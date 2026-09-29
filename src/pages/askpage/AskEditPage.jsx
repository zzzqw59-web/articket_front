import { useState, useEffect } from "react"; // 👈 useState, useEffect import 추가
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import AskForm from "./components/AskForm";
import { getAskDetail, updateAsk } from "../../api/askApi";

const AskEditPage = () => {
  const navigate = useNavigate();
  const { askId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOriginalAsk = async () => {
      try {
        const data = await getAskDetail(askId);
        setInitialData(data);
      } catch (error) {
        console.error("원글 데이터 조회 실패:", error);
        alert("존재하지 않는 문의글입니다.");
        navigate("/articket/ask");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOriginalAsk();
  }, [askId, navigate]);

  const handleSubmit = async ({ requestDto, newFiles }) => {
    try {
      await updateAsk(askId, requestDto, newFiles);
      alert("문의글이 수정되었습니다.");
      navigate(`/articket/ask/${askId}`);
    } catch (error) {
      console.error("문의글 수정 실패:", error);
      alert("문의글 수정 처리에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/articket/ask/${askId}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-12 text-gray-500">
          데이터를 불러오는 중입니다...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <PageHeader
          title="문의 게시판"
          description="전시 관련 문의 및 사이트 관련 문의 사항을 남겨주세요."
        />
        <AskForm
          initialData={initialData}
          isEditMode={true}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </MainLayout>
  );
};

export default AskEditPage;