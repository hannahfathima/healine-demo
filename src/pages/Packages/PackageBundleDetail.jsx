// ===========================================
// PackageBundleDetail.jsx
// View-only detail page for Package Bundle
// ===========================================

import React, { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Box,
    Paper,
    Divider,
    Button,
    Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchList } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";

const PackageBundleDetail = () => {
    const { bundleId } = useParams();
    const navigate = useNavigate();
    const [bundle, setBundle] = useState(null);

    useEffect(() => {
        const loadBundle = async () => {
            try {
                const res = await fetchList(
                    `${ApiEndPoints.PACKAGE_BUNDLES}/${bundleId}`
                );
                if (res.status === 200) {
                    setBundle(res.data);
                }
            } catch (err) {
                console.error("Failed to load bundle", err);
            }
        };
        loadBundle();
    }, [bundleId]);

    if (!bundle) return <Typography>Loading...</Typography>;

    // 🔹 Helper (same idea as your PlanDetailPage)
    const renderValue = (value) => {
        if (value === null || value === "") return "—";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        return value;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Bundle Details
            </Typography>

            <Paper sx={{ p: 3 }}>
                {/* =====================
            BASIC INFO
        ====================== */}
                <Typography variant="h6" gutterBottom>
                    Basic Information
                </Typography>
                {bundle.image && (
                    <Box
                        sx={{
                            mb: 3,
                            display: "flex",
                            justifyContent: "start",
                        }}
                    >
                        <Box
                            component="img"
                            src={bundle.image}
                            alt={bundle.name}
                            sx={{
                                width: "200px",
                                maxWidth: 150,
                                height: 150,
                                objectFit: "cover",
                                borderRadius: 2,
                                border: "1px solid #e0e0e0",
                            }}
                        />
                    </Box>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <strong>ID:</strong> {bundle.id}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Name:</strong> {bundle.name}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Sub Title:</strong> {bundle.sub_title}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Label:</strong> {bundle.label}
                    </Grid>
                    <Grid item xs={12}>
                        <strong>Description:</strong> {bundle.description}
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* =====================
            PRICING
        ====================== */}
                <Typography variant="h6" gutterBottom>
                    Pricing
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <strong>Base Price:</strong> AED {bundle.base_price}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <strong>Strike Price:</strong> AED {bundle.strike_price}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <strong>Selling Price:</strong> AED {bundle.selling_price}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Validity Days:</strong> {bundle.validity_days}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Visible:</strong> {renderValue(bundle.visible)}
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* =====================
            CATEGORY & ESTABLISHMENT
        ====================== */}
                <Typography variant="h6" gutterBottom>
                    Classification
                </Typography>

                <Typography>
                    <strong>Category:</strong> {bundle.category?.name || "—"}
                </Typography>
                <Typography>
                    <strong>Establishment:</strong>{" "}
                    {bundle.establishment?.name || "—"}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* =====================
            PACKAGES INSIDE BUNDLE
        ====================== */}
                <Typography variant="h6" gutterBottom>
                    Included Packages
                </Typography>

                {bundle.packages?.length > 0 ? (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {bundle.packages.map((pkg) => (
                            <Chip
                                key={pkg.id}
                                label={`${pkg.name} (AED ${pkg.selling_price})`}
                            />
                        ))}
                    </Box>
                ) : (
                    <Typography>No packages added</Typography>
                )}
            </Paper>

            {/* BACK */}
            <Box sx={{ mt: 3, textAlign: "right" }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default PackageBundleDetail;
