import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewListByHits } from "../../api/reviewApi";

const MainReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await getReviewListByHits();
      setReviews(response.dtoList.slice(0, 5));
    } catch (e) {
      console.error("fail to load reviews", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderMessage = (message) => (
    <p className="ml-2 mt-4 text-lg body-text text-gray-500">{message}</p>
  );

  return (
    <div className="w-[400px] flex justify-between mr-20">
      {/* 제목 영역 */}
      <div>
        <span className="block font-bold text-3xl border-b-4 w-[400px] h-12">
          <span className="ml-2 head-text">제목</span>
        </span>

        {loading
          ? renderMessage("리뷰를 불러오는 중입니다.")
          : error
            ? renderMessage("리뷰를 불러오지 못했습니다.")
            : reviews.length === 0
              ? renderMessage("표시할 리뷰가 없습니다.")
              : reviews.map((review) => (
                  <div key={review.reviewId}>
                    <div
                      className="text-2xl body-text ml-2 mt-1 cursor-pointer truncate w-[370px]"
                      onClick={() =>
                        navigate(`/articket/review/${review.reviewId}`)
                      }
                    >
                      {review.reviewTitle}
                    </div>
                  </div>
                ))}
      </div>

      {/* 조회수 영역 */}
      <div>
        <span className="block font-bold text-3xl border-b-4 w-[100px] head-text h-12">
          <span className="ml-3">조회수</span>
        </span>

        {!loading &&
          !error &&
          reviews.map((review) => (
            <div key={review.reviewId}>
              <div className="text-2xl body-text text-center mt-1">
                {review.reviewHits}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainReviewComponent;
