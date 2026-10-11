import { Pie } from "@ant-design/plots";
import { Tooltip } from "antd";
import React from "react";

const PieGraph = ({ data = [] }) => {
  const config = {
    data,
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
