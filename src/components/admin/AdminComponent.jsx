import { useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";
import { getStatisticSummary } from "../../utils/statisticUtils";
import AdminHeadBoard from "./AdminHeadBoard";
import StatisticBoard from "../../components/staff/StatisticBoard";

import {
  getTotalProfit,
  getTotalVisitor,
  getTotalReservation,
  getProfitList,
  getVisitorList,
  getReservationList,
} from "../../api/statisticApi";

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

  const fetchStatistic = async ({ metric, startDate, endDate }) => {
    let totalApi;
    let listApi;

    switch (metric) {
      case "profit":
        totalApi = getTotalProfit;
        listApi = getProfitList;
        break;
      case "visitor":
        totalApi = getTotalVisitor;
        listApi = getVisitorList;
        break;
      case "reservation":
        totalApi = getTotalReservation;
        listApi = getReservationList;
        break;
      default:
        return {
          total: 0,
          summary: { average: 0, max: 0, min: 0 },
          lists: [],
        };
    }

    const total = await totalApi(undefined, startDate, endDate);

    const lists = await Promise.all(
      exhibitions.map((exhibition) =>
        listApi(exhibition.id, startDate, endDate),
      ),
    );

    const combinedData = lists.flat();
    const summary = getStatisticSummary(combinedData);

    return { total, summary, lists };
  };

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
      <div className="h-10"></div>
    </>
  );
};

export default AdminComponent;
