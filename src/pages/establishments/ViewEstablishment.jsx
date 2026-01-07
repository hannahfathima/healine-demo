import {
  Button,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { connect } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { getRecord } from "../../apis/services/CommonApiService";
import { Routing } from "../../shared/constants/routing";
import {
  establishmentDetailFailed,
  establishmentDetailSuccess,
} from "../../store/reducers/establishmentSlice";

const useStyles = makeStyles({
  label: {
    marginBottom: "11px",
    color: "#1E1E1E",
    fontSize: "16px",
    fontWeight: "500",
  },
  value: {
    color: "#000",
    paddingLeft: "5px",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "end",
    marginRight: "20px",
    marginBottom: "20px",
    borderTop: "2px solid",
    marginTop: "20px",
    paddingTop: "20px",
  },
  backBtn: {
    justifyContent: "center",
    width: "98px",
    height: "44px",
    textTransform: "capitalize",
    background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
  },
});

function ViewEstablishment(props) {
  const {
    establishmentDetail,
    establishmentDetailSuccess,
    establishmentDetailFailed,
  } = props;
  const navigate = useNavigate();
  const classes = useStyles();
  let { establishmentId } = useParams();
  const getEstablishmentDetail = useCallback(
    async (establishmentId) => {
      const result = await getRecord(establishmentId, ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE);

      if (result.status === 200) {
        establishmentDetailSuccess(result.data);
      } else {
        establishmentDetailFailed();
        <Navigate to={Routing.Establishment} />;
      }
    },
    [establishmentId]
  );

  useEffect(() => {
    getEstablishmentDetail(establishmentId);
  }, [establishmentId, getEstablishmentDetail]);

  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">View Establishment Detail</h4>
      </div>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4}>
          <Typography className={classes.label}>Name</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.name}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Email</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.email}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Contact Number</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.contact_number}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>License Number</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.licence_no}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Establishment Type</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.establishmentTypeInfo?.name}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>
            Establishment Sub Type
          </Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.establishmentSubTypeInfo?.name}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Photo</Typography>
          <img
            src={establishmentDetail?.primary_photo}
            alt={establishmentDetail?.name}
            style={{ height: "50px", width: "75px" }}
          />
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Address</Typography>
          <Typography className={classes.value} variant="subtitle1">
            <a
              rel="noopener noreferrer"
              href={`https://maps.google.com/?q=${establishmentDetail?.latitude},${establishmentDetail?.longitude}`}
              target="_blank"
            >
              {establishmentDetail?.address}
            </a>
            {/* <Link
              target="_blank"
              to={`https://maps.google.com/?q=${establishmentDetail?.latitude},${establishmentDetail?.longitude}`}
            >
              {establishmentDetail?.address}
            </Link> */}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Latitude</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.latitude}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Longitude</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.longitude}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Zone</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.zoneInfo?.name}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>City</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.cityInfo?.name}
          </Typography>
        </Grid>
        {/* <Grid item lg={4}>
          <Typography className={classes.label}>Pin Code</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.pin_code}
          </Typography>
        </Grid> */}
        <Grid item lg={4}>
          <Typography className={classes.label}>
            Establishment Images
          </Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.imageList.map((item) => {
              return (
                <>
                  <img
                    src={item.image}
                    alt={establishmentDetail?.name}
                    style={{
                      height: "50px",
                      width: "75px",
                      marginRight: "5px",
                    }}
                  />
                </>
              );
            })}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Facilities</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.facilitiesList
              .map((item) => item.name.name)
              .join(", ")}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Specialities</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.specialitiesList
              .map((item) => item.name.name)
              .join(", ")}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Services</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.servicesList
              .map((item) => item?.name?.name)
              .filter(Boolean)
              .join(", ") || ""}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Establishment Departments</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.departmentList
              .map((item) => item?.departmentInfo?.name)
              .filter(Boolean)
              .join(", ") || ""}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>
            Is Establishment 24 x 7 working
          </Typography>
          <Typography className={classes.value} variant="subtitle1">
            {establishmentDetail?.is_24_by_7_working == 1 ? "Yes" : "No"}{" "}
          </Typography>
        </Grid>
      </Grid>

      {/* <Grid container spacing={2} sx={{ marginTop: 2, paddingX: 2 }}>
        <Typography className={classes.label}>
          Establishment Working Hours
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                >
                  DAY
                </TableCell>
                <TableCell
                  style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                >
                  START TIME
                </TableCell>
                <TableCell
                  style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                >
                  END TIME
                </TableCell>
                <TableCell
                  style={{ minWidth: "140px", border: "1px solid #B4ADAD" }}
                >
                  IS DAY OFF
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {establishmentDetail?.newWorkingHoursDetails.map(
                (item, index) => (
                  <>
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell style={{ border: "1px solid #B4ADAD" }}>
                        <Grid item lg={12}>
                          <Typography
                            className={classes.value}
                            variant="subtitle1"
                          >
                            {item?.day_of_week_name}
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell style={{ border: "1px solid #B4ADAD" }}>
                        <Grid item lg={12}>
                          <Typography
                            className={classes.value}
                            variant="subtitle1"
                          >
                            {item?.start_time}
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell style={{ border: "1px solid #B4ADAD" }}>
                        <Grid item lg={12}>
                          <Typography
                            className={classes.value}
                            variant="subtitle1"
                          >
                            {item?.end_time}
                          </Typography>
                        </Grid>
                      </TableCell>
                      <TableCell style={{ border: "1px solid #B4ADAD" }}>
                        <Grid item lg={12}>
                          <Typography
                            className={classes.value}
                            variant="subtitle1"
                          >
                            {item?.is_day_off == 1 ? "Yes" : "No"}
                          </Typography>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid> */}

      <div className={classes.buttonWrapper}>
        <Grid item xs={2}>
          <Button
            className={(classes.buttonWrapper, "mt - 1")}
            size="large"
            variant="contained"
            disableElevation
            onClick={() => {
              navigate("/establishments");
            }}
            color="primary"
            style={{}}
          >
            Back
          </Button>
        </Grid>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  establishmentDetail: state.establishment.establishmentDetail,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    establishmentDetailSuccess: (data) =>
      dispatch(establishmentDetailSuccess(data)),
    establishmentDetailFailed: () => dispatch(establishmentDetailFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewEstablishment);
