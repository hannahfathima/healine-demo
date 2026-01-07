import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Divider } from "@mui/material";
import PrescriptionsTab from "./components/PrescriptionsTab";
import SubscriptionsTab from "./components/SubscriptionsTab";
import DosePacksTab from "./components/DosePacksTab";


const PillPackManagement = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="min-width">
      <Typography variant="h4" gutterBottom>
        PillPack Pharmacy
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
        <Tab label="Prescriptions" />
        <Tab label="Subscriptions" />
        <Tab label="Dose Packs" />
      </Tabs>

      <Box mt={3}>
        {tabValue === 0 && <PrescriptionsTab />}
        {tabValue === 1 && <SubscriptionsTab />}
        {tabValue === 2 && <DosePacksTab />}
      </Box>
    </div>
  );
};

export default PillPackManagement;
