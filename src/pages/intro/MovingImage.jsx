import { useNavigate } from "react-router-dom";

const MovingImage = ({ venues }) => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <img
          src={venues[0]?.photoUrl}
          className="w-[900px] h-[500px] object-cover"
        />
      </div>
      <div>
        <img
          src={venues[1]?.photoUrl}
          className="w-[900px] h-[500px] object-cover"
        />
      </div>
    </>
  );
};
export default MovingImage;
