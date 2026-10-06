
const PageHeader = ({ title, description }) => {
  return (
    <div className="text-center my-8">
      {/* 메인 타이틀 */}
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
        {title}
      </h1>
      
      {/* 서브 설명 문구 (있는 경우만 렌더링) */}
      {description && (
        <p className="mt-2 text-xs text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;