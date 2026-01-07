import * as Yup from "yup";

export const LoginValidator = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password Is Required"),
});
