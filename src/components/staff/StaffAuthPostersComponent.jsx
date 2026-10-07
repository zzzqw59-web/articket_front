const StaffAuthPostersComponent = ({
  pageCache,
  page,
  totalPages,
  onSelect,
  onPageChange,
}) => {
  const prev = pageCache[page - 1] || [];
  const current = pageCache[page] || [];
  const next = pageCache[page + 1] || [];

  return (
    <div className="flex gap-4 justify-center">
      {page !== 0 && (
        <button
          onClick={() => onPageChange(page - 1)}
          className="text-5xl text-gray-400 head-text cursor-pointer"
        >
          «
        </button>
      )}
      {/* 포스터 viewport */}
      <div className="w-[1100px] overflow-hidden">
        {/* 실제로 움직이는 track */}
        <div className="flex " style={{ transform: `translateX(-1100px)` }}>
          {/* 이전 페이지 */}
          <div className="w-[1100px] shrink-0 flex gap-4 justify-center">
            {prev.map((poster) => (
              <div
                key={poster.id}
                onClick={() => onSelect(poster.id)}
                className="w-50 h-80 mt-2 mb-7 overflow-hidden shrink-0"
              >
                <img
                  src={poster.imgUrl}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* 현재 페이지 */}
          <div className="w-[1100px] shrink-0 flex gap-4 justify-center">
            {current.map((poster) => (
              <div
                key={poster.id}
                onClick={() => onSelect(poster.id)}
                className="w-50 h-80 mt-2 mb-7 overflow-hidden shrink-0"
              >
                <img
                  src={poster.imgUrl}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* 다음 페이지 */}
          <div className="w-[1100px] shrink-0 flex gap-4 justify-center">
            {next.map((poster) => (
              <div
                key={poster.id}
                onClick={() => onSelect(poster.id)}
                className="w-50 h-80 mt-2 mb-7 overflow-hidden shrink-0"
              >
                <img
                  src={poster.imgUrl}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {page < totalPages - 1 && (
        <button
          onClick={() => onPageChange(page + 1)}
          className="text-5xl text-gray-400 head-text cursor-pointer"
        >
          »
        </button>
      )}
    </div>
  );
};

export default StaffAuthPostersComponent;
