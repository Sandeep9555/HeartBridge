import axios from "axios";
import { BACKEND_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icon library

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // State to track loading

  const reviewRequest = async (status, _id) => {
    try {
      setLoading(true);
      await axios.post(
        BACKEND_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Loading Spinner */}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="text-center my-10 px-4 flex-grow">
          <h1 className="font-bold text-white text-3xl mb-8">
            Connection Requests
          </h1>
          <h1 className="text-xl font-semibold my-10 text-gray-600">
            No New Users Found! Please Accept Requests First
          </h1>
        </div>

        {/* Footer stays at the bottom */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-center my-10 px-4 flex-grow">
        <h1 className="font-bold text-white text-3xl mb-8">
          Connection Requests
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;

            return (
              <div
                key={_id}
                className="transition-all transform hover:scale-105 duration-300 bg-base-300 p-6 rounded-lg shadow-lg hover:shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <img
                      alt="user photo"
                      className="w-24 h-24 rounded-full object-cover"
                      src={photoUrl}
                    />
                  </div>
                  <div className="ml-4 text-left">
                    <h2 className="font-bold text-xl text-gray-800">
                      {firstName + " " + lastName}
                    </h2>
                    {age && gender && (
                      <p className="text-gray-500">
                        {age}, {gender}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-2">{about}</p>
                  </div>
                  <div className="flex flex-col justify-between items-center">
                    <button
                      className="btn btn-error mx-2 my-2 flex items-center justify-center text-white hover:bg-red-600"
                      onClick={() => reviewRequest("rejected", _id)}
                    >
                      <FaTimesCircle className="mr-2" />
                      Reject
                    </button>
                    <button
                      className="btn btn-success mx-2 my-2 flex items-center justify-center text-white hover:bg-green-600"
                      onClick={() => reviewRequest("accepted", _id)}
                    >
                      <FaCheckCircle className="mr-2" />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;
