import React, { useState } from "react";
import Badge from "../../../components/common/Badge";

const WishlistCard = ({ item, onRemove, onClick }) => {
  const [isLiked, setIsLiked] = useState(true);

  // 개최 상태에 따른 뱃지 variant 매핑
  const getStatusVariant = (status) => {
    switch (status) {
      case "개최중":
        return "ongoing";
      case "개최전":
        return "upcoming";
      case "종료":
      default:
        return "ended";
    }
  };

  // 찜 해제 버튼 클릭
  const handleToggleLike = (e) => {
    e.stopPropagation(); // 카드 클릭(상세 이동) 이벤트 방지
    setIsLiked(false);
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(item.id)}
      className="group cursor-pointer flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      {/* 1. 썸네일 & 별 아이콘 */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            {/* 기본 이미지 아웃라인 아이콘 */}
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* 우측 상단 찜 별 아이콘 (원형 배경 제거, 별 모양 단독 노출) */}
        <button
        type="button"
        onClick={handleToggleLike}
        className="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-500 hover:scale-110 drop-shadow-md transition-all duration-200"
        title="위시리스트 삭제"
        >
            <svg
                className="w-6 h-6"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
            </svg>
        </button>
      </div>

      {/* 2. 카드 상세 정보 */}
      <div className="p-2.5 flex flex-col gap-1">
        {/* 제목 + 상태 뱃지 */}
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-sm text-gray-900 truncate flex-1">
            {item.title}
          </h3>
          <Badge
            label={item.status}
            variant={getStatusVariant(item.status)}
          />
        </div>

        {/* 전시장 장소 */}
        <p className="text-xs text-gray-500 truncate">{item.place}</p>

        {/* 전시 기간 */}
        <p className="text-[11px] text-gray-400 font-mono">
          {item.startDate} ~ {item.endDate}
        </p>
      </div>
    </div>
  );
};

export default WishlistCard;