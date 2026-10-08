import { useNavigate } from "react-router-dom";

const StaffAuthExhibitionsComponent = ({ exhibitions }) => {
  const navigate = useNavigate();

  const handleApply = async (staffId, exhibitionId) => {
    try {
      //await apply(staffId, exhibitionId);
      alert("신청되었습니다.");
    } catch (e) {
      console.error("fail to apply", e);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-[1200px] h-[1600px]">
        {Array.isArray(exhibitions) &&
          exhibitions.map((item) => (
            <div key={item.id} className="w-[300px] h-[400px]">
              <div className="head-text font-bold text-2xl">{item.title}</div>
              <img
                src={item.imgUrl}
                alt={item.title}
                onClick={() => navigate(`/articket/exhibition/${item.id}`)}
                className="object-fill w-full h-full cursor-pointer truncate"
              />
              <div className="flex justify-end">
                <div
                  onClick={() => handleApply(item.id)}
                  className="bg-[#214d72] text-white p-2 px-6 mt-2 rounded-2xl body-text hover:bg-[#5c88a8] cursor-pointer"
                >
                  신청
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default StaffAuthExhibitionsComponent;
