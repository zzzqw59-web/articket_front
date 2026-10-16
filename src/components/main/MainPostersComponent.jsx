import { useNavigate } from "react-router-dom";
import { getExhibitionList } from "../../api/exhibitionApi";
import { useState, useEffect } from "react";

const MainPostersComponent = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchPosters = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getExhibitionList({
          page: 5,
          sort: "wishCount",
        });

        if (!cancelled) {
          setPosters((response?.content ?? []).slice(0, 4));
        }
      } catch (e) {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPosters();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || error || posters.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-[#817A71]">
        {loading
          ? "전시 목록을 불러오는 중입니다."
          : error
            ? "전시 목록을 불러오지 못했습니다."
            : "표시할 전시가 없습니다."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-6">
      {posters.map((poster) => (
        <button
          type="button"
          key={poster.id}
          onClick={() => navigate(`/articket/exhibition/${poster.id}`)}
          className="group min-w-0 text-left"
          aria-label={`${poster.title} 전시 상세 보기`}
        >
          {/* 전시 포스터 */}
          <div
            className="
              relative flex aspect-[3/4]
              items-center justify-center
              overflow-hidden
              bg-[#EEEAE3]
            "
          >
            <img
              src={poster.imgUrl}
              alt={poster.title}
              loading="lazy"
              className="
                h-full w-full object-contain
                transition-transform duration-700
                group-hover:scale-[1.035]
              "
            />

            {/* 호버 오버레이 */}
            <div
              className="
                absolute inset-0 flex flex-col
                justify-end bg-black/65 p-5
                opacity-0 transition-opacity
                duration-300
                group-hover:opacity-100
                group-focus-visible:opacity-100
              "
            >
              <span className="mb-2 text-[10px] tracking-[0.25em] text-white/70">
                EXHIBITION
              </span>

              <h3 className="line-clamp-3 text-lg font-medium leading-relaxed text-white">
                {poster.title}
              </h3>

              <span className="mt-5 text-xs text-white/85">자세히 보기 ↗</span>
            </div>
          </div>

          {/* 포스터 아래 정보 */}
          <div className="pt-4">
            <h3 className="truncate text-[15px] font-medium tracking-[-0.03em] text-[#302B26]">
              {poster.title}
            </h3>

            <div className="mt-3 h-px w-full bg-[#E5DFD5]" />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] tracking-[0.15em] text-[#938B81]">
                ARTICKET
              </span>

              <span
                className="
                  text-lg text-[#817A71]
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              >
                ↗
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MainPostersComponent;
