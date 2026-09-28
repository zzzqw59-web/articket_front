import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import ActionButton from "../../components/common/ActionButton";
import CommentSection from "../../components/common/CommentSection";

const AskDetailPage = () => {
  const navigate = useNavigate();
  const { askId } = useParams();
  const [commentPage, setCommentPage] = useState(1);

  // 샘플 상세 데이터 (스토리보드 기준)
  const askDetail = {
    id: askId || "1",
    title: "가족과 함께 방문해도 괜찮을까요?",
    writer: "owune",
    createdAt: "2026.08.21 11:18",
    isEdited: true, // "수정" 표시
    views: 12,
    relatedExhibition: "사계절을 전시에 담다",
    content: "노인과 아이들이 관람하기에도 괜찮은지 문의드립니다.",
    images: [
      "/asset/sample1.png", // 메인 이미지
      "/asset/sample2.png", // 썸네일 1
      "/asset/sample3.png", // 썸네일 2
      "/asset/sample4.png", // 썸네일 3
    ],
  };

  // 샘플 댓글 목록 데이터
  const [comments, setComments] = useState(
    Array.from({ length: 9 }, (_, index) => ({
      id: index + 1,
      content: "댓글 내용",
      writer: "작성자",
      createdAt: "작성일",
    }))
  );

  // 댓글 등록 핸들러
  const handleAddComment = (newCommentText) => {
    const newComment = {
      id: comments.length + 1,
      content: newCommentText,
      writer: "현재사용자",
      createdAt: "2026.09.28",
    };
    setComments([newComment, ...comments]);
  };

  // 수정 / 삭제 핸들러
  const handleEdit = () => navigate(`/articket/ask/${askId}/edit`);
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      alert("삭제되었습니다.");
      navigate("/articket/ask");
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* 1. 공통 페이지 헤더 */}
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />

        {/* 2. 게시글 상세 영역 */}
        <div className="w-full flex flex-col gap-4">
          {/* 2-1. 게시글 타이틀 & 작성 메타 정보 */}
          <div className="border-b border-gray-300 pb-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {askDetail.title}
            </h2>
            <div className="flex justify-between items-end text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  {askDetail.writer}
                </span>
                <span>{askDetail.createdAt}</span>
                {askDetail.isEdited && (
                  <span className="text-gray-400">수정</span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 text-xs">
                <span>조회수 : {askDetail.views}</span>
                <span>관련전시 : {askDetail.relatedExhibition}</span>
              </div>
            </div>
          </div>

          {/* 2-2. 이미지 갤러리 영역 (좌측 메인 큰 이미지 + 우측 3개 썸네일 그리드) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full my-2">
            {/* 메인 뷰어 박스 */}
            <div className="md:col-span-3 bg-gray-200 aspect-[4/3] rounded-sm flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-400">
                {/* 메인 이미지 공간 */}
                이미지 영역
              </div>
            </div>
            {/* 우측 썸네일 3개 */}
            <div className="flex md:flex-col gap-3 justify-between">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="w-full bg-gray-200 aspect-[4/3] rounded-sm border border-gray-300 flex items-center justify-center text-gray-400 text-xs"
                >
                  썸네일 {idx + 1}
                </div>
              ))}
            </div>
          </div>

          {/* 2-3. 본문 텍스트 */}
          <p className="text-sm text-gray-800 leading-relaxed my-4">
            {askDetail.content}
          </p>

          {/* 2-4. 우측 수정/삭제 버튼 */}
          <div className="flex justify-end gap-2 w-full border-b border-gray-200 pb-6">
            <ActionButton
              label="삭제하기"
              variant="secondary"
              onClick={handleDelete}
            />
            <ActionButton
              label="수정하기"
              variant="primary"
              onClick={handleEdit}
            />
          </div>

          {/* 3. 공통 댓글 컴포넌트 */}
          <CommentSection
            comments={comments}
            showInput={true} // 필요 시 권한에 따라 false 전달 가능
            onAddComment={handleAddComment}
            currentPage={commentPage}
            totalPages={10}
            onPageChange={(page) => setCommentPage(page)}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AskDetailPage;