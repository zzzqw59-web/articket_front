import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ActionButton from "../../components/common/ActionButton";
import { useReviewDetail } from "./hooks/useReviewDetail";
import CommentSection from "../../components/common/CommentSection";

const ReviewDetailPage = () => {
  const navigate = useNavigate();
  const { reviewId } = useParams();

  const [selectedImage, setSelectedImage] = useState(null);

  const {
    reviewData,
    isLoading,
    replyList,
    replyPage,
    totalReplyPages,
    totalReplyCount,
    isReplyLoading,
    setReplyPage,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleDeleteReview,
  } = useReviewDetail(reviewId);

  useEffect(() => {
    console.log("reviewData:", reviewData);
    console.log("images:", reviewData?.images);
    console.log("selectedImage:", selectedImage);

    if (reviewData?.images?.length > 0 && !selectedImage) {
      setSelectedImage(reviewData.images[0].reviewImageUrl);
    }
  }, [reviewData, selectedImage]);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12 text-center text-gray-500">
        리뷰 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!reviewData) return null;

  return (
    <div>
      <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="리뷰 게시판"
          description="전시를 관람한 후기를 자유롭게 남겨주세요."
        />

        <div className="w-full flex flex-col gap-4">
          {/* 리뷰 제목 및 기본 정보 */}
          <div className="border-b border-gray-300 pb-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {reviewData.reviewTitle}
            </h2>

            <div className="flex justify-between items-end text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  {reviewData.memberNickname}
                </span>

                <span>
                  {reviewData.reviewModifiedAt
                    ? reviewData.reviewModifiedAt
                        .replace("T", " ")
                        .slice(0, 16)
                    : reviewData.reviewCreatedAt
                    ? reviewData.reviewCreatedAt
                        .replace("T", " ")
                        .slice(0, 16)
                    : ""}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1 text-xs">
                <span>
                  조회수 : {reviewData.reviewHits ?? 0}
                </span>

                {reviewData.exhibitionTitle && (
                  <span>
                    관련전시 : {reviewData.exhibitionTitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 첨부 이미지 */}
          {reviewData.images && reviewData.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full my-2">
              <div className="md:col-span-3 bg-gray-100 aspect-[4/3] rounded-sm flex items-center justify-center overflow-hidden border border-gray-300">
                {selectedImage ? (
                  <img
                    src={`http://localhost:8080${selectedImage}`}
                    alt="첨부 이미지"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">
                    이미지 영역
                  </span>
                )}
              </div>

              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
                {reviewData.images.map((img, idx) => (
                  <div
                    key={img.reviewImageId || idx}
                    onClick={() =>
                      setSelectedImage(img.reviewImageUrl)
                    }
                    className={`w-full bg-gray-100 aspect-[4/3] rounded-sm border cursor-pointer overflow-hidden flex items-center justify-center ${
                      selectedImage === img.reviewImageUrl
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={`http://localhost:8080${img.reviewImageUrl}`}
                      alt={
                        img.reviewImageOrigin ||
                        `썸네일 ${idx + 1}`
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 리뷰 본문 */}
          <div className="text-sm text-gray-800 leading-relaxed my-4 min-h-[100px] whitespace-pre-wrap">
            {reviewData.reviewBody}
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <ActionButton
              label="목록"
              variant="secondary"
              onClick={() => navigate("/articket/review")}
            />

            <div className="flex gap-2">
              <ActionButton
                label="수정"
                variant="secondary"
                onClick={() =>
                  navigate(`/articket/review/${reviewId}/edit`)
                }
              />

              <ActionButton
                label="삭제"
                variant="danger"
                onClick={handleDeleteReview}
              />
            </div>
          </div>
        </div>

        {/* 댓글 */}
        <CommentSection
          comments={replyList}
          showInput={true}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          currentPage={replyPage}
          totalPages={totalReplyPages}
          totalComments={totalReplyCount}
          onPageChange={setReplyPage}
          isLoading={isReplyLoading}
        />
      </div>
    </div>
  );
};

export default ReviewDetailPage;
