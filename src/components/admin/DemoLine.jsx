import React from "react";
import { Line } from "@ant-design/plots";

export default function DemoLine() {
  const data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  const config = {
    data,
    xField: "year",
    yField: "value",
    point: {
      shapeField: "square",
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">연도별 성장 추이</h2>
        <p className="text-sm text-gray-500">
          1991년부터 1999년까지의 데이터 변화입니다.
        </p>
      </div>

      {/* 차트 영역 */}
      <div className="w-full h-[300px]">
        <Line {...config} />
      </div>
    </div>
  );
}
