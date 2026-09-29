import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import WishlistCard from "./components/WishlistCard";

// 초기 무한스크롤 샘플 데이터 (10개)
const initialMockData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `사라지는 것들에 대하여`,
  status: i % 3 === 0 ? "개최중" : i % 3 === 1 ? "개최전" : "종료",
  place: "문화아트홀",
  startDate: "2026.09.18",
  endDate: "2026.09.27",
  imageUrl: "",
}));

const MyWishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(initialMockData);
  const [sortOption, setSortOption] = useState("closest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 무한 스크롤 타겟 Ref
  const observerRef = useRef(null);

  // 찜 삭제 핸들러
  const handleRemoveWish = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // 카드 클릭 시 상세 이동
  const handleCardClick = (id) => {
    navigate(`/articket/exhibition/${id}`);
  };

  // 📐 현재 화면 너비(Breakpoint)에 맞는 그리드 열(Column) 수 반환
  const getColumnCount = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 5; // lg (lg:grid-cols-5)
    if (width >= 768) return 4;  // md (md:grid-cols-4)
    if (width >= 640) return 3;  // sm (sm:grid-cols-3)
    return 2;                    // default (grid-cols-2)
  };

  // 🔄 무한 스크롤 더보기 로드 함수 (동적 개수 계산)
  const loadMoreItems = () => {
    if (isLoading) return;
    setIsLoading(true);

    const cols = getColumnCount(); // 현재 화면의 열 수 (예: 5)
    const currentCount = wishlist.length; // 현재 남은 아이템 수

    // 1) 현재 마지막 행을 채우기 위해 필요한 개수
    const remainder = currentCount % cols;
    const fillRowNeeded = remainder === 0 ? 0 : cols - remainder;

    // 2) 마지막 행 채움 + 추가로 더 불러올 행(Row) 수 (기본 1~2줄 추가)
    const targetRowsToFetch = 1; 
    const fetchCount = fillRowNeeded + (cols * targetRowsToFetch);

    setTimeout(() => {
      const newItems = Array.from({ length: fetchCount }, (_, i) => ({
        id: Date.now() + i,
        title: `사라지는 것들에 대하여 ${currentCount + i + 1}`,
        status: "개최중",
        place: "문화아트홀 2관",
        startDate: "2026.10.01",
        endDate: "2026.10.15",
        imageUrl: "",
      }));

      setWishlist((prev) => [...prev, ...newItems]);
      setIsLoading(false);
    }, 600);
  };

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 0.3 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [wishlist, isLoading]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* 1. 페이지 헤더 */}
      <PageHeader
        title="위시리스트"
        description="회원님이 등록하신 위시리스트를 조회할 수 있습니다."
      />

      {/* 2. 상단 컨트롤 바 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        {/* 정렬 드롭다운 */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:border-amber-600"
        >
          <option value="closest">관람일 가까운 순</option>
          <option value="latest">등록 순</option>
          <option value="title">제목 순</option>
        </select>

        {/* 우측 키워드 검색창 */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pr-8 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:border-amber-600"
          />
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. 위시리스트 카드 그리드 */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {wishlist.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={handleRemoveWish}
              onClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400 text-sm border-y border-gray-200">
          위시리스트에 담긴 전시가 없습니다.
        </div>
      )}

      {/* 4. 무한 스크롤 트리거 영역 */}
      <div ref={observerRef} className="py-6 flex justify-center items-center w-full">
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <span>목록을 불러오는 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWishlistPage;