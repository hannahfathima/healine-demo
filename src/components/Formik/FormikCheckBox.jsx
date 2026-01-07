import React from "react";
import _ from "lodash";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import images from "../../assets/images/index";

const FormikCheckBox = ({
  field: { ...fields },
  ...props
}): React.ReactNode => {
  const { label, className, ...rest } = props;
  // const error = Boolean(
  //   _.get(touched, fields?.name) && _.get(errors, fields?.name)
  // );

  return (
    <FormControl disabled={props?.disabled}>
      <FormGroup>
        <FormControlLabel
          className={`check ${className}`}
          label={label}
          control={
            <Checkbox
              {...fields}
              {...rest}
              icon={<img src={images.IcUnChecked} />}
              checkedIcon={<img src={images.IcChecked} />}
              checked={fields?.value}
              style={{
                color: "#8A92A6",
              }}
            />
          }
        />
      </FormGroup>
      {/* {error && (
        <FormHelperText error>{error && errors[fields?.name]}</FormHelperText>
      )} */}
    </FormControl>
  );
};

export default FormikCheckBox;
