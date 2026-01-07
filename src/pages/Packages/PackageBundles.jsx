// ===========================================
// PackageBundles.jsx
// Parent component with Tabs
// ===========================================

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Divider } from "@mui/material";
import BundlesTab from "./BundleList";
import PurchaseListTab from "./BundlePurchaseList";

const PackageBundles = () => {
    const [tab, setTab] = useState(0);

    return (

        <Box>
            <Typography variant="h4" gutterBottom>
                Package Bundles Management
            </Typography>
            <Divider style={{ marginBottom: "20px" }} />
            {/* Tabs Header */}
            <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                sx={{ mb: 2 }}
            >
                <Tab label="Package Bundles" />
                <Tab label="Purchase List" />
            </Tabs>

            {/* Tab Content */}
            {tab === 0 && <BundlesTab />}
            {tab === 1 && <PurchaseListTab />}
        </Box>
    );
};

export default PackageBundles;
