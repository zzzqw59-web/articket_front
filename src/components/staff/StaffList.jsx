const StaffList = ({
  title,
  items = [],
  onItemClick,
  page = 0,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <section className="min-w-0 flex-1 border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="head-text text-2xl font-bold">{title}</h2>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onItemClick?.(item)}
              className="group w-full py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 transition-colors group-hover:bg-black" />

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 transition-colors group-hover:text-black">
                  {item.title}
                </span>

                <span className="ml-4 shrink-0 text-xs text-gray-400">
                  {item.date}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* 페이징 */}
      <div className="mt-3 flex items-center justify-center gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => onPageChange?.(page - 1)}
          className="rounded px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, index) => index).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange?.(pageNumber)}
              className={`h-9 min-w-9 rounded px-3 text-sm transition-colors ${
                page === pageNumber
                  ? "bg-black font-semibold text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pageNumber + 1}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange?.(page + 1)}
          className="rounded px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          다음
        </button>
      </div>
    </section>
  );
};

export default StaffList;
