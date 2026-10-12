import { Pie } from "@ant-design/plots";
import React from "react";

const cancelReasonOrder = [
  "PERSONAL",
  "SCHEDULE",
  "PLAN_CHANGE",
  "COMPANION",
  "WRONG_RESERVATION",
  "OTHER",
];
const cancelReasonLabels = {
  PERSONAL: "개인 사정",
  SCHEDULE: "일정 문제",
  PLAN_CHANGE: "계획 변경",
  COMPANION: "동행인 문제",
  WRONG_RESERVATION: "예약 실수",
  OTHER: "기타",
};

const PieGraph = ({ data = [] }) => {
  const chartData = [...data]
    .sort(
      (a, b) =>
        cancelReasonOrder.indexOf(a.type) - cancelReasonOrder.indexOf(b.type),
    )
    .map((item) => ({
      ...item,
      type: cancelReasonLabels[item.type] ?? item.type,
    }));

  const config = {
    data: chartData,
    angleField: "value",
    colorField: "type",

    tooltip: {
      items: [
        (datum) => ({
          name: String(datum.type),
          value: datum.value,
        }),
      ],
    },

    width: 600,
    height: 350,

    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  return (
    <div className="w-[600px]">
      <Pie {...config} />
    </div>
  );
};

export default PieGraph;
