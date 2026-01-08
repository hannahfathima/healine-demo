import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import imageCompression from 'browser-image-compression';
import Typography from "@mui/material/Typography";
import {
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tabs,
    Tab,
    Box,
    Checkbox,
    FormControlLabel,
    Chip,
    OutlinedInput,
    Tooltip,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ScienceIcon from "@mui/icons-material/Science";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import CustomIconButton from "../../shared/components/CustomIconButton";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { createRecord, deleteRecord, fetchList, updateRecord } from "../../apis/services/CommonApiService";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { rowsPerPageJsonData } from "../../utils/jsonData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import PackageCategories from "./PackageCategories";
import { Card } from "react-bootstrap";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));
function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`package-tabpanel-${index}`}
            aria-labelledby={`package-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
const Packages = (props) => {
    const [tabValue, setTabValue] = useState(0);
    const [addonTabValue, setAddonTabValue] = useState(0); // NEW: Separate state for add-ons dialog tabs
    const navigate = useNavigate();
    const [openPackageDialog, setOpenPackageDialog] = useState(false);
    const [selectBiomarkers, setSelectBiomarkers] = useState([]); // For add-on biomarkers select
    const [selectPackages, setSelectPackages] = useState([]); // For add-on packages select
    const [selectedAddonGroups, setSelectedAddonGroups] = useState([]);
    const [selectGroups, setSelectGroups] = useState([]); // For add-on groups select
    const [selectCategories, setSelectCategories] = useState([]); // For category dropdown
    const [packageFormData, setPackageFormData] = useState({
        name: "",
        sub_title: "",
        description: "",
        base_price: "",
        selling_price: "",
        strike_price: "",
        discount_text: "",
        addon_price: "",
        // fasting_required: true,
        // fasting_hours: "",
        service_duration_minutes: "",
        sla: "",
        sla_unit: "hours",
        demographics: [],
        visible: true,
        image: null,
        category: "",
        result_time: "",
        service_provider: "",
        establishment_id: "",
        type: "",
        tag: "", // string
        instructionBeforeTest: [], // list of strings
        recommended: false,
        // working_hours: [
        // { day_of_week: "Monday", sessions: [{ start_time: "", end_time: "" }] },
        // { day_of_week: "Tuesday", sessions: [{ start_time: "", end_time: "" }] },
        // { day_of_week: "Wednesday", sessions: [{ start_time: "", end_time: "" }] },
        // { day_of_week: "Thursday", sessions: [{ start_time: "", end_time: "" }] },
        // { day_of_week: "Friday", sessions: [{ start_time: "", end_time: "" }] },
        // { day_of_week: "Saturday", sessions: [{ start_time: "", end_time: "" }] },
        // { day_of_week: "Sunday", sessions: [{ start_time: "", end_time: "" }] },
        // ],
    });
    const [packageId, setPackageId] = useState(null);
    const [packagesDataGridOptions, setPackagesDataGridOptions] = useState({
        loading: false,
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: rowsPerPageJsonData,
        pageSize: 10,
        page: 1,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const demographicsOptions = ["male", "female", "seniors", "kids", "adults"];
    // ──────────────────────────────────────────────────────────────────────
    // PLACE THIS AFTER: const demographicsOptions = ["male", "female", "seniors", "children", "adults"];
    // ──────────────────────────────────────────────────────────────────────
    const serviceTypeOptions = [
        "Home test",
        "Home vaccination",
        "IV Therapy",
        "Home nurse",
    ];
    const [biomarkersList, setBiomarkersList] = useState([]);
    const [biomarkerGroupsList, setBiomarkerGroupsList] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openUpdateBiomarkersDialog, setOpenUpdateBiomarkersDialog] = useState(false);
    const [selectedBiomarkerGroups, setSelectedBiomarkerGroups] = useState([]);
    const [selectedBiomarkers, setSelectedBiomarkers] = useState([]);
    const [updatePackageId, setUpdatePackageId] = useState(null);
    const [biomarkerSearchQuery, setBiomarkerSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [openUpdateAddOnsDialog, setOpenUpdateAddOnsDialog] = useState(false);
    const [selectedAddonBiomarkers, setSelectedAddonBiomarkers] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [updateAddOnPackageId, setUpdateAddOnPackageId] = useState(null);
    const [addonSearchQuery, setAddonSearchQuery] = useState("");
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [currentPackageDetails, setCurrentPackageDetails] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteType, setDeleteType] = useState("package");
    const packagesColumns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 1.5 },
        { field: "sub_title", headerName: "Sub title", flex: 1 },
        { field: "selling_price", headerName: "Selling Price (AED)", flex: 0.8 },
        { field: "category_name", headerName: "Category", flex: 1 }, // Add this line
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1.5,
            renderCell: (params) => (
                <>
                    <Tooltip title="View Package">
                        <CustomIconButton
                            onClickAction={() => navigate(`/packages/${params.id}/view`)}
                            ariaLabel="View"
                            icon={<RemoveRedEyeIcon />}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Package Details">
                        <CustomIconButton
                            onClickAction={() => handleEditPackage(params.id)}
                            ariaLabel="Edit Package"
                            icon={<EditIcon />}
                        />
                    </Tooltip>
                    <Tooltip title="Update Biomarkers">
                        <CustomIconButton
                            onClickAction={() => handleUpdateBiomarkers(params.id)}
                            ariaLabel="Update Biomarkers"
                            icon={<ScienceIcon />}
                        />
                    </Tooltip>
                    <Tooltip title="Update Add-ons">
                        <CustomIconButton
                            onClickAction={() => handleUpdateAddOns(params.id)}
                            ariaLabel="Update Add-ons"
                            icon={<AddCircleOutlineIcon />}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Package">
                        <CustomIconButton
                            onClickAction={() => handleDeletePackage(params.id)}
                            ariaLabel="Delete"
                            icon={<DeleteIcon />}
                        />
                    </Tooltip>
                </>
            ),
        },
    ];
    const getPackagesList = useCallback(async () => {
        setPackagesDataGridOptions((prev) => ({ ...prev, loading: true }));
        try {
            // Fetch ALL records
            const result = await fetchList(
                ApiEndPoints.PACKAGES +
                `?page_no=1&items_per_page=10000&search_text=${searchQuery}`
            );
            if (result.status === 200) {
                const packageRows = result.data.rows?.map((item) => ({
                    id: item.id,
                    name: item.name,
                    sub_title: item.sub_title,
                    selling_price: item.selling_price,
                    category_name: item.category?.name || "N/A",
                }));

                setPackagesDataGridOptions((prev) => ({
                    ...prev,
                    rows: packageRows,
                    totalRows: packageRows.length,  // ✅ Use actual array length
                    loading: false,
                }));
            }
        } catch (error) {
            setPackagesDataGridOptions((prev) => ({ ...prev, loading: false }));
            toast.error("Failed to fetch packages: " + (error.response?.data?.message || error.message));
        }
    }, [searchQuery]); // Remove page/pageSize dependencies
    const fetchEstablishments = useCallback(async () => {
        try {
            const result = await fetchList(ApiEndPoints.GET_ESTABLISHMENT_FOR_SELECT);
            if (result.status === 200) {
                setEstablishments(result.data.map(item => ({
                    id: item.id,
                    name: item.name
                })));
            }
        } catch (error) {
            console.error("Failed to fetch establishments:", error);
            toast.error("Failed to load establishments");
        }
    }, []);
    const fetchCategories = useCallback(async () => {
        try {
            const result = await fetchList(ApiEndPoints.PACKAGE_CATEGORIES + "?page_no=1&items_per_page=50");
            if (result.status === 200) {
                setCategories(result.data.rows || []);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to load categories");
        }
    }, []);
    const fetchBiomarkerGroupsList = useCallback(async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}packages/1000000/edit-data`);
            if (result.status === 200 && result.data.success) {
                const groups = result.data.data.allGroups || [];
                setBiomarkerGroupsList(groups);
                const allBiomarkers = groups.flatMap(group =>
                    group.biomarkers.map(biomarker => ({
                        id: biomarker.id,
                        name: biomarker.name,
                        group_id: group.id,
                    }))
                );
                setBiomarkersList(allBiomarkers);
            }
        } catch (error) {
            console.error("Failed to fetch biomarker groups list:", error);
            toast.error("Failed to fetch biomarker groups: " + (error.response?.data?.message || error.message));
        }
    }, []);
    // In the useEffect, update to:
    useEffect(() => {
        getPackagesList();
        fetchEstablishments();
        fetchCategories();
        fetchSelectCategories(); // Use new select API instead of paginated fetchCategories
        fetchSelectBiomarkers(); // Load biomarkers for add-ons
        fetchSelectPackages(); // Load packages for add-ons
        fetchSelectGroups(); // ADD THIS LINE: Load groups for add-ons
    }, [getPackagesList, fetchCategories]);
    const handleOpenPackageDialog = () => {
        setPackageFormData({
            name: "",
            sub_title: "",
            description: "",
            base_price: "",
            selling_price: "",
            strike_price: "",
            discount_text: "",
            addon_price: "",
            // fasting_required: true,
            // fasting_hours: "",
            service_duration_minutes: "",
            sla: "",
            sla_unit: "hours",
            demographics: [],
            visible: true,
            image: null,
            category: "",
            result_time: "",
            service_provider: "", // Remove or keep as fallback
            establishment_id: "", // Add this
            recommended: false,
            tag: "",
            instructionBeforeTest: [],
            // working_hours: [
            // { day_of_week: "Monday", sessions: [{ start_time: "", end_time: "" }] },
            // { day_of_week: "Tuesday", sessions: [{ start_time: "", end_time: "" }] },
            // { day_of_week: "Wednesday", sessions: [{ start_time: "", end_time: "" }] },
            // { day_of_week: "Thursday", sessions: [{ start_time: "", end_time: "" }] },
            // { day_of_week: "Friday", sessions: [{ start_time: "", end_time: "" }] },
            // { day_of_week: "Saturday", sessions: [{ start_time: "", end_time: "" }] },
            // { day_of_week: "Sunday", sessions: [{ start_time: "", end_time: "" }] },
            // ],
        });
        setPackageId(null);
        setOpenPackageDialog(true);
    };
    const handleClosePackageDialog = () => {
        setOpenPackageDialog(false);
        setPackageId(null);
    };
    const handleEditPackage = async (id) => {
        try {
            const result = await fetchList(`${ApiEndPoints.PACKAGES}/${id}`);
            if (result.status === 200) {
                const packageData = result.data;
                setPackageFormData({
                    name: packageData.name || "",
                    sub_title: packageData.sub_title || "",
                    description: packageData.description || "",
                    base_price: packageData.base_price || "",
                    selling_price: packageData.selling_price || "",
                    strike_price: packageData.strike_price || "",
                    discount_text: packageData.discount_text || "",
                    addon_price: packageData.addon_price || "",
                    // fasting_required: packageData.fasting_required || false,
                    // fasting_hours: packageData.fasting_hours || "",
                    service_duration_minutes: packageData.service_duration_minutes || "",
                    sla: packageData.sla || "",
                    sla_unit: packageData.sla_unit ? packageData.sla_unit.toLowerCase() : "hours",
                    demographics: packageData.demographics || [],
                    visible: packageData.visible !== undefined ? packageData.visible : true,
                    image: packageData.image || null,
                    category: packageData.category?.id || packageData.category_id || "",
                    result_time: packageData.result_time || "",
                    service_provider: packageData.service_provider || "",
                    establishment_id: packageData.establishment?.id || packageData.establishment_id || "",
                    recommended: packageData.recommended || false,
                    tag: packageData.tag || "",
                    instructionBeforeTest: Array.isArray(packageData.instruction_before_test)
                        ? packageData.instruction_before_test
                        : [],
                    // working_hours: packageData.working_hours?.length
                    // ? packageData.working_hours.map(d => ({
                    // day_of_week: d.day_of_week,
                    // sessions: d.sessions?.length ? d.sessions : [{ start_time: "", end_time: "" }],
                    // }))
                    // : [
                    // { day_of_week: "Monday", sessions: [{ start_time: "", end_time: "" }] },
                    // { day_of_week: "Tuesday", sessions: [{ start_time: "", end_time: "" }] },
                    // { day_of_week: "Wednesday", sessions: [{ start_time: "", end_time: "" }] },
                    // { day_of_week: "Thursday", sessions: [{ start_time: "", end_time: "" }] },
                    // { day_of_week: "Friday", sessions: [{ start_time: "", end_time: "" }] },
                    // { day_of_week: "Saturday", sessions: [{ start_time: "", end_time: "" }] },
                    // { day_of_week: "Sunday", sessions: [{ start_time: "", end_time: "" }] },
                    // ],
                });
                setPackageId(id);
                setOpenPackageDialog(true);
            }
        } catch (error) {
            toast.error("Failed to fetch package details: " + (error.response?.data?.message || error.message));
        }
    };
    const handleViewPackage = (id) => {
        toast.info("View package: " + id);
    };
    const handleUpdateBiomarkers = async (id) => {
        setUpdatePackageId(id);
        setSelectedBiomarkerGroups([]);
        setSelectedBiomarkers([]);
        setExpandedGroups([]);
        setCurrentPackageDetails(null);
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}packages/${id}/edit-data`);
            if (result.status === 200 && result.data.success) {
                const { selectedGroups, selectedBiomarkers, allGroups } = result.data.data;
                const packageResult = await fetchList(`${ApiEndPoints.PACKAGES}/${id}`);
                if (packageResult.status === 200) {
                    setCurrentPackageDetails({
                        id,
                        name: packageResult.data.name,
                    });
                }
                // Set biomarker groups list
                setBiomarkerGroupsList(allGroups || []);
                // Create biomarkers list with group_id
                const allBiomarkers = allGroups.flatMap(group =>
                    group.biomarkers.map(biomarker => ({
                        id: biomarker.id,
                        name: biomarker.name,
                        group_id: group.id,
                    }))
                );
                setBiomarkersList(allBiomarkers);
                // Calculate which groups should be selected based on selected biomarkers
                const groupsToSelect = new Set(selectedGroups || []);
                (selectedBiomarkers || []).forEach(biomarkerId => {
                    const biomarker = allBiomarkers.find(b => b.id === biomarkerId);
                    if (biomarker && biomarker.group_id) {
                        groupsToSelect.add(biomarker.group_id);
                    }
                });
                const finalGroupsArray = Array.from(groupsToSelect);
                setSelectedBiomarkerGroups(finalGroupsArray);
                setSelectedBiomarkers(selectedBiomarkers || []);
                setExpandedGroups(finalGroupsArray);
            }
        } catch (error) {
            console.error("Failed to fetch package biomarkers:", error);
            toast.error("Failed to fetch package biomarkers: " + (error.response?.data?.message || error.message));
        }
        setOpenUpdateBiomarkersDialog(true);
    };
    const getBiomarkersForGroup = (groupId) => {
        return biomarkersList.filter((biomarker) => biomarker.group_id === groupId);
    };
    const fetchSelectBiomarkers = useCallback(async () => {
        try {
            const result = await fetchList(ApiEndPoints.GET_BIOMARK_FOR_SELECT);
            if (result.status === 200) {
                setSelectBiomarkers(result.data || []); // Assumes {id, name, type, specimen, unit, price} for display
            } else {
                toast.error("Failed to fetch biomarkers for select");
            }
        } catch (error) {
            console.error("Error fetching select biomarkers:", error);
            toast.error("Failed to fetch biomarkers for select");
        }
    }, []);
    const fetchSelectPackages = useCallback(async () => {
        try {
            const result = await fetchList(ApiEndPoints.GET_PACKAGES_FOR_SELECT);
            if (result.status === 200) {
                setSelectPackages(result.data || []); // Assumes {id, name, sub_title, price} for display
            } else {
                toast.error("Failed to fetch packages for select");
            }
        } catch (error) {
            console.error("Error fetching select packages:", error);
            toast.error("Failed to fetch packages for select");
        }
    }, []);
    const fetchSelectGroups = useCallback(async () => {
        try {
            const result = await fetchList(ApiEndPoints.GET_BIOMARK_GROUP_FOR_SELECT);
            if (result.status === 200) {
                setSelectGroups(result.data || []); // Assumes {id, name} for display
            } else {
                toast.error("Failed to fetch groups for select");
            }
        } catch (error) {
            console.error("Error fetching select groups:", error);
            toast.error("Failed to fetch groups for select");
        }
    }, []);
    const fetchSelectCategories = useCallback(async () => {
        try {
            const result = await fetchList(ApiEndPoints.GET_PACKAGES_CATERGORIES);
            if (result.status === 200) {
                setSelectCategories(result.data || []); // Assumes {id, name} for dropdown
            } else {
                toast.error("Failed to fetch categories for select");
            }
        } catch (error) {
            console.error("Error fetching select categories:", error);
            toast.error("Failed to fetch categories for select");
        }
    }, []);
    const toggleGroupExpansion = (groupId) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };
    const handleSearchChange = (value) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
            setSearchQuery(value);
            setPackagesDataGridOptions(prev => ({ ...prev, page: 1 })); // Reset to page 1
        }, 500);
        setSearchTimeout(timeout);
    };
    const handleGroupCheckboxChange = (groupId, checked) => {
        if (checked) {
            setSelectedBiomarkerGroups([...selectedBiomarkerGroups, groupId]);
            const groupBiomarkers = getBiomarkersForGroup(groupId);
            const biomarkerIds = groupBiomarkers.map(b => b.id);
            setSelectedBiomarkers([...new Set([...selectedBiomarkers, ...biomarkerIds])]);
            setExpandedGroups(prev => [...new Set([...prev, groupId])]);
        } else {
            setSelectedBiomarkerGroups(selectedBiomarkerGroups.filter((id) => id !== groupId));
            const groupBiomarkers = getBiomarkersForGroup(groupId);
            const biomarkerIds = groupBiomarkers.map(b => b.id);
            setSelectedBiomarkers(selectedBiomarkers.filter(id => !biomarkerIds.includes(id)));
            setExpandedGroups(prev => prev.filter(id => id !== groupId));
        }
    };
    const getSelectedBiomarkersCount = (groupId) => {
        const groupBiomarkers = getBiomarkersForGroup(groupId);
        const groupBiomarkerIds = groupBiomarkers.map(b => b.id);
        return selectedBiomarkers.filter(id => groupBiomarkerIds.includes(id)).length;
    };
    const handleUpdateAddOns = async (id) => {
        setUpdateAddOnPackageId(id);
        setSelectedAddonBiomarkers([]);
        setSelectedAddons([]);
        setAddonSearchQuery("");
        try {
            // Fetch add-ons data from the specific endpoint
            const result = await axios.get(
                `${process.env.REACT_APP_BASE_URL}packages/${id}/get_addons`
            );
            if (result.status === 200 && result.data.success) {
                const { addonBiomarkers, addonPackages, addonGroups } = result.data.data;
                // Set selected addon biomarkers
                if (addonBiomarkers) {
                    setSelectedAddonBiomarkers(
                        addonBiomarkers.map((b) => ({
                            id: b.id,
                            name: b.name, // Add name for display
                            type: b.type,
                            specimen: b.specimen,
                            unit: b.unit,
                            price: b.price,
                            recommended: b.recommended || false,
                            why_recommended: b.why_recommended || "",
                        }))
                    );
                }
                // Set selected addon packages
                if (addonPackages) {
                    setSelectedAddons(
                        addonPackages.map((a) => ({
                            id: a.id,
                            name: a.name, // Add name for display
                            sub_title: a.sub_title,
                            price: a.price,
                            recommended: a.recommended || false,
                            why_recommended: a.why_recommended || "",
                        }))
                    );
                }
                if (addonGroups) { // ADD THIS BLOCK
                    setSelectedAddonGroups(
                        addonGroups.map((g) => ({
                            id: g.id,
                            name: g.name, // Add name for display
                            recommended: g.recommended || false,
                            why_recommended: g.why_recommended || "",
                        }))
                    );
                }
            }
        } catch (error) {
            console.error("Failed to fetch package addons:", error);
            toast.error("Failed to fetch add-ons: " + (error.response?.data?.message || error.message));
        }
        setOpenUpdateAddOnsDialog(true);
    };
    const handleDeletePackage = (id) => {
        setDeleteId(id);
        setDeleteType("package");
        setOpenDeleteDialog(true);
    };
    const handleGroupChange = (groupId, checked) => {
        if (checked) {
            setSelectedAddonGroups(prev => [
                ...prev,
                { id: groupId, recommended: false, why_recommended: "" }
            ]);
        } else {
            setSelectedAddonGroups(prev => prev.filter(item => item.id !== groupId));
        }
    };
    const handleGroupRecommendedChange = (groupId, checked) => {
        setSelectedAddonGroups(prev =>
            prev.map(item =>
                item.id === groupId ? { ...item, recommended: checked } : item
            )
        );
    };
    const handleGroupWhyRecommendedChange = (groupId, value) => {
        setSelectedAddonGroups(prev =>
            prev.map(item =>
                item.id === groupId ? { ...item, why_recommended: value } : item
            )
        );
    };
    const filteredAddonGroups = selectGroups.filter((group) =>
        group.name.toLowerCase().includes(addonSearchQuery.toLowerCase())
    );
    const handleSavePackage = async () => {
        if (!packageFormData.name.trim()) {
            toast.error("Package name is required");
            return;
        }
        if (!packageFormData.category) {
            toast.error("Category is required");
            return;
        }
        const formData = new FormData();
        formData.append("name", packageFormData.name);
        formData.append("sub_title", packageFormData.sub_title);
        formData.append("description", packageFormData.description);
        formData.append("base_price", parseFloat(packageFormData.base_price) || 0);
        formData.append("selling_price", parseFloat(packageFormData.selling_price) || 0);
        formData.append("strike_price", parseFloat(packageFormData.strike_price) || 0);
        formData.append("discount_text", packageFormData.discount_text);
        formData.append("addon_price", parseFloat(packageFormData.addon_price) || 0);
        // formData.append("fasting_required", packageFormData.fasting_required);
        // formData.append("fasting_hours", parseInt(packageFormData.fasting_hours) || 0);
        formData.append("service_duration_minutes", packageFormData.service_duration_minutes);
        formData.append("sla", parseInt(packageFormData.sla) || 0);
        formData.append("sla_unit", packageFormData.sla_unit);
        packageFormData.demographics.forEach((element, index) => {
            formData.append(`demographics[${index}]`, element);
        });
        formData.append("visible", packageFormData.visible);
        if (packageFormData.image) {
            formData.append("image", packageFormData.image);
        }
        // Newly added fields
        formData.append("category_id", packageFormData.category || "");
        formData.append("result_time", packageFormData.result_time || "");
        if (packageFormData.establishment_id) {
            formData.append("establishment_id", packageFormData.establishment_id);
        }
        formData.append("recommended", packageFormData.recommended);
        // formData.append("type", packageFormData.type);
        formData.append("tag", packageFormData.tag || "");
        packageFormData.instructionBeforeTest
            .filter(s => s.trim())
            .forEach((inst, i) => {
                formData.append(`instruction_before_test[${i}]`, inst);
            });
        // packageFormData.working_hours.forEach((day, dIdx) => {
        // const hasSessions = day.sessions?.some(s => s.start_time && s.end_time);
        // formData.append(`working_hours[${dIdx}][day_of_week]`, day.day_of_week);
        // formData.append(`working_hours[${dIdx}][is_leave]`, !hasSessions);
        // day.sessions?.forEach((s, sIdx) => {
        // if (s.start_time && s.end_time) {
        // formData.append(`working_hours[${dIdx}][sessions][${sIdx}][start_time]`, s.start_time);
        // formData.append(`working_hours[${dIdx}][sessions][${sIdx}][end_time]`, s.end_time);
        // }
        // });
        // });
        try {
            let result;
            if (packageId) {
                result = await updateRecord(formData, packageId, ApiEndPoints.PACKAGES);
            } else {
                result = await createRecord(formData, ApiEndPoints.PACKAGES);
            }
            if (result.status === 200) {
                toast.success(result.data.message || "Service saved successfully");
                handleClosePackageDialog();
                getPackagesList();
            } else {
                toast.error(result.data.message || "Failed to save package");
            }
        } catch (error) {
            toast.error("Failed to save package: " + (error.response?.data?.message || error.message));
        }
    };
    const handleSaveUpdateBiomarkers = async () => {
        try {
            const payload = {
                groups: selectedBiomarkerGroups,
                biomarkers: selectedBiomarkers,
            };
            const result = await axios.put(
                `${process.env.REACT_APP_BASE_URL}packages/${updatePackageId}/update_biomarkers`,
                payload
            );
            if (result.status === 200) {
                toast.success("Biomarkers updated successfully");
                setOpenUpdateBiomarkersDialog(false);
            } else {
                toast.error(result.data.message || "Failed to update biomarkers");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Failed to update biomarkers";
            const backendError = error.response?.data?.err;
            if (backendError) {
                toast.error(`Error: ${backendError}`);
                console.error("Backend error:", backendError);
            } else {
                toast.error(errorMessage);
            }
            console.error("Error updating biomarkers:", error.response?.data || error);
        }
    };
    const handleBiomarkerChange = (biomarkerId, checked) => {
        if (checked) {
            // push a **complete** object – id, recommended (boolean), why_recommended (string)
            setSelectedAddonBiomarkers(prev => [
                ...prev,
                { id: biomarkerId, recommended: false, why_recommended: "" }
            ]);
        } else {
            setSelectedAddonBiomarkers(prev => prev.filter(item => item.id !== biomarkerId));
        }
    };
    const handleRecommendedChange = (biomarkerId, checked) => {
        setSelectedAddonBiomarkers(prev =>
            prev.map(item =>
                item.id === biomarkerId ? { ...item, recommended: checked } : item
            )
        );
    };
    const handleWhyRecommendedChange = (biomarkerId, value) => {
        setSelectedAddonBiomarkers(prev =>
            prev.map(item =>
                item.id === biomarkerId ? { ...item, why_recommended: value } : item
            )
        );
    };
    const handleAddonPackageChange = (pkgId, checked) => {
        if (checked) {
            setSelectedAddons(prev => [
                ...prev,
                { id: pkgId, recommended: false, why_recommended: "" }
            ]);
        } else {
            setSelectedAddons(prev => prev.filter(item => item.id !== pkgId));
        }
    };
    const handleAddonRecommendedChange = (pkgId, checked) => {
        setSelectedAddons(prev =>
            prev.map(item =>
                item.id === pkgId ? { ...item, recommended: checked } : item
            )
        );
    };
    const handleAddonWhyRecommendedChange = (pkgId, value) => {
        setSelectedAddons(prev =>
            prev.map(item =>
                item.id === pkgId ? { ...item, why_recommended: value } : item
            )
        );
    };
    const handleSaveUpdateAddOns = async () => {
        try {
            const payload = {
                // ---- Biomarker add-ons ----
                addonBiomarkers: selectedAddonBiomarkers.map(b => ({
                    id: b.id,
                    recommended: Boolean(b.recommended), // force boolean
                    why_recommended: String(b.why_recommended || "")
                })),
                // ---- Package add-ons ----
                addons: selectedAddons.map(p => ({
                    id: p.id,
                    recommended: Boolean(p.recommended), // force boolean
                    why_recommended: String(p.why_recommended || "")
                })),
                // ---- Group add-ons (NEW) ----
                addonGroups: selectedAddonGroups.map(g => ({ // ADD THIS BLOCK
                    id: g.id,
                    recommended: Boolean(g.recommended), // force boolean
                    why_recommended: String(g.why_recommended || "")
                }))
            };
            const result = await axios.put(
                `${process.env.REACT_APP_BASE_URL}packages/${updateAddOnPackageId}/update_addons`,
                payload
            );
            if (result.status === 200) {
                toast.success("Add-ons updated successfully");
                setOpenUpdateAddOnsDialog(false);
            } else {
                toast.error(result.data.message || "Failed to update add-ons");
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Failed to update add-ons";
            toast.error(msg);
            console.error("Error updating add-ons:", error.response?.data || error);
        }
    };
    const handleConfirmDelete = async () => {
        try {
            const result = await deleteRecord(deleteId, ApiEndPoints.PACKAGES);
            if (result.status === 200) {
                toast.success(result.message || "Deleted successfully");
                getPackagesList();
            } else {
                toast.error(result.message || "Failed to delete");
            }
        } catch (error) {
            toast.error("Failed to delete: " + (error.response?.data?.message || error.message));
        }
        setOpenDeleteDialog(false);
    };
    const filteredBiomarkers = biomarkersList.filter((biomarker) =>
        biomarker.name.toLowerCase().includes(biomarkerSearchQuery.toLowerCase())
    );
    const filteredBiomarkerGroups = biomarkerGroupsList.filter((group) =>
        group.name.toLowerCase().includes(biomarkerSearchQuery.toLowerCase())
    );
    const filteredAddonBiomarkers = selectBiomarkers.filter((biomarker) => // Changed from biomarkersList
        biomarker.name.toLowerCase().includes(addonSearchQuery.toLowerCase())
    );
    // Update this line (around line 650-655, just before the return statement, where other filtered variables are defined):
    const filteredAddonPackages = selectPackages.filter((pkg) =>
        pkg.id !== updateAddOnPackageId &&
        pkg.name.toLowerCase().includes(addonSearchQuery.toLowerCase())
    );
    return (
        <div className="min-width">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                }}
            >
                <Typography variant="h4">Services</Typography>
            </div>
            <Divider style={{ marginBottom: "20px", marginTop: "20px" }} />
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="Packages" />
                    <Tab label="Package Categories" />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <TextField
                        placeholder="Search Services"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)} // Use handler if debouncing
                        // onChange={(e) => setSearchQuery(e.target.value)} // Remove this line
                        InputProps={{
                            startAdornment: <SearchIcon />,
                        }}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleOpenPackageDialog}
                    >
                        Create New Service
                    </Button>
                </div>
                <div style={{ height: "65vh", width: "100%" }}>
                    <DataGrid
                        density="compact"
                        autoHeight
                        getRowHeight={() => "auto"}
                        pagination
                        // ❌ REMOVE: paginationMode="server"
                        loading={packagesDataGridOptions.loading}
                        // ❌ REMOVE: rowCount={packagesDataGridOptions.totalRows}
                        rowsPerPageOptions={packagesDataGridOptions.rowsPerPageOptions}
                        rows={packagesDataGridOptions.rows}
                        columns={packagesColumns}
                        page={packagesDataGridOptions.page - 1}
                        pageSize={packagesDataGridOptions.pageSize}
                        onPageChange={(newPage) => {
                            setPackagesDataGridOptions((old) => ({
                                ...old,
                                page: newPage + 1,
                            }));
                        }}
                        onPageSizeChange={(pageSize) => {
                            setPackagesDataGridOptions((old) => ({
                                ...old,
                                page: 1,
                                pageSize,
                            }));
                        }}
                    />
                </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <PackageCategories
                    onSaveSuccess={() => fetchCategories()} // Refresh package category select options
                />
            </TabPanel>
            {/* Add/Edit Package Dialog */}
            <Dialog open={openPackageDialog} onClose={handleClosePackageDialog} maxWidth="md" fullWidth>
                <DialogTitle>{packageId ? "Edit Service" : "Add a Service"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name *"
                                value={packageFormData.name}
                                onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Sub-title *"
                                value={packageFormData.sub_title}
                                onChange={(e) => setPackageFormData({ ...packageFormData, sub_title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description*"
                                multiline
                                rows={3}
                                value={packageFormData.description}
                                onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                            />
                        </Grid>
                        {/* NEW FIELDS */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={packageFormData.category || ""}
                                    label="Category"
                                    onChange={(e) => setPackageFormData({ ...packageFormData, category: e.target.value })}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {selectCategories.map((cat) => ( // Changed from categories to selectCategories
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={packageFormData.type}
                                    label="Type"
                                    onChange={(e) => setPackageFormData({ ...packageFormData, type: e.target.value })}
                                >
                                    {serviceTypeOptions.map((opt) => (
                                        <MenuItem key={opt} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tag"
                                value={packageFormData.tag}
                                onChange={(e) => setPackageFormData({ ...packageFormData, tag: e.target.value })}
                            />
                        </Grid>
                        {/* ────────────────────────────────────────────────────────────────────── */}
                        {/* PLACE THIS GRID ITEM AFTER the Tag field (or wherever you prefer) */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Instructions Before Test
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                                {packageFormData.instructionBeforeTest.map((inst, idx) => (
                                    <Chip
                                        key={idx}
                                        label={inst}
                                        size="small"
                                        onDelete={() => {
                                            const newInst = [...packageFormData.instructionBeforeTest];
                                            newInst.splice(idx, 1);
                                            setPackageFormData({ ...packageFormData, instructionBeforeTest: newInst });
                                        }}
                                    />
                                ))}
                            </Box>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Add instruction (press Enter)"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.target.value.trim()) {
                                        e.preventDefault();
                                        const val = e.target.value.trim();
                                        setPackageFormData({
                                            ...packageFormData,
                                            instructionBeforeTest: [...packageFormData.instructionBeforeTest, val],
                                        });
                                        e.target.value = "";
                                    }
                                }}
                            />
                        </Grid>
                        {/* ────────────────────────────────────────────────────────────────────── */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Result Time"
                                value={packageFormData.result_time || ""}
                                onChange={(e) => setPackageFormData({ ...packageFormData, result_time: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Service Provider (Establishment)</InputLabel>
                                <Select
                                    value={packageFormData.establishment_id || ""}
                                    label="Service Provider (Establishment)"
                                    onChange={(e) => setPackageFormData({ ...packageFormData, establishment_id: e.target.value })}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {establishments.map((est) => (
                                        <MenuItem key={est.id} value={est.id}>
                                            {est.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={packageFormData.recommended || false}
                                        onChange={(e) => setPackageFormData({ ...packageFormData, recommended: e.target.checked })}
                                    />
                                }
                                label="Recommended"
                            />
                        </Grid>
                        {/* END NEW FIELDS */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Base Price (AED)*"
                                type="number"
                                value={packageFormData.base_price}
                                onChange={(e) => setPackageFormData({ ...packageFormData, base_price: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Selling Price (AED)*"
                                type="number"
                                value={packageFormData.selling_price}
                                onChange={(e) => setPackageFormData({ ...packageFormData, selling_price: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Strike Price (AED)"
                                type="number"
                                value={packageFormData.strike_price}
                                onChange={(e) => setPackageFormData({ ...packageFormData, strike_price: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Discount Text"
                                value={packageFormData.discount_text}
                                onChange={(e) => setPackageFormData({ ...packageFormData, discount_text: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Add-on Price (AED)"
                                type="number"
                                value={packageFormData.addon_price}
                                onChange={(e) => setPackageFormData({ ...packageFormData, addon_price: e.target.value })}
                            />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Fasting Required?</InputLabel>
                                <Select
                                    value={packageFormData.fasting_required}
                                    label="Fasting Required?"
                                    onChange={(e) => setPackageFormData({ ...packageFormData, fasting_required: e.target.value })}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid> */}
                        {/* <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Fasting Hours"
                                type="number"
                                value={packageFormData.fasting_hours}
                                onChange={(e) => setPackageFormData({ ...packageFormData, fasting_hours: e.target.value })}
                            />
                        </Grid> */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Service Duration (minutes)"
                                // 🔥 CHANGE: removed type="number" to allow string input
                                value={packageFormData.service_duration_minutes}
                                onChange={(e) => setPackageFormData({
                                    ...packageFormData,
                                    service_duration_minutes: e.target.value // 🔥 CHANGE: string allowed
                                })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="SLA"
                                type="number"
                                value={packageFormData.sla}
                                onChange={(e) => setPackageFormData({ ...packageFormData, sla: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>SLA Unit</InputLabel>
                                <Select
                                    value={packageFormData.sla_unit}
                                    label="SLA Unit"
                                    onChange={(e) => setPackageFormData({ ...packageFormData, sla_unit: e.target.value })}
                                >
                                    <MenuItem value="Hours">Hours</MenuItem>
                                    <MenuItem value="Days">Days</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Demographics</InputLabel>
                                <Select
                                    multiple
                                    value={packageFormData.demographics}
                                    onChange={(e) => setPackageFormData({ ...packageFormData, demographics: e.target.value })}
                                    input={<OutlinedInput label="Demographics" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {demographicsOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            <Checkbox checked={packageFormData.demographics.indexOf(option) > -1} />
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Visible</InputLabel>
                                <Select
                                    value={packageFormData.visible}
                                    label="Visible"
                                    onChange={(e) => setPackageFormData({ ...packageFormData, visible: e.target.value })}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {packageFormData.image ? (
                                typeof packageFormData.image === "string" ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2">Current Image:</Typography>
                                        <img
                                            src={packageFormData.image || "no image found"}
                                            alt="Package"
                                            style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                            }}
                                        />
                                    </Box>
                                ) : null
                            ) : null}
                            <TextField
                                fullWidth
                                label="Upload New Image"
                                type="file"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ accept: "image/*" }}
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            console.log('Original file size:', file.size / 1024 / 1024, 'MB');
                                            const options = {
                                                maxSizeMB: 1, // Max size after compression
                                                maxWidthOrHeight: 1920, // Max dimension
                                                useWebWorker: true, // Improves performance
                                                initialQuality: 0.85 // Start with 85% quality (adjustable)
                                            };
                                            const compressedFile = await imageCompression(file, options);
                                            console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
                                            // Convert back to File object (name, type preserved)
                                            const finalFile = new File([compressedFile], file.name, {
                                                type: file.type,
                                                lastModified: Date.now(),
                                            });
                                            setPackageFormData({ ...packageFormData, image: finalFile });
                                        } catch (error) {
                                            console.error("Image compression error:", error);
                                            // Fallback: use original file
                                            setPackageFormData({ ...packageFormData, image: file });
                                        }
                                    } else {
                                        // Keep existing image if no new file selected
                                        setPackageFormData({ ...packageFormData, image: packageFormData.image });
                                    }
                                }}
                            />
                        </Grid>
                        {/* ---------- WORKING HOURS ----------
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Working Hours (Multiple Sessions per Day)</Typography>
                        </Grid>
                        {packageFormData.working_hours.map((day, dIdx) => (
                            <Grid item xs={12} key={dIdx}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>{day.day_of_week}</Typography>
                                {day.sessions.map((session, sIdx) => (
                                    <Grid container spacing={2} key={sIdx} alignItems="center">
                                        <Grid item xs={4}>
                                            <TextField
                                                label="Start Time"
                                                type="time"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                value={session.start_time}
                                                onChange={e => {
                                                    const newHours = [...packageFormData.working_hours];
                                                    newHours[dIdx].sessions[sIdx].start_time = e.target.value;
                                                    setPackageFormData({ ...packageFormData, working_hours: newHours });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="End Time"
                                                type="time"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                value={session.end_time}
                                                onChange={e => {
                                                    const newHours = [...packageFormData.working_hours];
                                                    newHours[dIdx].sessions[sIdx].end_time = e.target.value;
                                                    setPackageFormData({ ...packageFormData, working_hours: newHours });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            {day.sessions.length > 1 && (
                                                <Button
                                                    size="small"
                                                    color="secondary"
                                                    onClick={() => {
                                                        const newHours = [...packageFormData.working_hours];
                                                        newHours[dIdx].sessions.splice(sIdx, 1);
                                                        setPackageFormData({ ...packageFormData, working_hours: newHours });
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                ))}
                                <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                    onClick={() => {
                                        const newHours = [...packageFormData.working_hours];
                                        newHours[dIdx].sessions.push({ start_time: "", end_time: "" });
                                        setPackageFormData({ ...packageFormData, working_hours: newHours });
                                    }}
                                >
                                    Add Session
                                </Button>
                            </Grid>
                        ))} */}
                        {/* ---------- END WORKING HOURS ---------- */}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePackageDialog} style={{ color: "#666" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSavePackage}
                        variant="outlined"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Update Biomarkers Dialog */}
            {/* Update Biomarkers Dialog */}
            <Dialog
                open={openUpdateBiomarkersDialog}
                onClose={() => setOpenUpdateBiomarkersDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Update Biomarkers for Service {currentPackageDetails?.name || `ID: ${updatePackageId}`}</DialogTitle>
                <DialogContent>
                    {currentPackageDetails && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <Typography variant="body2" color="text.secondary">ID</Typography>
                                    <Typography variant="body1">{currentPackageDetails.id}</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="body2" color="text.secondary">Name</Typography>
                                    <Typography variant="body1">{currentPackageDetails.name}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    <Typography variant="subtitle2" gutterBottom>
                        Biomarker Groups ({selectedBiomarkerGroups.length} group{selectedBiomarkerGroups.length !== 1 ? 's' : ''}, {selectedBiomarkers.length} biomarker{selectedBiomarkers.length !== 1 ? 's' : ''} selected)
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Search groups or biomarkers"
                        size="small"
                        sx={{ mb: 2 }}
                        value={biomarkerSearchQuery}
                        onChange={(e) => setBiomarkerSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon />,
                        }}
                    />
                    <Box sx={{ maxHeight: "500px", overflowY: "auto", border: 1, borderColor: 'grey.300', borderRadius: 1, p: 2 }}>
                        {filteredBiomarkerGroups.map((group) => {
                            const isExpanded = expandedGroups.includes(group.id);
                            const isGroupSelected = selectedBiomarkerGroups.includes(group.id);
                            const groupBiomarkers = getBiomarkersForGroup(group.id).filter((biomarker) =>
                                biomarker.name.toLowerCase().includes(biomarkerSearchQuery.toLowerCase())
                            );
                            const selectedCount = getSelectedBiomarkersCount(group.id);
                            return (
                                <Box key={group.id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isGroupSelected}
                                                    onChange={(e) => handleGroupCheckboxChange(group.id, e.target.checked)}
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography>{group.name}</Typography>
                                                    {selectedCount > 0 && (
                                                        <Chip
                                                            label={`${selectedCount} biomarker${selectedCount !== 1 ? 's' : ''} selected`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            sx={{ flexGrow: 1 }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => toggleGroupExpansion(group.id)}
                                            aria-label={isExpanded ? "Collapse group" : "Expand group"}
                                        >
                                            {isExpanded ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
                                        </IconButton>
                                    </Box>
                                    {isExpanded && (
                                        <Box sx={{ ml: 4, mt: 1, pl: 2, borderLeft: 2, borderColor: 'grey.300' }}>
                                            {groupBiomarkers.length > 0 ? (
                                                groupBiomarkers.map((biomarker) => (
                                                    <FormControlLabel
                                                        key={biomarker.id}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedBiomarkers.includes(biomarker.id)}
                                                                onChange={(e) => {
                                                                    const groupId = biomarker.group_id;
                                                                    if (e.target.checked) {
                                                                        // Add biomarker
                                                                        const newSelectedBiomarkers = [...selectedBiomarkers, biomarker.id];
                                                                        setSelectedBiomarkers(newSelectedBiomarkers);
                                                                        // Automatically select the group if not already selected
                                                                        if (!selectedBiomarkerGroups.includes(groupId)) {
                                                                            setSelectedBiomarkerGroups([...selectedBiomarkerGroups, groupId]);
                                                                        }
                                                                        // Expand the group
                                                                        if (!expandedGroups.includes(groupId)) {
                                                                            setExpandedGroups([...expandedGroups, groupId]);
                                                                        }
                                                                    } else {
                                                                        // Remove biomarker
                                                                        const newSelectedBiomarkers = selectedBiomarkers.filter((id) => id !== biomarker.id);
                                                                        setSelectedBiomarkers(newSelectedBiomarkers);
                                                                        // Check if any biomarkers from this group are still selected
                                                                        const groupBiomarkers = getBiomarkersForGroup(groupId);
                                                                        const groupBiomarkerIds = groupBiomarkers.map(b => b.id);
                                                                        const hasSelectedBiomarkersInGroup = newSelectedBiomarkers.some(id =>
                                                                            groupBiomarkerIds.includes(id)
                                                                        );
                                                                        // Unselect group only if no biomarkers from this group are selected
                                                                        if (!hasSelectedBiomarkersInGroup) {
                                                                            setSelectedBiomarkerGroups(
                                                                                selectedBiomarkerGroups.filter((id) => id !== groupId)
                                                                            );
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                        label={biomarker.name}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No biomarkers available in this group
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}
                        {filteredBiomarkerGroups.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                No groups match the search criteria
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdateBiomarkersDialog(false)} style={{ color: "#666" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveUpdateBiomarkers}
                        variant="outlined"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Update Add-ons Dialog */}
            <Dialog open={openUpdateAddOnsDialog} onClose={() => setOpenUpdateAddOnsDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Update Add-ons for Service</DialogTitle>
                <DialogContent>
                    {/* Main Instructions */}
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                        Select the Add-ons (Biomarkers, Packages, and Groups) you'd like to update for this service.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Search Biomarkers, Packages, or Groups"
                            size="small"
                            value={addonSearchQuery}
                            onChange={(e) => setAddonSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                        />
                    </Box>
                    {/* Tabs for Biomarkers, Packages, and Groups */}
                    <Tabs
                        value={addonTabValue}  // CHANGED: Use addonTabValue
                        onChange={(e, newValue) => setAddonTabValue(newValue)}  // CHANGED: Use setAddonTabValue
                        variant="fullWidth"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Biomarkers" />
                        <Tab label="Packages" />
                        <Tab label="Groups" />
                    </Tabs>
                    <TabPanel value={addonTabValue} index={0}>
                        {/* Biomarkers Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                Biomarkers ({selectedAddonBiomarkers.length} selected)
                            </Typography>
                            <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                                {filteredAddonBiomarkers.map((biomarker) => (
                                    <div key={biomarker.id} sx={{ mb: 2, padding: 2, borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedAddonBiomarkers.some((item) => item.id === biomarker.id)}
                                                    onChange={(e) => handleBiomarkerChange(biomarker.id, e.target.checked)}
                                                />
                                            }
                                            label={biomarker.name}
                                        />
                                        {selectedAddonBiomarkers.some((item) => item.id === biomarker.id) && (
                                            <Box sx={{ ml: 4, mt: 1 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                selectedAddonBiomarkers.find((item) => item.id === biomarker.id)?.recommended || false
                                                            }
                                                            onChange={(e) => handleRecommendedChange(biomarker.id, e.target.checked)}
                                                        />
                                                    }
                                                    label="Recommended"
                                                />
                                                {selectedAddonBiomarkers.find((item) => item.id === biomarker.id)?.recommended && (
                                                    <TextField
                                                        fullWidth
                                                        label="Why Recommended?"
                                                        multiline
                                                        rows={2}
                                                        sx={{ mt: 1 }}
                                                        value={selectedAddonBiomarkers.find((item) => item.id === biomarker.id)?.why_recommended || ""}
                                                        onChange={(e) => handleWhyRecommendedChange(biomarker.id, e.target.value)}
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </div>
                                ))}
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={addonTabValue} index={1}>
                        {/* Packages Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                Add-on Packages ({selectedAddons.length} selected)
                            </Typography>
                            <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                                {filteredAddonPackages.map((pkg) => (
                                    <div key={pkg.id} sx={{ mb: 2, padding: 2, borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedAddons.some((item) => item.id === pkg.id)}
                                                    onChange={(e) => handleAddonPackageChange(pkg.id, e.target.checked)}
                                                />
                                            }
                                            label={pkg.name}
                                        />
                                        {selectedAddons.some((item) => item.id === pkg.id) && (
                                            <Box sx={{ ml: 4, mt: 1 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedAddons.find((item) => item.id === pkg.id)?.recommended || false}
                                                            onChange={(e) => handleAddonRecommendedChange(pkg.id, e.target.checked)}
                                                        />
                                                    }
                                                    label="Recommended"
                                                />
                                                {selectedAddons.find((item) => item.id === pkg.id)?.recommended && (
                                                    <TextField
                                                        fullWidth
                                                        label="Why Recommended?"
                                                        multiline
                                                        rows={2}
                                                        sx={{ mt: 1 }}
                                                        value={selectedAddons.find((item) => item.id === pkg.id)?.why_recommended || ""}
                                                        onChange={(e) => handleAddonWhyRecommendedChange(pkg.id, e.target.value)}
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </div>
                                ))}
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={addonTabValue} index={2}>
                        {/* Groups Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                Add-on Groups ({selectedAddonGroups.length} selected)
                            </Typography>
                            <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                                {filteredAddonGroups.map((group) => (
                                    <div key={group.id} sx={{ mb: 2, padding: 2, borderRadius: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedAddonGroups.some((item) => item.id === group.id)}
                                                    onChange={(e) => handleGroupChange(group.id, e.target.checked)}
                                                />
                                            }
                                            label={group.name}
                                        />
                                        {selectedAddonGroups.some((item) => item.id === group.id) && (
                                            <Box sx={{ ml: 4, mt: 1 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={selectedAddonGroups.find((item) => item.id === group.id)?.recommended || false}
                                                            onChange={(e) => handleGroupRecommendedChange(group.id, e.target.checked)}
                                                        />
                                                    }
                                                    label="Recommended"
                                                />
                                                {selectedAddonGroups.find((item) => item.id === group.id)?.recommended && (
                                                    <TextField
                                                        fullWidth
                                                        label="Why Recommended?"
                                                        multiline
                                                        rows={2}
                                                        sx={{ mt: 1 }}
                                                        value={selectedAddonGroups.find((item) => item.id === group.id)?.why_recommended || ""}
                                                        onChange={(e) => handleGroupWhyRecommendedChange(group.id, e.target.value)}
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </div>
                                ))}
                            </Box>
                        </Box>
                    </TabPanel>
                </DialogContent>
                <DialogActions sx={{ padding: "10px 24px" }}>
                    <Button onClick={() => setOpenUpdateAddOnsDialog(false)} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveUpdateAddOns} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmDialog
                scroll="paper"
                maxWidth="md"
                title="Confirm The Action"
                message={`Do you really want to delete this ${deleteType}?`}
                cancelButtonText="Cancel"
                confirmButtonText="Delete"
                openDialog={openDeleteDialog}
                handleDialogClose={() => setOpenDeleteDialog(false)}
                handleDialogAction={handleConfirmDelete}
            />
        </div>
    );
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Packages);