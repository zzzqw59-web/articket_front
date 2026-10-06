import BarGraph from "./BarGraph";
import PolygonGraph from "./PolygonGraph";
import { useState } from "react";

const StaffComponent = () => {
  const [isPolygon, setIsPolygon] = useState(true);

  return (
    <>
      <div>title</div>
      {isPolygon ? (
        <PolygonGraph
          data={[
            {
              groupName: "올해",
              data: [
                { month: "1월", visitors: 420, type: "올해" },
                { month: "2월", visitors: 3000, type: "올해" },
                { month: "3월", visitors: 510, type: "올해" },
                { month: "4월", visitors: 630, type: "올해" },
                { month: "5월", visitors: 750, type: "올해" },
                { month: "6월", visitors: 820, type: "올해" },
              ],
            },
            {
              groupName: "작년",
              data: [
                { month: "1월", visitors: 300, type: "작년" },
                { month: "2월", visitors: 1500, type: "작년" },
                { month: "3월", visitors: 400, type: "작년" },
                { month: "4월", visitors: 500, type: "작년" },
                { month: "5월", visitors: 600, type: "작년" },
                { month: "6월", visitors: 700, type: "작년" },
              ],
            },
            {
              groupName: "재작년",
              data: [
                { month: "1월", visitors: 3000, type: "재작년" },
                { month: "2월", visitors: 150, type: "재작년" },
                { month: "3월", visitors: 40, type: "재작년" },
                { month: "4월", visitors: 50, type: "재작년" },
                { month: "5월", visitors: 800, type: "재작년" },
                { month: "6월", visitors: 400, type: "재작년" },
              ],
            },
          ]}
        />
      ) : (
        <BarGraph
          data={[
            {
              groupName: "올해",
              data: [
                { month: "1월", visitors: 420, type: "올해" },
                { month: "2월", visitors: 3000, type: "올해" },
                { month: "3월", visitors: 510, type: "올해" },
                { month: "4월", visitors: 630, type: "올해" },
                { month: "5월", visitors: 750, type: "올해" },
                { month: "6월", visitors: 820, type: "올해" },
              ],
            },
            {
              groupName: "작년",
              data: [
                { month: "1월", visitors: 300, type: "작년" },
                { month: "2월", visitors: 1500, type: "작년" },
                { month: "3월", visitors: 400, type: "작년" },
                { month: "4월", visitors: 500, type: "작년" },
                { month: "5월", visitors: 600, type: "작년" },
                { month: "6월", visitors: 700, type: "작년" },
              ],
            },
            {
              groupName: "재작년",
              data: [
                { month: "1월", visitors: 3000, type: "재작년" },
                { month: "2월", visitors: 150, type: "재작년" },
                { month: "3월", visitors: 40, type: "재작년" },
                { month: "4월", visitors: 50, type: "재작년" },
                { month: "5월", visitors: 800, type: "재작년" },
                { month: "6월", visitors: 400, type: "재작년" },
              ],
            },
          ]}
        />
      )}
      <div className="flex justify-between w-[900px] cursor-none text-white">
        <div>.</div>
        <div>
          <button
            onClick={() => setIsPolygon(true)}
            className={`head-text font-bold px-3 py-2 hover:bg-[#bfd6df] mr-2
            ${isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300"}`}
          >
            꺾은선
          </button>
          <button
            onClick={() => setIsPolygon(false)}
            className={`head-text font-bold px-3 py-2 hover:bg-[#bfd6df] 
            ${!isPolygon ? "bg-[#0b2342] text-white" : "bg-gray-300"}`}
          >
            막대
          </button>
        </div>
      </div>
      <div className="h-96" />
    </>
  );
};

export default StaffComponent;
