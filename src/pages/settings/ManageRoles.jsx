import React, { useState, useEffect } from "react";
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, FormGroup, FormControlLabel, Chip, IconButton, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { getRolesApi, createRoleApi, updateRoleApi, deleteRoleApi } from "../../../src/apis/services/AdminServices";
import { useNavigate } from "react-router-dom"; // For back navigation if needed

// ---------------------- STYLES --------------------------
const useStyles = makeStyles({
    tableContainer: {
        marginTop: "20px",
        marginBottom: "20px",
    },
    tableHeader: {
        backgroundColor: "#f5f5f5",
        fontWeight: "600",
    },
    permissionChip: {
        margin: "2px",
    },
    sectionTitle: {
        marginBottom: "15px",
        fontWeight: "600",
        color: "#255480",
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        padding: "20px",
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "end",
        marginBottom: "20px",
        gap: "10px",
    },
    addBtn: {
        justifyContent: "center",
        width: "120px",
        height: "44px",
        textTransform: "capitalize",
        background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
        color: "#fff",
    },
});

// ---------------------- AVAILABLE ROLE MODULES --------------------------

const availableRoleModules = [
    { value: "specialities", label: "Specialities" },
    { value: "professionals", label: "Professionals" },
    { value: "establishments", label: "Establishments" },
    { value: "departments", label: "Departments" },
    { value: "establishmenttypes", label: "Establishment Types" },
    { value: "establishment-sub-types", label: "Establishment Sub Types" },
    { value: "professionstypes", label: "Professions Types" },
    { value: "banners", label: "Banners" },
    { value: "nationalities", label: "Nationalities" },
    { value: "facilities", label: "Facilities" },
    { value: "services", label: "Services" },
    { value: "languages", label: "Languages" },
    { value: "zones", label: "Zones" },
    { value: "cities", label: "Cities" },
    { value: "faq", label: "FAQ" },
    { value: "biomarkers", label: "Biomarkers" },
    { value: "packages", label: "Medical Services" },
    { value: "demo-login", label: "Demo Login" },
    { value: "bookings", label: "Bookings" },
    { value: "insurances", label: "Insurances" },
    { value: "service-bookings", label: "Service Booking" },
    { value: "promotions", label: "Promotions" },
];


// ---------------------- MAIN COMPONENT --------------------------
function ManageRoles() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleName, setRoleName] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);

    // ---------------------- FETCH ROLES --------------------------
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await getRolesApi();
            if (response.success) {
                setRoles(response.data.filter((role) => role.id !== 1)); // Exclude Super Admin
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to fetch roles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // ---------------------- DIALOG FUNCTIONS --------------------------
    const handleOpenCreate = () => {
        setIsEdit(false);
        setRoleName("");
        setSelectedModules([]);
        setOpenDialog(true);
    };

    const handleOpenEdit = (role) => {
        setIsEdit(true);
        setSelectedRole(role);
        setRoleName(role.name);
        setSelectedModules(role.permissions?.map((p) => p.module) || []);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRole(null);
    };

    const handleModuleToggle = (moduleValue) => {
        setSelectedModules((prev) =>
            prev.includes(moduleValue)
                ? prev.filter((m) => m !== moduleValue)
                : [...prev, moduleValue]
        );
    };
    const handleSaveRole = async () => {
        if (!roleName.trim()) {
            toast.error("Role name is required");
            return;
        }

        const payload = {
            name: roleName.trim(),
            modules: selectedModules,
        };

        try {
            let response;
            if (isEdit && selectedRole) {
                // Updating existing role
                response = await updateRoleApi(selectedRole.id, payload);
            } else {
                // Creating a new role
                response = await createRoleApi(payload); // Using createRoleApi with token automatically handled
            }

            if (response.success) {
                toast.success(response.message);
                fetchRoles();  // Reload roles after creation
                handleCloseDialog(); // Close dialog after success
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(isEdit ? "Failed to update role" : "Failed to create role");
        }
    };

    // ---------------------- DELETE ROLE --------------------------
    const handleDeleteRole = async (id) => {
        if (!window.confirm("Are you sure you want to delete this role?")) {
            return;
        }
        try {
            const response = await deleteRoleApi(id);
            if (response.success) {
                toast.success(response.message);
                fetchRoles();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to delete role");
        }
    };

    // ---------------------- RENDER --------------------------
    return (
        <div className="min-width">
            <div
                className="d-flex mt-2rem mb-2 pb-2"
                style={{ borderBottom: "2px solid", alignItems: "baseline" }}
            >
                <h4 className="pagename-heading ml-0">Manage Roles</h4>
                <Button
                    onClick={() => navigate(-1)}
                    style={{ marginLeft: "auto" }}
                    variant="outlined"
                >
                    Back
                </Button>
            </div>
            <div className={classes.buttonWrapper}>
                <Button
                    className={classes.addBtn}
                    variant="contained"
                    onClick={handleOpenCreate}
                    startIcon={<AddIcon />}
                >
                    Add Role
                </Button>
            </div>
            {loading ? (
                <div className={classes.loadingContainer}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.tableHeader}>ID</TableCell>
                                <TableCell className={classes.tableHeader}>Name</TableCell>
                                <TableCell className={classes.tableHeader}>Permissions</TableCell>
                                <TableCell className={classes.tableHeader}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>{role.id}</TableCell>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>
                                            {role.permissions?.length ? (
                                                role.permissions.map((p, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={p.module}
                                                        size="small"
                                                        className={classes.permissionChip}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))
                                            ) : (
                                                <Typography>No permissions</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenEdit(role)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteRole(role.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No roles found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* ---------------- ROLE DIALOG (CREATE/EDIT) ---------------- */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEdit ? "Edit Role" : "Create New Role"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Role Name"
                        fullWidth
                        variant="standard"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                    <Typography style={{ marginTop: "15px" }}>Select permissions:</Typography>
                    <FormGroup style={{ marginTop: "15px" }}>
                        {[...availableRoleModules]
                            .sort((a, b) => {
                                const aSel = selectedModules.includes(a.value);
                                const bSel = selectedModules.includes(b.value);
                                return aSel === bSel ? 0 : aSel ? -1 : 1; // Selected come on TOP
                            })
                            .map((module) => (
                                <FormControlLabel
                                    key={module.value}
                                    control={
                                        <Checkbox
                                            checked={selectedModules.includes(module.value)}
                                            onChange={() => handleModuleToggle(module.value)}
                                        />
                                    }
                                    label={module.label}
                                />
                            ))}
                    </FormGroup>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        className={classes.addBtn}
                        variant="contained"
                        onClick={handleSaveRole}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ManageRoles;
