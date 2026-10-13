import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewListByHits } from "../../api/reviewApi";

const MainReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getReviewListByHits();
      setReviews(response.dtoList.slice(0, 5));
    } catch (e) {
      console.error("fail to load ask", e);
    } finally {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <div className="w-[400px] flex justify-between mr-20">
        <div>
          <span className="block font-bold text-3xl border-b-4 w-[400px] h-12">
            <span className="ml-2 head-text">제목</span>
          </span>

          {loading ? (
            <p className="ml-2 mt-4 text-lg body-text text-gray-500">
              게시글을 불러오는 중입니다.
            </p>
          ) : error ? (
            <p className="ml-2 mt-4 text-lg body-text text-gray-500">
              게시글을 불러오지 못했습니다.
            </p>
          ) : asks.length === 0 ? (
            <p className="ml-2 mt-4 text-lg body-text text-gray-500">
              표시할 게시글이 없습니다.
            </p>
          ) : (
            asks.map((review) => (
              <div key={review.reviewId}>
                <div
                  className="text-2xl body-text ml-2 mt-1 cursor-pointer truncate  w-[370px]"
                  onClick={() => navigate(`/articket/ask/${review.reviewId}`)}
                >
                  {review.reviewTitle}
                </div>
              </div>
            ))
          )}
        </div>
        <div>
          <span className="block font-bold text-3xl border-b-4 w-[100px] head-text h-12">
            <span className="ml-3">조회수</span>
          </span>
          {reviews.map((review) => (
            <div key={review.reviewId}>
              <div className="text-2xl body-text text-center mt-1">
                {review.reviewHits}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainReviewComponent;
