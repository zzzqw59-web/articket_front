import { Pie } from "@ant-design/plots";
import { Tooltip } from "antd";
import React from "react";

const PieGraph = () => {
  const config = {
    data: [
      { type: "11111111111", value: 27 },
      { type: "2", value: 25 },
      { type: "3", value: 18 },
      { type: "4", value: 15 },
      { type: "5", value: 10 },
      { type: "6", value: 5 },
    ],

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
    height: 300,

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
