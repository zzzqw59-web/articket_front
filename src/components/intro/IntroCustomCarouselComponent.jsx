import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function CustomCarousel({ venues = [] }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!venues || venues.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    function triggerDrop() {
      const cards = container.children;
      if (isAnimating.current || cards.length <= 1) return;
      isAnimating.current = true;

      // 현재 맨 위에 있는 첫 번째 카드
      const topCard = cards[0];

      gsap.to(topCard, {
        y: 900,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          container.appendChild(topCard);

          // 위치 초기화 및 z-index 순서 재정렬
          gsap.set(topCard, { y: 0 });
          updateCardZIndex();

          isAnimating.current = false;
        },
      });
    }

    function updateCardZIndex() {
      const cards = container.children;
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.zIndex = cards.length - i;
      }
    }

    updateCardZIndex();

    const timer = setInterval(triggerDrop, 4000);
    return () => clearInterval(timer);
  }, [venues]);

  if (!venues || venues.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-[1000px] h-[550px] overflow-hidden flex select-none"
    >
      {venues.map((venue, idx) => {
        const isTop = idx === 0;

        return (
          <div
            key={venue.id || idx}
            onClick={() => navigate(`/articket/venue/${venue.id}`)}
            className="absolute w-full h-full bg-white shadow-xl overflow-hidden flex flex-col cursor-pointer"
            style={{
              zIndex: venues.length - idx,
            }}
          >
            <img
              src={venue.photoUrl}
              alt={venue.name}
              className="w-full h-[500px] object-cover pointer-events-none"
            />
            <div className="mr-20 mt-5 w-full translate-y-[-10px] items-end flex flex-col text-left">
              <h3 className="font-bold body-text text-3xl text-gray-500 text-left">
                {venue.name}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
