
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataGrid } from "@mui/x-data-grid";
import { fetchList } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";

const PurchaseListTab = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // =====================================================
  // 🔹 FETCH PURCHASE LIST (GET /bundle-purchases)
  // =====================================================
  const loadPurchaseList = async () => {
    setLoading(true);
    try {
      const res = await fetchList(ApiEndPoints.PACKAGE_PURCHASE_LIST);

      if (res?.status === 200 && Array.isArray(res.data)) {
        setRows(
          res.data.map((item) => ({
            id: item.id, // REQUIRED for DataGrid
            customer_id: item.customer_id,
            customer_name: item.customer_name,
            package_name: item.package_name,
            package_id: item.package_id,
            purchase_date: item.purchase_date,
            selling_price: item.selling_price,
            status: item.status,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load purchase list", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchaseList();
  }, []);

  // =====================================================
  // 🔹 VIEW DETAILS (GET /bundle-purchases/:id)
  // =====================================================
  const viewDetails = async (row) => {
    try {
      const res = await fetchList(
        `${ApiEndPoints.PACKAGE_PURCHASE_LIST}/${row.id}`
      );
      console.log("Purchase Details:", res.data);
    } catch (error) {
      console.error("Failed to fetch purchase details", error);
    } finally {
      setAnchorEl(null);
    }
  };

  // =====================================================
  // 🔹 TABLE COLUMNS
  // =====================================================
  const columns = [
    { field: "customer_id", headerName: "Customer ID", flex: 1 },
    { field: "customer_name", headerName: "Customer Name", flex: 1.5 },
    { field: "package_name", headerName: "Package Name", flex: 1.5 },
    { field: "package_id", headerName: "Package ID", flex: 1 },
    { field: "purchase_date", headerName: "Purchase Date", flex: 1 },
    { field: "selling_price", headerName: "Selling Price", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setSelectedRow(params.row);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      {/* 🔍 FILTER BAR (UI ONLY – NO LOGIC REMOVED) */}
      <Box display="flex" gap={2} mb={2}>
        <TextField size="small" placeholder="Search" />
        <TextField
          size="small"
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small"
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* 📊 DATA GRID */}
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {/* ⋮ ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => viewDetails(selectedRow)}>
          View details
        </MenuItem>
        <MenuItem onClick={() => console.log("Usage", selectedRow)}>
          Usage details
        </MenuItem>
        <MenuItem onClick={() => console.log("Refund", selectedRow)}>
          Refund
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PurchaseListTab;
