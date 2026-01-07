// eslint-disable @typescript-eslint/no-explicit-any 
import React from "react";
import _ from "lodash";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  select: {
    "& .MuiOutlinedInput-root": {
      height: "38px",
      width: "62px",
      color: "#646464",
      border: "1px solid #B4ADAD",
    },
  },
}));
// interface ISelectOption {
//   title: string;
//   value: any;
//   disabled: boolean;
// }

const FormikSelect = ({
  field: { ...fields },
  //   form: { touched, errors },
  ...props
}) => {
  const classes = useStyles();

  const {
    defaultOption,
    sx,
    fullWidth = true,
    hasObject = false,
    className,
    required,
    ...rest
  } = props;

  //   const error = Boolean(
  //     _.get(touched, fields.name) && _.get(errors, fields.name)
  //   );
  //   const getError = () => {
  //     let errorString = errors;
  //     if (hasObject)
  //       fields?.name?.split(".").map((name) => (errorString = errorString[name]));
  //     return errorString;
  //   };

  return (
    <FormControl fullWidth={fullWidth} className={`${className}`}>
      {/* <Typography
        style={{
          marginBottom: "11px",
          color: "#8A92A6",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        {props?.label}
      </Typography> */}
      <InputLabel title={props.label}>
        {props.label} {required && <span style={{ color: "red" }}>*</span>}
      </InputLabel>
      <Select
        // multiple
        {...fields}
        {...rest}
        // error={error}
        MenuProps={{
          PaperProps: {
            className: "select-wrapper",
          },
        }}
        className={classes.select}
        sx={sx}
      >
        {defaultOption && (
          <MenuItem value={typeof fields.value === "string" ? "" : 0}>
            {" "}
            -- Select --{" "}
          </MenuItem>
        )}
        {props.options &&
          props.options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option?.disabled ? option?.disabled : false}
            >
              {option.title}
            </MenuItem>
          ))}
      </Select>
      {/* {error && (
        <FormHelperText error>
          {error && (hasObject ? getError() : errors[fields?.name])}
        </FormHelperText>
      )} */}
    </FormControl>
  );
};

export default FormikSelect;
