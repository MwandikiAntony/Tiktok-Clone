import React, { useEffect, useState } from "react";
import { api, getToken } from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken(); 

    const fetchProfile = async () => {
      try {
        const userRes = await api.get("/auth/me");
        console.log("User data from API:", userRes.data); // <--- debug
        setUser(userRes.data);

        const videosRes = await api.get(`/video/feed?userId=${userRes.data._id}`);
        setVideos(videosRes.data.videos);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{user.username || "No username"}'s Profile</h1>
      <p>Email: {user.email || "No email"}</p>

      <h2>My Videos</h2>
      {videos.length === 0 && <p>No videos uploaded yet.</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {videos.map((video) => (
          <div key={video._id} style={{ width: "200px" }}>
            <video width="100%" controls src={video.url} />
            <p>{video.caption}</p>
            <p>Likes: {video.likes?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
