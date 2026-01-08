// Bookings.js
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
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
import { bookingsListSuccess, bookingsListFailed } from '../../store/reducers/bookingSlice';

const rowsPerPageJsonData = [5, 10, 20, 50];

const Bookings = ({ bookingsList, bookingsListSuccess, bookingsListFailed }) => {
  const navigate = useNavigate();

  const [dataGridOptions, setDataGridOptions] = useState({
    loading: false,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: rowsPerPageJsonData,
    pageSize: 10,
    page: 1,
  });

  const [allBookings, setAllBookings] = useState([]); // Full list for client-side

  const [searchFilters, setSearchFilters] = useState({ searchText: '' });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const columns = [
    { field: 'id', headerName: 'Booking ID', flex: 1 },
    { field: 'patient_name', headerName: 'Patient Name', flex: 1 },

    {
      field: 'booking_date',
      headerName: 'Date of Appointment',
      flex: 1,
      valueGetter: (params) => {
        if (!params.row.booking_date) return '';
        return new Date(params.row.booking_date).toLocaleDateString('en-IN');
      }
    },

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
      renderCell: (params) => params.row.status || 'Unknown',
    },

    {
      field: 'actions',
      type: 'actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <CustomIconButton
            onClickAction={() => navigate(`/bookings/view/${params.id}`)}
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

  const sortBySearchPriority = (data, searchText) => {
    if (!searchText) return data;
    const s = searchText.toLowerCase();
    return data.filter(r => r.patient_name?.toLowerCase().includes(s));
  };

  const updateDataGridOptions = (k, v) => {
    setDataGridOptions(prev => ({ ...prev, [k]: v }));
  };

  const getBookingsList = useCallback(async () => {
    updateDataGridOptions('loading', true);
    const result = await fetchList(
      `${ApiEndPoints.BOOKING}?page_no=1&items_per_page=1000`
    );

    if (result.status === 200) {
      const data = result.data.data || [];
      setAllBookings(data);
    } else {
      bookingsListFailed();
      toast.error('Failed to fetch doctor bookings');
    }

    updateDataGridOptions('loading', false);
  }, []);

  useEffect(() => {
    getBookingsList();
  }, [getBookingsList]);

  const computeRows = useCallback(() => {
    const mapped = allBookings.map(item => ({
      id: item.id,
      patient_name: item.patient_name,
      booking_date: item.booking_date,
      time_slot: item.time_slot,
      status: item.status,
      created_date: item.created_at,
    }));

    const searched = sortBySearchPriority(mapped, searchFilters.searchText);

    const sorted = searched.sort((a, b) =>
      new Date(b.created_date) - new Date(a.created_date)
    );

    updateDataGridOptions('rows', sorted);
    updateDataGridOptions('totalRows', sorted.length);
  }, [allBookings, searchFilters.searchText]);

  useEffect(() => {
    computeRows();
  }, [computeRows]);

  useEffect(() => {
    updateDataGridOptions('page', 1);
  }, [searchFilters.searchText]);

  const deleteBooking = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    const result = await deleteRecord(deleteId, ApiEndPoints.BOOKING);

    if (result.status === 200) {
      toast.success('Booking deleted');
      getBookingsList();
    } else {
      toast.error('Failed to delete booking');
    }
  };

  return (
    <div className="min-width">
      <Typography variant="h4">Doctor Bookings</Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Search Doctor Bookings"
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
        pagination
        checkboxSelection
        onPageChange={(newPage) =>
          updateDataGridOptions('page', newPage + 1)
        }
        onPageSizeChange={(pageSize) => {
          updateDataGridOptions('page', 1);
          updateDataGridOptions('pageSize', pageSize);
        }}
      />

      <ConfirmDialog
        openDialog={openDeleteDialog}
        handleDialogClose={() => setOpenDeleteDialog(false)}
        handleDialogAction={handleConfirmDelete}
        title="Confirm Delete"
        message="Delete this doctor booking?"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  bookingsList: state.booking.bookingsList,
});

const mapDispatchToProps = (dispatch) => ({
  bookingsListSuccess: (data) => dispatch(bookingsListSuccess(data)),
  bookingsListFailed: () => dispatch(bookingsListFailed()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);