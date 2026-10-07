import { useState, useEffect } from "react";
import { getAskDetail, getAskList } from "../../api/askApi";
import { useNavigate } from "react-router-dom";

const IntroAskComponent = () => {
  const [asks, setAsks] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

  const fetchAsks = async () => {
    try {
      const response = await getAskList({ sort: "hits" });
      setAsks(response.dtoList.slice(0, 3));
    } catch (e) {
      console.error("fail to load ask", e);
    }
  };

  useEffect(() => {
    fetchAsks();
  }, []);

  const handleAskClick = async (askId) => {
    if (openId === askId) {
      setOpenId(null);
      return;
    }

    try {
      const isDetail = details.find((detail) => detail.askId === askId);

      if (!isDetail) {
        const response = await getAskDetail(askId);

        setDetails((prev) => [
          ...prev,
          {
            askId,
            ...response,
          },
        ]);
      }

      setOpenId(askId);
    } catch (e) {
      console.error("fail to load ask detail", e);
    }
  };

  return (
    <div className="h-[300px] flex flex-col items-end">
      {asks.map((ask) => {
        const detail = details.find((item) => item.askId === ask.askId);

        return (
          <div key={ask.askId} className="text-right">
            <div
              onClick={() => handleAskClick(ask.askId)}
              className="cursor-pointer font-bold text-5xl leading-15 head-text"
            >
              · {ask.askTitle}
            </div>

            <div
              className={`body-text overflow-hidden transition-all duration-300 ease-in-out text-3xl w-[1200px] ${
                openId === ask.askId
                  ? "max-h-[350px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="max-h-[300px] overflow-hidden ">
                {detail?.askBody}
              </div>
              <div
                onClick={() => navigate(`/articket/ask/${ask.askId}`)}
                className="cursor-pointer text-[#5c88a8] font-bold text-2xl"
              >
                ⇒ 답변 확인하기
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IntroAskComponent;
