import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { createRecord, fetchList, updateRecord, deleteRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import CustomIconButton from "../../shared/components/CustomIconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { faqsListSuccess, faqsListFailed } from "../../store/reducers/faqSlice";
import { rowsPerPageJsonData } from "../../utils/jsonData";

const Faq = (props) => {
  const { faqsList, faqsListSuccess, faqsListFailed } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [faqData, setFaqData] = useState({ question: "", answer: "", type: "" });
  const [faqId, setFaqId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteFaqId, setDeleteFaqId] = useState(0);
  const [faqDataGridOptions, setFaqDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });

  const faqDataGridColumns = [
    { field: "question", headerName: "Question", flex: 1 },
    { field: "answer", headerName: "Answer", flex: 1 },
    { field: "type", headerName: "Type", flex: 0.5 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => editFaq(params.id)}
            arialLabel="edit"
            icon={<EditIcon />}
          />
          <CustomIconButton
            onClickAction={() => deleteFaq(params.id)}
            arialLabel="delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  const updateFaqDataGridOptions = (key, value) =>
    setFaqDataGridOptions((prev) => ({ ...prev, [key]: value }));

  const getFaqsList = useCallback(async () => {
    updateFaqDataGridOptions("loading", true);
    const result = await fetchList(
      `${ApiEndPoints.FAQS}?page_no=${faqDataGridOptions.page}&items_per_page=${faqDataGridOptions.pageSize}`
    );
    if (result.status === 200) {
      updateFaqDataGridOptions("totalRows", result.data.count);
      faqsListSuccess(result.data.rows);
      updateFaqDataGridOptions("loading", false);
    } else {
      updateFaqDataGridOptions("totalRows", 0);
      faqsListFailed();
      updateFaqDataGridOptions("loading", false);
      toast.error(result.message || "Failed to fetch FAQs");
    }
  }, [faqDataGridOptions.page, faqDataGridOptions.pageSize, faqsListSuccess, faqsListFailed]);

  useEffect(() => {
    getFaqsList();
  }, [getFaqsList]);

  useEffect(() => {
    const faqRows = faqsList?.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      type: item.type,
      actions: "Actions",
    }));
    updateFaqDataGridOptions("rows", faqRows);
  }, [faqsList]);

  const handleOpen = () => {
    setFaqData({ question: "", answer: "", type: "" });
    setFaqId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFaqData({ question: "", answer: "", type: "" });
    setFaqId(null);
  };

  const editFaq = (id) => {
    const faq = faqDataGridOptions.rows.find((item) => item.id === id);
    setFaqData({
      question: faq.question,
      answer: faq.answer,
      type: faq.type,
    });
    setFaqId(id);
    setOpen(true);
  };

  const deleteFaq = (id) => {
    setDeleteFaqId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    const result = await deleteRecord(deleteFaqId, ApiEndPoints.FAQS);
    if (result.status === 200) {
      toast.success(result.message || "FAQ deleted successfully");
      getFaqsList();
    } else {
      toast.error(result.message || "Failed to delete FAQ");
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteFaqId(0);
  };

  const onSubmit = async () => {
    const data = {
      question: faqData.question,
      answer: faqData.answer,
      type: faqData.type,
    };

    if (!faqId) {
      const result = await createRecord(data, ApiEndPoints.FAQS);
      if (result.status === 200) {
        toast.success(result.message || "FAQ created successfully");
        getFaqsList();
        handleClose();
      } else {
        toast.error(result.message || "Failed to create FAQ");
      }
    } else {
      const result = await updateRecord(data, faqId, ApiEndPoints.FAQS);
      if (result.status === 200) {
        toast.success(result.message || "FAQ updated successfully");
        getFaqsList();
        handleClose();
      } else {
        toast.error(result.message || "Failed to update FAQ");
      }
    }
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
        <Typography variant="h4">FAQs</Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          style={{
            background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
            textTransform: "capitalize",
          }}
        >
          Add FAQ
        </Button>
      </div>
      <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />

      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          density="compact"
          autoHeight
          getRowHeight={() => "auto"}
          pagination
          paginationMode="server"
          loading={faqDataGridOptions.loading}
          rowCount={faqDataGridOptions.totalRows}
          rowsPerPageOptions={faqDataGridOptions.rowsPerPageOptions}
          rows={faqDataGridOptions.rows}
          columns={faqDataGridColumns}
          page={faqDataGridOptions.page - 1}
          pageSize={faqDataGridOptions.pageSize}
          onPageChange={(newPage) => {
            updateFaqDataGridOptions("page", newPage + 1);
          }}
          onPageSizeChange={(pageSize) => {
            updateFaqDataGridOptions("page", 1);
            updateFaqDataGridOptions("pageSize", pageSize);
          }}
        />
      </div>

      <ConfirmDialog
        scroll="paper"
        maxWidth="md"
        title="Confirm Delete FAQ"
        message="Do you really want to delete this FAQ?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        openDialog={openDeleteDialog}
        handleDialogClose={handleCloseDeleteDialog}
        handleDialogAction={handleConfirmDelete}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{faqId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="question"
            label="Question"
            type="text"
            fullWidth
            value={faqData.question}
            variant="standard"
            onChange={(e) => setFaqData({ ...faqData, question: e.target.value })}
          />
          <TextField
            margin="dense"
            id="answer"
            label="Answer"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={faqData.answer}
            variant="standard"
            onChange={(e) => setFaqData({ ...faqData, answer: e.target.value })}
          />
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              value={faqData.type}
              label="Type"
              onChange={(e) => setFaqData({ ...faqData, type: e.target.value })}
            >
              <MenuItem value="insurance">Insurance</MenuItem>
              <MenuItem value="global">Global</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            size="large"
            variant="contained"
            disableElevation
            onClick={onSubmit}
            style={{
              justifyContent: "center",
              width: "98px",
              height: "44px",
              textTransform: "capitalize",
              background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  faqsList: state.faq.faqsList,
});

const mapDispatchToProps = (dispatch) => ({
  faqsListSuccess: (data) => dispatch(faqsListSuccess(data)),
  faqsListFailed: () => dispatch(faqsListFailed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Faq);