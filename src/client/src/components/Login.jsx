import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/constants";
import SignUp from "./SignUp";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BACKEND_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
      <div className="card bg-white shadow-2xl rounded-xl w-full max-w-sm p-8">
        <div className="card-body">
          <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {isLoginForm ? (
            <>
              {/* Login Form */}
              <div className="form-group mb-4">
                <label className="block text-gray-700 text-sm mb-2">
                  Email ID
                </label>
                <input
                  type="text"
                  value={emailId}
                  className="input input-bordered w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </div>
              <div className="form-group mb-6">
                <label className="block text-gray-700 text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  className="input input-bordered w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary w-full py-2 text-lg text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all duration-300"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </>
          ) : (
            <SignUp />
          )}

          <p
            className="text-center cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 py-2"
            onClick={() => setIsLoginForm((prev) => !prev)}
          >
            {isLoginForm
              ? "New User? Sign Up Here"
              : "Existing User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
