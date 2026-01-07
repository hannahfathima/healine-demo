import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormikInput from "../../components/Formik/FormikInput";
import ShowInputError from "../../components/ShowInputError";
import { register, getRoles } from "../../apis/services/AuthApiService";  // ⭐ UPDATED
import { toast } from "react-toastify";
import Storage from "../../utils/HandelLocalStorage";
import { loginSuccess } from "../../store/reducers/authSlice";
import { Routing } from "../../shared/constants/routing";
import "./Auth.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  // ⭐ PREVENT NON-SUPER ADMIN FROM ACCESSING REGISTER PAGE
  useEffect(() => {
    const user = Storage.retrieveItem("userDetails").then((u) => {
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.role_id !== 1) {
          toast.error("Only Super Admin can create new admins");
          navigate("/settings/profile");   // redirect back
        }
      }
    });
  }, []);

  // ⭐ NEW — Load roles on mount
  useEffect(() => {
    getRoles().then((res) => setRoles(res));
  }, []);

  const initialState = {
    name: "",
    email: "",
    password: "",
    role_id: "", // ⭐ NEW
  };

  const handleSubmit = async (values) => {
    let data = {
      name: values.name,
      email: values.email,
      password: values.password,
      role_id: values.role_id,
    };

    const result = await register(data);

    if (result.status === 200) {
      toast.success("Admin created successfully!");

      // ⭐ DO NOT LOGIN NEW ADMIN
      // ⭐ DO NOT STORE NEW ADMIN IN LOCALSTORAGE
      // ⭐ SUPER ADMIN REMAINS LOGGED IN

      navigate("/settings/profile");  // stay in super admin panel
    } else {
      toast.error(result.message);
    }
  };


  return (
    <div className="auth-form-container">
      <h2 style={{ textAlign: "center" }}>Register</h2>

      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={true}
        enableReinitialize={true}
      >
        {(props) => {
          const { handleSubmit, values, setFieldValue } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>

                {/* Full Name */}
                <Grid item xs={12}>
                  <Field
                    label="Full Name"
                    name="name"
                    type="text"
                    component={FormikInput}
                  />
                  <ErrorMessage name="name" component={ShowInputError} />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    component={FormikInput}
                  />
                  <ErrorMessage name="email" component={ShowInputError} />
                </Grid>

                {/* Password */}
                <Grid item xs={12}>
                  <Field
                    label="Password"
                    name="password"
                    type="password"
                    component={FormikInput}
                  />
                  <ErrorMessage name="password" component={ShowInputError} />
                </Grid>

                {/* ⭐ NEW — ROLE DROPDOWN */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Select Role"
                    value={values.role_id}
                    onChange={(e) => setFieldValue("role_id", e.target.value)}
                  >
                    {roles
                      .filter((role) => role.id !== 1) // ⭐ BLOCK SUPER ADMIN ROLE
                      .map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}

                  </TextField>
                  {!values.role_id && (
                    <p style={{ color: "red", fontSize: 12 }}>
                      Role is required
                    </p>
                  )}
                </Grid>

                {/* Submit */}
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <Button type="submit" size="large" variant="contained">
                    Create Account
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>

      {/* Login redirect */}
      {/* <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button
          className="link-btn"
          style={{
            background: "transparent",
            border: "none",
            color: "#1976d2",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Already have an account? Login here.
        </button>
      </div> */}
    </div>
  );
};

export default Register;
