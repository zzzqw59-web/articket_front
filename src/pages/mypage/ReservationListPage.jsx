
import { useState, useEffect, useRef } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ReservationDetailSide from "./components/ReservationDetailSide";
import {
  getMyReservationList,
  getReservationDetail,
  getMyPaymentList,
  getPaymentDetail,
  cancelReservation,
} from "../../api/mypageApi";
import {
  RESERVATION_TABS,
  RESERVATION_SEARCH_OPTIONS,
  RESERVATION_SORT_OPTIONS,
  getBookingColumns,
  getPaymentColumns,
} from "../../constants/mypageConstants";
import ReservationCancelModal from "./components/ReservationCancelModal";

const PAGE_SIZE = 10;

const ReservationListPage = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("title");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("desc");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // 이전 요청이 늦게 도착해 목록을 덮어쓰는 문제 방지
  const requestIdRef = useRef(0);

  // 통합 데이터 Fetch
  const fetchData = async () => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);

      if (activeTab === "booking") {
        // 1. 예약 목록 첫 페이지 조회
        const firstResponse = await getMyReservationList(
          1,
          PAGE_SIZE,
          searchType,
          keyword,
          sort
        );

        const allReservations = [
          ...(firstResponse.dtoList || []),
        ];

        const serverTotalPages = Math.max(
          1,
          Number(firstResponse.totalPage) || 1
        );

        // 2. 서버에 남아 있는 페이지까지 모두 조회
        for (let page = 2; page <= serverTotalPages; page++) {
          if (requestId !== requestIdRef.current) return;

          const response = await getMyReservationList(
            page,
            PAGE_SIZE,
            searchType,
            keyword,
            sort
          );

          allReservations.push(...(response.dtoList || []));
        }

        if (requestId !== requestIdRef.current) return;

        // 3. PENDING 제외
        const filteredReservations = allReservations.filter(
          (item) => item.reservationStatus !== "PENDING"
        );

        // 4. 필터링된 데이터 기준 전체 페이지 계산
        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(filteredReservations.length / PAGE_SIZE)
        );

        // 5. 현재 페이지에 해당하는 예약 10개 추출
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const paginatedReservations = filteredReservations.slice(
          startIndex,
          startIndex + PAGE_SIZE
        );

        // 6. 기존 화면 데이터 형태로 변환
        const mappedData = paginatedReservations.map((item) => ({
          id: item.reservationId,
          orderId: item.reservationOrderId,
          bookingId:
            item.reservationOrderId ||
            `RES${String(item.reservationId).padStart(7, "0")}`,
          transactionId: `TRX${String(item.reservationId).padStart(8, "0")}`,
          title: item.exhibitionTitle,
          place: item.exhibitionArea || "상세 장소 미정",
          personnel: `성인 ${item.reservationPerson}명`,
          viewDate: item.reservationDay
            ? String(item.reservationDay).replace(/-/g, ".")
            : "-",
          bookingDate: item.reservationCreatedAt
            ? item.reservationCreatedAt.replace("T", " ").split(".")[0]
            : "-",
          transactionDate: item.reservationCreatedAt
            ? item.reservationCreatedAt.replace("T", " ").split(".")[0]
            : "-",
          amount: item.reservationAmount
            ? `${item.reservationAmount.toLocaleString()} 원`
            : "0 원",
          status: item.reservationStatus || "RESERVED",
          cancelDate: item.reservationCanceledAt
            ? item.reservationCanceledAt.replace("T", " ").split(".")[0]
            : null,
        }));

        setDataList(mappedData);
        setTotalPages(calculatedTotalPages);

        // 취소 등으로 현재 페이지가 사라진 경우
        if (currentPage > calculatedTotalPages) {
          setCurrentPage(calculatedTotalPages);
        }

      } else {
        // 결제 내역은 기존 서버 페이징 유지
        const response = await getMyPaymentList(
          currentPage,
          PAGE_SIZE,
          searchType,
          keyword,
          sort
        );

        if (requestId !== requestIdRef.current) return;

        const mappedData = (response.dtoList || []).map((item) => ({
          id: item.paymentId,
          paymentOrderId: item.paymentOrderId,
          transactionId: item.paymentOrderId,
          title: item.exhibitionTitle,
          amount: item.paymentAmount
            ? `${item.paymentAmount.toLocaleString()} 원`
            : "0 원",
          transactionDate: item.paymentCreatedAt || "-",
          status: item.paymentStatus || "DONE",
        }));

        setDataList(mappedData);
        setTotalPages(response.totalPage || 1);
      }
    } catch (error) {
      if (requestId === requestIdRef.current) {
        console.error(`${activeTab} 내역 조회 실패:`, error);
        setDataList([]);
        setTotalPages(1);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      // 탭이나 검색 조건이 바뀌면 이전 결과 무시
      requestIdRef.current += 1;
    };
  }, [activeTab, currentPage, searchType, keyword, sort]);

  const getColumns = () => {
    const isCompact = !!selectedItem;

    return activeTab === "payment"
      ? getPaymentColumns(isCompact)
      : getBookingColumns(isCompact);
  };

  // 행 클릭 시 단건 상세 조회
  const handleRowClick = async (row) => {
    try {
      if (activeTab === "booking" && row.id) {
        const detailData = await getReservationDetail(row.id);

        setSelectedItem({
          ...row,
          title: detailData.exhibitionTitle,
          place: detailData.exhibitionArea || row.place,
          personnel: `성인 ${detailData.reservationPerson}명`,
          viewDate: detailData.reservationDay
            ? String(detailData.reservationDay).replace(/-/g, ".")
            : row.viewDate,
          amount: detailData.reservationAmount
            ? `${detailData.reservationAmount.toLocaleString()} 원`
            : row.amount,
          status: detailData.reservationStatus || row.status,
          bookingDate: detailData.reservationCreatedAt
            ? detailData.reservationCreatedAt
                .replace("T", " ")
                .split(".")[0]
            : row.bookingDate,
          cancelDate: detailData.reservationCanceledAt
            ? detailData.reservationCanceledAt
                .replace("T", " ")
                .split(".")[0]
            : row.cancelDate,
        });

      } else if (activeTab === "payment" && row.id) {
        const detailData = await getPaymentDetail(row.id);

        setSelectedItem({
          paymentId: detailData.paymentId,
          transactionId: detailData.paymentOrderId,
          bookingId: detailData.reservationId
            ? `RES${String(detailData.reservationId).padStart(7, "0")}`
            : "-",
          title: row.title,
          amount: detailData.paymentAmount
            ? `${detailData.paymentAmount.toLocaleString()} 원`
            : "0 원",
          paymentMethod: detailData.paymentMethod || "신용카드",
          refundAmount: detailData.paymentRefundAmount
            ? `${detailData.paymentRefundAmount.toLocaleString()} 원`
            : "0 원",
          status: detailData.paymentStatus,
          transactionDate:
            detailData.paymentApprovedAt ||
            detailData.paymentCreatedAt ||
            "-",
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

  // 예약 취소
  const handleCancelSubmit = async (cancelData) => {
    try {
      setCancelLoading(true);

      await cancelReservation(selectedItem.id, cancelData);

      alert("예약이 성공적으로 취소되었습니다.");

      setIsCancelModalOpen(false);
      setSelectedItem(null);

      // 목록 새로고침
      await fetchData();

    } catch (error) {
      console.error("예약 취소 실패:", error);

      alert(
        error.response?.data?.message ||
        "예약 취소 중 오류가 발생했습니다."
      );
    } finally {
      setCancelLoading(false);
    }
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
            onOpenCancelModal={() => setIsCancelModalOpen(true)}
          />
        )}
      </div>

      <ReservationCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onSubmit={handleCancelSubmit}
        loading={cancelLoading}
      />
    </div>
  );
};

export default ReservationListPage;
