import { useNavigate } from "react-router-dom";
import { getExhibitionList } from "../../api/exhibitionApi";
import { useState, useEffect } from "react";

const MainPostersComponent = () => {
  const [posters, setPosters] = useState([]);
  const navigate = useNavigate();

  const fetchPosters = async () => {
    try {
      const posters = await getExhibitionList({ page: 5 });
      setPosters(posters.content.slice(0, 4));
    } catch (e) {
      console.error("fail to get exhibition list");
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  return (
    <div className="flex justify-center w-full ml-50">
      <div className="grid grid-cols-4 gap-9 w-full">
        {posters.map((poster, index) => (
          <div
            key={poster.id || index}
            className="group relative overflow-hidden cursor-pointer"
            onClick={() => navigate(`/articket/exhibition/${poster.id}`)}
          >
            <div className="w-full h-[500px]">
              <img
                src={poster.imgUrl}
                alt={poster.title}
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPostersComponent;
