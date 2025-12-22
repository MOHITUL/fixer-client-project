import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosSecure.get("/me")
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, [axiosSecure]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>My Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
    </div>
  );
};

export default Profile;
