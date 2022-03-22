import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { FieldAttributes, useField } from "formik";

type FormikTextFieldProps = TextFieldProps & FieldAttributes<Record<string, unknown>>;

export const FormikTextField: React.FC<FormikTextFieldProps> = ({ helperText, ...props }) => {
  const [field, meta] = useField<Record<string, unknown>>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField {...props} {...field} helperText={errorText || helperText} error={!!errorText} />
  );
};
