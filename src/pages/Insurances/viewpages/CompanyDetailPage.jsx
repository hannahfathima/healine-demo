import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Paper, Divider, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCompany } from "../../../apis/services/insuranceApi";
import { makeStyles } from "@mui/styles"; // Import makeStyles for custom styles

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
        fontWeight: "300",
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "flex-end",
        marginRight: "20px",
        marginBottom: "20px",
        borderTop: "2px solid #B4ADAD",
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

const CompanyDetailPage = () => {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();
    const classes = useStyles(); // Use custom styles

    useEffect(() => {
        const loadCompany = async () => {
            try {
                const response = await fetchCompany(companyId);
                if (response.data.success) {
                    setCompany(response.data.data);
                } else {
                    console.error("Failed to fetch company details");
                }
            } catch (error) {
                console.error("Error fetching company details:", error);
            }
        };
        loadCompany();
    }, [companyId]);

    if (!company) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Company Details</Typography>
            <Paper sx={{ padding: 2 }}>
                {/* Company Information */}
                <Grid item lg={4}>
                    <Typography className={classes.label}>Logo</Typography>
                    <img
                        src={company.logo_url}
                        alt={company.name}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                </Grid>
                <Grid container spacing={2}>
                    <Grid item lg={4}>
                        <Typography className={classes.label}>Company Name</Typography>
                        <Typography className={classes.value} variant="subtitle1">
                            {company.name}
                        </Typography>
                    </Grid>
                    <Grid item lg={4}>
                        <Typography className={classes.label}>Email</Typography>
                        <Typography className={classes.value} variant="subtitle1">
                            {company.email}
                        </Typography>
                    </Grid>
                    <Grid item lg={4}>
                        <Typography className={classes.label}>Contact Number</Typography>
                        <Typography className={classes.value} variant="subtitle1">
                            {company.contact_number}
                        </Typography>
                    </Grid>

                </Grid>

                <Divider sx={{ marginY: 2 }} />

                {/* Network Information */}
                <Typography variant="h6" gutterBottom>Networks</Typography>
                {company.networks && company.networks.length > 0 ? (
                    <Grid container spacing={2}>
                        {company.networks.map((network) => (
                            <Grid item xs={12} key={network.id}>
                                <Paper sx={{ padding: 2 }}>
                                    <Typography variant="body1"><strong>Network Name:</strong> {network.name}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No networks available.</Typography>
                )}
            </Paper>

            {/* Back Button */}
            <div className={classes.buttonWrapper}>
                <Button
                    className={classes.backBtn}
                    variant="contained"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </div>
        </Box>
    );
};

export default CompanyDetailPage;
