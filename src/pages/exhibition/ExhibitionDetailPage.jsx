import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/ExhibitionAndVenue.css";
import { getExhibitionDetail, deleteExhibition,} from "../../api/exhibitionApi";
import { toggleWish, countWish } from "../../api/wishApi";
import { MEMBER_ROLE, getStoredUser } from "../../constants/config";


const ExhibitionDetailPage = () => {
  const user = getStoredUser();  

  const { exhibitionId } = useParams();

  const navigate = useNavigate();

  const [exhibition, setExhibition] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isWished, setIsWished] = useState(false);

  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const [ data, wishData] = await Promise.all([
            getExhibitionDetail(exhibitionId),
            countWish(exhibitionId),
        ]); 
        
        setExhibition(data);
        setWishCount(wishData.totalWishCount);
        setIsWished(wishData.wished);
      } catch (error) {
        console.error(error);

        setError(
          "전시 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [exhibitionId]);

  const handleWishToggle = async () => {
    try {
        const data = await toggleWish(exhibitionId);

        setIsWished(data.wished);
        setWishCount(data.totalWishCount);
    } catch (error) {
        console.error("찜 처리 실패:", error);
        alert("찜 처리에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    const result = window.confirm(
      "정말 삭제하시겠습니까?"
    );

    if (!result) {
      return;
    }

    try {
      await deleteExhibition(exhibitionId);

      alert("삭제되었습니다.");

      navigate("/articket/exhibition");
    } catch (error) {
      console.error(error);

      alert("삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div>
        전시 정보가 없습니다.
      </div>
    );
  }

  const isAdmin = user?.memberType === MEMBER_ROLE.ADMIN;

  const isStaff = user?.memberType === MEMBER_ROLE.STAFF;

//   관리자 + 전시관계자만 수정 가능
   const canEdit = isAdmin || isStaff;
     //const canEdit = true;

  // 관리자 삭제 가능
   const canDelete = isAdmin;
     

  return (
    <div className="exhibition-detail-page">

      {/* 전시 이미지 */}
      <div className="exhibition-detail-image">
        <img
          src={
            exhibition.imgUrl ? exhibition.imgUrl.startsWith("http")
            ? exhibition.imgUrl : `http://localhost:8080/api/images/${exhibition.imgUrl}`
            : "/images/default-exhibition.jpg"
          }
          alt={exhibition.title}
        />
      </div>
      

      {/* 전시 정보 */}
      <div className="exhibition-detail-info">
       <div className="exhibition-detail-title">
        <h1>{exhibition.title}</h1>

        <button type="button" className = {`wish-button ${isWished ? "wished" : ""}`}
                onClick={handleWishToggle} >
                    <span className="wish-heart">
                        {isWished ? "♥" : "♡"}
                    </span>
                    <span className="wish-count">
                        {wishCount}
                    </span>
        </button>
       </div> 
        
        <p>
          {exhibition.startDate}
          {" ~ "}
          {exhibition.endDate}
        </p>

        <p>
          장소 :{" "}
          {exhibition.venue?.name ||
            "정보 없음"}
        </p>

        <p>
          지역 :{" "}
          {exhibition.area ||
            "정보 없음"}
        </p>

        <p>
          가격 :{" "}
          {exhibition.free ? "무료" : exhibition.ticketPrice}
        </p>

        {exhibition.venue?.tel && (
          <p>
            전화 :{" "}
            {exhibition.venue.tel}
          </p>
        )}

        {exhibition.url && (
            <button onClick={() => window.open(exhibition.url, "_blank")}
                    className="exhibition-homepage-button">
                공식 홈페이지
            </button>
        )}

        {!exhibition.free && (
            <button
                type="button"
                onClick={() =>
                        navigate(`/articket/exhibition/${exhibitionId}/reservation`)}
                className="exhibition-reservation-button"
            >
                예약하기
            </button>
        )}

      </div>

      {/* 전시 설명 */}
      <div className="exhibition-description">

        <h2>전시 소개</h2>

        <p>
          {exhibition.description ||
            "등록된 설명이 없습니다."}
        </p>

      </div>

      {/* 버튼 */}
      <div className="exhibition-detail-buttons">

        {canEdit && (
          <button
            onClick={() =>
              navigate(
                `/articket/exhibition/${exhibitionId}/edit`
              )
            }
          >
            수정
          </button>
         )} 

         {canDelete && (
          <button
            onClick={handleDelete}
          >
            삭제
          </button>
         )} 

        <button
          onClick={() =>
            navigate(
              "/articket/exhibition"
            )
          }
        >
          목록
        </button>

      </div>
    </div>
  );
};

export default ExhibitionDetailPage;