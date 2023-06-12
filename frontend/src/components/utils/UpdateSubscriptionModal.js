import { useState } from "react";
import { sampleSubscriberData } from "../Sample";
import { SelectSubscriberModal } from "./SelectSubscriberModal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

export const UpdateSubscriptionModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  validateAmt,
  row,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  // row -> currently selected record with edit option
  // which returns the data of the current record from the table.

  // rowData -> has the Subscriber record, which selected from "Select Subscriber" Modal.

  const handleSubmit = () => {
    //put your validation logic here
    for (let key in values) {
      if (values[key] === "" || values[key] === undefined) {
        switch (key) {
          case "amt":
            values.amt = row.original.amt;
            break;
          case "subscriber":
            values.subscriber = row.original.subscriber;
            break;
          case "subscriber_name":
            values.subscriber_name = row.original.susbcriber_name;
            break;
          case "remarks":
            values.remarks = row.original.remarks;
            break;
          case "date":
            values.date = row.original.date;
            break;
          default:
        }
      }
    }

    console.log(values);
    console.log(rowData);
    const validations = [validateAmt(values.amt)];
    console.log(validations);
    for (let x of validations) {
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
                  column.accessorKey === "subscriber" ||
                  column.accessorKey === "subscriber_name" ||
                  column.accessorKey === "id"
                    ? { readOnly: true }
                    : {}
                }
                key={column.accessorKey}
                label={
                  column.accessorKey === "subscriber" ||
                  column.accessorKey === "subscriber_name"
                    ? ""
                    : column.header
                }
                placeholder={
                  column.accessorKey === "subscriber" ||
                  column.accessorKey === "subscriber_name"
                    ? column.header
                    : ""
                }
                name={column.accessorKey}
                type={column.type}
                value={
                  column.accessorKey === "subscriber" && rowData != null
                    ? (values.subscriber = rowData.original.id)
                    : column.accessorKey === "subscriber_name" &&
                      rowData != null
                    ? (values.subscriber_name = rowData.original.name)
                    : undefined
                }
                defaultValue={
                  column.accessorKey === "date" && row !== null
                    ? row.original.date
                    : column.accessorKey === "subscriber" && row !== null
                    ? row.original.subscriber
                    : column.accessorKey === "subscriber_name" && row !== null
                    ? row.original.subscriber_name
                    : column.accessorKey === "amt" && row !== null
                    ? row.original.amt
                    : column.accessorKey === "remarks" && row !== null
                    ? row.original.remarks
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
          Update Subscription
        </Button>
        <Button
          color="primary"
          onClick={() => setSelectModalOpen(true)}
          variant="outlined"
        >
          Select Subscriber
        </Button>
      </DialogActions>
      <SelectSubscriberModal
        open={selectModalOpen}
        onClose={() => {
          setSelectModalOpen(false);
        }}
        setRowData={setRowData}
      />
    </Dialog>
  );
};
