import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Divider } from "@mui/material";
import NetworksTab from "./components/NetworksTab";
import PlansTab from "./components/PlansTab";
import CompaniesTab from "./components/CompaniesTab";
import InsuranceCategoriesTab from "./components/InsuranceCategoriesTab";

const InsuranceList = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="min-width">
      <Typography variant="h4" gutterBottom>
        Insurance Management
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="insurance tabs">
        <Tab label="Companies" />
        <Tab label="Networks" />
        <Tab label="Plans" />
        <Tab label="Categories" />

      </Tabs>

      <Box mt={3}>
        {tabValue === 0 && <CompaniesTab />}
        {tabValue === 1 && <NetworksTab />}
        {tabValue === 2 && <PlansTab />}
        {tabValue === 3 && <InsuranceCategoriesTab />}

      </Box>
    </div>
  );
};

export default InsuranceList;