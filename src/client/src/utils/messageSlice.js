import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    connections: [], // Stores the list of connections
    messagesByConnection: {}, // Stores messages grouped by connection ID
    selectedConnectionId: null, // Tracks the currently selected connection
  },
  reducers: {
    // Set the list of connections
    setConnections(state, action) {
      state.connections = action.payload;
    },
    // Set the messages for a specific connection
    setMessages(state, action) {
      state.messagesByConnection[action.payload.connectionId] =
        action.payload.messages;
    },
    // Add a new message to a specific connection's message list
    addMessage(state, action) {
      const { connectionId, message } = action.payload;
      if (!state.messagesByConnection[connectionId]) {
        state.messagesByConnection[connectionId] = [];
      }
      state.messagesByConnection[connectionId].push(message);
    },
    // Set the currently selected connection for viewing/chat
    setSelectedConnection(state, action) {
      state.selectedConnectionId = action.payload;
    },
    // Update the read status of a specific message
    updateMessageReadStatus(state, action) {
      const { connectionId, messageId } = action.payload;
      const messages = state.messagesByConnection[connectionId];
      const message = messages?.find((msg) => msg._id === messageId);
      if (message) {
        message.read = true;
      }
    },
    // Update the delivery status of a specific message
    updateMessageDeliveryStatus(state, action) {
      const { connectionId, messageId, status } = action.payload;
      const messages = state.messagesByConnection[connectionId];
      const message = messages?.find((msg) => msg._id === messageId);
      if (message) {
        message.deliveryStatus = status;
      }
    },
    // Clear all messages for a specific connection (useful for resets)
    clearMessages(state, action) {
      const { connectionId } = action.payload;
      state.messagesByConnection[connectionId] = [];
    },
  },
});

export const {
  setConnections,
  setMessages,
  addMessage,
  setSelectedConnection,
  updateMessageReadStatus,
  updateMessageDeliveryStatus,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
