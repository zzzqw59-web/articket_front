import { useCallback, useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import AdminHeadBoard from "../../components/admin/AdminHeadBoard";
import StatisticBoard from "../../components/staff/StatisticBoard";

import {
  getTotalProfit,
  getTotalVisitor,
  getTotalReservation,
  getTotalCanceledReservation,
} from "../../api/statisticApi";
import CancleBoard from "../../components/staff/CancleBoard";

const AdminComponent = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedExhibitions = exhibitions.filter((exhibition) =>
    selectedIds.includes(exhibition.id),
  );

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await getExhibitionList({
          keyword: "",
          sort: "latest",
          free: false,
          page: 0,
          size: 100,
        });

        const list = Array.isArray(response)
          ? response
          : (response.dtoList ?? response.content ?? []);

        setExhibitions(list);
      } catch (error) {
        console.error("전시 목록 조회 실패:", error);
      }
    };

    fetchExhibitions();
  }, []);

  const fetchStatistic = useCallback(async ({ metric, startDate, endDate }) => {
    let totalApi;

    switch (metric) {
      case "profit":
        totalApi = getTotalProfit;
        break;
      case "visitor":
        totalApi = getTotalVisitor;
        break;
      case "reservation":
        totalApi = getTotalReservation;
        break;
      case "canceledreservation":
        totalApi = getTotalCanceledReservation;
        break;
      default:
        return {
          total: 0,
          summary: { average: 0, total: 0 },
          lists: [],
        };
    }

    // 전체 통계 API로 조회합니다.
    const total = await totalApi(startDate, endDate);

    // 시작일과 종료일을 모두 포함하여 날짜 수를 계산합니다.
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    const dateCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const average = dateCount > 0 ? total / dateCount : 0;

    return {
      total,
      summary: {
        total,
        average,
      },
      lists: [],
    };
  }, []);

  return (
    <>
      <div className="h-10"></div>

      <AdminHeadBoard
        exhibitions={exhibitions}
        fetchStatistic={fetchStatistic}
        onSelectedIdsChange={setSelectedIds}
      />

      <div className="h-10"></div>

      <StatisticBoard selectedExhibitions={selectedExhibitions} />

      <CancleBoard selectedExhibitions={selectedExhibitions} />
      <div className="h-10"></div>
    </>
  );
};

export default AdminComponent;
