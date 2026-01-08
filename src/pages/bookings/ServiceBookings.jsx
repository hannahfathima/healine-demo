// ServiceBookings.js
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button, Divider, FormControl, Grid, InputAdornment, TextField, Typography,
  IconButton
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';

import ConfirmDialog from '../../shared/components/ConfirmDialog';
import CustomIconButton from '../../shared/components/CustomIconButton';

import { toast } from 'react-toastify';
import { fetchList, deleteRecord } from '../../apis/services/CommonApiService';
import { ApiEndPoints } from '../../apis/ApiEndPoints';

const rowsPerPageJsonData = [5, 10, 20, 50];

const serviceStatusText = {
  0: "Pending",
  1: "Confirm",
  2: "Cancel",
  3: "Sample Collected",
  4: "Report Delivered",
  '0': "Pending",
  '1': "Confirm",
  '2': "Cancel",
  '3': "Sample Collected",
  '4': "Report Delivered",
};

const ServiceBookings = () => {
  const navigate = useNavigate();

  const [dataGridOptions, setDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });

  const [searchFilters, setSearchFilters] = useState({ searchText: '' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [allBookings, setAllBookings] = useState([]);

  const columns = [
    { field: 'id', headerName: 'Booking ID', flex: 1 },
    { field: 'service_name', headerName: 'Service', flex: 1 },
    { field: 'patient_name', headerName: 'Patient Name', flex: 1 },
    { field: 'service_date', headerName: 'Date of Appointment', flex: 1 },
    { field: 'time_slot', headerName: 'Time Slot', flex: 1 },

    {
      field: 'created_date',
      headerName: 'Created Date',
      flex: 1,
      valueGetter: (params) => {
        if (!params.row.created_date) return '';
        return new Date(params.row.created_date).toLocaleString('en-IN');
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => serviceStatusText[params.row.status] || 'Unknown',
    },

    {
      field: 'actions',
      type: 'actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => navigate(`/service-bookings/view/${params.id}`)}
            ariaLabel="View"
            icon={<CommentIcon />}
          />
          <CustomIconButton
            onClickAction={() => deleteBooking(params.id)}
            ariaLabel="Delete"
            icon={<DeleteIcon />}
          />
        </>
      ),
    },
  ];

  const getBookingsList = useCallback(async () => {
    setDataGridOptions(prev => ({ ...prev, loading: true }));

    const result = await fetchList(
      `${ApiEndPoints.PACKAGE_BOOKINGS}?page_no=1&items_per_page=10000`
    );

    if (result.status === 200) {
      setAllBookings(result.data.rows || []);
    } else {
      toast.error('Failed to fetch service bookings');
    }

    setDataGridOptions(prev => ({ ...prev, loading: false }));
  }, []);

  const computeRows = useCallback(() => {
    const mapped = allBookings.map(item => ({
      id: item.id,
      service_name: item.addons_snapshot?.map(a => a.name).join(', ') || 'Basic Service',
      patient_name: item.patient_name || '',
      service_date: item.booked_date,
      time_slot: item.slot,
      status: item.booking_status,
      created_date: item.created_at,
    }));

    const searched = mapped.filter(r =>
      r.patient_name?.toLowerCase().includes(searchFilters.searchText.toLowerCase())
    );

    const sorted = searched.sort(
      (a, b) => new Date(b.created_date) - new Date(a.created_date)
    );

    setDataGridOptions(prev => ({
      ...prev,
      rows: sorted,
      totalRows: sorted.length,
    }));
  }, [
    allBookings,
    searchFilters.searchText,
  ]);

  useEffect(() => {
    getBookingsList();
  }, [getBookingsList]);

  useEffect(() => {
    computeRows();
  }, [computeRows]);

  useEffect(() => {
    setDataGridOptions(prev => ({ ...prev, page: 1 }));
  }, [searchFilters.searchText]);

  const deleteBooking = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    const result = await deleteRecord(deleteId, ApiEndPoints.PACKAGE_BOOKINGS);

    if (result.status === 200) {
      toast.success('Service booking deleted');
      getBookingsList();
    } else {
      toast.error('Failed to delete service booking');
    }
  };

  return (
    <div className="min-width">
      <Typography variant="h4">Service Bookings</Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Search Service Bookings"
            onChange={(e) =>
              setSearchFilters({ searchText: e.target.value })
            }
            value={searchFilters.searchText}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchFilters.searchText && (
                    <IconButton onClick={() => setSearchFilters({ searchText: '' })}>
                      <CloseIcon />
                    </IconButton>
                  )}
                  <IconButton><SearchIcon /></IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>

      <DataGrid
        autoHeight
        loading={dataGridOptions.loading}
        rows={dataGridOptions.rows}
        columns={columns}
        page={dataGridOptions.page - 1}
        pageSize={dataGridOptions.pageSize}
        rowsPerPageOptions={dataGridOptions.rowsPerPageOptions}
        checkboxSelection
        pagination
        onPageChange={(newPage) =>
          setDataGridOptions(prev => ({ ...prev, page: newPage + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setDataGridOptions(prev => ({ ...prev, page: 1, pageSize }))
        }
      />

      <ConfirmDialog
        openDialog={openDeleteDialog}
        handleDialogClose={() => setOpenDeleteDialog(false)}
        handleDialogAction={handleConfirmDelete}
        title="Confirm Delete"
        message="Delete this service booking?"
      />
    </div>
  );
};

export default ServiceBookings;