import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import { setSelectedConnection } from "../utils/messageSlice"; // Import the action to select a connection

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const connections = useSelector((state) => state.connection); // Get the list of connections
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(BACKEND_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login", { replace: true }); // Added replace: true to avoid going back to the previous page
    } catch (err) {
      console.error("Logout error:", err); // Log errors for debugging
    }
  };

  // Fetch unread messages count
  useEffect(() => {
    if (user) {
      axios
        .get(`${BASE_URL}/messages/unread`, { withCredentials: true })
        .then((res) => {
          setUnreadMessages(res.data.count); // Assuming the response returns the unread message count
        })
        .catch((err) => {
          console.error("Error fetching unread messages:", err);
        });
    }
  }, [user]);

  // Handle selecting a connection
  const handleSelectConnection = (connection) => {
    dispatch(setSelectedConnection(connection)); // Dispatch action to set the selected connection
    navigate(`/messages/${connection._id}`); // Navigate to the message page for the selected connection
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 z-50 shadow-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          👩‍💻 HeartBridge
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="form-control text-white">
            Welcome, {user.firstName} {user.lastName}
          </div>
          <div className="dropdown dropdown-end mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
            >
              <li>
                <Link
                  to="/profile"
                  className="justify-between text-gray-700 hover:bg-gray-200"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="text-gray-700 hover:bg-gray-200"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="text-gray-700 hover:bg-gray-200"
                >
                  Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/message"
                  className="flex justify-between text-gray-700 hover:bg-gray-200"
                >
                  Messages
                  {unreadMessages > 0 && (
                    <span className="badge badge-secondary">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              </li>
              {/* Display Connections in the Dropdown */}
              {connections && connections.length > 0 && (
                <div className="menu menu-compact bg-base-100 rounded-box mt-3 p-2 shadow-lg">
                  <h2 className="text-xl mb-2">Connections</h2>
                  {connections.map((connection) => (
                    <div
                      key={connection._id}
                      className="flex justify-between items-center p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSelectConnection(connection)}
                    >
                      <div className="flex items-center">
                        <img
                          src={connection.photoUrl}
                          alt="Connection"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>
                          {connection.firstName} {connection.lastName}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Send Message
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <li>
                <a
                  onClick={handleLogout}
                  className="text-gray-700 hover:bg-gray-200"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
