import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    user && (
      <div className="bg-gradient-to-r from-indigo-300 via-purple-300 min-h-screen flex justify-center items-center p-4">
        {/* Container for both cards */}
        <div className="w-full max-w-4xl space-y-6 flex flex-col">
          {/* User Profile Card */}
          <div className="card bg-base-200 shadow-xl p-6 rounded-xl flex-grow-0">
            <div className="card-body">
              <h2 className="card-title text-center text-xl font-semibold text-purple-800">
                Your Profile
              </h2>
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={user?.photoUrl || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
                />
                <div>
                  <h3 className="text-3xl font-bold text-purple-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-lg text-gray-700">{user?.email}</p>
                  {user?.age && (
                    <p className="mt-2 text-md text-gray-600">
                      Age: {user?.age}
                    </p>
                  )}
                  {user?.gender && (
                    <p className="mt-2 text-md text-gray-600">
                      Gender: {user?.gender}
                    </p>
                  )}
                  {user?.about && (
                    <p className="mt-2 text-md text-gray-600">
                      About: {user?.about}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional details */}
              {user?.address && (
                <p className="mt-2 text-md text-gray-600">
                  Address: {user?.address}
                </p>
              )}
              {user?.phone && (
                <p className="mt-2 text-md text-gray-600">
                  Phone: {user?.phone}
                </p>
              )}
            </div>
          </div>

          {/* Edit Profile Section */}
          <EditProfile user={user} />
        </div>
      </div>
    )
  );
};

export default Profile;
