import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntroAskComponent = () => {
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
    <div>
      <div>11</div>
    </div>
  );
};

export default IntroAskComponent;
