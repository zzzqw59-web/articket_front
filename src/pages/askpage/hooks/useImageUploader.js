import { useState, useEffect } from "react";

/**
 * 문의 게시판 전용 이미지 파일 제어 커스텀 훅
 * @param {number} maxLimit - 최대 슬롯 수 (기본값: 3)
 * @param {Array} initialImages - 초기 기존 서버 이미지 배열 (수정 모드용)
 */
export const useImageUploader = (maxLimit = 3, initialImages = []) => {
  // 기존 서버 이미지 (수정 모드용)
  const [existingImages, setExistingImages] = useState(initialImages);

  // 신규 첨부할 파일 객체 배열 (고정 슬롯 개수)
  const [files, setFiles] = useState(() => Array(maxLimit).fill(null));

  // 초기 데이터가 변경될 때 기존 이미지 업데이트
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setExistingImages(initialImages);
    }
  }, [initialImages]);

  // 신규 파일 단일 변경
  const handleFileChange = (index, e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = selectedFile;
        return updated;
      });
    }
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
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 실제 유효한 신규 파일만 추출
  const validFiles = files.filter(Boolean);

  // 초기화
  const resetImages = () => {
    setExistingImages([]);
    setFiles(Array(maxLimit).fill(null));
  };

  return {
    existingImages,
    files,
    validFiles,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingImage,
    resetImages,
  };
};