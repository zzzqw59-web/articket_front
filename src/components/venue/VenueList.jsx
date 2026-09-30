import VenueCard from "./VenueCard";
import "../../styles/ExhibitionAndVenue.css";

const VenueList = ({
  venues = [],
}) => {
  if (venues.length === 0) {
    return (
      <div>
        등록된 전시장이 없습니다.
      </div>
    );
  }

  return (
    <div className="venue-list">
      {venues.map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
        />
      ))}
    </div>
  );
};

export default VenueList;