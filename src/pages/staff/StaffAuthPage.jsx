import { useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import StaffAuthExhibitionsComponent from "../../components/staff/StaffAuthExhibitionsComponent";
import PageHeader from "../../components/common/PageHeader";
import ExhibitionPagination from "../../components/exhibition/ExhibitionPagination";

const StaffAuthPage = () => {
  const [exhibitions, setExhibitions] = useState([]);

  const fetchExhibitions = async ({ keyword, page, free = false } = {}) => {
    try {
      const data = await getExhibitionList({ keyword, page, free });
      setExhibitions(data.content || data);
    } catch (e) {
      console.error("fail to load exhibition list", e);
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, []);

  return (
    <>
      <PageHeader
        title={"권한 요청 페이지"}
        description={"신청 버튼을 눌러 권한을 신청하세요."}
      />

      <div className="flex justify-center mt-30">
        <StaffAuthExhibitionsComponent exhibitions={exhibitions} />
      </div>
      <ExhibitionPagination />
      <div className="h-20"></div>
    </>
  );
};
export default StaffAuthPage;
