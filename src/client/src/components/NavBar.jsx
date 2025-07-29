import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import { setSelectedConnection } from "../utils/messageSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const connections = useSelector((state) => state.connection);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`${BASE_URL}/messages/unread`, { withCredentials: true })
        .then((res) => {
          setUnreadMessages(res.data.count);
        })
        .catch((err) => {
          console.error("Error fetching unread messages:", err);
        });
    }
  }, [user]);

  const handleSelectConnection = (connection) => {
    dispatch(setSelectedConnection(connection));
    navigate(`/messages/${connection._id}`);
  };

  return (
    <div className="navbar bg-white sticky top-0 z-50 shadow-md px-4">
      <div className="flex-1">
        <h1 className="btn btn-ghost text-2xl font-bold text-pink-700">
          💖 HeartBridge
        </h1>
      </div>

      {user && (
        <div className="flex-none gap-4 items-center">
          <div className="text-pink-800 font-medium hidden sm:block">
            Welcome, {user.firstName}
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring-2 ring-pink-300">
                <img alt="user avatar" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-xl mt-3 w-56 shadow-lg z-[1] p-3"
            >
              <li>
                <Link
                  to="/profile"
                  className="text-pink-700 hover:bg-pink-100 rounded-md px-2 py-1"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="text-pink-700 hover:bg-pink-100 rounded-md px-2 py-1"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="text-pink-700 hover:bg-pink-100 rounded-md px-2 py-1"
                >
                  Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/feed"
                  className="text-pink-700 hover:bg-pink-100 rounded-md px-2 py-1"
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/message"
                  className="flex justify-between items-center text-pink-700 hover:bg-pink-100 rounded-md px-2 py-1"
                >
                  Messages
                  {unreadMessages > 0 && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              </li>

              {connections && connections.length > 0 && (
                <div className="mt-3 px-2">
                  <h2 className="text-sm font-semibold text-gray-600 mb-1">
                    Quick Chat
                  </h2>
                  {connections.map((connection) => (
                    <div
                      key={connection._id}
                      className="flex items-center gap-2 p-2 hover:bg-pink-50 cursor-pointer rounded-md"
                      onClick={() => handleSelectConnection(connection)}
                    >
                      <img
                        src={connection.photoUrl}
                        alt="conn"
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-800">
                        {connection.firstName} {connection.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <li className="mt-2">
                <button
                  onClick={handleLogout}
                  className="text-pink-700 hover:bg-pink-100 rounded-md px-2 py-1"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
