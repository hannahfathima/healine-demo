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
          </>
        )}
      </div>
    </div>
  );
}
export default Profile;