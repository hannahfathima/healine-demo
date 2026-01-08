import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Paper, Divider, Button, Avatar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchNetwork } from "../../../apis/services/insuranceApi"; // Adjust the API import to your actual API service

const NetworkDetailPage = () => {
    const { networkId } = useParams();
    const [network, setNetwork] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadNetwork = async () => {
            try {
                const response = await fetchNetwork(networkId);
                setNetwork(response.data.data); // Adjusted for actual response data structure
            } catch (error) {
                console.error("Error fetching network details:", error);
            }
        };
        loadNetwork();
    }, [networkId]);

    if (!network) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Network Details</Typography>

            <Paper sx={{ padding: 2 }}>
                {/* Network Name */}

                <Typography variant="h6">{network.name}</Typography>
                <Divider sx={{ marginY: 2 }} />

                {/* Company Details */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1"><strong>Logo:</strong></Typography>
                        <Avatar
                            alt={network.company?.name}
                            src={network.company?.logo_url}
                            sx={{ width: 100, height: 100 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Company:</strong> {network.company?.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1"><strong>Company Description:</strong> {network.company?.description}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1"><strong>Email:</strong> {network.company?.email}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1"><strong>Contact Number:</strong> {network.company?.contact_number}</Typography>
                    </Grid>

                </Grid>

                <Divider sx={{ marginY: 2 }} />

                {/* Related Plans */}
                <Typography variant="h6" gutterBottom>Related Plans</Typography>
                {network.plans && network.plans.length > 0 ? (
                    <Grid container spacing={2}>
                        {network.plans.map((plan) => (
                            <Grid item xs={12} key={plan.id}>
                                <Paper sx={{ padding: 2 }}>
                                    <Typography variant="body1"><strong>{plan.name}</strong></Typography>
                                    <Typography variant="body2" sx={{ marginLeft: 2 }}><strong>Annual Limit:</strong> {plan.annual_limit}</Typography>
                                    <Typography variant="body2" sx={{ marginLeft: 2 }}><strong>Area of Cover:</strong> {plan.area_of_cover}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No plans available for this network.</Typography>
                )}
            </Paper>

            {/* Back Button */}
            <Box sx={{ marginTop: 2, textAlign: "right" }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
            </Box>
        </Box>
    );
};

export default NetworkDetailPage;
