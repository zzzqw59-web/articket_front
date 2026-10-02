import BarGraph from "./BarGraph";
import PolygonGraph from "./PolygonGraph";
import { useState } from "react";

const StaffComponent = () => {
  const [isPolygon, setIsPolygon] = useState(true);

  return (
    <>
      <div>staff page test</div>
      <div className="flex justify-between w-[800px]">
        <div>title</div>
        <div>
          <button
            onClick={() => setIsPolygon(true)}
            className={`head-text font-bold rounded-2xl px-3 py-2 hover:bg-[#bfd6df] mr-2
            ${isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300"}`}
          >
            꺾은선
          </button>
          <button
            onClick={() => setIsPolygon(false)}
            className={`head-text font-bold rounded-2xl px-3 py-2 hover:bg-[#bfd6df] 
            ${!isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300"}`}
          >
            막대
          </button>
        </div>
      </div>
      {isPolygon ? <PolygonGraph /> : <BarGraph />}
      <div className="h-96" />
    </>
  );
};

export default StaffComponent;
