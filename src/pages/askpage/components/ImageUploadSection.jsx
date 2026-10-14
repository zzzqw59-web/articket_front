import React from "react";

const ImageUploadSection = ({
  isEditMode,
  existingImages,
  files,
  limit,
  onRemoveExisting,
  onRemoveNew,
  onChangeFile,
}) => {
  // 클라이언트 측 파일 검증 헬퍼 (5MB, 허용 확장자 체크)
  const handleFileChangeWithValidation = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. 용량 검증 (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB를 초과할 수 없습니다.");
      e.target.value = ""; // 입력 초기화
      return;
    }

    // 2. 형식 검증 (JPG, JPEG, PNG, GIF, WEBP)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("지원하지 않는 파일 형식입니다. (JPG, JPEG, PNG, GIF, WEBP만 가능합니다.)");
      e.target.value = ""; // 입력 초기화
      return;
    }

    // 검증 통과 시 기존 부모 전달 핸들러 호출
    onChangeFile(idx, e);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 수정 모드 전용: 기존 첨부 이미지 유지 목록 */}
      {isEditMode && existingImages.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
          <span className="text-xs text-gray-500 font-semibold">기존 첨부 이미지</span>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((img, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-1 border border-gray-300 rounded bg-amber-50 text-xs text-gray-700">
                <span className="truncate max-w-[150px]">{img.askImageOrigin || `이미지 ${idx + 1}`}</span>
                <button
                  type="button"
                  onClick={() => onRemoveExisting(idx)}
                  className="text-gray-400 hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 신규 사진 첨부 영역 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-semibold">
            사진 첨부 (최대 {limit}개)
          </span>
          <span className="text-[10px] text-gray-400">
            * 최대 5MB, JPG/PNG/GIF/WEBP 지원
          </span>
        </div>

        {files.map((file, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {file ? (
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-gray-50 text-xs text-gray-700">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveNew(idx)}
                  className="text-gray-400 hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <span className="px-3 py-1.5 border border-gray-300 rounded bg-gray-100 text-xs text-gray-700 hover:bg-gray-200 inline-block">
                  사진 첨부하기 #{idx + 1}
                </span>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  className="hidden"
                  onChange={(e) => handleFileChangeWithValidation(idx, e)}
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadSection;