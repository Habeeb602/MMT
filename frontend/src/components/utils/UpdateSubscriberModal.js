import { useState } from "react";
// import { sampleSubscriberData } from "../Sample";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

export const UpdateSubscriberModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  validations,
  row,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const [rowData, setRowData] = useState(null);
  // row -> currently selected record with edit option
  // which returns the data of the current record from the table.

  // rowData -> has the Subscriber record, which selected from "Select Subscriber" Modal.

  const handleSubmit = () => {
    //put your validation logic here
    for (let key in values) {
      if ((values[key] === "" || values[key] === undefined) && row != null) {
        switch (key) {
          case "name":
            values.name = row.original.name;
            break;
          case "address":
            values.address = row.original.address;
            break;
          case "phone":
            values.phone = row.original.phone;
            break;
          case "monthly_sub_amt":
            values.monthly_sub_amt = row.original.monthly_sub_amt;
            break;
          case "family_name":
            values.family_name = row.original.family_name;
            break;
          default:
        }
      }
    }

    console.log(values);
    console.log(rowData);
    const _validations = [
      validations[0](values.name),
      validations[1](values.phone),
      validations[2](values.monthly_sub_amt),
    ];
    console.log(_validations);
    for (let x of _validations) {
      if (!x[0]) {
        window.alert(x[1]);
        return;
      }
    }
    onSubmit(values);
    setRowData(null);
    Object.keys(values).forEach((k) => (values[k] = ""));
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Update Subscription</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
              marginTop: "1.5%",
            }}
          >
            {columns.map((column) => (
              <TextField
                InputProps={
                  column.accessorKey === "id" ? { readOnly: true } : {}
                }
                required={
                  column.accessorKey === "name" ||
                  column.accessorKey === "phone" ||
                  column.accessorKey === "monthly_sub_amt"
                    ? true
                    : false
                }
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                type={column.type}
                defaultValue={
                  column.accessorKey === "name" && row !== null
                    ? row.original.name
                    : column.accessorKey === "address" && row !== null
                    ? row.original.address
                    : column.accessorKey === "phone" && row !== null
                    ? row.original.phone
                    : column.accessorKey === "family_name" && row !== null
                    ? row.original.family_name
                    : column.accessorKey === "monthly_sub_amt" && row !== null
                    ? row.original.monthly_sub_amt
                    : column.accessorKey === "id" && row !== null
                    ? (values.id = row.original.id)
                    : undefined
                }
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Update Subscriber
        </Button>
      </DialogActions>
    </Dialog>
  );
};
