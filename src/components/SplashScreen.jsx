import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const frame = document.querySelector(".phone-frame");
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    // A splash is a modal startup state: pin the app to the top and prevent
    // the dashboard underneath from moving or being exposed by scrolling.
    frame?.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const exit = window.setTimeout(() => setLeaving(true), 3900);
    const done = window.setTimeout(onDone, 4320);
    return () => {
      window.clearTimeout(exit);
      window.clearTimeout(done);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [onDone]);

  return (
    <div
      className={`splash-screen orbit-splash ${leaving ? "splash-leaving" : ""}`}
      role="status"
      aria-label="Freedom Travel OS is starting"
    >
      <div className="orbit-splash-stage" aria-hidden="true">
        <span className="orbit-blue-glow" />
        <span className="orbit-line orbit-line-one" />
        <span className="orbit-line orbit-line-two" />
        <img
          className="orbit-splash-monogram"
          src={`${import.meta.env.BASE_URL}brand/qr-splash-monogram.png`}
          alt=""
        />
        <img
          className="orbit-splash-complete"
          src={`${import.meta.env.BASE_URL}brand/qr-splash-orbit.png`}
          alt=""
        />
      </div>

      <div className="splash-copy orbit-splash-copy">
        <h1>Freedom Travel OS</h1>
        <p><span>Your Journey.</span><span>Your Freedom.</span></p>
        <small>P Edition</small>
      </div>

      <div className="splash-loader orbit-splash-loader" aria-hidden="true"><span /></div>
    </div>
  );
}
