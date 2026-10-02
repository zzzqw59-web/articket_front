import React from "react";
import { Line } from "@ant-design/plots";

const PolygonGraph = () => {
  const rawDataGroup = [
    {
      groupName: "올해",
      data: [
        { month: "1월", visitors: 420 },
        { month: "2월", visitors: 510 },
        { month: "3월", visitors: 480 },
        { month: "4월", visitors: 620 },
        { month: "5월", visitors: 710 },
        { month: "6월", visitors: 680 },
      ],
    },
    {
      groupName: "작년",
      data: [
        { month: "1월", visitors: 380 },
        { month: "2월", visitors: 450 },
        { month: "3월", visitors: 430 },
        { month: "4월", visitors: 520 },
        { month: "5월", visitors: 590 },
        { month: "6월", visitors: 610 },
      ],
    },
  ];

  /*
   * 선형 회귀
   */
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
      visitors: slope * index + intercept,
    }));
  };

  /*
   * 실제 데이터
   *
   * series가 legend의 독립적인 항목이 된다.
   */
  const actualData = rawDataGroup.flatMap((group) =>
    group.data.map((item) => ({
      ...item,

      group: group.groupName,

      series: `${group.groupName} 실제`,

      type: "actual",
    })),
  );

  /*
   * 추세선 데이터
   */
  const trendData = rawDataGroup.flatMap((group) =>
    getRegression(group.data).map((item) => ({
      ...item,

      group: group.groupName,

      series: `${group.groupName} 추세선`,

      type: "trend",
    })),
  );

  /*
   * Line이 사용하는 전체 데이터
   */
  const data = [...actualData, ...trendData];

  const config = {
    data,

    /*
     * 부모 Line의 x/y는 children이 상속한다.
     */
    xField: "month",
    yField: "visitors",

    /*
     * ⭐ 가장 중요한 부분
     *
     * colorField를 group이 아니라 series로 설정한다.
     *
     * 따라서 legend가:
     *
     * 올해 실제
     * 올해 추세선
     * 작년 실제
     * 작년 추세선
     *
     * 4개로 독립적으로 만들어진다.
     */
    colorField: "series",

    scale: {
      color: {
        domain: ["올해 실제", "올해 추세선", "작년 실제", "작년 추세선"],
      },

      y: {
        domainMin: 0,
        nice: true,
      },
    },

    /*
     * 하나의 차트 안에
     *
     * 1. line
     * 2. point
     *
     * 두 mark를 구성한다.
     */
    children: [
      /*
       * =========================
       * LINE
       * =========================
       */
      {
        type: "line",

        /*
         * series가 실제 / 추세선을 각각
         * 별도의 line으로 분리한다.
         */
        encode: {
          x: "month",
          y: "visitors",

          color: "series",

          series: "series",
        },

        /*
         * 실제선 / 추세선 스타일
         */
        style: {
          lineWidth: (d) => {
            return d[0]?.type === "trend" ? 2 : 3;
          },

          /*
           * ⭐ 추세선만 점선
           *
           * 실제 데이터 = 실선
           * 추세선 = 점선
           */
          lineDash: (d) => {
            return d[0]?.type === "trend" ? [6, 4] : [0, 0];
          },
        },
      },

      /*
       * =========================
       * POINT
       * =========================
       *
       * 실제 데이터만 point mark로 사용한다.
       *
       * 따라서 pointSize를 0으로 만드는 방식이 아니라
       * 애초에 추세선 데이터에는 point mark가 존재하지 않는다.
       */
      {
        type: "point",

        /*
         * ⭐ 실제 데이터만 point로 사용
         */
        data: actualData,

        encode: {
          x: "month",
          y: "visitors",

          /*
           * line과 동일한 series 값을 사용한다.
           *
           * 따라서 legend에서
           * "올해 실제"를 끄면
           * 올해 실제 line + point가 같이 꺼진다.
           */
          color: "series",

          series: "series",

          shape: "circle",
        },

        /*
         * point의 크기를 데이터로 제어하지 않는다.
         * 기본 point 크기를 사용한다.
         */
        style: {
          stroke: "#fff",
          lineWidth: 2,
        },
      },
    ],

    /*
     * ⭐ color legend
     *
     * colorField = series이므로
     * 4개의 독립적인 legend item이 생성된다.
     */
    legend: {
      color: {
        position: "top",
      },
    },

    /*
     * Tooltip
     */
    tooltip: {
      title: (datum) => datum.month,

      items: [
        {
          channel: "y",
          name: "방문자 수",
        },
      ],
    },

    /*
     * Axis
     */
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
      <div className="w-[800px]">
        <Line {...config} />
      </div>
    </>
  );
};

export default PolygonGraph;
