import "./Marquee.css";
import React from "react";

const Marquee = () => {
  const row1ImagesData = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500",
      title: "1번 줄 전시 A",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500",
      title: "1번 줄 전시 B",
    },
  ];

  const row2ImagesData = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
      title: "2번 줄 전시 A",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=500",
      title: "2번 줄 전시 B",
    },
  ];

  const row3ImagesData = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=500",
      title: "3번 줄 전시 A",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=500",
      title: "3번 줄 전시 B",
    },
  ];

  const getFixedItems = (sourceArray, count = 9) => {
    let items = [];
    while (items.length < count) {
      items = [...items, ...sourceArray];
    }
    return items.slice(0, count);
  };

  const rows = [
    {
      items: getFixedItems(row1ImagesData, 9),
      animationClass: "animate-marquee",
      overlayClass: "bg-black/0",
    },
    {
      items: getFixedItems(row2ImagesData, 9),
      animationClass: "animate-marquee-reverse",
      overlayClass: "bg-black/20",
    },
    {
      items: getFixedItems(row3ImagesData, 9),
      animationClass: "animate-marquee",
      overlayClass: "bg-black/50",
    },
  ];

  return (
    <div className="w-[1500px] overflow-hidden py-3 select-none ml-20">
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
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 transition-all duration-300 cursor-pointer"
                  />
                  <div
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
