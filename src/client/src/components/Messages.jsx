import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  setMessages,
  addMessage,
  setSelectedConnection,
  setConnections,
} from "../utils/messageSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { io } from "socket.io-client";

const Messages = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Logged-in user
  const connections = useSelector((state) => state.connections);
  const messagesByConnection = useSelector(
    (state) => state.messages.messagesByConnection
  );
  const selectedConnectionId = useSelector(
    (state) => state.messages.selectedConnectionId
  );
  const [messageContent, setMessageContent] = useState("");
  const [onlineStatus, setOnlineStatus] = useState({}); // Track online status of users
  const [isTyping, setIsTyping] = useState(false); // Typing indicator

  const socket = io(BASE_URL, { withCredentials: true });

  useEffect(() => {
    if (user?._id) {
      const fetchConnections = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/connections`, {
            withCredentials: true,
          });
          dispatch(setConnections(response.data)); // Save connections in Redux store
        } catch (error) {
          console.error("Error fetching connections:", error);
        }
      };

      fetchConnections();

      if (selectedConnectionId) {
        const fetchMessages = async () => {
          try {
            const response = await axios.get(
              `${BASE_URL}/message/conversation?receiverId=${selectedConnectionId}`,
              { withCredentials: true }
            );
            dispatch(
              setMessages({
                connectionId: selectedConnectionId,
                messages: response.data,
              })
            );
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        };

        fetchMessages();
      }
    }
  }, [user?._id, selectedConnectionId, dispatch]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("userOnline", user._id);

      socket.on("receive_message", (message) => {
        const connectionId =
          message.sender === user._id ? message.receiver : message.sender;
        dispatch(
          addMessage({
            connectionId,
            message,
          })
        );

        const messageList = document.querySelector(".messages-list");
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight; // Scroll to bottom
        }
      });

      socket.on("userOnlineStatus", (status) => {
        setOnlineStatus((prevStatus) => ({
          ...prevStatus,
          [status.userId]: status.isOnline,
        }));
      });

      socket.on("typing", ({ senderId, isTyping }) => {
        if (senderId === selectedConnectionId) {
          setIsTyping(isTyping);
        }
      });

      return () => {
        socket.off("receive_message");
        socket.off("userOnlineStatus");
        socket.off("typing");
      };
    }
  }, [user?._id, dispatch, socket, selectedConnectionId]);

  useEffect(() => {
    if (messageContent.trim()) {
      socket.emit("typing", {
        senderId: user._id,
        receiverId: selectedConnectionId,
        isTyping: true,
      });

      const timeout = setTimeout(() => {
        socket.emit("typing", {
          senderId: user._id,
          receiverId: selectedConnectionId,
          isTyping: false,
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [messageContent, user._id, selectedConnectionId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedConnectionId) return;

    const newMessage = {
      sender: user._id,
      receiver: selectedConnectionId,
      content: messageContent.trim(),
      messageType: "text",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/message/send`,
        newMessage,
        { withCredentials: true }
      );

      dispatch(
        addMessage({
          connectionId: selectedConnectionId,
          message: response.data,
        })
      );

      socket.emit("send_message", newMessage);
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSelectConnection = (connectionId) => {
    dispatch(setSelectedConnection(connectionId));
  };

  const messages = messagesByConnection[selectedConnectionId] || [];
  const selectedConnection = connections.find(
    (connection) => connection._id === selectedConnectionId
  );

  if (!user) {
    return <div>Please log in to see messages.</div>;
  }

  return (
    <div className="messages-container flex overflow-hidden h-full">
      {/* Connections List */}
      <div className="connections-list w-1/3 p-4 border-r bg-gradient-to-r from-blue-100 to-purple-200">
        <h3 className="text-center text-2xl mb-6 text-gray-700">
          Your Connections
        </h3>
        {connections?.length > 0 ? (
          connections.map((connection) => (
            <div
              key={connection._id}
              className={`connection-item p-4 my-2 cursor-pointer rounded-lg border-b transform transition-transform duration-300 hover:scale-105 ${
                selectedConnectionId === connection._id
                  ? "bg-blue-300"
                  : "bg-gray-100"
              }`}
              onClick={() => handleSelectConnection(connection._id)}
            >
              <div className="flex items-center">
                <img
                  src={connection.photoUrl}
                  alt={`${connection.firstName} ${connection.lastName}`}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold text-lg">
                    {connection.firstName} {connection.lastName}
                  </p>
                  <p className="text-gray-600">{connection.about}</p>
                  <span
                    className={`ml-2 w-3 h-3 rounded-full ${
                      onlineStatus[connection._id]
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No connections available.</p>
        )}
      </div>

      {/* Chat Window */}
      <div className="chat-window w-2/3 p-6 bg-white rounded-lg shadow-xl flex flex-col h-full">
        <h2 className="text-3xl mb-6 font-semibold text-gray-800">
          {selectedConnectionId
            ? `Chat with ${selectedConnection?.firstName} ${selectedConnection?.lastName}`
            : "Select a connection to start chatting"}
          {selectedConnectionId && onlineStatus[selectedConnectionId] && (
            <span className="ml-2 w-3 h-3 rounded-full bg-green-500" />
          )}
        </h2>

        <div className="messages-list mb-4 flex-grow overflow-y-auto px-3">
          {messages?.length > 0 ? (
            messages.map((message) => {
              const isSender = message.sender === user._id;
              const messageTime = new Date(
                message.createdAt
              ).toLocaleTimeString();

              return (
                <div
                  key={message._id}
                  className={`message-item flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`message-bubble p-4 my-2 inline-block max-w-xs rounded-lg ${
                      isSender
                        ? "bg-blue-500 text-white rounded-l-lg"
                        : "bg-gray-200 text-black rounded-r-lg"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className="message-time text-sm text-gray-500 mt-1">
                      {messageTime}
                    </div>
                    <div className="message-status text-sm mt-1">
                      {message.read ? (
                        <span className="text-green-500">✔✔</span>
                      ) : (
                        <span className="text-yellow-500">✔</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500">No messages yet...</div>
          )}
        </div>

        {isTyping && selectedConnectionId && (
          <div className="typing-indicator text-gray-500">Typing...</div>
        )}

        <div className="input-area flex items-center p-4 border-t">
          <textarea
            className="flex-grow p-2 border rounded-lg"
            rows="2"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 bg-blue-500 text-white p-3 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
