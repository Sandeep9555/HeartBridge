import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  // Fetch Connections from the API
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0)
    return (
      <h1 className="text-center text-xl text-gray-500">
        No Connections Found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-white text-3xl mb-6">Your Connections</h1>

      <div className="connections-list flex flex-col gap-6 items-center">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="connection-card flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 hover:shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer w-full max-w-md"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                <img
                  alt="profile"
                  className="w-full h-full object-cover"
                  src={photoUrl}
                />
              </div>
              <div className="text-left flex-1">
                <h2 className="font-semibold text-xl text-gray-800">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-gray-600">
                    {age}, {gender}
                  </p>
                )}
                <p className="text-gray-500 mt-2">{about}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
