import { useEffect, useRef } from "react";

export default function VideoCard({ video }) {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) ref.current.play();
      else ref.current.pause();
    }, { threshold: 0.7 });

    observer.observe(ref.current);
  }, []);

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
