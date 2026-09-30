import ExhibitionCard from "./ExhibitionCard";
import "../../styles/ExhibitionAndVenue.css";
const ExhibitionList = ({
  exhibitions = [],
}) => {
  if (exhibitions.length === 0) {
    return (
      <div>
        등록된 전시가 없습니다.
      </div>
    );
  }

  return (
    <div className="exhibition-list">
      {exhibitions.map((exhibition) => (
        <ExhibitionCard
          key={exhibition.id}
          exhibition={exhibition}
        />
      ))}
    </div>
  );
};

export default ExhibitionList;