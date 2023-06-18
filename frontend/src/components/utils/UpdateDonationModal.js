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
} from "@mui/material";

export const UpdateDonationModal = ({
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

  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [subscriberSwitch, setSubscriberSwitch] = useState(false);
  useEffect(() => {
    setSubscriberSwitch(row === null ? false : row.original.is_subscriber);
  }, [row]);
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
          case "donor_phone":
            values.donor_phone = row.original.donor_phone;
            break;
          case "donor_name":
            values.donor_name = row.original.donor_name;
            break;
          case "remarks":
            values.remarks = row.original.remarks;
            break;
          case "date":
            values.date = row.original.date;
            break;
          case "is_subscriber":
            values.is_subscriber = subscriberSwitch;
            break;
          default:
        }
      }
    }

    console.log(values);
    console.log(rowData);
    const _validations = [
      validations[0](values.amt),
      validations[1](values.donor_name),
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
      <DialogTitle textAlign="center">Update Donation</DialogTitle>
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
              column.type === "boolean" ? (
                <Stack
                  sx={{ display: "inline", marginLeft: "2px" }}
                  key={column.accessorKey}
                >
                  <Typography sx={{ display: "inline" }}>
                    Is Subscriber?
                  </Typography>
                  <Switch
                    checked={subscriberSwitch}
                    onChange={(e) => {
                      setSubscriberSwitch(!subscriberSwitch);
                      setSelectModalOpen(!subscriberSwitch);
                      if (subscriberSwitch) {
                        setRowData(null);
                      }
                    }}
                  />
                </Stack>
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
                  value={
                    column.accessorKey === "donor_name" &&
                    rowData != null &&
                    subscriberSwitch
                      ? (values.donor_name = rowData.original.name)
                      : column.accessorKey === "donor_phone" &&
                        rowData != null &&
                        subscriberSwitch
                      ? (values.donor_phone = rowData.original.phone)
                      : undefined
                  }
                  defaultValue={
                    column.accessorKey === "date" && row !== null
                      ? row.original.date
                      : column.accessorKey === "donor_name" && row !== null
                      ? row.original.donor_name
                      : column.accessorKey === "donor_phone" && row !== null
                      ? row.original.donor_phone
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
              )
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Update Donation
        </Button>
        {/* <Button
          color="primary"
          onClick={() => setSelectModalOpen(true)}
          variant="outlined"
        >
          Select Subscriber
        </Button> */}
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
