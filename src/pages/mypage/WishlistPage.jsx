import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import WishlistCard from "./components/WishlistCard";
import { getMyWishList, toggleWish } from "../../api/wishApi";

const MyWishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1); // 👈 초기 페이지를 1로 설정 (백엔드 PageRequestDTO 호환)
  const [hasMore, setHasMore] = useState(true);

  // 위시리스트 데이터 로드 함수
  const fetchWishlist = async (targetPage = 1, isAppend = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await getMyWishList(targetPage, 10); 
      
      const items = data.dtoList || data.content || []; 
      
      setWishlist((prev) => (isAppend ? [...prev, ...items] : items));
      setHasMore(targetPage < data.totalPages);
    } catch (error) {
      console.error("위시리스트 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 찜 해제 핸들러 (API 연동)
  const handleRemoveWish = async (exhibitionId) => {
    try {
      await toggleWish(exhibitionId);
      setWishlist((prev) => prev.filter((item) => item.exhibitionId !== exhibitionId));
    } catch (error) {
      console.error("위시 취소 실패:", error);
    }
  };

  const handleCardClick = (exhibitionId) => {
    navigate(`/articket/exhibition/${exhibitionId}`);
  };

  useEffect(() => {
    fetchWishlist(1, false); // 👈 첫 페이지 1 요청
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      <PageHeader
        title="위시리스트"
        description="회원님이 등록하신 위시리스트를 조회할 수 있습니다."
      />

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {wishlist.map((item) => (
            <WishlistCard
              key={item.exhibitionId}
              item={{
                id: item.exhibitionId,
                title: item.exhibitionTitle,
                status: item.isRunning,
                place: item.venueTitle,
                startDate: item.exhibitionPeriod?.split(" ~ ")[0] || "",
                endDate: item.exhibitionPeriod?.split(" ~ ")[1] || "",
                imageUrl: item.posterUrl,
              }}
              onRemove={handleRemoveWish}
              onClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="py-20 text-center text-gray-400 text-sm border-y border-gray-200">
            위시리스트에 담긴 전시가 없습니다.
          </div>
        )
      )}

      {isLoading && (
        <div className="py-6 flex justify-center items-center w-full">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <span>목록을 불러오는 중...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWishlistPage;