import React from "react";
import { Column } from "@ant-design/plots";

const BarGraph = ({ data: rawDataGroup }) => {
  const data = rawDataGroup.flatMap((group) =>
    group.data.map((item) => ({
      ...item,
      group: group.groupName,
    })),
  );

  const config = {
    data: data,

    xField: "anchorDate",
    yField: "value",
    colorField: "group",

    group: true,

    scale: {
      y: {
        min: 0,
        nice: true,
      },
    },

    style: {
      radiusTopLeft: 4,
      radiusTopRight: 4,
    },
  };

  return (
    <div className="w-[900px]">
      <Column {...config} />
    </div>
  );
};

export default BarGraph;
