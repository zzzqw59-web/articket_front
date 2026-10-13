const StaffAuthPostersComponent = ({
  pageCache,
  page,
  totalPages,
  onSelect,
  onPageChange,
  selectedIds = [],
}) => {
  const current = pageCache[page] || [];

  return (
    <div className="flex gap-4 justify-center items-center">
      {page > 0 && (
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          className="text-5xl text-gray-400 head-text cursor-pointer"
        >
          «
        </button>
      )}

      {/* 포스터 viewport */}
      <div className="w-[1100px] overflow-hidden select-none">
        <div key={page} className="flex gap-4 justify-start">
          {current.map((poster) => {
            const isSelected = selectedIds.includes(poster.id);
            return (
              <div
                key={poster.id}
                onClick={() => onSelect(poster)}
                className={`w-50 h-80 mt-2 mb-7 shrink-0 overflow-hidden transition-all ease-in-out ${
                  isSelected ? "scale-90 brightness-90" : "hover:scale-110"
                }`}
              >
                <img
                  src={poster.imgUrl}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>

      {page < totalPages - 1 && (
        <button
          type="button"
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
