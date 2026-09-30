const ImageUploadSection = ({
  isEditMode,
  existingImages,
  files,
  limit,
  onRemoveExisting,
  onRemoveNew,
  onChangeFile,
}) => {
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
        <span className="text-xs text-gray-500 font-semibold">
          사진 첨부 (최대 {limit}개)
        </span>
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
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onChangeFile(idx, e)}
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