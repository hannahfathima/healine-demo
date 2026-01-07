import {
  Autocomplete,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";


const FormikAutocomplete = ({ textFieldProps, ...props }) => {
  const {
    form: { setTouched, setFieldValue },
  } = props;
  //   const { error, helperText, ...field } = fieldToTextField(props);
  const { error, placeholder, helperText, required, ...field } = props;
  //   const { name } = { ...field };
  const name = field.field.name;
  //   field: { ...fields }
  //   console.log("name", name);
  // console.log("field", field);
  return (
    <FormControl fullWidth>
      <Typography
        style={{
          marginBottom: "11px",
          color: "#1E1E1E",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        {props?.label} {required && <span style={{ color: "red" }}> *</span>}
      </Typography>
      <Autocomplete
        {...props}
        {...field}
        onChange={(_, value) => setFieldValue(name, value)}
        onBlur={() => setTouched({ [name]: true })}
        getOptionSelected={(item, current) => item.id == current.id}
        isOptionEqualToValue={(item, current) => item.id == current.id}
        // isOptionEqualToValue={true}
        // getOptionSelected={(item, current) => console.log("item1", item)}
        // isOptionEqualToValue={(item, current) => console.log("item12", current)}
        renderInput={(props) => (
          <TextField
            {...props}
            {...textFieldProps}
            helperText={helperText}
            error={error}
            placeholder={placeholder}
          />
        )}
      />
    </FormControl>
  );
};

export default FormikAutocomplete;
