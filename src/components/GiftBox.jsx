
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function GiftBox({ onOpened }) {
  const containerRef = useRef(null);
  const openedRef = useRef(false);
  const [isOpening, setIsOpening] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      gsap.to(".gift-wrapper", {
        y: -12,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    },
    { scope: containerRef }
  );

  const openGift = contextSafe(() => {
    if (openedRef.current) return;

    openedRef.current = true;
    setIsOpening(true);

    const root = containerRef.current;

    gsap.killTweensOf(
      root.querySelector(".gift-wrapper")
    );

    gsap.timeline({
      onComplete: () => {
        onOpened?.();
      }
    })
      .to(".gift-wrapper", {
        rotation: -5,
        duration: 0.15,
        repeat: 3,
        yoyo: true
      })
      .to(".gift-bow", {
        y: -65,
        rotation: 25,
        opacity: 0,
        duration: 0.55
      })
      .to(".gift-lid", {
        y: -115,
        rotation: -20,
        duration: 0.75,
        ease: "back.out(1.6)"
      }, "-=0.2")
      .to(".gift-glow", {
        scale: 2,
        opacity: 1,
        duration: 0.6
      }, "-=0.5")
      .to(".gift-wrapper", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5
      }, "+=0.25");
  });

  return (
    <div ref={containerRef} className="gift-container">
      <button
        type="button"
        className="gift-interactive"
        onClick={openGift}
        disabled={isOpening}
        aria-label="Buka kado ulang tahun"
      >
        <div className="gift-glow" />

        <div className="gift-wrapper">
          <div className="gift-bow">
            <span />
            <span />
          </div>

          <div className="gift-lid" />

          <div className="gift-box">
            <div className="gift-ribbon" />
            <div className="gift-heart">♡</div>
          </div>
        </div>
      </button>
    </div>
  );
}
