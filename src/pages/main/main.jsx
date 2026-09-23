import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Observer);

export default function App() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // 1. 타임라인 생성 (처음엔 멈춤)
      const tl = gsap.timeline({ paused: true });

      tl.to(".box-1", {
        scale: 1.5,
        opacity: 1,
        backgroundColor: "#ff3b30",
        duration: 1,
      })
        .to(".box-2", {
          y: -300,
          opacity: 1,
          backgroundColor: "#34c759",
          duration: 1,
        })
        .to(".box-3", {
          rotation: 360,
          opacity: 1,
          backgroundColor: "#007aff",
          duration: 1,
        });

      // 스텝 위치 배열 (0%, 33%, 66%, 100%)
      const steps = [0, 0.33, 0.66, 1];
      let currentIndex = 0;
      let isAnimating = false; // 연속 입력 방지 락

      // 2. ScrollTrigger로 섹션 고정(Pin)만 담당
      ScrollTrigger.create({
        trigger: ".snap-section",
        pin: true,
        start: "top top",
        end: "+=1500", // 고정 유지 거리
        markers: true,
      });

      // 3. Observer로 휠 입력 즉시 캐치해서 스텝별로 순간이동/부드러운 이동 실행
      Observer.create({
        target: containerRef.current,
        type: "wheel,touch",
        onChange: (self) => {
          if (isAnimating) return;

          // 아래로 내릴 때
          if (self.deltaY > 0) {
            if (currentIndex < steps.length - 1) {
              currentIndex++;
              isAnimating = true;
              gsap.to(tl, {
                progress: steps[currentIndex],
                duration: 0.5, // 이동하는 속도
                ease: "power2.out",
                onComplete: () => {
                  isAnimating = false;
                },
              });
            }
          }
          // 위로 올릴 때
          else if (self.deltaY < 0) {
            if (currentIndex > 0) {
              currentIndex--;
              isAnimating = true;
              gsap.to(tl, {
                progress: steps[currentIndex],
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                  isAnimating = false;
                },
              });
            }
          }
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <style>{`
        .spacer {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #111;
          color: #fff;
          font-size: 1.5rem;
          font-family: sans-serif;
        }

        .snap-section {
          width: 100vw;
          height: 100vh;
          background-color: #1e1e1e;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          position: relative;
          overflow: hidden;
        }

        .target-box {
          width: 120px;
          height: 120px;
          background-color: #555;
          opacity: 0.3;
          border-radius: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          font-family: sans-serif;
        }
      `}</style>

      <div className="spacer">
        👇 휠을 톡 굴리는 순간 딜레이 없이 즉시 다음 단계로 이동합니다!
      </div>

      <section className="snap-section">
        <div className="target-box box-1">1단계</div>
        <div className="target-box box-2">2단계</div>
        <div className="target-box box-3">3단계</div>
      </section>

      <div className="spacer">
        👆 3단계가 끝나면 스크롤이 자연스럽게 풀립니다.
      </div>
    </div>
  );
}
