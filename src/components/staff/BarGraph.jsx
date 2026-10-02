import React from "react";
import { Column } from "@ant-design/plots";

const BarGraph = () => {
  // 1. 비교할 데이터 그룹 (올해 vs 작년)
  const data = [
    // 올해 데이터
    { month: "1월", visitors: 420, type: "올해" },
    { month: "2월", visitors: 3000, type: "올해" },
    { month: "3월", visitors: 510, type: "올해" },
    { month: "4월", visitors: 630, type: "올해" },
    { month: "5월", visitors: 750, type: "올해" },
    { month: "6월", visitors: 820, type: "올해" },

    // 작년 데이터
    { month: "1월", visitors: 300, type: "작년" },
    { month: "2월", visitors: 1500, type: "작년" },
    { month: "3월", visitors: 400, type: "작년" },
    { month: "4월", visitors: 500, type: "작년" },
    { month: "5월", visitors: 600, type: "작년" },
    { month: "6월", visitors: 700, type: "작년" },
  ];

  // 2. 막대그래프 설정 옵션
  const config = {
    data,
    xField: "month",
    yField: "visitors",
    colorField: "type", // '올해'와 '작년'을 기준으로 막대를 그룹화

    // 그룹형 막대 정렬 방식
    group: true,

    // 막대 색상 지정
    color: ["#1677FF", "#FF4D4F"],

    // Y축 설정 (0부터 시작)
    scale: {
      y: {
        min: 0,
        nice: true,
      },
    },

    // 막대 상단 모서리를 둥글게 처리하여 세련된 느낌 부여
    style: {
      radiusTopLeft: 4,
      radiusTopRight: 4,
    },
  };

  return (
    <div className="w-[800px]">
      <Column {...config} />
    </div>
  );
};

export default BarGraph;
