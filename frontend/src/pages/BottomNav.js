import React from "react";

export default function BottomNav({ activeTab, setActiveTab, navigate }) {
  return (
    <div style={{ position: "fixed", bottom: 0, width: "100%", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0", background: "rgba(0,0,0,0.7)", color: "#fff", zIndex: 1000 }}>
      <button onClick={() => { navigate("/"); setActiveTab("home"); }} style={{ color: activeTab === "home" ? "yellow" : "#fff" }}>Home</button>
      <button onClick={() => { navigate("/upload"); setActiveTab("upload"); }} style={{ color: activeTab === "upload" ? "yellow" : "#fff" }}>Upload</button>
      <button onClick={() => { navigate("/profile"); setActiveTab("profile"); }} style={{ color: activeTab === "profile" ? "yellow" : "#fff" }}>Profile</button>
    </div>
  );
}
