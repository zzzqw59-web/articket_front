import { useEffect, useState } from "react";
import { getExhibitionList } from "../../api/exhibitionApi";

import AdminHeadBoard from "../../components/admin/AdminHeadBoard";
import StatisticBoard from "../../components/staff/StatisticBoard";
import CancleBoard from "../../components/staff/CancleBoard";
import AdminReservationComponent from "../../components/admin/AdminReservationComponent";
import AdminFloatingNavigator from "./AdminFloatingNavigator";

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
          size: 999,
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

  return (
    <>
      <div className="h-10" />

      <AdminHeadBoard
        exhibitions={exhibitions}
        onSelectedIdsChange={setSelectedIds}
      />

      <div className="h-10" />

      <StatisticBoard selectedExhibitions={selectedExhibitions} />

      <CancleBoard selectedExhibitions={selectedExhibitions} />
      <div className="h-10"></div>
      <AdminReservationComponent />

      <div className="h-20" />
      <AdminFloatingNavigator isMain={true} />
    </>
  );
};

export default AdminComponent;
