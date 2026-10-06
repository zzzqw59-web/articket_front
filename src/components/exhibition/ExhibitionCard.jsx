import { useNavigate } from "react-router";
import "../../styles/ExhibitionAndVenue.css";
import { useState, useEffect } from "react";
import { countWish, toggleWish } from "../../api/wishApi";

const ExhibitionCard = ({exhibition}) => {
  const navigate = useNavigate();

  const [isWished, setIswished] = useState(false);
  const [wishCount, setWishCount] = useState(0);

  //해당 전시의 찜 개수 조회 + 현재 회원의 찜 여부 조회
  useEffect(() => {
    const fetchWishInfo = async () => {
        try {
            const data = await countWish( exhibition.id);

            setWishCount(data.totalWishCount);
            setIswished(data.wished);
        } catch(error) {
            console.error("찜 개수 조회 실패",error);
        }
    };
    fetchWishInfo();
  }, [exhibition.id]);

  //찜 토글
  const handleWishToggle = async (e) => {
    //카드 클릭 이벤트 방지
    e.stopPropagation();

    try {
        const data = await toggleWish(exhibition.id);

        setIswished(data.wished);
        setWishCount(data.totalWishCount);
    }catch (error) {
        console.error("찜 토글 실패:", error);
        alert("찜 처리에 실패했습니다.");
    }
  };

  const handleCardClick = () => {
    navigate(
      `/articket/exhibition/${exhibition.id}`
    );
  };

  return (
    <div
      className="exhibition-card"
      onClick={handleCardClick}
    >
      <div className="exhibition-image">
        <img
          src={ exhibition.imgUrl
            ? exhibition.imgUrl.startsWith("http") 
            ? exhibition.imgUrl : `http://localhost:8080/api/images/${exhibition.imgUrl}` 
            : "/images/default-exhibition.jpg"}
          alt={exhibition.title}
        />
      </div>

      <div className="exhibition-info">
       <div className="exhibition-card-top">     
        <span
          className={`exhibition-badge ${
            exhibition.free
              ? "free"
              : "paid"
          }`}
        >
          {exhibition.free
            ? "무료"
            : "유료"}
        </span>

        {/* 찜 */}
        <button
            type="button"
            className={`wish-button ${
                isWished ? "wished" : ""
            }`}
            onClick={handleWishToggle}
        >
            {isWished ? "♥" : "♡"}
            <span>{wishCount}</span>
        </button>
       </div> 

        <h3>
          {exhibition.title}
        </h3>

        <p>
          {exhibition.startDate}
          {" ~ "}
          {exhibition.endDate}
        </p>
      </div>
    </div>
  );
};

export default ExhibitionCard; 