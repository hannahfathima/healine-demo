import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-toastify';
import { fetchList, createRecord } from '../../apis/services/CommonApiService';
import { ApiEndPoints } from '../../apis/ApiEndPoints';

const useStyles = makeStyles({
  label: {
    marginBottom: '11px',
    color: '#1E1E1E',
    fontSize: '16px',
    fontWeight: '500',
  },
  value: {
    color: '#000',
    paddingLeft: '5px',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'end',
    marginRight: '20px',
    marginBottom: '20px',
    borderTop: '2px solid',
    marginTop: '20px',
    paddingTop: '20px',
  },
  backBtn: {
    justifyContent: 'center',
    width: '98px',
    height: '44px',
    textTransform: 'capitalize',
    background: 'linear-gradient(180deg, #255480 0%, #173450 100%)',
  },
  commentSection: {
    marginTop: '20px',
    marginBottom: '20px',
  },
});

const ViewBooking = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { bookingId } = useParams();
  const [bookingDetail, setBookingDetail] = useState({});
  const [comment, setComment] = useState('');
  const [latestComment, setLatestComment] = useState(null); // Store the latest comment
  const [status, setStatus] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);

  const statusOptions = ['Pending', 'Confirmed', 'Cancelled'];

  const fetchBookingDetail = async () => {
    const result = await fetchList(`${ApiEndPoints.BOOKING}/${bookingId}`);
    if (result.status === 200) {
      const data = result.data;
      setBookingDetail(data);
      // Ensure status is a valid string, default to 'pending' if unknown
      setStatus(statusOptions.includes(data.status) ? data.status : 'pending');
      // Handle comments as a single value or array, take the latest if array
      const comments = data.comments;
      if (comments) {
        if (Array.isArray(comments)) {
          setLatestComment(comments.length > 0 ? comments[comments.length - 1] : null);
        } else {
          setLatestComment({ text: comments, created_at: new Date().toISOString() });
        }
      } else {
        setLatestComment(null);
      }
    } else {
      toast.error(result.message || 'Failed to fetch booking details');
    }
  };

  useEffect(() => {
    fetchBookingDetail();
  }, [bookingId]);

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    const data = { comment: comment.trim() };
    const result = await createRecord(data, `${ApiEndPoints.BOOKING}/${bookingId}/comment`);
    if (result.status === 200) {
      await fetchBookingDetail(); // Refresh to get the new comment
      setComment(''); // Clear the input
      toast.success('Comment added successfully');
    } else {
      toast.error(result.message || 'Failed to add comment');
    }
  };

  // ----------------------
  // UPDATED STATUS FUNCTION
  // ----------------------
  // UPDATED STATUS FUNCTION
  // ----------------------
  const handleUpdateStatus = async () => {
    if (!statusOptions.includes(status)) {
      toast.error('Invalid status selected');
      return;
    }

    const url = `${ApiEndPoints.UPDATE_BOOKING_STATUS}/${bookingId}/comment`;

    const data = { status: status }; // backend required body

    const result = await createRecord(data, url, "PATCH"); // IMPORTANT: USE PATCH

    if (result.status === 200) {
      toast.success('Status updated successfully');
      setEditingStatus(false);
      await fetchBookingDetail(); // reload
    } else {
      toast.error(result.message || 'Failed to update status');
    }
  };


  const getStatusText = (statusValue) => {
    // Handle undefined or null statusValue
    if (!statusValue) return 'Unknown';
    return statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
  };

  return (
    <div className="min-width">
      <div className="d-flex mt-2rem mb-2 pb-2" style={{ borderBottom: '2px solid', alignItems: 'baseline' }}>
        <h4 className="pagename-heading ml-0">View Booking Details</h4>
      </div>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4}>
          <Typography className={classes.label}>Booking ID</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.id}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Name</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.patient_name}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Number</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.patient_number}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Age</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.patient_age}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Gender</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.patient_gender}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Doctor Name</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.doctor_details?.name || 'N/A'}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Doctor Specialty</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.doctor_details?.speciality || 'N/A'}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Hospital Name</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.hospital_details?.name || 'N/A'}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Hospital Address</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.hospital_details?.address || 'N/A'}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Booking Date</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.booking_date}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Time Slot</Typography>
          <Typography className={classes.value} variant="subtitle1">{bookingDetail?.time_slot}</Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Status</Typography>
          {editingStatus ? (
            <>
              <FormControl fullWidth>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={handleUpdateStatus} style={{ marginTop: '10px' }}>Save</Button>
              <Button onClick={() => { setEditingStatus(false); setStatus(bookingDetail?.status || 'pending'); }} style={{ marginTop: '10px', marginLeft: '10px' }}>Cancel</Button>
            </>
          ) : (
            <>
              <Typography className={classes.value} variant="subtitle1">
                {getStatusText(bookingDetail?.status)}
              </Typography>
              <Button onClick={() => setEditingStatus(true)} style={{ marginTop: '10px' }}>Edit Status</Button>
            </>
          )}
        </Grid>
        <Grid item lg={4} className={classes.commentSection}>
          <Typography className={classes.label}>Comments</Typography>
          {latestComment ? (
            <Typography className={classes.value} variant="subtitle1">
              {latestComment.text || latestComment.comment}
            </Typography>
          ) : (
            <Typography className={classes.value} variant="subtitle1">No comments yet</Typography>
          )}
          <TextField
            fullWidth
            label="Add Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ marginTop: '10px' }}
          />
          <Button
            variant="contained"
            onClick={handleAddComment}
            style={{ marginTop: '10px', background: 'linear-gradient(180deg, #255480 0%, #173450 100%)' }}
          >
            ADD COMMENT
          </Button>
        </Grid>
      </Grid>
      <div className={classes.buttonWrapper}>
        <Grid item xs={2}>
          <Button
            className={classes.backBtn}
            size="large"
            variant="contained"
            disableElevation
            onClick={() => navigate('/bookings')}
          >
            Back
          </Button>
        </Grid>
      </div>
    </div>
  );
};

export default ViewBooking;