import { useNavigate } from "react-router-dom";
import { getExhibitionList } from "../../api/exhibitionApi";
import { useState, useEffect } from "react";

const MainPostersComponent = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const fetchPosters = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await getExhibitionList({
        page: 5,
        sort: "wishCount",
      });

      setPosters(response.content.slice(0, 4));
    } catch (e) {
      console.error("fail to get exhibition list", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  return (
    <div className="flex justify-center w-full">
      {loading ? (
        <div className="flex items-center justify-center w-full h-[350px] text-lg body-text text-gray-500">
          전시 목록을 불러오는 중입니다.
        </div>
      ) : error ? (
        <div className="flex items-center justify-center w-full h-[350px] text-lg body-text text-gray-500">
          전시 목록을 불러오지 못했습니다.
        </div>
      ) : posters.length === 0 ? (
        <div className="flex items-center justify-center w-full h-[350px] text-lg body-text text-gray-500">
          표시할 전시가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-9 w-full">
          {posters.map((poster, index) => (
            <div
              key={poster.id || index}
              className="group relative overflow-hidden cursor-pointer"
              onClick={() => navigate(`/articket/exhibition/${poster.id}`)}
            >
              <div className="w-full h-[350px]">
                <img
                  src={poster.imgUrl}
                  alt={poster.title}
                  className="w-full h-full object-fill"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3">
                  <span className="text-white text-xl font-bold whitespace-nowrap truncate">
                    {poster.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPostersComponent;
