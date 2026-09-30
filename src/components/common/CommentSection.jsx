import React, { useState, useEffect, useRef } from "react";
import ActionButton from "./ActionButton";
import Badge from "./Badge";

const CommentSection = ({
  comments = [],
  showInput = true,
  onAddComment,
  onEditComment,
  onDeleteComment,
  currentUserId,
  currentPage = 1,
  totalPages = 1,
  totalComments = 0, // 👈 이 부분이 totalComments로 되어 있어야 합니다!
  onPageChange,
  isLoading = false,
  pageSize = 10,
}) => {
  const [commentText, setCommentText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const menuRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 신규 댓글 등록 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddComment) {
      onAddComment(commentText);
    }
    setCommentText("");
  };

  // 수정 모드 진입
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditingText(item.content);
    setActiveMenuId(null);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // 수정 완료 저장
  const handleSaveEdit = (commentId) => {
    if (!editingText.trim()) {
      alert("댓글 내용을 입력해 주세요.");
      return;
    }
    if (onEditComment) {
      onEditComment(commentId, editingText);
    }
    setEditingId(null);
    setEditingText("");
  };

  const toggleMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-4">
      {/* 1. 댓글 입력창 */}
      {showInput && (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="댓글 내용을 입력해주세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-amber-600 bg-white"
          />
          <ActionButton
            label="댓글 등록하기"
            variant="secondary"
            type="submit"
          />
        </form>
      )}

      {/* 2. 댓글 목록 테이블 */}
      <div className="w-full border-t border-b border-gray-300 py-2">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 font-medium">
              <th className="py-2.5 px-4 w-16 text-center">번호</th>
              <th className="py-2.5 px-4 w-32">작성자</th>
              <th className="py-2.5 px-4">댓글 내용</th>
              <th className="py-2.5 px-4 w-28 text-center">작성일</th>
              <th className="py-2.5 px-2 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {comments.length > 0 ? (
              comments.map((item, index) => {
                const commentId = item.id;
                const isMenuOpen = activeMenuId === commentId;
                const isEditing = editingId === commentId;

                // 💡 [등록순 번호 계산]
                // 전체 댓글 수에서 현재 페이지와 인덱스 오프셋을 빼서,
                // 가장 먼저 등록된 글이 1번이 되고 최신 글이 전체 개수(totalComments)가 되도록 역산합니다.
                const displayNo = totalComments - ((currentPage - 1) * pageSize + index);

                return (
                  <tr
                    key={commentId || index}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50/50 relative group"
                  >
                    {/* 번호 */}
                    <td className="py-3 px-4 text-center text-gray-500">
                      {displayNo}
                    </td>

                    {/* 작성자 & 뱃지 */}
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-700">{item.writer}</span>
                        {(item.memberType === "ADMIN" || item.role === "admin") && (
                          <Badge label="관리자" variant="admin" />
                        )}
                        {(item.memberType === "STAFF" || item.role === "staff") && (
                          <Badge label="전시 관계자" variant="staff" />
                        )}
                      </div>
                    </td>

                    {/* 댓글 내용 */}
                    <td className="py-3 px-4 text-gray-800 leading-relaxed">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(commentId);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                            className="flex-1 px-3 py-1.5 text-sm border border-amber-500 rounded focus:outline-none bg-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(commentId)}
                            className="px-2.5 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-2.5 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        item.content
                      )}
                    </td>

                    {/* 작성일 */}
                    <td className="py-3 px-4 text-center text-gray-400 text-xs">
                      {item.createdAt}
                    </td>

                    {/* 옵션 버튼 */}
                    <td className="py-3 px-2 text-center relative">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => toggleMenu(commentId)}
                          className={`p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-opacity duration-150 ${
                            isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                          title="더보기"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      )}

                      {/* 드롭다운 메뉴 */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-2 top-10 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-gray-700 transition-colors"
                          >
                            수정하기
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteComment && onDeleteComment(item.id);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 transition-colors"
                          >
                            삭제하기
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  등록된 댓글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. 댓글 페이지네이션 */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-1 mt-2 text-sm text-gray-500">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="px-2 py-1 disabled:opacity-30 hover:text-black"
          >
            &larr; 이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange && onPageChange(page)}
              className={`px-2.5 py-0.5 rounded ${
                currentPage === page
                  ? "bg-black text-white font-bold"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="px-2 py-1 disabled:opacity-30 hover:text-black"
          >
            다음 &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;