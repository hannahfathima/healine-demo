import { Button, Checkbox, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { getRecord } from "../../apis/services/CommonApiService";
import { Routing } from "../../shared/constants/routing";
import {
  professionDetailFailed,
  professionDetailSuccess,
} from "../../store/reducers/establishmentSlice";
import {
  professionsDetailFailed,
  professionsDetailSuccess,
} from "../../store/reducers/professionSlice";
import { getMonthName } from "../../utils/helper";

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

function ViewProfession(props) {
  const {
    professionDetail,
    professionsDetailSuccess,
    professionsDetailFailed,
  } = props;
  const navigate = useNavigate();
  const classes = useStyles();
  let { professionId } = useParams();
  const getProfessionDetail = useCallback(
    async (professionId) => {
      const result = await getRecord(
        professionId,
        ApiEndPoints.PROFESSION_RESOURCE_ROUTE
      );
      if (result.status === 200) {
        professionsDetailSuccess(result.data);
      } else {
        professionsDetailFailed();
      }
    },
    [professionId]
  );

  useEffect(() => {
    getProfessionDetail(professionId);
  }, [professionId, getProfessionDetail]);

  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">View Professionals Detail</h4>
      </div>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid item lg={4}>
          <Typography className={classes.label}>First Name</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.first_name}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Last Name</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.last_name}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Email</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.email}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Phone</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.phone}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>License Number</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.licence_no}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Nationality</Typography>
          <Typography className={classes.value} variant="subtitle1">
            <img
              src={professionDetail?.nationalityInfo?.icon}
              alt={professionDetail?.nationalityInfo?.name}
              style={{ height: "40px", width: "40px" }}
            />{" "}
            {professionDetail?.nationalityInfo?.name}
          </Typography>
        </Grid>
        {/* <Grid item lg={4}>
          <Typography className={classes.label}>Specialist</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.specialist}
          </Typography>
        </Grid> */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Designation</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.designation}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Photo</Typography>
          <img
            src={professionDetail?.photo}
            alt={professionDetail?.name}
            style={{ height: "50px", width: "75px" }}
          />
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>
            Educational Qualification
          </Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.educational_qualification}
          </Typography>
        </Grid>
        {/* <Grid item lg={4}>
          <Typography className={classes.label}>Working Since Month</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {getMonthName(professionDetail?.working_since_month)}
          </Typography>
        </Grid> */}
        <Grid item lg={4}>
          <Typography className={classes.label}>Working Since Year</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.working_since_year}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Profession Type</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.professionTypeInfo?.name}
          </Typography>
        </Grid>

        <Grid item lg={4}>
          <Typography className={classes.label}>Specialities</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.specialitiesList
              .map((item) => item.name.name)
              .join(", ")}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Languages</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.languagesList
              .map((item) => item.languageInfo.language)
              .join(", ")}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Expert in</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {/* {professionDetail?.servicesList
              .map((item) => item.serviceInfo.service)
              .join(", ")} */}
            {professionDetail?.expert_in}
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <Typography className={classes.label}>Place Of Work</Typography>
          <Typography className={classes.value} variant="subtitle1">
            {professionDetail?.professionsEstablishmentList
              .map((item) => item.establishmentInfo.name)
              .join(", ")}
          </Typography>
        </Grid>
      </Grid>

      <div className={classes.buttonWrapper}>
        <Grid item xs={2}>
          <Button
            className={(classes.buttonWrapper, "mt - 1")}
            size="large"
            variant="contained"
            disableElevation
            onClick={() => {
              navigate("/professionals");
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
  professionDetail: state.profession.professionDetail,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    professionsDetailSuccess: (data) =>
      dispatch(professionsDetailSuccess(data)),
    professionsDetailFailed: () => dispatch(professionsDetailFailed()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfession);
