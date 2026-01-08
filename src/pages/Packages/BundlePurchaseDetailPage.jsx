
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchList } from "../../../src/apis/services/CommonApiService";
import { ApiEndPoints } from "../../../src/apis/ApiEndPoints";

const BundlePurchaseDetailPage = () => {
  const { purchaseId } = useParams(); 
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPurchaseDetail = useCallback(async (id) => {
    try {
      setLoading(true);

      const result = await fetchList(
        `${ApiEndPoints.PACKAGE_PURCHASE_LIST}/${id}`
      );

      if (result?.status === 200) {
        setPurchase(result.data);
      } else {
        toast.error("Failed to fetch purchase details");
        navigate("/package-bundles");
      }
    } catch (error) {
      toast.error("Failed to fetch purchase details");
      navigate("/package-bundles");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (purchaseId) {
      getPurchaseDetail(purchaseId);
    }
  }, [purchaseId, getPurchaseDetail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!purchase) {
    return null;
  }

  return (
    <div className="min-width">
      {/* PAGE HEADER */}
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">
          View Bundle Purchase
        </h4>
      </div>

      {/* DETAILS GRID */}
      <Grid container spacing={2} alignItems="flex-start">

        <Grid item lg={6}>
          <Typography className="label">Purchase ID</Typography>
          <Typography className="value">{purchase.id}</Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Customer Name</Typography>
          <Typography className="value">
            {purchase.customer_name || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Customer ID</Typography>
          <Typography className="value">
            {purchase.customer_id || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Package Name</Typography>
          <Typography className="value">
            {purchase.package_name || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Package ID</Typography>
          <Typography className="value">
            {purchase.package_id || "-"}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Selling Price</Typography>
          <Typography className="value">
            AED {purchase.selling_price}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Status</Typography>
          <Typography className="value">
            {purchase.status}
          </Typography>
        </Grid>

        <Grid item lg={6}>
          <Typography className="label">Purchase Date</Typography>
          <Typography className="value">
            {new Date(purchase.purchase_date).toLocaleString()}
          </Typography>
        </Grid>

        {/* OPTIONAL: PAYMENT INFO */}
        {purchase.payment_method && (
          <Grid item lg={6}>
            <Typography className="label">Payment Method</Typography>
            <Typography className="value">
              {purchase.payment_method}
            </Typography>
          </Grid>
        )}

        {purchase.transaction_id && (
          <Grid item lg={6}>
            <Typography className="label">Transaction ID</Typography>
            <Typography className="value">
              {purchase.transaction_id}
            </Typography>
          </Grid>
        )}

      </Grid>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginRight: "20px",
          marginBottom: "20px",
          borderTop: "2px solid",
          marginTop: "20px",
          paddingTop: "20px",
        }}
      >
        <Button
          size="large"
          variant="contained"
          disableElevation
          onClick={() => navigate(-1)}
          style={{
            justifyContent: "center",
            width: "98px",
            height: "44px",
            textTransform: "capitalize",
            background:
              "linear-gradient(180deg, #255480 0%, #173450 100%)",
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default BundlePurchaseDetailPage;
