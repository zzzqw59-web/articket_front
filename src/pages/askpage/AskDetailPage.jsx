import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import ActionButton from "../../components/common/ActionButton";
import CommentSection from "../../components/common/CommentSection";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAskDetail } from "./hooks/useAskDetail";
import { CURRENT_USER, MEMBER_ROLE } from "../../constants/config"; // 임시 회원 ID, 권한명 constants/config.js에서 가져오기

const AskDetailPage = () => {
  const navigate = useNavigate();
  const { askId } = useParams();

  // 🚀 커스텀 훅을 통해 비즈니스 로직 및 상태 바인딩
  const {
    askData,
    selectedImage,
    setSelectedImage,
    isLoading,
    replyList,
    replyPage,
    totalReplyPages,
    isReplyLoading,
    setReplyPage,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleDeleteAsk,
    modalState,
    handleConfirm,
    handleCancel,
  } = useAskDetail(askId);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="w-full max-w-5xl mx-auto px-4 py-12 text-center text-gray-500">
          문의 정보를 불러오는 중입니다...
        </div>
      </MainLayout>
    );
  }

  if (!askData) return null;

  return (
    <div>
      <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />

        <div className="w-full flex flex-col gap-4">
          {/* 본문 헤더 정보 */}
          <div className="border-b border-gray-300 pb-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {askData.askSecret === 1 && "🔒 "}
              {askData.askTitle}
            </h2>
            <div className="flex justify-between items-end text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  {askData.memberNickname || "익명"}
                </span>
                <span>{askData.askCreatedAt}</span>
                {askData.askModifiedAt && (
                  <span className="text-gray-400">
                    (수정됨: {askData.askModifiedAt})
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 text-xs">
                <span>조회수 : {askData.askHits ?? 0}</span>
                {askData.exhibitionTitle && (
                  <span>관련전시 : {askData.exhibitionTitle}</span>
                )}
              </div>
            </div>
          </div>

          {/* 첨부 이미지 갤러리 */}
          {askData.images && askData.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full my-2">
              <div className="md:col-span-3 bg-gray-100 aspect-[4/3] rounded-sm flex items-center justify-center overflow-hidden border border-gray-300">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="첨부 이미지"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">이미지 영역</span>
                )}
              </div>
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
                {askData.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`w-full bg-gray-100 aspect-[4/3] rounded-sm border cursor-pointer overflow-hidden flex items-center justify-center ${
                      selectedImage === img.imageUrl
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img.thumbnailUrl || img.imageUrl}
                      alt={img.askImageOrigin || `썸네일 ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 본문 텍스트 */}
          <div className="text-sm text-gray-800 leading-relaxed my-4 min-h-[100px] whitespace-pre-wrap">
            {askData.askBody}
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <ActionButton
              label="목록"
              variant="secondary"
              onClick={() => navigate("/articket/ask")}
            />

            {/* 작성자 본인일 때만 수정/삭제 버튼 노출 (TEMP_MEMBER_ID와 비교) */}
            {(askData.memberId === CURRENT_USER.memberId || CURRENT_USER.memberType === MEMBER_ROLE.ADMIN) && (
              <div className="flex gap-2">
                <ActionButton
                  label="삭제하기"
                  variant="secondary"
                  onClick={handleDeleteAsk}
                />
                <ActionButton
                  label="수정하기"
                  variant="primary"
                  onClick={() => navigate(`/articket/ask/${askId}/edit`)}
                />
              </div>
            )}
          </div>

          {/* 댓글 영역 */}
          <CommentSection
            comments={replyList}
            showInput={true}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            currentPage={replyPage}
            totalPages={totalReplyPages}
            onPageChange={(page) => setReplyPage(page)}
            isLoading={isReplyLoading}
          />
        </div>
      </div>

      {/* 🚀 커스텀 모달 컴포넌트 연동 */}
      <ConfirmModal
        modalState={modalState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AskDetailPage;