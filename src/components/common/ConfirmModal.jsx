import ActionButton from "./ActionButton";

const ConfirmModal = ({ modalState, onConfirm, onCancel }) => {
  if (!modalState.isOpen) return null;

  const { type, title, message, confirmLabel, cancelLabel } = modalState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-100 mx-4">
        {/* 헤더 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 mt-2">
          {type === "confirm" && (
            <ActionButton
              label={cancelLabel}
              variant="secondary"
              onClick={onCancel}
              className="px-4 py-1.5 text-xs"
            />
          )}
          <ActionButton
            label={confirmLabel}
            variant="primary"
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;