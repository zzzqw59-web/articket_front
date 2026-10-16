import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewListByHits } from "../../api/reviewApi";

const MainReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getReviewListByHits();

        if (!cancelled) {
          setReviews((response?.dtoList ?? []).slice(0, 5));
        }
      } catch (e) {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderMessage = (message) => (
    <div className="flex min-h-[220px] items-center justify-center text-sm text-[#938B81]">
      {message}
    </div>
  );

  return (
    <div className="w-full">
      {/* 테이블 헤더 */}
      <div
        className="
          flex items-center justify-between
          border-b border-[#3A352F]
          pb-4
        "
      >
        <span className="text-[12px] font-medium text-[#514B44]">제목</span>

        <span className="w-[64px] text-center text-[12px] font-medium text-[#514B44]">
          조회수
        </span>
      </div>

      {/* 리뷰 목록 */}
      {loading ? (
        renderMessage("리뷰를 불러오는 중입니다.")
      ) : error ? (
        renderMessage("리뷰를 불러오지 못했습니다.")
      ) : reviews.length === 0 ? (
        renderMessage("표시할 리뷰가 없습니다.")
      ) : (
        <div>
          {reviews.map((review, index) => (
            <button
              type="button"
              key={review.reviewId}
              onClick={() => navigate(`/articket/review/${review.reviewId}`)}
              className="
                group flex w-full
                items-center justify-between
                gap-4 border-b
                border-[#E5DFD5]
                py-5 text-left
                transition-colors duration-200
                hover:bg-[#F3F0EA]
              "
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="w-5 shrink-0 text-[11px] text-[#A29A8F]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className="
                    truncate text-[14px]
                    text-[#3A352F]
                    transition-colors
                    group-hover:text-black
                  "
                >
                  {review.reviewTitle}
                </span>
              </div>

              <span
                className="
                  w-[64px] shrink-0
                  text-center text-[12px]
                  text-[#938B81]
                "
              >
                {review.reviewHits ?? 0}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainReviewComponent;
