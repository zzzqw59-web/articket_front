import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAskDetail, getAskList } from "../../api/askApi";

const IntroAskComponent = () => {
  const [asks, setAsks] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
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
      const response = await getAskDetail(askId);

      setDetail(response);
      setOpenId(askId);
    } catch (e) {
      console.error("fail to load ask detail", e);
    }
  };

  return (
    <div className="">
      {asks.map((ask) => (
        <div key={ask.askId}>
          <div
            onClick={() => handleAskClick(ask.askId)}
            className="cursor-pointer font-bold text-4xl"
          >
            {ask.askTitle}
          </div>
          <div
            className={`overflow-hidden transition-all duration-400 ease-in-out ${
              openId === ask.askId
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div>{detail.askBody}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntroAskComponent;
