import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import ActionButton from "../../components/common/ActionButton";
import CommentSection from "../../components/common/CommentSection";
import { getAskDetail, deleteAsk } from "../../api/askApi";
import {
  getReplyList,
  createReply,
  updateReply,
  deleteReply,
} from "../../api/askReplyApi"; // [추가] 댓글 API

const AskDetailPage = () => {
  const navigate = useNavigate();
  const { askId } = useParams();

  // 본문 상세 데이터 상태
  const [askData, setAskData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 댓글 관련 상태
  const [replyList, setReplyList] = useState([]);
  const [replyPage, setReplyPage] = useState(1);
  const [totalReplyPages, setTotalReplyPages] = useState(1);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // 1. 상세 본문 조회
  const fetchAskDetail = useCallback(async () => {
    if (!askId) return;
    setIsLoading(true);
    try {
      const response = await getAskDetail(askId);
      if (response) {
        setAskData(response);
        if (response.images && response.images.length > 0) {
          setSelectedImage(response.images[0].imageUrl);
        }
      }
    } catch (error) {
      console.error("문의 상세 조회 실패:", error);
      alert("존재하지 않거나 접근 권한이 없는 문의글입니다.");
      navigate("/articket/ask");
    } finally {
      setIsLoading(false);
    }
  }, [askId, navigate]);

  // 2. 댓글 목록 조회
  const fetchReplyList = useCallback(async () => {
    if (!askId) return;
    setIsReplyLoading(true);
    try {
      const response = await getReplyList(askId, replyPage, 10);
      if (response && response.dtoList) {
        // 백엔드 DTO를 CommentSection에 맞게 매핑
        const formattedReplies = response.dtoList.map((item) => ({
          id: item.askReplyId || item.id,
          writer: item.memberNickname || "익명",
          memberType: item.memberType,
          content: item.askReplyBody,
          createdAt: item.askReplyCreatedAt,
          modifiedAt: item.askReplyModifiedAt,
          rawItem: item,
        }));
        setReplyList(formattedReplies);
        setTotalReplyPages(response.totalPage || 1);
      }
    } catch (error) {
      console.error("댓글 목록 로딩 실패:", error);
    } finally {
      setIsReplyLoading(false);
    }
  }, [askId, replyPage]);

  useEffect(() => {
    fetchAskDetail();
  }, [fetchAskDetail]);

  useEffect(() => {
    fetchReplyList();
  }, [fetchReplyList]);

  // 3. 댓글 등록 핸들러
  const handleAddComment = async (text) => {
    try {
      await createReply(askId, text);
      alert("댓글이 등록되었습니다.");
      setReplyPage(1); // 첫 페이지로 이동하여 최신 댓글 확인
      fetchReplyList();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  // 4. 댓글 수정 핸들러
  // AskDetailPage.jsx
  // AskDetailPage.jsx
  const handleEditComment = async (replyId, newText) => {
    try {
      await updateReply(askId, replyId, newText);
      alert("댓글이 수정되었습니다.");
      fetchReplyList(); // 댓글 목록 갱신
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 5. 댓글 삭제 핸들러
  const handleDeleteComment = async (replyId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        await deleteReply(askId, replyId);
        alert("댓글이 삭제되었습니다.");
        fetchReplyList();
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  // 본문 수정 / 삭제
  const handleEdit = () => navigate(`/articket/ask/${askId}/edit`);
  const handleDelete = async () => {
    if (window.confirm("정말 이 문의글을 삭제하시겠습니까?")) {
      try {
        await deleteAsk(askId);
        alert("삭제되었습니다.");
        navigate("/articket/ask");
      } catch (error) {
        console.error("문의글 삭제 실패:", error);
        alert("삭제 처리 중 오류가 발생했습니다.");
      }
    }
  };

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
    <MainLayout>
      <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />

        <div className="w-full flex flex-col gap-4">
          {/* 본문 정보 */}
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
                  <span className="text-gray-400">(수정됨: {askData.askModifiedAt})</span>
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

          {/* 이미지 갤러리 */}
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

          {/* 버튼 영역 */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            {/* 좌측: 목록으로 돌아가기 버튼 */}
            <ActionButton
              label="목록"
              variant="secondary"
              onClick={() => navigate("/articket/ask")}
            />

            {/* 우측: 본인 글일 때 삭제하기 / 수정하기 버튼 */}
            <div className="flex gap-2">
              <ActionButton
                label="삭제하기"
                variant="secondary"
                onClick={handleDelete}
              />
              <ActionButton
                label="수정하기"
                variant="primary"
                onClick={() => navigate(`/articket/ask/${askId}/edit`)}
              />
            </div>
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
    </MainLayout>
  );
};

export default AskDetailPage;