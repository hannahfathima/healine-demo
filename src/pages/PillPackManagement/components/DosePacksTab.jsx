import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchDosePacks, updateDosePackStatus } from "../../../apis/services/pillpackApi";
import { toast } from "react-toastify";

const DosePacksTab = () => {
  const [rows, setRows] = useState([]);

  const loadData = async () => {
    const res = await fetchDosePacks();
    setRows(
      res.data.data.map((d) => ({
        id: d.id,
        batch_number: d.batch_number,
        packing_status: d.packing_status,
      }))
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const markPacked = async (id) => {
    await updateDosePackStatus(id, {
      packing_status: "packed",
      batch_number: "BATCH-2026-01-001",
      qr_code: "https://qr.example.com/pack/" + id,
    });
    toast.success("Dose pack updated");
    loadData();
  };

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={[
        { field: "batch_number", headerName: "Batch", flex: 1 },
        { field: "packing_status", headerName: "Status", flex: 1 },
        {
          field: "action",
          headerName: "Action",
          renderCell: (params) => (
            <Button onClick={() => markPacked(params.id)}>Mark Packed</Button>
          ),
        },
      ]}
    />
  );
};

export default DosePacksTab;
