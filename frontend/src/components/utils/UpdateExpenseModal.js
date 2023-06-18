import { useState, useEffect } from "react";
import { SelectSubscriberModal } from "./SelectSubscriberModal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Switch,
  MenuItem,
} from "@mui/material";
import { Filter } from "@mui/icons-material";

export const UpdateExpenseModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  validations,
  row,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = undefined;
      return acc;
    }, {})
  );

  useEffect(() => {
    if (row != null) {
      values.type = row.original.type;
    }
  }, [row]);
  const [rowData, setRowData] = useState(null);
  const options = [
    { value: "New buy" },
    { value: "Service/Maintainence" },
    { value: "Losses" },
  ];
  // row -> currently selected record with edit option
  // which returns the data of the current record from the table.

  // rowData -> has the Subscriber record, which selected from "Select Subscriber" Modal.

  const handleSubmit = () => {
    //put your validation logic here
    // console.log(columns);
    // console.log(row.original.is_subscriber);
    for (let key in values) {
      if (values[key] === undefined || values[key] === "") {
        switch (key) {
          case "amt":
            values.amt = row.original.amt;
            break;
          case "type":
            values.type = row.original.type;
            break;
          case "remarks":
            values.remarks = row.original.remarks;
            break;
          case "date":
            values.date = row.original.date;
            break;
          case "id":
            values.id = row.original.id;
            break;
          default:
        }
      }
    }

    console.log(values);
    console.log(rowData);
    const _validations = [validations[0](values.amt)];
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
      <DialogTitle textAlign="center">Update Expense</DialogTitle>
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
            {columns.map((column) =>
              column.accessorKey === "type" ? (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  type={column.type}
                  name={column.accessorKey}
                  select
                  // value={values != null ? values.type : undefined}
                  // defaultValue={}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  InputProps={
                    column.accessorKey === "id" ? { readOnly: true } : {}
                  }
                  key={column.accessorKey}
                  label={
                    column.accessorKey === "donor_name" ||
                    column.accessorKey === "donor_phone"
                      ? ""
                      : column.header
                  }
                  placeholder={
                    column.accessorKey === "donor_name" ||
                    column.accessorKey === "donor_phone"
                      ? column.header
                      : ""
                  }
                  name={column.accessorKey}
                  type={column.type}
                  defaultValue={
                    column.accessorKey === "date" && row !== null
                      ? row.original.date
                      : column.accessorKey === "amt" && row !== null
                      ? row.original.amt
                      : column.accessorKey === "remarks" && row !== null
                      ? row.original.remarks
                      : column.accessorKey === "id" && row !== null
                      ? row.original.id
                      : undefined
                  }
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
              )
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Update Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
};
