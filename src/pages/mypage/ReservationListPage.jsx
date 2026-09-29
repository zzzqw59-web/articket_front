import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTableContainer from "../../components/common/DataTableContainer";
import SearchBar from "../../components/common/SearchBar";
import ReservationDetailSide from "./components/ReservationDetailSide";

const ReservationListPage = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const tabs = [
    { id: "booking", label: "예약 내역" },
    { id: "payment", label: "결제 내역" },
  ];

  // 상세창이 열렸을 때(Compact 상태) 컬럼 너비를 최소화하거나 미세 조정
  const bookingColumns = [
    { key: "bookingId", label: "예약 번호", width: selectedItem ? "w-24" : "w-28", align: "center" },
    { key: "title", label: "전시명", align: "left" },
    { key: "personnel", label: "예약 인원", width: selectedItem ? "w-20" : "w-28", align: "center" },
    { key: "viewDate", label: "관람일", width: selectedItem ? "w-28" : "w-32", align: "center" },
    { key: "status", label: "예약 상태", width: selectedItem ? "w-20" : "w-24", align: "center" },
  ];

  const paymentColumns = [
    { key: "transactionId", label: "거래 번호", width: selectedItem ? "w-24" : "w-28", align: "center" },
    { key: "title", label: "전시명", align: "left" },
    { key: "amount", label: "결제 금액", width: selectedItem ? "w-24" : "w-28", align: "right" },
    { key: "status", label: "결제 상태", width: selectedItem ? "w-20" : "w-24", align: "center" },
    { key: "transactionDate", label: "결제 일시", width: selectedItem ? "w-28" : "w-32", align: "center" },
  ];

  const mockBookingData = [
    { id: 1, bookingId: "RES0000001", title: "반 고흐 미디어아트전", personnel: "성인 2, 청소년 1(3명)", viewDate: "2026.09.20 11:00", place: "한가람 미술관 1층", bookingDate: "2026.09.15 14:30", status: "예약완료" },
    { id: 2, bookingId: "RES0000002", title: "사계절을 전시에 담다 10", personnel: "성인 1(1명)", viewDate: "2026.09.10 15:00", place: "예술의전당 한가람미술관", bookingDate: "2026.09.05 10:10", status: "예약취소", cancelDate: "2026.09.06 10:45" },
  ];

  const mockPaymentData = [
    { id: 1, transactionId: "TRX12345678", bookingId: "RES0000001", title: "반 고흐 미디어아트전", amount: "45,000 원", transactionDate: "2026.09.15 14:30", status: "결제완료" },
    { id: 2, transactionId: "TRX12345679", bookingId: "RES0000002", title: "사계절을 전시에 담다 10", amount: "15,000 원", transactionDate: "2026.09.05 10:10", status: "결제취소", cancelDate: "2026.09.06 10:45" },
  ];

  const getColumns = () => (activeTab === "payment" ? paymentColumns : bookingColumns);
  const getData = () => (activeTab === "payment" ? mockPaymentData : mockBookingData);

  const handleRowClick = (row) => {
    setSelectedItem(row);
    setSelectedType(activeTab);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* 메인 Flex 레이아웃: 좌측(헤더+목록+검색) / 우측(상세영수증) */}
      <div className="flex gap-6 items-start w-full">
        {/* 좌측 영역 (상세 열림 여부에 따라 너비 축소) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 transition-all duration-300">
          {/* 헤더를 좌측 영역 내부로 배치하여 표와 함께 축소/중앙 정렬되도록 수정 */}
          <PageHeader
            title="예약/결제 내역"
            description="회원님의 예약 및 결제 내역을 조회할 수 있습니다."
          />

          <DataTableContainer
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId);
              setCurrentPage(1);
              handleCloseDetail();
            }}
            columns={getColumns()}
            data={getData()}
            currentPage={currentPage}
            totalPages={10}
            onPageChange={(page) => setCurrentPage(page)}
            sortOptions={[{ label: "최신순", value: "latest" }]}
            onRowClick={handleRowClick}
            isCompact={!!selectedItem} // 상세창 열림 상태 전달
          />

          {/* 하단 검색 바 */}
          <div className="w-full max-w-xl mx-auto mt-2">
            <SearchBar
              options={[{ label: "전시명", value: "title" }]}
              onSearch={(query) => console.log(`${activeTab} 검색:`, query)}
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