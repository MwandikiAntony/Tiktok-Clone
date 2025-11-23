import { useState } from "react";
import { api } from "../api";

export default function Upload() {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!video) return alert("Please select a video.");
    setLoading(true);

    const form = new FormData();
    form.append("video", video);
    form.append("caption", caption);

    try {
      await api.post("/video/upload", form);
      alert("Uploaded!");
      setVideo(null);
      setCaption("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
      <input value={caption} onChange={(e) => setCaption(e.target.value)} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
