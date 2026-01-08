import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Autocomplete,
  Box,
  Grid,
  Paper,
  Chip,
  FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchPlans,
  fetchNetworks,
  fetchCompanies,
  createPlan,
  updatePlan,
  deletePlan,
  searchBenefits,
  fetchPlan,
  fetchInsuranceCategories,
  fetchEstablishmentsSelect,
} from "../../../apis/services/insuranceApi";
// 🔹 CHANGES MADE: search UI icons
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";

// 🔹 CHANGES MADE: import bulk upload API
import { bulkUploadPlans } from "../../../apis/services/insuranceApi";

import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import CustomIconButton from "../../../shared/components/CustomIconButton";

const categoryOrder = ["inpatient", "outpatient", "optical", "dental"];
const categoryLabels = {
  inpatient: "Inpatient",
  outpatient: "Outpatient",
  optical: "Optical",
  dental: "Dental",
};

const PlansTab = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [id, setId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [annualLimit, setAnnualLimit] = useState("");
  const [areaOfCover, setAreaOfCover] = useState("");
  // 🔹 NEW FIELDS STATES
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [strikePrice, setStrikePrice] = useState("");
  const [coverAmount, setCoverAmount] = useState("");
  const [features, setFeatures] = useState([]);
  const [discountText, setDiscountText] = useState("");
  const [specialForCustomers, setSpecialForCustomers] = useState(false);
  const [recommended, setRecommended] = useState(false);
  // 🔹 CHANGES MADE: bulk upload states
  const fileInputRef = useRef(null);
  const [bulkUploading, setBulkUploading] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  // NEW FIELDS
  const [establishments, setEstablishments] = useState([]);
  // ⭐ NEW: Multi Establishment selection
  const [selectedEstablishments, setSelectedEstablishments] = useState([]);
  // CHANGES MADE: pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [insuranceCategories, setInsuranceCategories] = useState([]);
  // CHANGES MADE: category → specialities (array)
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);

  // Categories state
  const [categories, setCategories] = useState({
    inpatient: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
    outpatient: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
    optical: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
    dental: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
  });

  // Benefit search
  const [benefitOptions, setBenefitOptions] = useState({});
  const [benefitInput, setBenefitInput] = useState({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const columns = [
    { field: "name", headerName: "Plan Name", flex: 1 },
    { field: "sub_title", headerName: "Sub Title", flex: 1 },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      valueGetter: (params) => params.row.network?.company?.name || "-",
    },
    {
      field: "network",
      headerName: "Network",
      flex: 1,
      valueGetter: (params) => params.row.network?.name || "-",
    },
    { field: "annual_limit", headerName: "Annual Limit", flex: 1 },
    { field: "selling_price", headerName: "Selling Price", flex: 1 },
    { field: "cover_amount", headerName: "Cover Amount", flex: 1 },
    { field: "area_of_cover", headerName: "Area of Cover", flex: 1 },
    {
      field: "recommended",
      headerName: "Recommended",
      flex: 0.5,
      renderCell: (params) => (params.value ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" color="default" size="small" />),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <CustomIconButton
          key="view"
          onClickAction={() => navigate(`/plan/${params.id}`)}
          arialLabel="view"
          icon={<VisibilityIcon />}
        />,
        <CustomIconButton key="edit" onClickAction={() => handleEdit(params.id)} arialLabel="edit" icon={<EditIcon />} />,
        <CustomIconButton key="delete" onClickAction={() => handleDeleteClick(params.id)} arialLabel="delete" icon={<DeleteIcon />} />,
      ],
    },
  ];
  // CHANGES MADE: page & pageSize passed to API
  const loadPlans = useCallback(
    async (pageNo = page, limit = pageSize) => {
      setLoading(true);
      try {
        const res = await fetchPlans(pageNo, limit, searchText);

        if (res.data.success) {
          const mapped = res.data.data.rows.map((item) => ({
            id: item.id,
            name: item.name,
            sub_title: item.sub_title || "",
            annual_limit: item.annual_limit,
            selling_price: item.selling_price || "",
            cover_amount: item.cover_amount || "",
            area_of_cover: item.area_of_cover,
            recommended: item.recommended || false,
            network: item.network,
          }));

          setRows(mapped);
          setTotalRows(res.data.data.count); // ✅ backend count
        }
      } catch (err) {
        toast.error("Failed to load plans");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText]
  );
  // 🔹 CHANGES MADE: reload on search
  useEffect(() => {
    loadPlans(page, pageSize);
  }, [page, pageSize, searchText]);

  const loadCompanies = async () => {
    try {
      const res = await fetchCompanies();
      if (res.data.success) {
        setCompanies(res.data.data.rows || res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load companies");
    }
  };

  const loadNetworks = async (companyId) => {
    try {
      const res = await fetchNetworks();
      if (res.data.success) {
        const filtered = res.data.data.rows.filter((n) => n.company_id === Number(companyId));
        setNetworks(filtered);
      }
    } catch (err) {
      toast.error("Failed to load networks");
    }
  };
  // CHANGES MADE: reload on page/pageSize change
  useEffect(() => {
    loadPlans(page, pageSize);
  }, [page, pageSize, loadPlans]);

  useEffect(() => {
    loadPlans();
    loadCompanies();

    fetchEstablishmentsSelect().then((res) => {
      if (!isMounted.current) return;

      if (res.data.success) setEstablishments(res.data.data || []);
    });

    fetchInsuranceCategories().then((res) => {
      if (!isMounted.current) return;

      if (res.data.success) {
        const list = Array.isArray(res.data.data)
          ? res.data.data
          : res.data.data?.rows || [];
        setInsuranceCategories(list);
      } else {
        setInsuranceCategories([]);
      }
    });
  }, [loadPlans]);


  useEffect(() => {
    if (selectedCompany) {
      loadNetworks(selectedCompany);
      setSelectedNetwork("");
    }
  }, [selectedCompany]);

  // =======================================================
  // ✅ FULL UPDATED handleEdit() — supports multi-establishments + NEW FIELDS
  // =======================================================
  const handleEdit = async (planId) => {
    try {
      setLoading(true);

      const res = await fetchPlan(planId);
      if (!res.data.success) {
        toast.error("Failed to load plan details");
        return;
      }

      const plan = res.data.data;

      // ------------------------------
      // BASIC DETAILS
      setId(planId);
      setPlanName(plan.name || "");
      setSubTitle(plan.sub_title || "");
      setDescription(plan.description || "");
      setSellingPrice(plan.selling_price || "");
      setStrikePrice(plan.strike_price || "");
      setCoverAmount(plan.cover_amount || "");
      setFeatures(plan.features || []);
      setDiscountText(plan.discount_text || "");
      setSpecialForCustomers(plan.special_for_customers || false);
      setRecommended(plan.recommended || false);
      setAnnualLimit(plan.annual_limit || "");
      setAreaOfCover(plan.area_of_cover || "");

      // ------------------------------
      // COMPANY + NETWORK
      // ------------------------------
      setSelectedCompany(plan.network?.company?.id || "");
      await loadNetworks(plan.network?.company?.id);
      setSelectedNetwork(plan.network?.id || "");

      // -----------------------------------------------------
      // ⭐ MULTI ESTABLISHMENTS
      // API returns: establishments: [{id, name}, ...]
      // -----------------------------------------------------
      setSelectedEstablishments(plan.establishments?.map(e => e.id) || []);

      // -----------------------------------------------------
      // ⭐ PLAN CATEGORY
      // -----------------------------------------------------
      // CHANGES MADE: load specialities array from API
      setSelectedSpecialities(
        Array.isArray(plan.specialities)
          ? plan.specialities.map(s => s.id)
          : []
      );

      // ------------------------------
      // LOAD CATEGORIES & BENEFITS
      // ------------------------------
      const loadedCategories = {};
      categoryOrder.forEach((catKey) => {
        const cat = plan.categories?.[catKey];

        loadedCategories[catKey] = cat
          ? {
            description: cat.description || "",
            co_payment: cat.co_payment || false,
            co_payment_info: cat.co_payment_info || "",
            benefits:
              cat.benefits?.map((b) => ({
                id: b.id,
                name: b.name || "",
                included: b.included !== false,
                notes: b.notes || "",
              })) || [],
          }
          : {
            description: "",
            co_payment: false,
            co_payment_info: "",
            benefits: [],
          };
      });

      setCategories(loadedCategories);
      setOpen(true);
    } catch (err) {
      console.error("❌ Error loading plan", err);
      toast.error("Failed to load plan data");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CHANGES MADE: Dynamic rowsPerPageOptions based on totalRows
  const getRowsPerPageOptions = (count) => {
    if (count <= 10) return [10];

    if (count <= 20) return [10, 20];

    if (count <= 50) return [10, 25, 50];

    // count > 50 → allow up to 100
    return [10, 25, 50, 100];
  };

  const handleDeleteClick = (planId) => {
    setDeletingId(planId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePlan(deletingId);
      toast.success("Plan deleted successfully");
      loadPlans();
    } catch (err) {
      toast.error("Failed to delete plan");
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  // =======================================================
  // 🔹 CHANGES MADE: Bulk Upload Handler
  // =======================================================
  const handleBulkUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleBulkFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setBulkUploading(true);
      await bulkUploadPlans(file);
      toast.success("Plans uploaded successfully");

      loadPlans(); // refresh grid after upload
    } catch (err) {
      console.error("Bulk upload failed", err);
      toast.error(err.response?.data?.message || "Bulk upload failed");
    } finally {
      setBulkUploading(false);
      e.target.value = ""; // reset input
    }
  };

  const handleClose = () => {
    setOpen(false);
    setId(null);
    setPlanName("");
    setSubTitle("");
    setDescription("");
    setSellingPrice("");
    setStrikePrice("");
    setCoverAmount("");
    setFeatures([]);
    setDiscountText("");
    setSpecialForCustomers(false);
    setRecommended(false);
    setAnnualLimit("");
    setAreaOfCover("");
    setSelectedCompany("");
    setSelectedNetwork("");
    setCategories({
      inpatient: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
      outpatient: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
      optical: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
      dental: { description: "", co_payment: false, co_payment_info: "", benefits: [] },
    });
    setBenefitOptions({});
    setBenefitInput({});
  };

  const searchBenefitSuggestions = async (categoryKey, query) => {
    if (!query.trim()) {
      setBenefitOptions((prev) => ({ ...prev, [categoryKey]: [] }));
      return;
    }
    try {
      const res = await searchBenefits(query);
      if (res.data.success) {
        setBenefitOptions((prev) => ({ ...prev, [categoryKey]: res.data.data || [] }));
      }
    } catch (err) {
      console.error("Benefit search failed", err);
    }
  };

  const addBenefit = (categoryKey) => {
    setCategories((prev) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        benefits: [...prev[categoryKey].benefits, { name: "", included: true, notes: "" }],
      },
    }));
  };

  const updateBenefit = (categoryKey, index, field, value) => {
    setCategories((prev) => {
      const newBenefits = [...prev[categoryKey].benefits];
      newBenefits[index] = { ...newBenefits[index], [field]: value };
      return { ...prev, [categoryKey]: { ...prev[categoryKey], benefits: newBenefits } };
    });
  };

  const removeBenefit = (categoryKey, index) => {
    setCategories((prev) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        benefits: prev[categoryKey].benefits.filter((_, i) => i !== index),
      },
    }));
  };

  // =======================================================
  // ✅ FULL UPDATED handleSubmit() — sends category_id & establishment_ids[] + NEW FIELDS
  // =======================================================
  const handleSubmit = async () => {
    if (!planName.trim()) return toast.error("Plan name is required");
    if (!selectedNetwork) return toast.error("Please select a network");

    const payload = {
      network_id: Number(selectedNetwork),
      name: planName.trim(),
      sub_title: subTitle,
      description: description,
      selling_price: sellingPrice,
      strike_price: strikePrice,
      cover_amount: coverAmount,
      features: features,
      discount_text: discountText,
      special_for_customers: specialForCustomers,
      recommended: recommended,
      annual_limit: annualLimit,
      area_of_cover: areaOfCover,

      // ⭐ NEW: Multi establishment support
      establishments: selectedEstablishments,

      // ⭐ NEW: Plan category
      // CHANGES MADE: send specialities as array
      specialities: selectedSpecialities,

      categories: {},
    };

    // ------------------------------------------------------
    // BUILD CATEGORY PAYLOAD
    // ------------------------------------------------------
    categoryOrder.forEach((cat) => {
      const data = categories[cat];

      if (data.benefits.length > 0 || data.description || data.co_payment) {
        payload.categories[cat] = {
          description: data.description,
          co_payment: data.co_payment,
          co_payment_info: data.co_payment_info,
          benefits: data.benefits.map((b) => {
            const existing = benefitOptions[cat]?.find((opt) => opt.name === b.name);

            if (existing && existing.id) {
              return {
                benefit_id: existing.id,
                included: b.included,
                notes: b.notes,
              };
            }
            return {
              name: b.name,
              included: b.included,
              notes: b.notes,
            };
          }),
        };
      }
    });

    try {
      if (id) {
        await updatePlan(id, payload);
        toast.success("Plan updated successfully");
      } else {
        await createPlan(payload);
        toast.success("Plan created successfully");
      }

      handleClose();
      loadPlans();
    } catch (err) {
      console.error("❌ Failed to save plan:", err);
      toast.error(err.response?.data?.message || "Failed to save plan");
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <TextField
          size="small"
          placeholder="Search Plans..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1); // reset pagination
          }}
          sx={{ mb: 2, width: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchText ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchText("");
                    setPage(1);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <div>
          <input
            type="file"
            accept=".csv,.xlsx"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleBulkFileChange}
          />
          {/* <Typography variant="h5">Insurance Plans</Typography> */}
          <Button style={{ marginRight: "10px" }}
            variant="outlined"
            onClick={handleBulkUploadClick}
            disabled={bulkUploading}
          >
            {bulkUploading ? "Uploading..." : "Bulk Upload"}
          </Button>

          <Button variant="outlined" onClick={() => setOpen(true)}>
            Add Plan
          </Button>
        </div>
      </div>

      <div style={{ height: "75vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={totalRows}
          paginationMode="server"

          // 🔹 CHANGES MADE: keep DataGrid 0-based
          page={page - 1}
          pageSize={pageSize}

          // 🔹 CHANGES MADE: dynamic rowsPerPageOptions
          rowsPerPageOptions={getRowsPerPageOptions(totalRows)}

          onPageChange={(newPage) => setPage(newPage + 1)}

          // 🔹 CHANGES MADE: guard pageSize so it never exceeds totalRows
          onPageSizeChange={(newSize) => {
            const safeSize = Math.min(newSize, totalRows || newSize);
            setPageSize(safeSize);
            setPage(1);
          }}

          checkboxSelection
          density="compact"
          autoHeight
        />


      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {id ? "Edit Plan" : "Add Plan"}
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ background: "#fafafa" }}>

          {/* ---------- TOP SECTION (Company, Plan Info) ---------- */}
          <Box sx={{ p: 2, mb: 4, background: "white", borderRadius: 2 }}>

            <Typography variant="h6" gutterBottom>
              {id ? "Edit Plan" : "Add Plan"}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Insurance Company</InputLabel>
                  <Select
                    value={selectedCompany}
                    label="Insurance Company"
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    {companies.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Network</InputLabel>
                  <Select
                    value={selectedNetwork}
                    label="Network"
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                  >
                    {networks.map((n) => (
                      <MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Plan Name"
                  fullWidth
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Sub Title"
                  fullWidth
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Selling Price"
                  fullWidth
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Strike Price"
                  fullWidth
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={strikePrice}
                  onChange={(e) => setStrikePrice(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Cover Amount"
                  fullWidth
                  value={coverAmount}
                  onChange={(e) => setCoverAmount(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={features}
                  onChange={(e, value) => {
                    // 🔹 ensure ONLY strings are stored
                    setFeatures(value.map(v => String(v)));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Features"
                      placeholder="Type feature and press Enter"
                      fullWidth
                    />
                  )}
                />

              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Discount Text"
                  fullWidth
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={establishments}
                  getOptionLabel={(opt) => opt?.name || ""}
                  value={establishments.filter(e =>
                    selectedEstablishments.includes(e.id)
                  )}
                  onChange={(e, value) =>
                    setSelectedEstablishments(value.map(v => v.id))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Establishments"
                      placeholder="Choose establishments"
                      fullWidth
                    />
                  )}
                />
              </Grid>


              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Specialities</InputLabel>
                  <Select
                    multiple
                    value={selectedSpecialities}
                    label="Specialities"
                    onChange={(e) => setSelectedSpecialities(e.target.value)}
                    renderValue={(selected) =>
                      insuranceCategories
                        .filter(cat => selected.includes(cat.id))
                        .map(cat => cat.name)
                        .join(", ")
                    }
                  >
                    {insuranceCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        <Checkbox checked={selectedSpecialities.includes(cat.id)} />
                        <Typography>{cat.name}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>

              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={specialForCustomers}
                      onChange={(e) => setSpecialForCustomers(e.target.checked)}
                    />
                  }
                  label="Special for Customers"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={recommended}
                      onChange={(e) => setRecommended(e.target.checked)}
                    />
                  }
                  label="Recommended"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Annual Limit"
                  fullWidth
                  value={annualLimit}
                  onChange={(e) => setAnnualLimit(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Area of Cover"
                  fullWidth
                  value={areaOfCover}
                  onChange={(e) => setAreaOfCover(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ---------- CATEGORY SECTIONS (Inpatient / Outpatient / etc.) ---------- */}
          {categoryOrder.map((catKey) => (
            <Box
              key={catKey}
              sx={{ p: 3, mb: 3, background: "white", borderRadius: 2 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {categoryLabels[catKey]}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description with co-payments info"
                    value={categories[catKey].description}
                    onChange={(e) =>
                      setCategories((prev) => ({
                        ...prev,
                        [catKey]: { ...prev[catKey], description: e.target.value },
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Co-payment info"
                    value={categories[catKey].co_payment_info}
                    onChange={(e) =>
                      setCategories((prev) => ({
                        ...prev,
                        [catKey]: { ...prev[catKey], co_payment_info: e.target.value },
                      }))
                    }
                  />
                </Grid>

                {/* ---------- BENEFITS TABLE ---------- */}
                <Grid item xs={12}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Benefit</strong></TableCell>
                        <TableCell width={120}><strong>Covered</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell width={50}></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {categories[catKey].benefits.map((benefit, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Autocomplete
                              freeSolo
                              options={benefitOptions[catKey] || []}
                              getOptionLabel={(option) =>
                                typeof option === "string" ? option : option.name || ""
                              }
                              inputValue={benefitInput[`${catKey}-${idx}`] || benefit.name}
                              onInputChange={(e, value) => {
                                setBenefitInput((prev) => ({ ...prev, [`${catKey}-${idx}`]: value }));
                                searchBenefitSuggestions(catKey, value);
                                updateBenefit(catKey, idx, "name", value);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} size="small" placeholder="Benefit name" />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <Select
                              value={benefit.included ? "Covered" : "Not Covered"}
                              size="small"
                              onChange={(e) =>
                                updateBenefit(catKey, idx, "included", e.target.value === "Covered")
                              }
                            >
                              <MenuItem value="Covered">Covered</MenuItem>
                              <MenuItem value="Not Covered">Not Covered</MenuItem>
                            </Select>
                          </TableCell>

                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Description / Limit"
                              value={benefit.notes}
                              onChange={(e) => updateBenefit(catKey, idx, "notes", e.target.value)}
                            />
                          </TableCell>

                          <TableCell>
                            <IconButton size="small" onClick={() => removeBenefit(catKey, idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addBenefit(catKey)}
                    sx={{ mt: 1 }}
                  >
                    Add Benefit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        openDialog={deleteDialogOpen}
        title="Delete Plan"
        message="Are you sure you want to delete this insurance plan?"
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        handleDialogClose={() => setDeleteDialogOpen(false)}
        handleDialogAction={confirmDelete}
      />
    </>
  );
};

export default PlansTab;