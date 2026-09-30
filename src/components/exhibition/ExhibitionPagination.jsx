import "../../styles/ExhibitionAndVenue.css";

const ExhibitionPagination = ({
  page,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        이전
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => (
          <button
            key={index}
            className={
              page === index
                ? "active"
                : ""
            }
            onClick={() =>
              onChange(index)
            }
          >
            {index + 1}
          </button>
        )
      )}

      <button
        disabled={
          page === totalPages - 1
        }
        onClick={() =>
          onChange(page + 1)
        }
      >
        다음
      </button>
    </div>
  );
};

export default ExhibitionPagination;