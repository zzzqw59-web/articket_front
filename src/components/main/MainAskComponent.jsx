import { useEffect, useState } from "react";
import { getAskList } from "../../api/askApi";
import { useNavigate } from "react-router-dom";

const MainAskComponent = () => {
  const [asks, setAsks] = useState([]);
  const navigate = useNavigate();

  const fetchAsks = async () => {
    try {
      const response = await getAskList({ sort: "hits" });
      setAsks(response.dtoList.slice(0, 5));
    } catch (e) {
      console.error("fail to load ask", e);
    }
  };

  useEffect(() => {
    fetchAsks();
  }, []);

  return (
    <>
      <div className="w-[400px] flex justify-between mr-10">
        <div>
          <span className="block font-bold text-3xl border-b-4 w-[400px] h-12">
            <span className="ml-2 head-text">제목</span>
          </span>
          {asks.map((ask) => (
            <div key={ask.askId}>
              <div
                className="text-2xl body-text ml-2 mt-1 cursor-pointer truncate w-[370px]"
                onClick={() => navigate(`/articket/ask/${ask.askId}`)}
              >
                {ask.askTitle}
              </div>
            </div>
          ))}
        </div>
        <div>
          <span className="block font-bold text-3xl border-b-4 w-[100px] head-text h-12">
            <span className="ml-3">조회수</span>
          </span>
          {asks.map((ask) => (
            <div key={ask.askId}>
              <div className="text-2xl body-text text-center mt-1">
                {ask.askHits}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainAskComponent;
