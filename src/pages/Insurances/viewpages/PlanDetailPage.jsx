import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlan } from "../../../apis/services/insuranceApi";

const PlanDetailPage = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const response = await fetchPlan(planId);
        setPlan(response.data.data);
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };
    loadPlan();
  }, [planId]);

  if (!plan) {
    return <Typography>Loading...</Typography>;
  }

  // 🔹 Helper to render values safely
  const renderValue = (value) => {
    if (value === null || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Plan Details
      </Typography>

      <Paper sx={{ padding: 3 }}>
        {/* =========================
            BASIC PLAN INFO
        ========================== */}
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>

        <Grid container spacing={2}>
          {Object.entries(plan)
            .filter(
              ([key]) =>
                ![
                  "categories",
                  "network",
                  "establishments",
                  "features",
                  "specialities",
                ].includes(key)
            )
            .map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Typography variant="body2">
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                  {renderValue(value)}
                </Typography>
              </Grid>
            ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* =========================
            FEATURES  ✅ NEW
        ========================== */}
        <Typography variant="h6" gutterBottom>
          Features
        </Typography>

        {plan.features?.length > 0 ? (
          <List dense>
            {plan.features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemText primary={`• ${feature}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No features available</Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* =========================
            NETWORK & COMPANY
        ========================== */}
        {plan.network && (
          <>
            <Typography variant="h6" gutterBottom>
              Network Information
            </Typography>

            <Typography>
              <strong>Network:</strong> {plan.network.name}
            </Typography>
            <Typography>
              <strong>Company:</strong> {plan.network.company?.name}
            </Typography>

            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* =========================
            SPECIALITIES  ✅ NEW
        ========================== */}
        <Typography variant="h6" gutterBottom>
          Specialities
        </Typography>

        {plan.specialities?.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {plan.specialities.map((sp) => (
              <Chip key={sp.id} label={sp.name} color="primary" />
            ))}
          </Box>
        ) : (
          <Typography>No specialities available</Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* =========================
            CATEGORIES & BENEFITS
        ========================== */}
        <Typography variant="h6" gutterBottom>
          Categories & Benefits
        </Typography>

        {Object.entries(plan.categories).map(([categoryKey, category]) => (
          <Box key={categoryKey} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {categoryKey.toUpperCase()}
            </Typography>

            <Typography variant="body2">
              <strong>Description:</strong>{" "}
              {renderValue(category.description)}
            </Typography>
            <Typography variant="body2">
              <strong>Co-Payment:</strong>{" "}
              {renderValue(category.co_payment)}
            </Typography>
            <Typography variant="body2">
              <strong>Co-Payment Info:</strong>{" "}
              {renderValue(category.co_payment_info)}
            </Typography>

            <Box sx={{ mt: 1 }}>
              {category.benefits.map((benefit) => (
                <Paper
                  key={benefit.id}
                  variant="outlined"
                  sx={{ p: 1.5, mb: 1 }}
                >
                  {Object.entries(benefit)
                    .filter(([bKey]) => !["id"].includes(bKey))
                    .map(([bKey, bValue]) => {
                      let displayKey = bKey.replace(/_/g, " ");
                      let displayValue = bValue;

                      if (bKey === "included") {
                        displayKey = "Covered";
                        displayValue = renderValue(bValue);
                      }

                      if (
                        bKey === "description" &&
                        (bValue === null || bValue === "")
                      ) {
                        displayValue = renderValue(benefit.notes);
                      }

                      return (
                        <Typography variant="body2" key={bKey}>
                          <strong>{displayKey}:</strong>{" "}
                          {renderValue(displayValue)}
                        </Typography>
                      );
                    })}
                </Paper>
              ))}
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* =========================
            ESTABLISHMENTS
        ========================== */}
        <Typography variant="h6" gutterBottom>
          Establishments
        </Typography>

        {plan.establishments?.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {plan.establishments.map((est) => (
              <Chip key={est.id} label={est.name} />
            ))}
          </Box>
        ) : (
          <Typography>No establishments available</Typography>
        )}
      </Paper>

      {/* BACK BUTTON */}
      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default PlanDetailPage;
