import React, { useState, useEffect, useRef } from "react";
import ActionButton from "./ActionButton";
import Badge from "./Badge";

const CommentSection = ({
  comments = [],
  showInput = true,
  onAddComment,
  onEditComment,   // 댓글 수정 핸들러
  onDeleteComment, // 댓글 삭제 핸들러
  currentUserId,   // 현재 로그인한 사용자 ID (본인 댓글 판단용, 필요 시)
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const [commentText, setCommentText] = useState("");
  // 현재 어떤 댓글의 드롭다운이 열려있는지 관리하는 state
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  const menuRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기 이벤트
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddComment) {
      onAddComment(commentText);
    }
    setCommentText("");
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
              {/* 더보기(더보기/수정/삭제) 컬럼 */}
              <th className="py-2.5 px-2 w-12 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {comments.length > 0 ? (
              comments.map((item, index) => {
                const commentId = item.id || index + 1;
                const isMenuOpen = activeMenuId === commentId;

                return (
                  <tr
                    key={commentId}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50/50 relative"
                  >
                    {/* 번호 */}
                    <td className="py-3 px-4 text-center text-gray-500">
                      {commentId}
                    </td>

                    {/* 작성자 & 뱃지 */}
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-700">{item.writer}</span>
                        {item.role === "admin" && (
                          <Badge label="관리자" variant="admin" />
                        )}
                        {item.role === "staff" && (
                          <Badge label="전시 관계자" variant="staff" />
                        )}
                      </div>
                    </td>

                    {/* 댓글 내용 */}
                    <td className="py-3 px-4 text-gray-800 leading-relaxed">
                      {item.content}
                    </td>

                    {/* 작성일 */}
                    <td className="py-3 px-4 text-center text-gray-400 text-xs">
                      {item.createdAt}
                    </td>

                    {/* 옵션 버튼 (케밥 아이콘) & 드롭다운 팝업 */}
                    <td className="py-3 px-2 text-center relative">
                      <button
                        type="button"
                        onClick={() => toggleMenu(commentId)}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                        title="더보기"
                      >
                        {/* 케밥 아이콘 (⋮) */}
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {/* 드롭다운 메뉴 (열려있을 때) */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-2 top-10 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditComment && onEditComment(item);
                            }}
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

      {/* 3. 댓글 페이지네이션 (기존과 동일) */}
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