import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import WishlistCard from "./components/WishlistCard";
import { 
  getMyWishList, 
  toggleWish, 
  deleteExpiredWishes, 
  deleteAllWishes 
} from "../../api/wishApi";

const MyWishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 위시리스트 데이터 로드
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

  // 개별 찜 해제
  const handleRemoveWish = async (exhibitionId) => {
    if (!exhibitionId) return;
    try {
      await toggleWish(exhibitionId);
      setWishlist((prev) => prev.filter((item) => item.exhibitionId !== exhibitionId));
    } catch (error) {
      console.error("위시 취소 실패:", error);
    }
  };

  // 💡 [신규] 만료된 위시 일괄 삭제
  const handleDeleteExpired = async () => {
    if (!window.confirm("종료된 전시 위시리스트를 모두 삭제하시겠습니까?")) return;

    try {
      const deletedCount = await deleteExpiredWishes();
      if (deletedCount > 0) {
        alert(`${deletedCount}개의 만료된 위시가 삭제되었습니다.`);
        // 목록 새로고침
        fetchWishlist(1, false);
      } else {
        alert("삭제할 만료된 전시가 없습니다.");
      }
    } catch (error) {
      console.error("만료된 위시 삭제 실패:", error);
      alert("삭제 처리 중 오류가 발생했습니다.");
    }
  };

  // 💡 [신규] 전체 위시 일괄 삭제
  const handleDeleteAll = async () => {
    if (!window.confirm("위시리스트를 전체 삭제하시겠습니까?\n이 작업은 복구할 수 없습니다.")) return;

    try {
      await deleteAllWishes();
      setWishlist([]); // UI 즉시 비우기
      alert("모든 위시리스트가 삭제되었습니다.");
    } catch (error) {
      console.error("전체 위시 삭제 실패:", error);
      alert("삭제 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCardClick = (exhibitionId) => {
    if (exhibitionId) {
      navigate(`/articket/exhibition/${exhibitionId}`);
    }
  };

  useEffect(() => {
    fetchWishlist(1, false);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      <PageHeader
        title="위시리스트"
        description="회원님이 등록하신 위시리스트를 조회할 수 있습니다."
      />

      {/* 💡 상단 일괄 삭제 버튼 영역 */}
      {wishlist.length > 0 && (
        <div className="flex justify-end items-center gap-2 -mb-2">
          <button
            type="button"
            onClick={handleDeleteExpired}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            만료된 위시 삭제
          </button>
          <button
            type="button"
            onClick={handleDeleteAll}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            전체 삭제
          </button>
        </div>
      )}

      {/* 위시리스트 카드 목록 Grid */}
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