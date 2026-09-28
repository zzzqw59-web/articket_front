import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import AskForm from "./components/AskForm";

const AskEditPage = () => {
  const navigate = useNavigate();
  const { askId } = useParams();

  // 기존 상세 데이터 샘플 (스토리보드 화면 기준)[cite: 5]
  const mockInitialData = {
    category: "전시 관련 문의",
    exhibition: "0000148 - 사라지는 것들에 대하여",
    title: "가족과 함께 방문해도 괜찮을까요?",
    isSecret: true,
    content: "노인과 아이들이 관람해도 괜찮은 전시인지 문의드립니다.",
    files: ["입구 사진.jpg"],
  };

  const handleSubmit = (data) => {
    console.log(`문의[${askId}] 수정 제출:`, data);
    alert("문의글이 수정되었습니다.");
    navigate(`/articket/ask/${askId}`);
  };

  const handleCancel = () => {
    navigate(`/articket/ask/${askId}`);
  };

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />
        <AskForm
          initialData={mockInitialData}
          isEditMode={true}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </MainLayout>
  );
};

export default AskEditPage;