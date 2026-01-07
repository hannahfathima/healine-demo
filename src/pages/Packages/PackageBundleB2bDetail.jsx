import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const PackageBundleB2bDetail = () => {
  const { id } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [rowDetails, setRowDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchSubscriptionDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}b2b/b2b-subscriptions/${id}`
        );
        const result = await response.json();

        if (result?.success && isMounted) {
          // 🔧 CHANGE #1: normalize CUSTOMERS array (API sends customers, not coupons)
          setSubscription({
            ...result.data,
            customers: Array.isArray(result.data?.customers)
              ? result.data.customers
              : [],
          });
        }
      } catch (error) {
        console.error("Error fetching B2B subscription details:", error);
      } finally {
        isMounted && setLoading(false);
      }
    };

    if (id) fetchSubscriptionDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleRowClick = async (empId) => {
    if (expandedRow === empId) {
      setExpandedRow(null);
      return;
    }

    setExpandedRow(empId);

    if (!rowDetails[empId]) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}b2b/b2b-employee-details/${empId}`
        );
        const result = await response.json();

        if (result?.success) {
          setRowDetails((prev) => ({ ...prev, [empId]: result.data }));
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Subscription not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        B2B Subscription Details
      </Typography>

      <Paper sx={{ padding: 3 }}>
        {/* =========================
            BASIC SUBSCRIPTION INFO
        ========================== */}
        <Typography variant="h6" gutterBottom>
          Subscription Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Company Name:</strong>{" "}
              {subscription.company_name || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Bundle ID:</strong> {subscription.bundle_id || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Bundle Name:</strong>{" "}
              {subscription.bundle?.name || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Employee Count:</strong>{" "}
              {subscription.employee_count ?? "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Total Price:</strong>{" "}
              ₹{Number(subscription.total_price || 0).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Coupon Code:</strong>{" "}
              {subscription.coupon_code || "—"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Payment Status:</strong>{" "}
              <Chip
                label={(subscription.payment_status || "unknown").toUpperCase()}
                color={
                  subscription.payment_status === "paid"
                    ? "success"
                    : subscription.payment_status === "pending"
                    ? "warning"
                    : "error"
                }
                size="small"
              />
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Created At:</strong>{" "}
              {formatDate(subscription.created_at)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Updated At:</strong>{" "}
              {formatDate(subscription.updated_at)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* =========================
            EMPLOYEE CUSTOMERS
        ========================== */}
        <Typography variant="h6" gutterBottom>
          Employees ({subscription.customers.length})
        </Typography>

        {subscription.customers.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Country</strong></TableCell>
                  <TableCell><strong>Designation</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subscription.customers.map((emp) => (
                  <React.Fragment key={emp.id}>
                    <TableRow 
                      onClick={() => handleRowClick(emp.id)}
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell>{emp.employee_name || "—"}</TableCell>
                      <TableCell>
                        {emp.country_code} {emp.employee_phone}
                      </TableCell>
                      <TableCell>{emp.country_code || "—"}</TableCell>
                      <TableCell>{emp.designation || "—"}</TableCell>
                      <TableCell>
                        <Chip
                          label={(emp.status || "unknown").toUpperCase()}
                          color={
                            emp.status === "available" ? "primary" : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(emp.created_at)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedRow === emp.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1, backgroundColor: 'grey.100', p: 2 }}>
                            {rowDetails[emp.id] ? (
                              <>
                                {/* Employee Details */}
                                <Typography variant="subtitle1" gutterBottom>
                                  Employee Details
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>ID:</strong> {rowDetails[emp.id].employee?.id || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Name:</strong> {rowDetails[emp.id].employee?.name || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Phone:</strong> {rowDetails[emp.id].employee?.phone || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Country Code:</strong> {rowDetails[emp.id].employee?.country_code || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Designation:</strong> {rowDetails[emp.id].employee?.designation || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Coupon Code:</strong> {rowDetails[emp.id].employee?.coupon_code || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Status:</strong>{" "}
                                      <Chip
                                        label={(rowDetails[emp.id].employee?.status || "unknown").toUpperCase()}
                                        color={
                                          rowDetails[emp.id].employee?.status === "available" ? "primary" : "success"
                                        }
                                        size="small"
                                      />
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Claimed At:</strong> {formatDate(rowDetails[emp.id].employee?.claimed_at)}
                                    </Typography>
                                  </Grid>
                                </Grid>

                                {/* Bundle Summary */}
                                <Typography variant="subtitle1" gutterBottom>
                                  Bundle Summary
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Bundle Name:</strong> {rowDetails[emp.id].bundle_summary?.bundle_name || "—"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Status:</strong>{" "}
                                      <Chip
                                        label={(rowDetails[emp.id].bundle_summary?.status || "unknown").toUpperCase()}
                                        color="primary"
                                        size="small"
                                      />
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Purchase Date:</strong> {formatDate(rowDetails[emp.id].bundle_summary?.purchase_date)}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography>
                                      <strong>Expiration Date:</strong> {formatDate(rowDetails[emp.id].bundle_summary?.expiration_date)}
                                    </Typography>
                                  </Grid>
                                </Grid>

                                {/* Packages */}
                                <Typography variant="subtitle1" gutterBottom>
                                  Packages ({rowDetails[emp.id].packages?.length || 0})
                                </Typography>
                                {rowDetails[emp.id].packages?.length > 0 ? (
                                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell><strong>Package ID</strong></TableCell>
                                          <TableCell><strong>Package Name</strong></TableCell>
                                          <TableCell><strong>Total Qty</strong></TableCell>
                                          <TableCell><strong>Remaining Qty</strong></TableCell>
                                          <TableCell><strong>Used Qty</strong></TableCell>
                                          <TableCell><strong>Status</strong></TableCell>
                                          <TableCell><strong>Usage Date</strong></TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {rowDetails[emp.id].packages.map((pkg, index) => (
                                          <TableRow key={pkg.package_id || index}>
                                            <TableCell>{pkg.package_id || "—"}</TableCell>
                                            <TableCell>{pkg.package_name || "—"}</TableCell>
                                            <TableCell>{pkg.total_qty || 0}</TableCell>
                                            <TableCell>{pkg.remaining_qty || 0}</TableCell>
                                            <TableCell>{pkg.used_qty || 0}</TableCell>
                                            <TableCell>
                                              <Chip
                                                label={(pkg.status || "unknown").toUpperCase()}
                                                color="success"
                                                size="small"
                                              />
                                            </TableCell>
                                            <TableCell>
                                              {pkg.used_qty > 0 && pkg.usage_history?.length > 0 
                                                ? formatDate(pkg.usage_history[0].usage_date) 
                                                : "—"
                                              }
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                ) : (
                                  <Typography>No packages found.</Typography>
                                )}
                              </>
                            ) : (
                              <Typography>Loading details...</Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No employees found for this subscription.</Typography>
        )}
      </Paper>

      {/* BACK BUTTON */}
      <Box sx={{ mt: 4, textAlign: "right" }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default PackageBundleB2bDetail;