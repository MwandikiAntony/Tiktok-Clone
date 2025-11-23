import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getToken, removeToken } from "../api";
import VideoCard from "../components/VideoCard";

export default function Feed() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  // Placeholder videos
  const placeholderVideos = [
    { _id: "1", url: "https://www.w3schools.com/html/mov_bbb.mp4", caption: "Sample Video 1" },
    { _id: "2", url: "https://www.w3schools.com/html/movie.mp4", caption: "Sample Video 2" },
    { _id: "3", url: "https://www.w3schools.com/html/mov_bbb.mp4", caption: "Sample Video 3" },
  ];

  // Check authentication
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
    } else {
      setAuthenticated(true);
    }
  }, []);

  const loadVideos = async () => {
    try {
      const res = await api.get("/video/feed", { params: { cursor } });
      if (res.data?.videos?.length) {
        setVideos((prev) => [...prev, ...res.data.videos]);
        setCursor(res.data.nextCursor);
      } else if (videos.length === 0) {
        setVideos(placeholderVideos);
      }
    } catch (err) {
      console.error("Failed to load videos:", err);
      if (videos.length === 0) setVideos(placeholderVideos);
    } finally {
      setLoading(false);
    }
  };

  // Load videos if authenticated
  useEffect(() => {
    if (authenticated) loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px"
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated
  if (!authenticated) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px"
      }}>
        <p>Please login or sign up to watch videos.</p>
        <div style={{ marginTop: "20px" }}>
          <button style={{ marginRight: "10px", padding: "10px 20px" }} onClick={() => navigate("/login")}>
            Login
          </button>
          <button style={{ padding: "10px 20px" }} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Authenticated feed
  return (
    <div>
      {/* Logout button */}
      {authenticated && (
        <button
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px 15px",
            fontSize: "16px",
            zIndex: 1000,
          }}
        >
          Logout
        </button>
      )}

      {/* Video feed */}
      {videos.map((v) => (
        <VideoCard key={v._id} video={v} />
      ))}

      {/* Load more button */}
      {cursor && (
        <button
          onClick={loadVideos}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            fontSize: "16px",
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
}
