import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div>
      <label className="form-control w-full max-w-xs my-2">
        <div className="label">
          <span className="label-text">First Name</span>
        </div>
        <input
          type="text"
          value={firstName}
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my-2">
        <div className="label">
          <span className="label-text">Last Name</span>
        </div>
        <input
          type="text"
          value={lastName}
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my-2">
        <div className="label">
          <span className="label-text">Email ID:</span>
        </div>
        <input
          type="text"
          value={emailId}
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setEmailId(e.target.value)}
        />
      </label>
      <label className="form-control w-full max-w-xs my-2">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <input
          type="password"
          value={password}
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <p className="text-red-500">{error}</p>
      <div className="card-actions justify-center m-2">
        <button className="btn btn-primary" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};
export default SignUp;
