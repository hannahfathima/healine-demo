import { Button, Grid } from "@mui/material";
import { ErrorMessage, Field, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormikInput from "../../components/Formik/FormikInput";
import ShowInputError from "../../components/ShowInputError";
import { LoginValidator } from "../../shared/validations/AuthValidations";
import { loginSuccess } from "../../store/reducers/authSlice";
import { useDispatch } from "react-redux";
import { Routing } from "../../shared/constants/routing";
import { toast } from "react-toastify";
import { login } from "../../apis/services/AuthApiService";
import Storage from "../../utils/HandelLocalStorage";

// ⭐ NEW — Import logo

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const initialState = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    let data = {
      email: values.email,
      password: values.password,
    };

    const result = await login(data);

    if (result.status === 200) {
      Storage.storeItem("userDetails", JSON.stringify(result.data));
      dispatch(loginSuccess(result.data));
      navigate(Routing.Profile, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-form-container"
    >

    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px"}}>
        {/* ⭐ NEW — Logo Added */}
      <div style={{
        textAlign: "left", width: "50px",
        height: "auto",
      }}>
        <img
          src='/healine_-_Copy-removebg-preview.png'
          alt="App Logo"
          style={{
            width: "100%",
            marginBottom: "10px",
            objectFit: "contain",
          }}
        />
      </div>
      {/* ⭐ END NEW */}

      <h2 style={{ textAlign: "center", marginBottom: "20px",fontSize:'25px',marginTop:"10px",fontWeight:"500"}}>Login</h2>
    </div>

      <Formik
        initialValues={initialState}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={true}
        enableReinitialize={true}
        validationSchema={LoginValidator}
      >
        {(props) => {
          const { handleSubmit } = props;
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    maxLength={50}
                    component={FormikInput}
                  />
                  <ErrorMessage name="email" component={ShowInputError} />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    maxLength={16}
                    component={FormikInput}
                  />
                  <ErrorMessage name="password" component={ShowInputError} />
                </Grid>

                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <Button
                    size="large"
                    variant="contained"
                    disableElevation
                    type="submit"
                    color="primary"
                  >
                    Log In
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>

      {/* (Optional Register link already present in your old code) */}
    </div>
  );
};

export default Login;
