import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {
  Divider,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { rowsPerPageJsonData } from "../../utils/jsonData";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useCallback } from "react";
import { 
  fetchPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion, 
  sendPromotion 
} from "../../apis/services/promotionApi";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

const PromotionsTab = () => {
  const [open, setOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [promotionsDataGridOptions, setPromotionsDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'Package',
    reference_id: '',
    schedule_at: ''
  });
  
  const [id, setId] = useState();
  const [imageFile, setImageFile] = useState(null);

  const promotionsDataGridColumns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "type", headerName: "Type", flex: 0.8 },
    { field: "reference_id", headerName: "Reference ID", flex: 0.8 },
    {
      field: "schedule_at",
      headerName: "Schedule At",
      flex: 1,
      renderCell: (params) =>
        params.row.schedule_at
          ? new Date(params.row.schedule_at).toLocaleString()
          : "-"
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (params) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor:
              params.row.status === "completed"
                ? "#4caf50"
                : params.row.status === "pending"
                ? "#ff9800"
                : "#f44336",
            color: "white",
            fontSize: "12px",
          }}
        >
          {params.row.status}
        </span>
      ),
    },
    {
      field: "success_rate",
      headerName: "Success Rate",
      flex: 0.8,
      renderCell: (params) => `${params.row.success_rate}%`
    },
    {
      field: "image",
      headerName: "Image",
      flex: 0.8,
      renderCell: (params) =>
        params.row.image ? (
          <img
            src={`${params.row.image}`}
            alt="promotion"
            style={{ height: 40, borderRadius: 4 }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: 'Actions',
      flex: 1.2,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => {
              editPromotion(params.id);
            }}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              deletePromotionHandler(params.id);
            }}
            arialLabel="Delete"
            icon={<DeleteIcon />}
          />
          <CustomIconButton
            onClickAction={() => {
              sendPromotionHandler(params.id);
            }}
            arialLabel="Send"
            icon={<SendIcon />}
          />
        </>
      ),
    },
  ];

  const setPromotionsData = (data) => {
    const promotionsDatagridRows = data?.map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      type: item.type,
      reference_id: item.reference_id,
      schedule_at: item.schedule_at,
      sent_at: item.sent_at,
      status: item.status,
      success_rate: item.success_rate || 0,
      total_target: item.total_target || 0,
      total_sent: item.total_sent || 0,
      total_failed: item.total_failed || 0,
      image: item.image,
      actions: "Actions",
    }));

    updatePromotionsDataGridOptions("rows", promotionsDatagridRows);
  };

  const updatePromotionsDataGridOptions = (k, v) =>
    setPromotionsDataGridOptions((prev) => ({ ...prev, [k]: v }));

  const getPromotionsList = useCallback(async () => {
    updatePromotionsDataGridOptions("loading", true);
    try {
      // Use fetchPromotions from promotionsApi
      const result = await fetchPromotions(
        promotionsDataGridOptions.page,
        promotionsDataGridOptions.pageSize
      );
      
      if (result.status === 200) {
        updatePromotionsDataGridOptions("totalRows", result.data.pagination?.total || 0);
        setPromotionsData(result.data.data || []);
        updatePromotionsDataGridOptions("loading", false);
      } else {
        updatePromotionsDataGridOptions("totalRows", 0);
        updatePromotionsDataGridOptions("loading", false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load promotions");
      updatePromotionsDataGridOptions("loading", false);
    }
  }, [
    promotionsDataGridOptions.page,
    promotionsDataGridOptions.pageSize,
  ]);

  useEffect(() => {
    getPromotionsList();
  }, [getPromotionsList]);

  useEffect(() => {
    getPromotionsList();
  }, [pageNo]);

  const editPromotion = async (id) => {
    setId(id);
    setOpen(true);
    const item = promotionsDataGridOptions.rows.find((item) => item.id === id);
    
    if (item.image) {
      setPreviewImage(`${item.image}`);
    }

    setFormData({
      title: item.title,
      body: item.body,
      type: item.type,
      reference_id: item.reference_id,
      schedule_at: item.schedule_at
        ? new Date(item.schedule_at).toISOString().slice(0, 16)
        : ''
    });
  };

  const [openDeletePromotionDialog, setOpenDeletePromotionDialog] =
    React.useState(false);
  const handleCloseDeletePromotionDialog = () =>
    setOpenDeletePromotionDialog(false);
  const [promotionId, setDeletePromotionId] = useState(0);
  
  const handleConfirmDeletePromotionAction = async () => {
    setOpenDeletePromotionDialog(false);
    try {
      // Use deletePromotion from promotionsApi
      const result = await deletePromotion(promotionId);
      
      if (result.status === 200) {
        toast.success("Promotion deleted successfully");
        getPromotionsList();
      } else {
        toast.error("Failed to delete promotion");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete promotion");
    }
  };

  const deletePromotionHandler = (id) => {
    setDeletePromotionId(id);
    setOpenDeletePromotionDialog(true);
  };

  const [openSendPromotionDialog, setOpenSendPromotionDialog] =
    React.useState(false);
  const handleCloseSendPromotionDialog = () =>
    setOpenSendPromotionDialog(false);
  const [sendPromotionId, setSendPromotionId] = useState(0);
  
  const handleConfirmSendPromotionAction = async () => {
    setOpenSendPromotionDialog(false);
    try {
      // Use sendPromotion from promotionsApi
      const result = await sendPromotion(sendPromotionId);
      
      if (result.status === 200) {
        toast.success("Promotion sent successfully");
        getPromotionsList();
      } else {
        toast.error("Failed to send promotion");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send promotion");
    }
  };

  const sendPromotionHandler = (id) => {
    setSendPromotionId(id);
    setOpenSendPromotionDialog(true);
  };

  const onSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!formData.body.trim()) {
      toast.error("Body is required.");
      return;
    }
    if (!formData.reference_id) {
      toast.error("Reference ID is required.");
      return;
    }
    if (!formData.schedule_at) {
      toast.error("Schedule date/time is required.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("body", formData.body);
    formPayload.append("type", formData.type);
    formPayload.append("reference_id", formData.reference_id);
    formPayload.append("schedule_at", formData.schedule_at);
    
    if (imageFile) {
      formPayload.append("image", imageFile);
    }

    try {
      let result;
      if (!id) {
        // Use createPromotion from promotionsApi
        result = await createPromotion(formPayload);
      } else {
        // Use updatePromotion from promotionsApi
        result = await updatePromotion(id, formPayload);
      }

      if (result.status === 200 || result.status === 201) {
        toast.success(result.data.message || "Operation successful");
        setFormData({
          title: '',
          body: '',
          type: 'Package',
          reference_id: '',
          schedule_at: ''
        });
        setImageFile(null);
        setId();
        setOpen(false);
        getPromotionsList();
        setPreviewImage(null);
      } else {
        toast.error(result.data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      body: '',
      type: 'Package',
      reference_id: '',
      schedule_at: ''
    });
    setId();
    setPreviewImage(null);
    setImageFile(null);
  };

  return (
    <div className="min-width">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Typography variant="h4">Promotions</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add Promotion
        </Button>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      {/* datatable start */}
      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={promotionsDataGridOptions.loading}
          rowCount={promotionsDataGridOptions.totalRows}
          rowsPerPageOptions={promotionsDataGridOptions.rowsPerPageOptions}
          rows={promotionsDataGridOptions.rows}
          columns={promotionsDataGridColumns}
          page={promotionsDataGridOptions.page - 1}
          pageSize={promotionsDataGridOptions.pageSize}
          checkboxSelection={true}
          onPageChange={(newPage) => {
            setPromotionsDataGridOptions((old) => ({
              ...old,
              page: newPage + 1,
            }));
          }}
          onPageSizeChange={(pageSize) => {
            console.log("page size", pageSize);
            updatePromotionsDataGridOptions("page", 1);
            updatePromotionsDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>
      
      {/* Delete Promotion Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to delete this promotion?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeletePromotionDialog}
        handleDialogClose={handleCloseDeletePromotionDialog}
        handleDialogAction={handleConfirmDeletePromotionAction}
      />

      {/* Send Promotion Alert */}
      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm The Action"
        message="Do you really want to send this promotion?"
        cancelButtonText="Cancel"
        confirmButtonText="Send"
        openDialog={openSendPromotionDialog}
        handleDialogClose={handleCloseSendPromotionDialog}
        handleDialogAction={handleConfirmSendPromotionAction}
      />
      {/* datatable end */}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{id ? 'Edit Promotion' : 'Add Promotion'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Enter Title"
            type="text"
            fullWidth
            value={formData.title}
            variant="standard"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <TextField
            margin="dense"
            id="body"
            label="Enter Body"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.body}
            variant="standard"
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />

          <TextField
            margin="dense"
            id="type"
            label="Type"
            select
            fullWidth
            value={formData.type}
            variant="standard"
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="Package">Package</MenuItem>
            <MenuItem value="Product">Product</MenuItem>
            <MenuItem value="Service">Service</MenuItem>
          </TextField>

          <TextField
            margin="dense"
            id="reference_id"
            label="Reference ID"
            type="number"
            fullWidth
            value={formData.reference_id}
            variant="standard"
            onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
          />

          <TextField
            margin="dense"
            id="schedule_at"
            label="Schedule At"
            type="datetime-local"
            fullWidth
            value={formData.schedule_at}
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setFormData({ ...formData, schedule_at: e.target.value })}
          />

          {/* Image file upload */}
          <div style={{ marginTop: "1rem" }}>
            <Typography variant="subtitle1">Upload Image:</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);

                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ marginTop: "10px", maxHeight: "150px", borderRadius: "8px" }}
              />
            )}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            className="mt-1"
            size="large"
            variant="contained"
            disableElevation
            type="submit"
            onClick={() => {
              onSubmit()
            }}
            color="primary"
            style={{
              justifyContent: "center",
              width: "98px",
              height: "44px",
              textTransform: "capitalize",
              background:
                "linear-gradient(180deg, #255480 0%, #173450 100%)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PromotionsTab;