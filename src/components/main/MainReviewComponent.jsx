import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewListByHits } from "../../api/reviewApi";

const MainReviewComponent = () => {
  const [asks, setAsks] = useState([]);
  const navigate = useNavigate();

  const fetchAsks = async () => {
    try {
      const response = await getReviewListByHits();
      setAsks(response.dtoList.slice(0, 5));
    } catch (e) {
      console.error("fail to load ask", e);
    }
  };

  useEffect(() => {
    fetchAsks();
  }, []);

  return (
    <>
      <div className="w-[400px] flex justify-between mr-20">
        <div>
          <span className="block font-bold text-3xl border-b-4 w-[400px] h-12">
            <span className="ml-2 head-text">제목</span>
          </span>
          {asks.map((review) => (
            <div key={review.reviewId}>
              <div
                className="text-2xl body-text ml-2 mt-1 cursor-pointer truncate  w-[370px]"
                onClick={() => navigate(`/articket/ask/${review.reviewId}`)}
              >
                {review.reviewTitle}
              </div>
            </div>
          ))}
        </div>
        <div>
          <span className="block font-bold text-3xl border-b-4 w-[100px] head-text h-12">
            <span className="ml-3">조회수</span>
          </span>
          {asks.map((review) => (
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
