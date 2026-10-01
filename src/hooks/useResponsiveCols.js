import { useState, useEffect } from "react";

/**
 * 뷰포트 크기 변화(Resize)를 감지하여 Breakpoint별 그리드 열(Column) 수를 반환하는 커스텀 훅
 * @param {number} delay - Resize 이벤트 Debounce 지연 시간 (ms)
 * @returns {number} cols - 현재 뷰포트에 적합한 Column 개수
 */
export const useResponsiveCols = (delay = 150) => {
  const getCols = () => {
    if (typeof window === "undefined") return 5;
    const width = window.innerWidth;
    if (width >= 1024) return 5; // lg (lg:grid-cols-5)
    if (width >= 768) return 4;  // md (md:grid-cols-4)
    if (width >= 640) return 3;  // sm (sm:grid-cols-3)
    return 2;                    // default (grid-cols-2)
  };

  const [cols, setCols] = useState(getCols);

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setCols(getCols());
      }, delay);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [delay]);

  return cols;
};