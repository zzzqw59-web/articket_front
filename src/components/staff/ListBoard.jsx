import { useNavigate } from "react-router-dom";
import StaffList from "./StaffList";

const ListBoard = ({ selectedExhibitions = [] }) => {
  const navigate = useNavigate();

  const MOCK_ASKS = [
    { id: 1, title: "전시 관람 시간 문의", date: "2026.10.10" },
    { id: 2, title: "주차장 이용 관련 문의", date: "2026.10.09" },
    { id: 3, title: "예약 변경 방법을 알고 싶습니다", date: "2026.10.08" },
    { id: 4, title: "예약 변경 방법을 알고 싶습니다", date: "2026.10.08" },
    { id: 5, title: "예약 변경 방법을 알고 싶습니다", date: "2026.10.08" },
  ];

  return (
    <div className=" w-[1100px] mx-auto">
      <div className="flex mt-15 mb-5 items-center">
        <div className="text-4xl head-text font-bold -translate-x-7">
          관련 글 조회
        </div>
        <span
          className="px-3 py-1 border-2 border-gray-500 text-gray-500 select-none cursor-pointer rounded-2xl
          hover:bg-gray-700 hover:text-white transition"
          onClick={() =>
            navigate(`/articket/exhibition/${selectedExhibitionId}`)
          }
        >
          전시 소개 글 바로가기
        </span>
      </div>
      <div className="flex gap-5">
        <StaffList title="문의글" />
        <StaffList title="리뷰글" />
      </div>
    </div>
  );
};
export default ListBoard;
