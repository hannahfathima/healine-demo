import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { fetchPillpackSubscriptions } from "../../../apis/services/pillpackApi";

const SubscriptionsTab = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchPillpackSubscriptions().then((res) => {
      setRows(
        res.data.data.map((s) => ({
          id: s.id,
          user: s.user_name,
          plan: s.plan_name,
          status: s.status,
        }))
      );
    });
  }, []);

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={[
        { field: "user", headerName: "User", flex: 1 },
        { field: "plan", headerName: "Plan", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
      ]}
    />
  );
};

export default SubscriptionsTab;
