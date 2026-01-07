import React from "react";
import _ from "lodash";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  label_shrinked: {
    minWidth: "200px",
    display: "flex",
  },
  textField: {
    border: "1px solid #B4ADAD !important",
    borderRadius: "6px !important",
  },
});

const FormikInput = function ({
  field: { ...fields },
  ...props
}): React.ReactNode {
  const styles = useStyles();
  const {
    id,
    maxLength,
    isDefaultValue,
    multiline,
    className,
    hasObject = false,
    controlClassName,
    placeHolder,
    required,
    sx,
    noMaxLength,
    ...rest
  } = props;
  //   const error = Boolean(
  //     _.get(touched, fields?.name) && _.get(errors, fields?.name)
  //   );
  //   const getError = () => {
  //     let errorString = errors;
  //     if (hasObject)
  //       fields?.name
  //         ?.split(".")
  //         .map((name: string) => (errorString = errorString[name]));
  //     return errorString;
  //   };
  return (
    <FormControl fullWidth className={controlClassName} sx={sx}>
      <Typography
        style={{
          marginBottom: "11px",
          color: "#1E1E1E",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        {props?.label} {required && <span style={{ color: "red" }}>*</span>}
      </Typography>
      {/* {props?.label && (
        <InputLabel
          classes={{
            root: styles.label,
            shrink: styles.label_shrinked,
          }}
        >
          {props?.label}
        </InputLabel>
      )} */}
      {isDefaultValue ? (
        <TextField
          {...fields}
          {...rest}
          id={id}
          label={""}
          className={className}
          multiline={multiline}
          placeholder={placeHolder}
          //   error={error}
          autoComplete="off"
          inputProps={{
            maxLength: noMaxLength ? -1 : maxLength ? maxLength : -1,
            className: styles.textField,
          }}
        />
      ) : (
        <TextField
          {...fields}
          {...rest}
          id={id}
          className={className}
          placeholder={placeHolder}
          label={""}
          value={props.type === "number" ? fields?.value || "" : fields?.value}
          multiline={multiline}
          //   error={error}
          autoComplete="off"
          inputProps={{
            maxLength: noMaxLength ? -1 : maxLength ? maxLength : -1,
            className: styles.textField,
          }}
        />
      )}
      {/* {error && (
        <FormHelperText error>
          {error && (hasObject ? getError() : errors[fields?.name])}
        </FormHelperText>
      )} */}
    </FormControl>
  );
};

export default FormikInput;
