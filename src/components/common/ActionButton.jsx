import React from "react";

const ActionButton = ({
  label,
  onClick,
  variant = "primary", // primary (글쓰기/주황), secondary, danger (삭제)
  type = "button",
}) => {
  const variantStyles = {
    primary: "bg-[#E07A26] hover:bg-[#c9691e] text-white", // 이미지 속 글쓰기 주황색
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 text-sm font-medium rounded transition-colors ${
        variantStyles[variant] || variantStyles.primary
      }`}
    >
      {label}
    </button>
  );
};

export default ActionButton;