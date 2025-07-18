import axios from "axios";
import { BACKEND_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BACKEND_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      //TODO: handle error
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length <= 0) {
    return (
      <h1 className="flex justify-center text-xl font-semibold my-10 text-gray-600">
        No New Users Found! Please Accept Requests First
      </h1>
    );
  }

  return (
    feed && (
      <div className="flex justify-center items-center my-10">
        <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 max-w-sm w-full">
          <UserCard user={feed[0]} />
        </div>
      </div>
    )
  );
};

export default Feed;
