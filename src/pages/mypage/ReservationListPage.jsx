import { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ReservationDetailSide from "./components/ReservationDetailSide";
import { getMyReservationList, getReservationDetail, getMyPaymentList, getPaymentDetail } from "../../api/mypageApi";
import {
  RESERVATION_TABS,
  RESERVATION_SEARCH_OPTIONS,
  RESERVATION_SORT_OPTIONS,
  getBookingColumns,
  getPaymentColumns,
} from "../../constants/mypageConstants";

const ReservationListPage = () => {
  const [activeTab, setActiveTab] = useState("booking"); // 'booking' | 'payment'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("desc");

  const [selectedItem, setSelectedItem] = useState(null);

  // 통합 데이터 Fetch (목록 조회)
  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === "booking") {
        // 1. 예약 내역 목록 조회 (Payment/Reservation List API)
        const response = await getMyReservationList(currentPage, 10, searchType, keyword, sort);
        const mappedData = (response.dtoList || []).map((item) => ({
          id: item.reservationId,
          orderId: item.reservationOrderId,
          bookingId: item.reservationOrderId || `RES${String(item.reservationId).padStart(7, '0')}`,
          transactionId: `TRX${String(item.reservationId).padStart(8, '0')}`,
          title: item.exhibitionTitle,
          place: item.exhibitionArea || "상세 장소 미정",
          personnel: `성인 ${item.reservationPerson}명`,
          viewDate: item.reservationDay ? String(item.reservationDay).replace(/-/g, '.') : "-",
          bookingDate: item.reservationCreatedAt ? item.reservationCreatedAt.replace('T', ' ').split('.')[0] : "-",
          transactionDate: item.reservationCreatedAt ? item.reservationCreatedAt.replace('T', ' ').split('.')[0] : "-",
          amount: item.reservationAmount ? `${item.reservationAmount.toLocaleString()} 원` : "0 원",
          status: item.reservationStatus || "RESERVED",
          cancelDate: item.reservationCanceledAt ? item.reservationCanceledAt.replace('T', ' ').split('.')[0] : null,
        }));
        setDataList(mappedData);
        setTotalPages(response.totalPage || 1);

      } else {
        // 2. 결제 내역 목록 조회 (PaymentListResponseDTO: yyyy-MM-dd 형태만 가짐)
        const response = await getMyPaymentList(currentPage, 10, searchType, keyword, sort);
        const mappedData = (response.dtoList || []).map((item) => ({
          id: item.paymentId, // paymentId (PK)
          paymentOrderId: item.paymentOrderId,
          transactionId: item.paymentOrderId,
          title: item.exhibitionTitle,
          amount: item.paymentAmount ? `${item.paymentAmount.toLocaleString()} 원` : "0 원",
          transactionDate: item.paymentCreatedAt || "-", // 백엔드가 'yyyy-MM-dd' 형태로 내려줌
          status: item.paymentStatus || "DONE",
        }));
        setDataList(mappedData);
        setTotalPages(response.totalPage || 1);
      }
    } catch (error) {
      console.error(`${activeTab} 내역 조회 실패:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, searchType, keyword, sort]);

  const getColumns = () => {
    const isCompact = !!selectedItem;
    return activeTab === "payment" ? getPaymentColumns(isCompact) : getBookingColumns(isCompact);
  };

  // 행 클릭 시 단건 상세 조회 연동
  const handleRowClick = async (row) => {
    try {
      if (activeTab === "booking" && row.id) {
        // 1. 예약 상세 API 호출 (기존 백엔드 API 호환)
        // orderId 기반 조회가 필요하면 getReservationDetail(row.orderId)를 유지하고 백엔드 컨트롤러 연결 확인
        const detailData = await getReservationDetail(row.id);

        setSelectedItem({
          ...row,
          title: detailData.exhibitionTitle,
          place: detailData.exhibitionArea || row.place,
          personnel: `성인 ${detailData.reservationPerson}명`,
          viewDate: detailData.reservationDay ? String(detailData.reservationDay).replace(/-/g, '.') : row.viewDate,
          amount: detailData.reservationAmount ? `${detailData.reservationAmount.toLocaleString()} 원` : row.amount,
          status: detailData.reservationStatus || row.status,
          bookingDate: detailData.reservationCreatedAt ? detailData.reservationCreatedAt.replace('T', ' ').split('.')[0] : row.bookingDate,
          cancelDate: detailData.reservationCanceledAt ? detailData.reservationCanceledAt.replace('T', ' ').split('.')[0] : row.cancelDate,
        });

      } else if (activeTab === "payment" && row.id) {
        // 2. 결제 상세 API 호출 (paymentId로 정확히 조회)
        const detailData = await getPaymentDetail(row.id);

        setSelectedItem({
          paymentId: detailData.paymentId,
          transactionId: detailData.paymentOrderId,
          bookingId: detailData.reservationId ? `RES${String(detailData.reservationId).padStart(7, '0')}` : "-",
          title: row.title,
          amount: detailData.paymentAmount ? `${detailData.paymentAmount.toLocaleString()} 원` : "0 원",
          paymentMethod: detailData.paymentMethod || "신용카드",
          refundAmount: detailData.paymentRefundAmount ? `${detailData.paymentRefundAmount.toLocaleString()} 원` : "0 원",
          status: detailData.paymentStatus,
          transactionDate: detailData.paymentApprovedAt || detailData.paymentCreatedAt || "-",
          cancelDate: detailData.paymentCanceledAt || null,
        });
      }
    } catch (error) {
      console.error("상세 정보 조회 실패:", error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6 items-start w-full">
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
              setSearchType("title");
              setKeyword("");
              handleCloseDetail();
            }}
            columns={getColumns()}
            data={dataList}
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

          <div className="w-full max-w-xl mx-auto mt-2">
            <SearchBar
              key={activeTab}
              options={RESERVATION_SEARCH_OPTIONS}
              onSearch={(query) => {
                setSearchType(query.type || "title");
                setKeyword(query.keyword || "");
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {selectedItem && (
          <ReservationDetailSide
            data={selectedItem}
            type={activeTab}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ReservationListPage;