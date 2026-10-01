import "./Marquee.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const Marquee = ({ posters }) => {
  const row1 = posters[0]?.content || [];
  const row2 = posters[1]?.content || [];
  const row3 = posters[2]?.content || [];

  const navigate = useNavigate();

  const getFixedItems = (sourceArray, count = 9) => {
    if (!sourceArray || sourceArray.length == 0) {
      return [];
    }
    let items = [];
    while (items.length < count) {
      items = [...items, ...sourceArray];
    }
    return items.slice(0, count);
  };

  const rows = [
    {
      items: getFixedItems(row1, 9),
      animationClass: "animate-marquee",
      overlayClass: "bg-black/0",
    },
    {
      items: getFixedItems(row2, 9),
      animationClass: "animate-marquee-reverse",
      overlayClass: "bg-black/20",
    },
    {
      items: getFixedItems(row3, 9),
      animationClass: "animate-marquee",
      overlayClass: "bg-black/50",
    },
  ];

  return (
    <div className="w-[1300px] overflow-hidden py-3 select-none ml-20">
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex overflow-hidden mb-4 gap-4 group"
        >
          {[0, 1].map((trackIndex) => (
            <div
              key={`row-${rowIndex}-track-${trackIndex}`}
              className={`flex gap-4 min-w-full shrink-0 ${row.animationClass}`}
            >
              {row.items.map((item, i) => (
                <div
                  key={`r${rowIndex + 1}-${trackIndex}-${i}`}
                  className="h-[max(20vh,250px)] aspect-[3/4] shrink-0 overflow-hidden relative group/item"
                >
                  <img
                    onClick={() => navigate(`/articket/exhibition/${item.id}`)}
                    src={item.imgUrl}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 transition-all duration-300 cursor-pointer"
                  />
                  <div
                    onClick={() => navigate(`/articket/exhibition/${item.id}`)}
                    className={`absolute inset-0 ${row.overlayClass} group-hover/item:bg-black/0 transition-all duration-300 cursor-pointer`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Marquee;
