import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const validateForm = () => {
    setIsFormValid(firstName && lastName && photoUrl && age && gender && about);
  };

  useEffect(() => {
    validateForm();
  }, [firstName, lastName, photoUrl, age, gender, about]);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="card bg-base-100 w-full max-w-3xl shadow-xl rounded-lg">
          <div className="card-body">
            <h2 className="card-title text-center text-2xl font-semibold mb-5 text-purple-800">
              Edit Your Profile
            </h2>
            <div className="space-y-5">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={validateForm}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={validateForm}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    Photo URL
                  </span>
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  onBlur={validateForm}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-sm font-medium">Age</span>
                </label>
                <input
                  type="number"
                  value={age}
                  className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAge(e.target.value)}
                  onBlur={validateForm}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-sm font-medium">Gender</span>
                </label>
                <input
                  type="text"
                  value={gender}
                  className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setGender(e.target.value)}
                  onBlur={validateForm}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-sm font-medium">About</span>
                </label>
                <textarea
                  value={about}
                  className="textarea textarea-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAbout(e.target.value)}
                  onBlur={validateForm}
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="card-actions justify-center mt-6">
                <button
                  className={`btn ${
                    isFormValid ? "btn-primary" : "btn-disabled"
                  } w-full rounded-lg`}
                  onClick={saveProfile}
                  disabled={!isFormValid}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
