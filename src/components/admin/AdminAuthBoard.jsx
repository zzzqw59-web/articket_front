import AdminManageStaffRequestComponent from "./AdminManageStaffRequestComponent";
import AdminCreateAccountComponent from "./AdminCreateAccountComponent";

const AdminAuthBoard = () => {
  return (
    <div className="flex w-[1400px] flex-row mx-auto">
      <AdminCreateAccountComponent />
      <AdminManageStaffRequestComponent />
    </div>
  );
};

export default AdminAuthBoard;
