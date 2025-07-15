import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const [isExpanded, setIsExpanded] = useState(false);
  const [interestLevel, setInterestLevel] = useState(50);
  const [showTooltip, setShowTooltip] = useState(false);
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="card bg-base-300 w-96 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 relative"
    >
      <figure className="overflow-hidden rounded-full border-4 border-gray-200 mb-4 relative">
        <motion.img
          className="h-64 w-64 object-cover rounded-full transition-transform duration-300"
          src={photoUrl}
          alt="User photo"
          whileHover={{ scale: 1.25 }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white p-2 rounded hidden group-hover:block">
          Zoomed In!
        </div>
      </figure>

      <div className="card-body">
        <h2 className="card-title text-center text-2xl font-semibold">
          {firstName + " " + lastName}
        </h2>
        {age && gender && (
          <p className="text-center text-gray-500">{age + ", " + gender}</p>
        )}

        <p
          className="text-gray-600 cursor-pointer text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? about : about.substring(0, 100) + "..."}
          <span className="text-blue-500 ml-2">
            {isExpanded ? "Show Less" : "Show More"}
          </span>
        </p>

        <div className="flex items-center justify-center my-4 space-x-4 relative">
          <label className="text-gray-600">Interest Level:</label>
          <motion.input
            type="range"
            min="0"
            max="100"
            value={interestLevel}
            onChange={(e) => {
              setInterestLevel(e.target.value);
              setShowTooltip(true);
            }}
            className="slider w-20"
            whileHover={{ scale: 1.05 }}
          />
          <span className="text-gray-600">{interestLevel}%</span>

          {showTooltip && (
            <div
              className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-1 rounded text-xs"
              style={{ left: `${interestLevel}%` }}
            >
              {interestLevel}%
            </div>
          )}
        </div>

        <div className="card-actions justify-center space-x-4 my-4">
          <motion.button
            className="btn btn-primary hover:bg-red-600 hover:shadow-lg transition-all duration-300"
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </motion.button>
          <motion.button
            className="btn btn-secondary hover:bg-green-600 hover:shadow-lg transition-all duration-300"
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
