import "../../styles/ExhibitionAndVenue.css";
import { useNavigate } from "react-router-dom";

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/articket/venue/${venue.id}`
    );
  };

  return (
    <div
      className="venue-card"
      onClick={handleClick}
    >
      <div className="venue-card-image">
        <img
          src={
            venue.photoUrl ||
            "/images/default-venue.jpg"
          }
          alt={venue.name}
        />
      </div>

      <div className="venue-card-info">
        <h3>
          {venue.name}
        </h3>

        <p>
          {venue.tel || "-"}
        </p>

        <p>
          {venue.description ||
            "상세 설명이 없습니다."}
        </p>
      </div>
    </div>
  );
};

export default VenueCard;
