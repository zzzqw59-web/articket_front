import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Intro.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, Observer, useGSAP, ScrollToPlugin);
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
const IntroComponent = () => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const posters = [
    {
      id: 1,
      title: "전시회 A",
      img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500",
    },
    {
      id: 2,
      title: "전시회 B",
      img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500",
    },
    {
      id: 3,
      title: "전시회 C",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
    },
    {
      id: 4,
      title: "전시회 D",
      img: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=500",
    },
  ];

  useGSAP(
    () => {
      //[전시 이미지들 등장 모션]
      gsap.fromTo(
        ".poster-box",
        { x: -1500, y: -200 },
        { x: 0, y: 0, duration: 1, ease: "back.out(0.5)" },
      );
      //[텍스트 등장 딜레이]
      gsap.fromTo(
        ".first-intro-text",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power2.out" },
      );
      //[contact us background]
      gsap.fromTo(
        ".first-tape",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: ".first-tape",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
      //[ask anything background]
      gsap.fromTo(
        ".second-tape",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: ".second-tape",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      const textElement = textRef.current;
      const length = 1500;

      //[Articket 모션] 초기 상태 세팅 (선은 숨기고, fill은 채우지 않음)
      gsap.set(textElement, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: "none",
        visibility: "visible",
      });
      //[Articket 모션] 반복 타임라인 생성
      const tl = gsap.timeline({
        delay: 1.5,
        repeat: -1,
        repeatDelay: 0.5,
      });

      //[Articket 모션] [1단계] 선이 그려짐
      tl.to(textElement, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.inOut",
      })
        //[Articket 모션] [2단계] 그려진 상태로 잠시 멈춤
        .to(textElement, {
          strokeDashoffset: 0, // 제자리 유지
          duration: 1.0, // 멈춰있는 시간
        })
        //[Articket 모션] [3단계] 선이 다시 거꾸로 줄어들며 사라짐
        .to(textElement, {
          strokeDashoffset: length,
          duration: 2.0,
          ease: "power2.inOut",
        });

      const frameTl = gsap.timeline({ paused: true });
      const firstScreenHeight = 1200;

      frameTl
        //[1단계] 자동 스크롤
        .to(".first-screen", {
          y: -firstScreenHeight,
          duration: 2,
        })

        // [2단계] 파란 박스 축소
        .to(
          ".frame-container",
          {
            scale: 0.2,
            y: -100,
            transformOrigin: "center center",
            duration: 5,
          },
          2,
        )

        // [3단계] 작아진 박스 안에 글자 페이드 인
        .to(".text-fadein-first", {
          opacity: 1,
          duration: 1.5,
        })
        .to(".text-fadein-second", {
          opacity: 1,
          duration: 1.5,
        });

      const steps = [0, 0.2, 1];
      const scrollTargets = [0, 60, 500];
      let currentIndex = 0;
      let isAnimating = false;

      ScrollTrigger.create({
        trigger: ".uppermost-container",
        pin: true,
        start: "top top",
        end: "+=100",
      });

      Observer.create({
        target: containerRef.current,
        type: "wheel",
        onChange: (self) => {
          if (isAnimating) return;

          const maxPinScroll = 500;

          if (window.scrollY > maxPinScroll && self.deltaY < 0) {
            if (
              currentIndex === scrollTargets.length - 1 &&
              window.scrollY > maxPinScroll + 50
            ) {
              return;
            }
          }
          if (self.deltaY > 0) {
            if (currentIndex < steps.length - 1) {
              currentIndex++;
              isAnimating = true;

              gsap.to(frameTl, {
                progress: steps[currentIndex],
                duration: 1,
              });

              gsap.to(window, {
                scrollTo: { y: scrollTargets[currentIndex], autoKill: false },
                duration: 1,
                onComplete: () => {
                  isAnimating = false;
                },
              });
            }
          } else if (self.deltaY < 0) {
            if (currentIndex > 0) {
              currentIndex--;
              isAnimating = true;

              gsap.to(frameTl, {
                progress: steps[currentIndex],
                duration: 1,
              });

              gsap.to(window, {
                scrollTo: { y: scrollTargets[currentIndex], autoKill: false },
                duration: 1,
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
    <div
      className="flex flex-col w-full min-h-screen bg-white uppermost-container"
      ref={containerRef}
    >
      <div className="first-screen select-none">
        <div className="group flex flex-row items-center w-full justify-between h-[850px] w-full overflow-hidden bg-white">
          <div className="flex flex-col">
            <div className="first-intro-text head-text ml-30 mb-0  font-bold text-3xl">
              대한민국에서 열리는 모든 전시
            </div>
            <svg viewBox="0 0 800 300" className="svg-container ml-50">
              <text
                ref={textRef}
                x="50%"
                y="40%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="animated-text semi-logo"
              >
                Articket
              </text>
            </svg>
          </div>
          <div className="poster-box flex flex-row justify-end items-center h-full px-10 gap-2 shrink-0">
            {posters.map((item) => (
              <div
                key={item.id}
                className="relative h-160 w-50 rounded-none overflow-hidden transition-all 
                duration-500 ease-out hover:w-112.5"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-top from-black/80 via-transparent to-transparent 
              opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-end p-6"
                >
                  <span className="text-white text-xl font-bold whitespace-nowrap">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center h-30 bg-[#ede6d6]">
          <div className="logo text-5xl font-bold m-6 mb-15">
            <Link to="/articket">
              <span>Articket</span>{" "}
            </Link>
          </div>
        </div>

        <div className="frame-container w-full h-[2500px] bg-[#214d72] flex items-center justify-center relative overflow-hidden">
          <div className="frame-text text-white text-[250px] absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-180%]">
            Articket
          </div>
          <div className="flex flex-col items-center text-white text-center">
            <div className="frame-text text-fadein-first text-[200px] ml-120 translate-x-[420px] translate-y-[-120px] opacity-0">
              에서
            </div>
            <div className="frame-text text-fadein-second text-[350px] font-bold translate-y-[500px] text-gray-50 opacity-0">
              한눈에
            </div>
          </div>
        </div>
      </div>

      <div className=" text-center exhibition-fadein-text head-text text-6xl font-bold relative z-10 -mt-20 translate-y-[-2200px]">
        대한민국에서 열리는
        <br /> 모든 전시를 만나보세요
      </div>

      <div className=" bg-white flex flex-col items-center justify-center p-6">
        <div className="text-8xl font-bold mb-8 text-slate-900 self-start ml-30 relative z-20">
          Contact Us
        </div>

        <div className=" p-10 self-start ml-60 z-10 relative">
          <div
            onClick={() => (window.location.href = "mailto:Articket@gmail.com")}
            className="body-text text-5xl cursor-pointer hover:text-gray-50 hover:font-bold"
          >
            email &emsp;&emsp;&emsp; Articket@gmail.com
          </div>
          <div
            onClick={() => (window.location.href = "tel:01012341234")}
            className="body-text text-5xl cursor-pointer hover:text-gray-50 hover:font-bold"
          >
            telephone &emsp;010-1234-1234
          </div>
        </div>
        <div className="first-tape bg-[#bfd6df] select-none w-205 h-40 self-start ml-60 text-[#bfd6df] relative z-0 translate-y-[-150px] -rotate-3">
          .
        </div>
        <div className="text-8xl font-bold mb-8 text-slate-900 self-end mr-30 relative z-20">
          Ask Anything!
        </div>
        <div className="second-tape bg-[#ede6d6] w-180 h-35 select-none self-end mr-20 text-[#ede6d6] relative z-0 translate-y-[-160px] rotate-3">
          .
        </div>
      </div>
    </div>
  );
};

export default IntroComponent;
