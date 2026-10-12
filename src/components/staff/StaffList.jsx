const StaffList = ({
  title,
  items = [],
  idKey,
  titleKey,
  dateKey,
  page = 0,
  totalPages = 1,
  onPageChange,
  onItemClick,
}) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safePage = Math.min(Math.max(0, Number(page) || 0), safeTotalPages - 1);

  const changePage = (nextPage) => {
    if (nextPage < 0 || nextPage >= safeTotalPages) return;
    if (nextPage === safePage) return;

    onPageChange?.(nextPage);
  };

  // 현재 페이지 주변 번호 표시
  const startPage = Math.max(0, safePage - 1);
  const endPage = Math.min(safeTotalPages - 1, safePage + 1);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  return (
    <section className="flex h-[400px] min-w-0 flex-1 flex-col border border-gray-200 bg-white p-5">
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="head-text text-2xl font-bold">{title}</h2>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto divide-y divide-gray-100">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={item[idKey] ?? `${safePage}-${index}`}>
              <button
                type="button"
                onClick={() => onItemClick?.(item)}
                className="group flex min-h-[48px] w-full items-center gap-3 py-3 text-left"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 transition-colors group-hover:bg-black" />

                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 transition-colors group-hover:text-black">
                  {item[titleKey] || "제목 없음"}
                </span>

                <span className="shrink-0 text-xs text-gray-400">
                  {item[dateKey] ? String(item[dateKey]).slice(0, 10) : ""}
                </span>
              </button>
            </li>
          ))
        ) : (
          <li className="flex h-full items-center justify-center text-sm text-gray-400">
            등록된 글이 없습니다.
          </li>
        )}
      </ul>
      {safeTotalPages > 1 && (
        <div className="mt-2 flex min-h-[36px] shrink-0 items-center justify-center gap-1 border-t border-gray-100 pt-2">
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => changePage(safePage - 1)}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            이전
          </button>

          {startPage > 0 && (
            <>
              <button
                type="button"
                onClick={() => changePage(0)}
                className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                1
              </button>

              {startPage > 1 && (
                <span className="px-1 text-sm text-gray-400">…</span>
              )}
            </>
          )}

          {visiblePages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => changePage(pageNumber)}
              aria-current={safePage === pageNumber ? "page" : undefined}
              className={`min-w-8 rounded px-2 py-1 text-sm transition ${
                safePage === pageNumber
                  ? "bg-gray-900 font-bold text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pageNumber + 1}
            </button>
          ))}

          {endPage < safeTotalPages - 1 && (
            <>
              {endPage < safeTotalPages - 2 && (
                <span className="px-1 text-sm text-gray-400">…</span>
              )}

              <button
                type="button"
                onClick={() => changePage(safeTotalPages - 1)}
                className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                {safeTotalPages}
              </button>
            </>
          )}

          <button
            type="button"
            disabled={safePage >= safeTotalPages - 1}
            onClick={() => changePage(safePage + 1)}
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
};

export default StaffList;
