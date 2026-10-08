import { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ReservationDetailSide from "./components/ReservationDetailSide";
import { getMyReservationList, getReservationDetail } from "../../api/mypageApi";
import {
  RESERVATION_TABS,
  RESERVATION_SEARCH_OPTIONS,
  RESERVATION_SORT_OPTIONS,
  getBookingColumns,
  getPaymentColumns,
} from "../../constants/mypageConstants";

const ReservationListPage = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [reservationList, setReservationList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("desc");

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // 백엔드 목록 데이터를 프론트엔드 UI 규격에 맞게 매핑
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await getMyReservationList(currentPage, 10, searchType, keyword, sort);
      
      const mappedData = (response.dtoList || []).map((item) => ({
        id: item.reservationId,
        orderId: item.reservationOrderId, // 👈 상세 조회용 orderId 보관
        bookingId: item.reservationOrderId || `RES${String(item.reservationId).padStart(7, '0')}`,
        transactionId: `TRX${String(item.reservationId).padStart(8, '0')}`,
        title: item.exhibitionTitle,
        place: item.exhibitionArea || "상세 장소 미정",
        personnel: `성인 ${item.reservationPerson}명`,
        viewDate: item.reservationDay ? String(item.reservationDay).replace(/-/g, '.') : "-",
        bookingDate: item.reservationCreatedAt ? item.reservationCreatedAt.replace('T', ' ') : "-",
        transactionDate: item.reservationCreatedAt ? item.reservationCreatedAt.replace('T', ' ') : "-",
        amount: item.reservationAmount ? `${item.reservationAmount.toLocaleString()} 원` : "0 원",
        status: item.reservationStatus || "예약완료",
        cancelDate: item.reservationCanceledAt ? item.reservationCanceledAt.replace('T', ' ') : null,
      }));

      setReservationList(mappedData);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("예약/결제 내역 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [currentPage, searchType, keyword, sort]);

  // 상수로 분리된 컬럼 가져오기 (상세창 열림 여부에 따른 width 동적 적용)
  const getColumns = () => {
    const isCompact = !!selectedItem;
    return activeTab === "payment" ? getPaymentColumns(isCompact) : getBookingColumns(isCompact);
  };

  const getData = () => reservationList;

  // 💡 행 클릭 시 상세 API 호출 후 선택된 아이템 세팅
  const handleRowClick = async (row) => {
    setSelectedType(activeTab);
    try {
      // orderId가 존재하면 상세 API 호출, 아니면 목록 데이터로 대체
      if (row.orderId) {
        const detailData = await getReservationDetail(row.orderId);
        // 상세 API 응답(ReservationDTO)을 기존 UI 구조에 맞게 매핑하여 세팅
        setSelectedItem({
          ...row,
          title: detailData.exhibitionTitle,
          place: detailData.exhibitionArea || row.place,
          personnel: `성인 ${detailData.reservationPerson}명`,
          viewDate: detailData.reservationDay ? String(detailData.reservationDay).replace(/-/g, '.') : row.viewDate,
          amount: detailData.reservationAmount ? `${detailData.reservationAmount.toLocaleString()} 원` : row.amount,
          status: detailData.reservationStatus || row.status,
          cancelDate: detailData.reservationCanceledAt ? detailData.reservationCanceledAt.replace('T', ' ') : row.cancelDate,
        });
      } else {
        setSelectedItem(row);
      }
    } catch (error) {
      console.error("예약 상세 조회 실패:", error);
      setSelectedItem(row); // 실패 시 기존 목록 데이터 폴백
    }
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6 items-start w-full">
        {/* 좌측 영역 */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 transition-all duration-300">
          <PageHeader
            title="예약/결제 내역"
            description="회원님의 예약 및 결제 내역을 조회할 수 있습니다."
          />

          <DataTableContainer
            tabs={RESERVATION_TABS}
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
              handleCloseDetail();
            }}
            columns={getColumns()}
            data={getData()}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            sortOptions={RESERVATION_SORT_OPTIONS}
            onSortChange={(newSort) => {
              setSort(newSort);
              setCurrentPage(1);
            }}
            onRowClick={handleRowClick}
            isCompact={!!selectedItem}
          />

          {/* 하단 검색 바 */}
          <div className="w-full max-w-xl mx-auto mt-2">
            <SearchBar
              options={RESERVATION_SEARCH_OPTIONS}
              onSearch={(query) => {
                setSearchType(query.type || "title");
                setKeyword(query.keyword || "");
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* 우측 상세 영수증 영역 */}
        {selectedItem && (
          <ReservationDetailSide
            data={selectedItem}
            type={selectedType}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ReservationListPage;