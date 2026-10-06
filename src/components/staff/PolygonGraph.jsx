import React from "react";
import { Line } from "@ant-design/plots";

const PolygonGraph = ({ data: rawDataGroup }) => {
  //선형 회귀(추세선)
  const getRegression = (data) => {
    const n = data.length;
    const xMean = (n - 1) / 2;
    const yMean = data.reduce((sum, item) => sum + item.visitors, 0) / n;

    let numerator = 0;
    let denominator = 0;

    data.forEach((item, index) => {
      numerator += (index - xMean) * (item.visitors - yMean);

      denominator += Math.pow(index - xMean, 2);
    });

    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    return data.map((item, index) => ({
      month: item.month,
      visitors: Math.round(slope * index + intercept),
    }));
  };

  //실제
  const actualData = rawDataGroup.flatMap((group) =>
    group.data.map((item) => ({
      ...item,

      group: group.groupName,

      series: `${group.groupName}`,

      type: "actual",
    })),
  );

  //추세선
  const trendData = rawDataGroup.flatMap((group) =>
    getRegression(group.data).map((item) => ({
      ...item,

      group: group.groupName,

      series: `${group.groupName} 추세선`,

      type: "trend",
    })),
  );

  const data = [...actualData, ...trendData];

  const seriesDomain = rawDataGroup.flatMap((group) => [
    `${group.groupName}`,
    `${group.groupName} 추세선`,
  ]);

  const config = {
    data: data,

    xField: "month",
    yField: "visitors",

    colorField: "series",

    scale: {
      color: {
        domain: seriesDomain,
      },

      y: {
        domainMin: 0,
        nice: true,
      },
    },

    //선 스타일
    children: [
      {
        type: "line",

        encode: {
          x: "month",
          y: "visitors",
          color: "series",
          series: "series",
        },

        style: {
          lineWidth: (d) => {
            return d[0]?.type === "trend" ? 2 : 3;
          },

          lineDash: (d) => {
            return d[0]?.type === "trend" ? [6, 4] : [0, 0];
          },
        },
      },

      //점 스타일
      {
        type: "point",

        data: actualData,

        encode: {
          x: "month",
          y: "visitors",

          color: "series",
          series: "series",
          shape: "circle",
        },

        style: {
          fill: "#fff",
          stroke: (d) => d.color,
          lineWidth: 2,
        },
      },
    ],

    legend: {
      color: {
        position: "top",
      },
    },

    //hover 하면 보이는 박스
    tooltip: {
      title: (datum) => datum.month,

      items: [
        {
          channel: "y",
        },
      ],
    },

    //축에 이름 지움
    axis: {
      x: {
        title: false,
      },

      y: {
        title: false,
      },
    },
  };

  return (
    <>
      <div className="w-[900px]">
        <Line {...config} />
      </div>
    </>
  );
};

export default PolygonGraph;
