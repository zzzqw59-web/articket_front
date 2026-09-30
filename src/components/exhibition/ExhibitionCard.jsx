import { useNavigate } from "react-router";
import "../../styles/ExhibitionAndVenue.css";

const ExhibitionCard = ({
  exhibition,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/articket/exhibition/${exhibition.id}`
    );
  };

  return (
    <div
      className="exhibition-card"
      onClick={handleClick}
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
        <span
          className={`exhibition-badge ${
            exhibition.Free
              ? "free"
              : "paid"
          }`}
        >
          {exhibition.free
            ? "무료"
            : "유료"}
        </span>

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