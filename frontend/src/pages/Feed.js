import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api, getToken, removeToken } from "../api";
import VideoCard from "../components/VideoCard";
import BottomNav from "./BottomNav";

export default function Feed() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [videoLikes, setVideoLikes] = useState({});
  const [videoComments, setVideoComments] = useState({});
  const videoRefs = useRef([]);

  const placeholderVideos = [
    { _id: "1", url: "https://www.w3schools.com/html/mov_bbb.mp4", caption: "Sample Video 1" },
    { _id: "2", url: "https://www.w3schools.com/html/movie.mp4", caption: "Sample Video 2" },
    { _id: "3", url: "https://www.w3schools.com/html/mov_bbb.mp4", caption: "Sample Video 3" },
  ];

  // Authentication
  useEffect(() => {
    const token = getToken();
    if (!token) setLoading(false);
    setAuthenticated(!!token);
  }, []);

  // Load videos
  const loadVideos = async () => {
    try {
      const res = await api.get("/video/feed", { params: { cursor } });
      if (res.data?.videos?.length) {
        setVideos((prev) => [...prev, ...res.data.videos]);
        setCursor(res.data.nextCursor);
      } else if (videos.length === 0) setVideos(placeholderVideos);
    } catch {
      if (videos.length === 0) setVideos(placeholderVideos);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  // Initialize likes/comments
  useEffect(() => {
    const likes = {};
    const comments = {};
    videos.forEach(v => {
      likes[v._id] = { liked: false, count: v.likes?.length || 0 };
      comments[v._id] = v.comments || [];
    });
    setVideoLikes(likes);
    setVideoComments(comments);
  }, [videos]);

  // Play only the most visible video on scroll (like TikTok)
  useEffect(() => {
    const handleScroll = () => {
      let maxVisible = 0;
      let activeVideo = null;

      videoRefs.current.forEach(video => {
        if (!video) return;
        const rect = video.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const ratio = visibleHeight / rect.height;
        if (ratio > maxVisible) {
          maxVisible = ratio;
          activeVideo = video;
        }
      });

      videoRefs.current.forEach(video => {
        if (!video) return;
        if (video === activeVideo) video.play().catch(() => {});
        else video.pause();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial play

    return () => window.removeEventListener("scroll", handleScroll);
  }, [videos]);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const handleLike = async (videoId) => {
    try {
      const res = await api.post(`/video/like/${videoId}`);
      setVideoLikes(prev => ({ ...prev, [videoId]: { liked: res.data.liked, count: res.data.likes } }));
    } catch {}
  };

  const handleComment = async (videoId, text) => {
    try {
      const res = await api.post(`/video/comment/${videoId}`, { text });
      setVideoComments(prev => ({ ...prev, [videoId]: res.data }));
    } catch {}
  };

  if (loading) return <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>Loading...</div>;
  if (!authenticated) return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
      <p>Please login or sign up to watch videos.</p>
      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px", padding: "10px 20px" }} onClick={() => navigate("/login")}>Login</button>
        <button style={{ padding: "10px 20px" }} onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <button onClick={handleLogout} style={{ position: "fixed", top: "20px", right: "20px", padding: "10px 15px", fontSize: "16px", zIndex: 1000 }}>Logout</button>

      {videos.map((v, i) => (
        <VideoCard
          key={v._id}
          ref={(el) => videoRefs.current[i] = el}
          video={v}
          videoLikes={videoLikes}
          videoComments={videoComments}
          handleLike={handleLike}
          handleComment={handleComment}
        />
      ))}

      {cursor && <button onClick={loadVideos} style={{ position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px", fontSize: "16px", zIndex: 1000 }}>Load More</button>}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
    </div>
  );
}
