import { useEffect, useState } from "react";
import { getReviewListByHits } from "../../api/reviewApi";
import { useNavigate } from "react-router-dom";

const IntroReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const response = await getReviewListByHits();
      setReviews(response.dtoList.slice(0, 3));
    } catch (e) {
      console.error("fail to load review", e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex justify-center mt-20 gap-10">
      {reviews.map((review) => (
        <div
          key={review.reviewId}
          onClick={() => navigate(`/articket/review/${review.reviewId}`)}
          className=" w-[380px] min-h-[300px] border border-gray-200 bg-white p-7
          hover:-translate-y-10 hover:bg-[#bfd6df] cursor-pointer transition duration-300 ease-in-out"
        >
          <h3 className="head-text text-3xl font-bold text-gray-900 line-clamp-1">
            {review.reviewTitle}
          </h3>

          <p className="body-text mt-5 text-xl tracking-wid leading-7 text-gray-600 line-clamp-7">
            {review.reviewBody}
          </p>
        </div>
      ))}
    </div>
  );
};

export default IntroReviewComponent;
