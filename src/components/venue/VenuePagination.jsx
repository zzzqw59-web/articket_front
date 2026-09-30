import "../../styles/ExhibitionAndVenue.css";

const VenuePagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const PAGE_BLOCK = 10; // 한 화면에 보여줄 페이지 번호 개수

  // 1. 현재 페이지가 속한 블록의 시작과 끝 인덱스 계산 (0 기반 인덱스)
  const currentBlock = Math.floor(page / PAGE_BLOCK);
  const startPage = currentBlock * PAGE_BLOCK; // 0, 10, 20...
  const endPage = Math.min(startPage + PAGE_BLOCK - 1, totalPages - 1);

  // 2. 현재 블록에 포함될 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {/* [이전] 버튼: 이전 블록의 마지막 페이지(인덱스)로 이동 */}
      <button
        disabled={startPage === 0}
        onClick={() => onChange(startPage - 1)}
      >
        이전
      </button>

      {/* 10개 단위로 잘라낸 페이지 번호 목록만 렌더링 */}
      {pageNumbers.map((index) => (
        <button
          key={index}
          className={page === index ? "active" : ""}
          onClick={() => onChange(index)}
        >
          {index + 1}
        </button>
      ))}

      {/* [다음] 버튼: 다음 블록의 첫번째 페이지(인덱스)로 이동 */}
      <button
        disabled={endPage >= totalPages - 1}
        onClick={() => onChange(endPage + 1)}
      >
        다음
      </button>
    </div>
  );
};

export default VenuePagination;