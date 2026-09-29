import React from "react";

const DataTableContainer = ({
  tabs = [], // [{ id: 'review', label: 'so flqb' }, ...]
  activeTab, // 현재 활성화된 탭 id
  onTabChange, // 탭 변경 콜백 함수
  columns = [], // [{ key: 'id', label: '번호', width: 'w-24', align: 'center' }, ...]
  data = [], // 데이터 배열
  currentPage = 1, // 현재 페이지 번호
  totalPages = 10, // 전체 페이지 수
  onPageChange, // 페이지 변경 콜백 함수
  sortOptions = [], // 우측 정렬 드롭다운 옵션
  selectedSort, // 현재 선택된 정렬 값
  onSortChange, // 정렬 변경 콜백
  onRowClick, // 행 클릭 이벤트 콜백 함수
  renderRow, // 사용자 정의 커스텀 row 렌더링 함수
  isCompact = false, // 축소형 모드 여부
}) => {
  return (
    <div className="w-full flex flex-col gap-0 min-w-0">
      {/* 1. 상단 탭 & 정렬 영역 */}
      <div className="flex justify-between items-end border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`px-4 sm:px-6 py-2.5 font-semibold text-sm rounded-t-lg transition-colors ${
                  isActive
                    ? "bg-white border-t-2 border-x border-gray-300 text-gray-900 border-b-white -mb-px z-10"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {sortOptions.length > 0 && (
          <div className="mb-2">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-600 bg-white focus:outline-none focus:border-amber-600"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. 테이블 데이터 영역 */}
      <div className="w-full border border-gray-200 rounded-b-lg overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-700 border-collapse border-spacing-0 table-fixed">
          {/* 테이블 헤더 */}
          <thead className="bg-white font-bold text-gray-900">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border-b border-gray-200 align-bottom ${col.width || ""} ${
                    isCompact ? "px-2 py-3 text-xs" : "px-4 sm:px-6 py-4 text-sm"
                  } ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, index) =>
                renderRow ? (
                  renderRow(row, index)
                ) : (
                  <tr
                    key={row.id || index}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-gray-50 transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`whitespace-nowrap truncate ${
                          isCompact ? "px-2 py-2.5 text-xs" : "px-4 py-3 text-sm"
                        } text-gray-800 ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  데이터가 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 3. 하단 페이지네이션 */}
        <div className="flex justify-center items-center py-3 gap-1.5 text-xs border-t border-gray-100">
          <button
            type="button"
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-30 px-1"
          >
            &lt; 이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange && onPageChange(pageNum)}
              className={`w-6 h-6 rounded flex items-center justify-center font-medium transition-colors ${
                pageNum === currentPage
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-30 px-1"
          >
            다음 &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTableContainer;