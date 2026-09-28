import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import AskForm from "./components/AskForm";

const AskWritePage = () => {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    console.log("문의 등록 제출:", data);
    alert("문의가 성공적으로 등록되었습니다.");
    navigate("/articket/ask");
  };

  const handleCancel = () => {
    if (window.confirm("작성을 취소하시겠습니까? 입력한 내용은 저장되지 않습니다.")) {
      navigate("/articket/ask");
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />
        <AskForm
          isEditMode={false}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </MainLayout>
  );
};

export default AskWritePage;