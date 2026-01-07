// src/pages/admin/PharmacyList.jsx (or similar path)
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Divider } from "@mui/material";
import CategoriesTab from "./components/CategoriesTab";
import ProductsTab from "./components/ProductsTab";
import InventoryTab from "./components/InventoryTab";
import BrandsTab from "./components/BrandsTab";


const PharmacyList = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="min-width">
      <Typography variant="h4" gutterBottom>
        Pharmacy Management
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="pharmacy tabs">
        <Tab label="Categories" />
        <Tab label="Brands" />
        <Tab label="Products" />
        <Tab label="Inventory" />
      </Tabs>
      <Box mt={4}>
        {tabValue === 0 && <CategoriesTab />}
        {tabValue === 1 && <BrandsTab />}
        {tabValue === 2 && <ProductsTab />}
        {tabValue === 3 && <InventoryTab />}
      </Box>
    </div>
  );
};

export default PharmacyList;