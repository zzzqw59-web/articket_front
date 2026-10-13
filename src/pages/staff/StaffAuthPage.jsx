import { useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import StaffAuthExhibitionsComponent from "../../components/staff/StaffAuthExhibitionsComponent";
import PageHeader from "../../components/common/PageHeader";
import ExhibitionPagination from "../../components/exhibition/ExhibitionPagination";
import ExhibitionSearch from "../../components/exhibition/ExhibitionSearch";
import StaffRequestComponent from "../../components/staff/StaffRequestComponent";
import { getStaffRequest } from "../../api/staffApi";

const StaffAuthPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestRefresh, setRequestRefresh] = useState(0);

  const fetchExhibitions = async ({
    keyword,
    page,
    size = 6,
    free = false,
  } = {}) => {
    try {
      setLoading(true);
      const data = await getExhibitionList({ keyword, page, size, free });
      setExhibitions(data.content || data || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      console.error("fail to load exhibition list", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const data = await getStaffRequest();
      setRequests(data);
      console.log("신청 현황 응답:", data);
    } catch (e) {
      console.log("fail to load request", e);
    }
  };

  useEffect(() => {
    fetchExhibitions({ keyword, page });
  }, [keyword, page]);

  useEffect(() => {
    fetchRequests();
    //탭 새로 들어올 때마다 컴포넌트 다시 그림
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRequests();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [requestRefresh]);

  const handleSearch = (value) => {
    setKeyword(value);
    setPage(0);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  return (
    <>
      <div className="flex flex-col mt-15">
        <div className="font-bold head-text text-4xl mx-auto">
          권한 요청 페이지
        </div>
        <div className="head-text text-xl mx-auto mt-1 text-gray-500">
          전시를 검색하고 신청 버튼을 눌러 권한을 신청하세요.
        </div>
      </div>
      <div className="mt-7">
        <ExhibitionSearch onSearch={handleSearch} />
      </div>
      <div className="flex justify-center mt-30">
        {loading ? (
          <div className="text-4xl head-text">불러오는 중입니다...</div>
        ) : exhibitions.length === 0 ? (
          <div className="text-4xl head-text mb-30">
            전시를 불러오는데 실패했습니다.
          </div>
        ) : (
          <StaffAuthExhibitionsComponent
            exhibitions={exhibitions}
            onRequestSuccess={() => {
              setRequestRefresh((prev) => prev + 1);
            }}
          />
        )}
      </div>
      <ExhibitionPagination
        page={page}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
      <div className="w-[1200px] mx-auto">
        <div className="mt-10 text-4xl head-text font-bold translate-x-11">
          신청 현황
        </div>
        <StaffRequestComponent requests={requests} />
      </div>
      <div className="h-20"></div>
    </>
  );
};
export default StaffAuthPage;
