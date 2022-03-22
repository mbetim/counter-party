import { Add, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import React from "react";
import { FormikTextField } from "../formik/FormikTextField";
import * as yup from "yup";

export interface FormData {
  incrementOptions: number[];
}

interface PartyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const initialValues: FormData = {
  incrementOptions: [-1, 1],
};

const validationSchema = yup.object({
  incrementOptions: yup.array(yup.number()).max(6).required(),
});

export const PartyFormDialog: React.FC<PartyFormDialogProps> = ({ isOpen, onClose, onSubmit }) => (
  <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>Create a party</DialogTitle>

    <DialogContent>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values }) => (
          <Form>
            <Typography>Increment options:</Typography>

            <FieldArray name="incrementOptions">
              {({ push, remove }) => (
                <>
                  {values.incrementOptions.map((_, index) => (
                    <Grid key={index} container spacing={1} alignItems="center">
                      <Grid item xs={11}>
                        <FormikTextField
                          name={`incrementOptions[${index}]`}
                          label={`Option ${index + 1}`}
                          type="number"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <IconButton
                          disabled={values.incrementOptions.length === 1}
                          onClick={() => remove(index)}
                        >
                          <Close />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => push(0)}
                    startIcon={<Add />}
                    disabled={values.incrementOptions.length >= 6}
                  >
                    Add option
                  </Button>
                </>
              )}
            </FieldArray>

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
