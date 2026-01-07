import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, Typography, TextField, Select, MenuItem, FormControl } from '@mui/material';
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

const ViewServiceBooking = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const { bookingId } = useParams();
  console.log("bookingId:", bookingId);

  const [bookingDetail, setBookingDetail] = useState({});
  const [comment, setComment] = useState('');
  const [latestComment, setLatestComment] = useState(null);
  const [status, setStatus] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);

  const statusOptions = ['pending', 'confirmed', 'cancelled', 'sample_collected', 'report_delivered'];
  const statusMap = {
    0: 'pending',
    '0': 'pending',
    1: 'confirmed',
    '1': 'confirmed',
    2: 'cancelled',
    '2': 'cancelled',
    3: 'sample_collected',
    '3': 'sample_collected',
    4: 'report_delivered',
    '4': 'report_delivered',
  };
  const reverseStatusMap = {
    pending: 0,
    confirmed: 1,
    cancelled: 2,
    sample_collected: 3,
    report_delivered: 4,
  };

  const fetchBookingDetail = async () => {
    try {
      const result = await fetchList(`${ApiEndPoints.PACKAGE_BOOKINGS}/${bookingId}`);
      if (result.status === 200 && result.data) {
        const data = result.data;
        setBookingDetail(data);

        // Map status from numeric to string
        setStatus(statusMap[data.booking_status] || 'pending');

        // Handle comments
        const comments = data.comments;
        if (comments) {
          if (Array.isArray(comments)) {
            setLatestComment(comments.length > 0 ? comments[comments.length - 1] : null);
          } else if (typeof comments === 'string') {
            setLatestComment({ text: comments, created_at: new Date().toISOString() });
          } else if (typeof comments === 'object') {
            setLatestComment(comments);
          }
        } else {
          setLatestComment(null);
        }
      } else {
        toast.error(result.message || 'Failed to fetch service booking details');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to fetch service booking details');
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId]);

  // ✅ Add Comment API Integration
  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const data = { comment: comment.trim() };
      const result = await createRecord(data, `${ApiEndPoints.PACKAGE_BOOKINGS}/${bookingId}`);

      if (result.status === 200) {
        await fetchBookingDetail();
        setComment('');
        toast.success('Comment added successfully');
      } else {
        toast.error(result.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  // ✅ Update Status API Integration
  const handleUpdateStatus = async () => {
    if (!statusOptions.includes(status)) {
      toast.error('Invalid status selected');
      return;
    }

    try {
      const data = { status: String(reverseStatusMap[status]) };
      const result = await createRecord(data, `${ApiEndPoints.PACKAGE_BOOKINGS}/${bookingId}`);

      if (result.status === 200) {
        toast.success('Status updated successfully');
        setEditingStatus(false);
        await fetchBookingDetail();
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusText = (statusValue) => {
    const mappedStatus = statusMap[statusValue];
    if (!mappedStatus) return 'Unknown';
    return mappedStatus.charAt(0).toUpperCase() + mappedStatus.slice(1);
  };


  return (
    <div className="min-width">
      <div className="d-flex mt-2rem mb-2 pb-2" style={{ borderBottom: '2px solid', alignItems: 'baseline' }}>
        <h4 className="pagename-heading ml-0">View Service Booking Details</h4>
      </div>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4}>
          <Typography className={classes.label}>Booking ID</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.id || 'N/A'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Name</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.patient_name || 'N/A'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Number</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.patient_number || 'N/A'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Patient Age</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.patient_age}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Package ID</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.package_id || 'N/A'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Addons</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.addons_snapshot?.length > 0
              ? bookingDetail.addons_snapshot.map(addon => addon.name).join(', ')
              : 'No Addons'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Customer Address</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.customer_address_snapshot?.address || 'N/A'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Booking Date</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.booked_date || 'N/A'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Time Slot</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.slot || 'N/A'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Package Price (AED)</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.package_price || '0.00'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Addons Price (AED)</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.addons_price || '0.00'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Total Price (AED)</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.total_price || '0.00'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Discount (AED)</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.discount_price || '0.00'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Home Collection</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.home_collection ? 'Yes' : 'No'}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Payment Method</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {bookingDetail?.payment_method || 'N/A'}
          </Typography>
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
              <Button
                onClick={() => {
                  setEditingStatus(false);
                  setStatus(statusMap[bookingDetail?.booking_status] || 'pending');
                }}
                style={{ marginTop: '10px', marginLeft: '10px' }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography className={classes.value} variant="subtitle1">
                {getStatusText(bookingDetail?.booking_status)}
              </Typography>
              <Button onClick={() => setEditingStatus(true)} style={{ marginTop: '10px' }}>
                Edit Status
              </Button>
            </>
          )}
        </Grid>
        <Grid item lg={12} className={classes.commentSection}>
          <Typography className={classes.label}>Comments</Typography>
          {latestComment ? (
            <Typography className={classes.value} variant="subtitle1">
              {latestComment.text || latestComment.comment || latestComment}
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
            multiline
            rows={3}
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

export default ViewServiceBooking;
