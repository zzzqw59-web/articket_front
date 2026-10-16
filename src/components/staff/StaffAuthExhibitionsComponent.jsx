import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const StaffAuthExhibitionsComponent = ({ exhibitions, onRequestSuccess }) => {
  const navigate = useNavigate();

  const handleApply = async (exhibitionId) => {
    try {
      await axiosInstance.post("/api/staff/requests", { exhibitionId });
      alert("신청되었습니다.");
    } catch (e) {
      alert(e.response?.data?.message || "신청에 실패했습니다.");
    } finally {
      onRequestSuccess?.();
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 w-[1200px] h-[1100px]">
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
