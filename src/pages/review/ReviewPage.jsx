import { useNavigate } from "react-router-dom";
import DataTableContainer from "../../components/common/DataTableContainer";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import { REVIEW_COLUMNS, REVIEW_SEARCH_OPTIONS } from "../../constants/reviewConstans";
import { useReviewList } from "./hooks/useReviewList";
import ActionButton from "../../components/common/ActionButton";

const ReviewPage = () => {
    const navigate = useNavigate();
    const handleWriteClick = () => {
    navigate("/articket/review/write");
    };

    const {
        currentPage,
        reviewList,
        totalPages,
        isLoading,
        setCurrentPage,
        handleSearch,
        handleRowClick,
    } = useReviewList();
  return (
    <div>
        <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
            {/* 1. 페이지 헤더 */}
            <PageHeader
                title="리뷰 게시판"
                description="관람하신 전시에 대한 후기와 감상을 자유롭게 공유해주세요. 다른 관람객들에게 유용한 정보를 함께 나눌 수 있습니다."
            />

            {/* 2. 데이터 테이블 (상수 연동 및 훅 상태 바인딩) */}
            <DataTableContainer
                columns={REVIEW_COLUMNS}
                data={reviewList}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onRowClick={handleRowClick}
                isLoading={isLoading}
            />

            {/* 3. 하단 검색 바 & 글쓰기 버튼 */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] items-center gap-4 w-full mt-2">
                <div className="hidden md:block"></div>

                <div className="w-full max-w-xl mx-auto">
                <SearchBar
                    options={REVIEW_SEARCH_OPTIONS}
                    onSearch={handleSearch}
                />
                </div>
        
                <div className="flex justify-center md:justify-end">
                <ActionButton
                    label="글쓰기"
                    variant="primary"
                    onClick={handleWriteClick}
                />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReviewPage
