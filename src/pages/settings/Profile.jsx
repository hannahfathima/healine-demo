// Updated Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { changePasswordApi } from "../../../src/services/AuthServices";
import {
  getAdminUsersApi,
  getRolesApi,
  assignRoleApi,
  assignPermissionsApi,
  deleteAdminApi,
  resetAdminPasswordApi,
} from "../../../src/apis/services/AdminServices";
import {
  setLoading,
  setAdmins,
  setError,
} from "../../../src/store/reducers/adminSlice";
import Storage from "../../utils/HandelLocalStorage";
import { useNavigate } from "react-router-dom"; // Assuming React Router is used for navigation
import { DeleteIcon } from "lucide-react";
import { DeleteOutline } from "@mui/icons-material";
// ---------------------- STYLES --------------------------
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
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "end",
    marginRight: "20px",
    marginBottom: "20px",
    borderTop: "2px solid",
    marginTop: "20px",
    paddingTop: "20px",
    gap: "10px",
  },
  backBtn: {
    justifyContent: "center",
    width: "98px",
    height: "44px",
    textTransform: "capitalize",
    background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
    color: "#fff",
  },
  changeBtn: {
    justifyContent: "center",
    width: "180px",
    height: "44px",
    textTransform: "capitalize",
    background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
    color: "#fff",
  },
  manageRolesBtn: {
    justifyContent: "center",
    width: "150px",
    height: "44px",
    textTransform: "capitalize",
    background: "linear-gradient(180deg, #255480 0%, #173450 100%)",
    color: "#fff",
  },
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
  section: {
    marginBottom: "30px",
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
});
// ---------------------- MODULES FROM SIDEBAR --------------------------
const availableModules = [
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
];
// ---------------------- MAIN COMPONENT --------------------------
function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admins, loading } = useSelector((state) => state.admin);
  const [user, setUser] = useState();
  const [roles, setRoles] = useState([]);
  const retryRolesRef = useRef(false);
  const [openChangePass, setOpenChangePass] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  // ⭐ RESET PASSWORD POPUP
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [resetPassForm, setResetPassForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  // ---------------------- FETCH USER INFO --------------------------
  const getUserInfo = () => {
    Storage.retrieveItem("userDetails").then((params) => {
      if (params) {
        setUser(JSON.parse(params));
      }
    });
  };
 
  useEffect(() => {
    getUserInfo();
  }, []);
  useEffect(() => {
    if (user && user.role_id === 1) {
      fetchAdminUsers();
      fetchRoles();
    }
  }, [user]);
  // ---------------------- FETCH ADMIN LIST --------------------------
  const fetchAdminUsers = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAdminUsersApi(1, 10);
      if (response.success) {
        dispatch(setAdmins(response.data));
      } else {
        toast.error(response.message);
        dispatch(setError(response.message));
      }
    } catch (error) {
      toast.error("Failed to fetch admins");
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const response = await deleteAdminApi(id);
      if (response.success) {
        toast.success("Admin deleted successfully");
        fetchAdminUsers(); // reload admin list
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  };
  // ---------------------- FETCH ROLES --------------------------
  const fetchRoles = async () => {
    try {
      const response = await getRolesApi();
      if (response.success) {
        setRoles(response.data);
      } else {
        handleRolesFetchError();
      }
    } catch (error) {
      handleRolesFetchError();
    }
  };

  const handleRolesFetchError = () => {
    if (!retryRolesRef.current) {
      retryRolesRef.current = true;
      setTimeout(() => {
        fetchRoles();
      }, 1000);
    } else {
      window.location.reload();
    }
  };
  const isSuperAdmin = user?.role_id === 1;
  // ---------------------- PASSWORD FUNCTIONS --------------------------
  const handleOpenPassword = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setOpenChangePass(true);
  };
  const handleClosePassword = () => {
    setOpenChangePass(false);
  };
  const handlePasswordSubmit = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("All fields required");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await changePasswordApi({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      });
      toast.success(response.message);
      setOpenChangePass(false);
    } catch (error) {
      toast.error("Password change failed");
    }
  };
  // ---------------------- ROLE ASSIGNMENT --------------------------
  // ---------------------- ROLE ASSIGNMENT --------------------------
  // ⭐ UPDATED — Assign role + reload that admin’s modules
  const handleRoleChange = async (userId, roleId) => {
    // ❗ Super Admin role (id = 1) blocking
    if (roleId === 1) {
      toast.error("Cannot assign Super Admin role");
      return;
    }
    try {
      const payload = { user_id: userId, role_id: roleId };
      const response = await assignRoleApi(payload);
      if (response.success) {
        toast.success("Role updated successfully");
        // ⭐ FETCH updated admin list
        await fetchAdminUsers();
        // ⭐ UPDATE selected admin permissions if open
        if (selectedAdmin?.id === userId) {
          // Reload selected admin from refreshed list
          const updated = admins.find((a) => a.id === userId);
          if (updated) {
            setSelectedAdmin(updated);
            setSelectedModules(
              updated.permissions?.map((p) => p.module) || []
            );
          }
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };
  // ---------------------- PERMISSIONS FUNCTIONS --------------------------
  // ⭐ ADDED DEBUG LOG
  const handleOpenPermissions = (admin) => {
    console.log("🟡 [Profile] Opening permissions for admin:", admin);
    setSelectedAdmin(admin);
    setSelectedModules(admin.permissions || []); // ✅ FIXED - directly use string array
    setOpenPermissions(true);
  };
  const handleClosePermissions = () => {
    setOpenPermissions(false);
    setSelectedAdmin(null);
    setSelectedModules([]);
  };
  const handleModuleToggle = (moduleValue) => {
    setSelectedModules((prev) =>
      prev.includes(moduleValue)
        ? prev.filter((m) => m !== moduleValue)
        : [...prev, moduleValue]
    );
  };
  // ⭐⭐⭐ UPDATED: Corrected admin_id → user_id
  const handleSavePermissions = async () => {
    if (!selectedAdmin) {
      toast.error("Admin not selected");
      return;
    }
    const payload = {
      user_id: selectedAdmin.id, // ⭐ UPDATED FIELD NAME
      modules: selectedModules,
    };
    console.log("🟡 [Profile] Saving permissions...", {
      selectedAdmin,
      selectedModules,
      payload,
    });
    try {
      const response = await assignPermissionsApi(payload);
      console.log("✅ [Profile] assignPermissionsApi response:", response);
      if (response.success) {
        toast.success(response.message);
        fetchAdminUsers();
        handleClosePermissions();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("❌ [Profile] Error updating permissions:", error);
      toast.error("Unable to save permissions");
    }
  };
  // ---------------------- FILTER CURRENT USER FROM TABLE --------------------------
  const filteredAdmins =
    admins?.filter((admin) => admin.id !== user?.id) || [];
  // ---------------------- RENDER --------------------------
  return (
    <div className="min-width">
      <div
        className="d-flex mt-2rem mb-2 pb-2"
        style={{ borderBottom: "2px solid", alignItems: "baseline" }}
      >
        <h4 className="pagename-heading ml-0">Profile Page</h4>
      </div>
      {/* USER DETAILS */}
      <div className={classes.section}>
        {user && (
          <>
            <Grid container spacing={2}>
              <Grid item lg={6}>
                <Typography className={classes.label}>Name</Typography>
                <Typography className={classes.value}>{user.name}</Typography>
              </Grid>
              <Grid item lg={6}>
                <Typography className={classes.label}>Email</Typography>
                <Typography className={classes.value}>{user.email}</Typography>
              </Grid>
              <Grid item lg={6}>
                <Typography className={classes.label}>Role</Typography>
                <Typography className={classes.value}>
                  {user.role_id === 1
                    ? "Super Admin"
                    : (user.role?.name || user.role)}
                </Typography>
              </Grid>
            </Grid>
            <div className={classes.buttonWrapper}>
              {isSuperAdmin && (
                <Button
                  className={classes.manageRolesBtn}
                  variant="contained"
                  onClick={() => navigate("/register")} // ⭐ NEW
                >
                  Create Admin
                </Button>
              )}
              {isSuperAdmin && (
                <Button
                  className={classes.manageRolesBtn}
                  variant="contained"
                  onClick={() => navigate("/manage-roles")}
                >
                  Manage Roles
                </Button>
              )}
              <Button
                className={classes.changeBtn}
                variant="contained"
                onClick={handleOpenPassword}
              >
                Change Password
              </Button>
            </div>
          </>
        )}
      </div>
      {/* ---------------- ADMIN TABLE (Super Admin Only) ---------------- */}
      {isSuperAdmin && (
        <div className={classes.section}>
          <Typography variant="h5" className={classes.sectionTitle}>
            Admin Management
          </Typography>
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
                    <TableCell className={classes.tableHeader}>Email</TableCell>
                    <TableCell className={classes.tableHeader}>Role</TableCell>
                    <TableCell className={classes.tableHeader}>Modules</TableCell>
                    <TableCell className={classes.tableHeader}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>{admin.id}</TableCell>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Select
                            value={admin.role_id}
                            disabled={admin.role_id === 1} // ⭐ SUPER ADMIN cannot be changed
                            onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                            size="small"
                            style={{ minWidth: 120 }}
                          >
                            {roles
                              .filter((role) => role.id !== 1)
                              .map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                  {role.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          {admin.permissions && admin.permissions.length > 0 ? (
                            admin.permissions.map((moduleName, index) => (
                              <Chip
                                key={index}
                                label={availableModules.find(m => m.value === moduleName)?.label || moduleName}
                                size="small"
                                className={classes.permissionChip}
                                color="primary"
                                variant="outlined"
                              />
                            ))
                          ) : (
                            <Typography>No modules</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedAdmin(admin); // ⭐ store admin
                              setOpenResetPassword(true); // ⭐ open password modal
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            style={{ marginLeft: "5px" }}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No admins found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}
      {/* ---------------- CHANGE PASSWORD DIALOG ---------------- */}
      <Dialog open={openChangePass} onClose={handleClosePassword}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {/* CURRENT PASSWORD */}
          <TextField
            margin="dense"
            label="Current Password"
            type={showPassword.current ? "text" : "password"}
            fullWidth
            variant="standard"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        current: !showPassword.current,
                      })
                    }
                  >
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* NEW PASSWORD */}
          <TextField
            margin="dense"
            label="New Password"
            type={showPassword.new ? "text" : "password"}
            fullWidth
            variant="standard"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        new: !showPassword.new,
                      })
                    }
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* CONFIRM PASSWORD */}
          <TextField
            margin="dense"
            label="Confirm Password"
            type={showPassword.confirm ? "text" : "password"}
            fullWidth
            variant="standard"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePassword}>Cancel</Button>
          <Button
            className={classes.backBtn}
            variant="contained"
            onClick={handlePasswordSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* ---------------- PERMISSIONS DIALOG ---------------- */}
      {/* ---------------- RESET PASSWORD DIALOG ---------------- */}
      <Dialog
        open={openResetPassword}
        onClose={() => setOpenResetPassword(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Reset Password – {selectedAdmin?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="New Password"
            value={resetPassForm.newPassword}
            onChange={(e) =>
              setResetPassForm({ ...resetPassForm, newPassword: e.target.value })
            }
          />
          <TextField
            margin="dense"
            fullWidth
            label="Confirm Password"
            value={resetPassForm.confirmPassword}
            onChange={(e) =>
              setResetPassForm({
                ...resetPassForm,
                confirmPassword: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetPassword(false)}>Cancel</Button>
          <Button
            className={classes.backBtn}
            variant="contained"
            onClick={async () => {
              if (!resetPassForm.newPassword || !resetPassForm.confirmPassword) {
                toast.error("Password fields required");
                return;
              }
              if (resetPassForm.newPassword !== resetPassForm.confirmPassword) {
                toast.error("Passwords do not match");
                return;
              }
              try {
                const payload = {
                  user_id: selectedAdmin.id,
                  new_password: resetPassForm.newPassword,
                  confirm_password: resetPassForm.confirmPassword,
                };
                const response = await resetAdminPasswordApi(payload);
                if (response.success) {
                  toast.success("Password reset successfully");
                  setOpenResetPassword(false);
                } else {
                  toast.error(response.message);
                }
              } catch (err) {
                toast.error("Failed to reset password");
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default Profile;