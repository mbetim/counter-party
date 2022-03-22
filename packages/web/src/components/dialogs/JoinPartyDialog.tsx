import { Button, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { FormikTextField } from "../formik/FormikTextField";

interface FormData {
  name: string;
}

interface JoinPartyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const initialValues: FormData = {
  name: "",
};

const validationSchema = yup.object({
  name: yup.string().required(),
});

export const JoinPartyDialog: React.FC<JoinPartyDialogProps> = ({ isOpen, onClose, onSubmit }) => (
  <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>Create a party</DialogTitle>

    <DialogContent>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {() => (
          <Form>
            <FormikTextField name="name" label="Party name" required fullWidth />

            <Stack direction="row" justifyContent="end" sx={{ mt: 2 }}>
              <Button onClick={onClose}>Cancel</Button>

              <Button type="submit">Create</Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </DialogContent>
  </Dialog>
);
