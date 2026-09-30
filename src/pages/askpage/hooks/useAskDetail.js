import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAskDetail, deleteAsk } from "../../../api/askApi";
import {
  getReplyList,
  createReply,
  updateReply,
  deleteReply,
} from "../../../api/askReplyApi";
import { useModal } from "../../../hooks/useModal";

export const useAskDetail = (askId) => {
  const navigate = useNavigate();

  // 모달 제어 훅
  const { modalState, showAlert, showConfirm, handleConfirm, handleCancel } =
    useModal();

  // 상태 관리
  const [askData, setAskData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [replyList, setReplyList] = useState([]);
  const [replyPage, setReplyPage] = useState(1);
  const [totalReplyPages, setTotalReplyPages] = useState(1);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // 1. 상세 본문 데이터 조회
  const fetchAskDetail = useCallback(async () => {
    if (!askId) return;
    setIsLoading(true);
    try {
      const response = await getAskDetail(askId);

      // 방어 코드: 데이터가 비어있거나 null인 경우
      if (!response) {
        showAlert({
          message: "이미 삭제되었거나 존재하지 않는 문의글입니다.",
          onConfirm: () => navigate("/articket/ask"),
        });
        return;
      }

      setAskData(response);
      if (response.images && response.images.length > 0) {
        setSelectedImage(response.images[0].imageUrl);
      }
    } catch (error) {
      console.error("문의 상세 조회 실패:", error);

      // 서버에서 404 Not Found를 내려주거나 삭제된 게시물인 경우
      const status = error.response?.status;
      if (status === 404) {
        showAlert({
          message: "이미 삭제되었거나 존재하지 않는 문의글입니다.",
          onConfirm: () => navigate("/articket/ask"),
        });
      } else {
        // 그 외의 서버 에러
        showAlert({
          message: "문의 정보를 불러오는 중 오류가 발생했습니다.",
          onConfirm: () => navigate("/articket/ask"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [askId, navigate, showAlert]);

  // 2. 댓글 목록 조회
  const fetchReplyList = useCallback(async () => {
    if (!askId) return;
    setIsReplyLoading(true);
    try {
      const response = await getReplyList(askId, replyPage, 10);
      if (response && response.dtoList) {
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

  // 3. 댓글 등록
  const handleAddComment = async (text) => {
    try {
      await createReply(askId, text);
      showAlert({ message: "댓글이 등록되었습니다." });
      setReplyPage(1);
      fetchReplyList();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      showAlert({ message: "댓글 등록에 실패했습니다." });
    }
  };

  // 4. 댓글 수정
  const handleEditComment = async (replyId, newText) => {
    try {
      await updateReply(askId, replyId, newText);
      showAlert({ message: "댓글이 수정되었습니다." });
      fetchReplyList();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      showAlert({ message: "댓글 수정에 실패했습니다." });
    }
  };

  // 5. 댓글 삭제 (Confirm 모달 적용)
  const handleDeleteComment = (replyId) => {
    showConfirm({
      title: "댓글 삭제",
      message: "정말로 댓글을 삭제하시겠습니까?",
      onConfirm: async () => {
        try {
          await deleteReply(askId, replyId);
          showAlert({ message: "댓글이 삭제되었습니다." });
          fetchReplyList();
        } catch (error) {
          console.error("댓글 삭제 실패:", error);
          showAlert({ message: "댓글 삭제에 실패했습니다." });
        }
      },
    });
  };

  // 6. 게시글 삭제 (Confirm 모달 적용)
  const handleDeleteAsk = () => {
    showConfirm({
      title: "문의글 삭제",
      message: "정말 이 문의글을 삭제하시겠습니까?\n삭제된 문의글은 복구되지 않습니다.",
      confirmLabel: "삭제",
      onConfirm: async () => {
        try {
          await deleteAsk(askId);
          showAlert({
            message: "문의글이 삭제되었습니다.",
            onConfirm: () => navigate("/articket/ask"),
          });
        } catch (error) {
          console.error("문의글 삭제 실패:", error);
          showAlert({ message: "삭제 처리 중 오류가 발생했습니다." });
        }
      },
    });
  };

  return {
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
  };
};