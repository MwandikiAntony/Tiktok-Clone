import { useEffect, useState } from "react";
import { api } from "../api";
import VideoCard from "../components/VideoCard";

export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [cursor, setCursor] = useState(null);

  const load = async () => {
    const res = await api.get("/video/feed", {
      params: { cursor }
    });

    setVideos([...videos, ...res.data.videos]);
    setCursor(res.data.nextCursor);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      {videos.map(v => <VideoCard key={v._id} video={v} />)}
      {cursor && <button onClick={load}>Load More</button>}
    </div>
  );
}
