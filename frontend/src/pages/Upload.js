import { useState } from "react";
import { api } from "../api";

export default function Upload() {
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");

  const handleUpload = async () => {
    const form = new FormData();
    form.append("video", video);
    form.append("caption", caption);

    const res = await api.post("/video/upload", form);
    alert("Uploaded!");
  };

  return (
    <div>
      <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
      <input value={caption} onChange={(e) => setCaption(e.target.value)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
