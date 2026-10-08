import { useState, useEffect } from "react";

/**
 * 문의 게시판 전용 이미지 파일 제어 커스텀 훅
 * @param {number} maxLimit - 최대 슬롯 수 (기본값: 3)
 * @param {Array} initialImages - 초기 기존 서버 이미지 배열 (수정 모드용)
 */
export const useImageUploader = (maxLimit = 3, initialImages = []) => {
  // 기존 서버 이미지
  const [existingImages, setExistingImages] = useState(initialImages);

  // 삭제할 기존 이미지 ID
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  // 신규 첨부할 파일 객체 배열
  const [files, setFiles] = useState(() =>
    Array(maxLimit).fill(null)
  );

  // 초기 데이터가 변경될 때 기존 이미지 업데이트
  useEffect(() => {
    if (initialImages) {
      setExistingImages(initialImages);
      setDeletedImageIds([]);
    }
  }, [initialImages]);

  // 신규 파일 단일 변경
  const handleFileChange = (index, e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // 현재 등록된 기존 이미지 개수
    const existingCount = existingImages.length;

    // 현재 새로 추가된 파일들의 개수
    // 현재 바꾸려는 슬롯은 제외
    const currentNewFilesCount = files.filter(
      (file, i) => i !== index && file !== null
    ).length;

    // 총 이미지 개수 확인
    if (
      existingCount +
        currentNewFilesCount +
        1 >
      maxLimit
    ) {
      alert(
        `이미지는 기존 이미지와 신규 첨부를 포함하여 총 ${maxLimit}개까지만 업로드할 수 있습니다.`
      );
      return;
    }

    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = selectedFile;
      return updated;
    });

    // 같은 input에서 파일을 다시 선택할 수 있도록 초기화
    e.target.value = "";
  };

  // 신규 파일 단일 제거
  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  // 기존 서버 이미지 제거
  const handleRemoveExistingImage = (index) => {
    const targetImage = existingImages[index];

    if (!targetImage) return;

    // 삭제할 이미지 ID 저장
    setDeletedImageIds((prev) => [
      ...prev,
      targetImage.reviewImageId,
    ]);

    // 화면에서 기존 이미지 제거
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // 실제 유효한 신규 파일만 추출
  const validFiles = files.filter(Boolean);

  // 초기화
  const resetImages = () => {
    setExistingImages([]);
    setFiles(Array(maxLimit).fill(null));
    setDeletedImageIds([]);
  };

  return {
    existingImages,
    deletedImageIds,
    files,
    validFiles,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingImage,
    resetImages,
  };
};
