import React, { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) setVisible(true);
      else setVisible(false);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        padding: "10px 21px",
        fontSize: "20px",
        borderRadius: "50%",
        border: "none",
        backgroundColor: "#F59E0B", // أصفر Tailwind (amber-400)
        color: "white",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        zIndex: 1000,
        transition: "background-color 0.3s",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#D97706"} // أغمق شويه
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#F59E0B"}
      aria-label="Scroll to top"
      title="العودة للأعلى"
    >
      ↑
    </button>
  );
}
