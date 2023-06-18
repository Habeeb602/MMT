import React, { useEffect, useState, useCallback, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  Stack,
  DialogActions,
  DialogContent,
  TextField,
  Alert,
  Collapse,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Edit, Delete, Person, PersonOff, CheckBox } from "@mui/icons-material";
import { sampleDonationData } from "./Sample";
import { SelectSubscriberModal } from "../utils/SelectSubscriberModal";
import { UpdateDonationModal } from "../utils/UpdateDonationModal";

const DonationsPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [successAlert, setSuccessAlert] = useState("");
  const [failureAlert, setFailureAlert] = useState("");
  const [rerender, setRerender] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    const getDonations = async () => {
      console.log("Came inside useEffect");
      const response = await fetch("/api/donation");
      if (response.ok) {
        const jsonData = await response.json();
        console.log(`Existing Data: ${tableData}\n\nFetched Data: ${jsonData}`);
        setTableData(jsonData);
        console.log(tableData);
      } else {
        console.log("Error Occurred!!! " + response);
      }
    };
    getDonations().catch(console.error);
  }, [rerender]);

  const handleCreateNewRow = (values) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: values.date,
        amt: parseInt(values.amt),
        remarks: values.remarks === "" ? null : values.remarks,
        is_subscriber: values.is_subscriber,
        donor_name: values.donor_name,
        donor_phone: values.donor_phone === "" ? null : values.donor_phone,
      }),
    };
    fetch("/api/create-donation", requestOptions).then((response) => {
      if (response.ok) {
        setFailureAlert("");
        setSuccessAlert("The record has been created successfully!");
        setTimeout(() => {
          setSuccessAlert("");
        }, 3500);
        setRerender(!rerender);
      } else {
        setSuccessAlert("");
        setFailureAlert(`Error: ${response.status}: ${response.statusText}`);
        setTimeout(() => {
          setFailureAlert("");
        }, 3500);
      }
    });
  };

  const handleUpdateRow = (values) => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: values.id,
        date: values.date,
        amt: parseInt(values.amt),
        remarks: values.remarks === "" ? null : values.remarks,
        is_subscriber: values.is_subscriber,
        donor_name: values.donor_name,
        donor_phone: values.donor_phone === "" ? null : values.donor_phone,
      }),
    };

    fetch("/api/update-donation", requestOptions).then((response) => {
      if (response.ok) {
        setFailureAlert("");
        setSuccessAlert("The record has been updated successfully!");
        setRerender(!rerender);
        setTimeout(() => {
          setSuccessAlert("");
        }, 3500);
      } else {
        setSuccessAlert("");
        setFailureAlert(`Error: ${response.status}: ${response.statusText}`);
        setTimeout(() => {
          setFailureAlert("");
        }, 3500);
      }
    });
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (!window.confirm(`Are you sure you want to delete this record?`)) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.original.id,
        }),
      };

      fetch("/api/delete-donation", requestOptions).then((response) => {
        if (response.ok) {
          setSuccessAlert("The record has been deleted successfully!");
          setRerender(!rerender);
          setTimeout(() => {
            setSuccessAlert("");
          }, 3500);
        } else {
          setFailureAlert(`Error: ${response.status}: ${response.statusText}`);
          setTimeout(() => {
            setFailureAlert("");
          }, 3500);
        }
      });

      console.log(row);
      console.log(row.original.id);
      // tableData.splice(row.index, 1);
      // setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "monthly_sub_amt"
              ? validateAmt(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid[0]) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: isValid[1],
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];

            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "date",
        }),
        type: "date",
      },
      {
        accessorKey: "amt",
        header: "Donation amount",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
        type: "number",
      },
      {
        accessorKey: "remarks",
        header: "Comments",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "is_subscriber",
        header: "Is Subscriber",
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ cell }) => (cell.getValue() ? <Person /> : <PersonOff />),
        type: "boolean",
      },
      {
        accessorKey: "donor_name",
        header: "Donor Name",
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
      },
      {
        accessorKey: "donor_phone",
        header: "Donor Phone",
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <Collapse in={successAlert !== "" || failureAlert !== ""}>
        {successAlert !== "" ? (
          <Alert severity="success" onClose={() => setSuccessAlert("")}>
            {successAlert}
          </Alert>
        ) : (
          <Alert severity="error" onClose={() => setFailureAlert("")}>
            {failureAlert}
          </Alert>
        )}
      </Collapse>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={() => {
                  setRowData(row);
                  setUpdateModalOpen(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New Donation
          </Button>
        )}
      />

      <CreateNewAccountModal
        columns={columns.slice(1)}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      <UpdateDonationModal
        open={updateModalOpen}
        columns={columns}
        onClose={() => setUpdateModalOpen(false)}
        row={rowData}
        validations={[validateAmt, validateDonorName]}
        onSubmit={handleUpdateRow}
      />
    </>
  );
};

// SelectSubscriberModal

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [subscriberSwitch, setSubscriberSwitch] = useState(false);

  const handleSubmit = () => {
    //put your validation logic here
    values.is_subscriber = subscriberSwitch;
    console.log(values);
    const validations = [
      validateAmt(values.amt),
      validateDonorName(values.donor_name),
    ];
    console.log(validations);
    for (let x of validations) {
      if (!x[0]) {
        window.alert(x[1]);
        return;
      }
    }
    onSubmit(values);
    setRowData(null);
    setSubscriberSwitch(false);
    Object.keys(values).forEach((k) => (values[k] = ""));
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Donation</DialogTitle>
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
                    column.accessorKey === "subscriber" ||
                    column.accessorKey === "subscriber_name"
                      ? { readOnly: true }
                      : {}
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
                  required={
                    column.accessorKey === "remarks" ||
                    column.accessorKey === "donor_phone"
                      ? false
                      : true
                  }
                  name={column.accessorKey}
                  type={column.type}
                  value={
                    column.accessorKey === "donor_name" && rowData !== null
                      ? (values.donor_name = rowData.original.name)
                      : column.accessorKey === "donor_phone" && rowData !== null
                      ? (values.donor_phone = rowData.original.phone)
                      : column.accessorKey === "amt"
                      ? values.amt
                      : column.accessorKey === "remarks"
                      ? values.remarks
                      : column.accessorKey === "subscriber_name" &&
                        rowData !== null
                      ? (values.subscriber_name = rowData.original.name)
                      : undefined
                  }
                  defaultValue={
                    column.accessorKey === "date"
                      ? (values.date = new Date()
                          .toISOString()
                          .substring(0, 10))
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
          Create New Donation
        </Button>
      </DialogActions>
      <SelectSubscriberModal
        open={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        setRowData={setRowData}
      />
    </Dialog>
  );
};

const validateAmt = (subAmt) => {
  let isValid = [];
  if (String(subAmt).match(/^[0-9]+$/) == null) {
    isValid.push(false, "Please enter a valid donation amount");
  } else if (parseInt(subAmt) <= 0) {
    isValid.push(false, "Please enter a donation amount greater than 0");
  } else {
    isValid.push(true, "");
  }
  return isValid;
};

const validateDonorName = (dName) => {
  let isValid = [];
  if (String(dName).match(/^[A-Za-z ]+$/) == null) {
    isValid.push(false, "Please enter the Donor Name!!!");
  } else {
    isValid.push(true, "");
  }
  return isValid;
};

const validateRequired = (value) => [true, ""];

export default DonationsPage;
