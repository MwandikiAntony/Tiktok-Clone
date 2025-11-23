import { useEffect, useRef } from "react";

export default function VideoCard({ video }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current; // ✅ copy ref.current to a local variable
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.play().catch(() => {});
        } else {
          element.pause();
        }
      },
      { threshold: 0.7 }
    );

    observer.observe(element);

    // Cleanup safely using the local variable
    return () => {
      observer.unobserve(element);
    };
  }, []);

  if (!video?.url) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        Video not available
      </div>
    );
  }

  return (
    <video
      ref={ref}
      src={video.url}
      className="video"
      loop
      muted
      playsInline
      style={{ width: "100%", height: "100vh", objectFit: "cover" }}
    />
  );
}
