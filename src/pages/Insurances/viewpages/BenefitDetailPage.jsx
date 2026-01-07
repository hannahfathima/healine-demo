import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Paper, Divider, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBenefit } from "../../apis/services/insuranceApi"; // Adjust the API import to your actual API service

const BenefitDetailPage = () => {
  const { benefitId } = useParams();
  const [benefit, setBenefit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBenefit = async () => {
      try {
        const response = await fetchBenefit(benefitId);
        setBenefit(response.data);
      } catch (error) {
        console.error("Error fetching benefit details:", error);
      }
    };
    loadBenefit();
  }, [benefitId]);

  if (!benefit) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Benefit Details</Typography>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h6">{benefit.name}</Typography>
        <Divider sx={{ marginY: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1"><strong>Description:</strong> {benefit.description}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ marginTop: 2, textAlign: "right" }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      </Box>
    </Box>
  );
};

export default BenefitDetailPage;
