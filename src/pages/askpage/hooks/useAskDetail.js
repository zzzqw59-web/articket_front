import { useState, useEffect, useCallback, useRef } from "react"; // useRef 추가
import { useNavigate } from "react-router-dom";
import { getAskDetail, deleteAsk } from "../../../api/askApi";
import { useModal } from "../../../hooks/useModal";

import {
  getReplyList,
  createReply,
  updateReply,
  deleteReply,
} from "../../../api/askReplyApi";


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
  const [totalReplyCount, setTotalReplyCount] = useState(0);
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  // 1. 상세 본문 데이터 조회
  const fetchAskDetail = useCallback(async () => {
    if (!askId) return;
    
    setIsLoading(true);
    try {
      const response = await getAskDetail(askId);

      if (!response) {
        alert("이미 삭제되었거나 존재하지 않는 문의글입니다.");
        navigate("/articket/ask", { replace: true });
        return;
      }

      setAskData(response);
      if (response.images && response.images.length > 0) {
        setSelectedImage(response.images[0].imageUrl);
      }
    } catch (error) {
      console.error("문의 상세 조회 실패:", error);
      const status = error.response?.status;

      if (status === 404) {
        alert("이미 삭제되었거나 존재하지 않는 문의글입니다.");
        navigate("/articket/ask", { replace: true });
      } else {
        alert("문의 정보를 불러오는 중 오류가 발생했습니다.");
        navigate("/articket/ask", { replace: true });
      }
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
        setTotalReplyCount(response.totalCount || 0);
      }
    } catch (error) {
      console.error("댓글 목록 로딩 실패:", error);
    } finally {
      setIsReplyLoading(false);
    }
  }, [askId, replyPage]);

  // 💡 [수정 포인트] useEffect 깔끔하게 분리
  // 1) askId가 바뀔 때: 페이지를 1페이지로 초기화하고 상세 본문 조회
  useEffect(() => {
    setReplyPage(1);
    fetchAskDetail();
  }, [askId, fetchAskDetail]);

  // 2) askId 또는 replyPage가 바뀔 때: 댓글 목록 조회
  useEffect(() => {
    fetchReplyList();
  }, [askId, replyPage, fetchReplyList]);

  // 3. 댓글 등록
  const handleAddComment = async (text) => {
    try {
      await createReply(askId, text);
      setReplyPage(1);
      fetchReplyList();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      showAlert({ message: "댓글을 등록할 수 없습니다." });
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
      showAlert({ message: "댓글 수정할 수 없습니다." });
    }
  };

  // 5. 댓글 삭제
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
          showAlert({ message: "댓글 삭제할 수 없습니다." });
        }
      },
    });
  };

  // 6. 게시글 삭제
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
    totalReplyCount,
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