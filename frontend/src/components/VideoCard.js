import React, { forwardRef } from "react";

const VideoCard = forwardRef(({ video, videoLikes, videoComments, handleLike, handleComment }, ref) => {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <video
        ref={ref}
        src={video.url}
        loop
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Floating action buttons */}
      <div style={{ position: "absolute", right: "15px", bottom: "100px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <button style={{ fontSize: "20px", color: videoLikes[video._id]?.liked ? "red" : "#fff" }} onClick={() => handleLike(video._id)}>
          ❤️ {videoLikes[video._id]?.count || 0}
        </button>
        <button style={{ fontSize: "20px", color: "#fff" }} onClick={() => {
          const text = prompt("Enter your comment:");
          if (text) handleComment(video._id, text);
        }}>
          💬 {videoComments[video._id]?.length || 0}
        </button>
        <button style={{ fontSize: "20px", color: "#fff" }} onClick={() => {
          navigator.clipboard.writeText(window.location.href + `/video/${video._id}`);
          alert("Video link copied!");
        }}>
          🔗
        </button>
      </div>

      {/* Caption */}
      <div style={{ position: "absolute", left: "15px", bottom: "120px", color: "#fff", fontSize: "16px", maxWidth: "70%" }}>
        {video.caption}
      </div>
    </div>
  );
});

export default VideoCard;
