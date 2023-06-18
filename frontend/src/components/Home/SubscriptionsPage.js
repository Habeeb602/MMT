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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { sampleSubscriptionData } from "./Sample";
import { SelectSubscriberModal } from "../utils/SelectSubscriberModal";
import { UpdateSubscriptionModal } from "../utils/UpdateSubscriptionModal";

const SusbcribersPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [successAlert, setSuccessAlert] = useState("");
  const [failureAlert, setFailureAlert] = useState("");
  const [rerender, setRerender] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  useEffect(() => {
    const getSubscribers = async () => {
      console.log("Came inside useEffect");
      const response = await fetch("/api/subscription");
      if (response.ok) {
        const jsonData = await response.json();
        console.log(`Existing Data: ${tableData}\n\nFetched Data: ${jsonData}`);
        setTableData(jsonData);
        console.log(tableData);
      } else {
        console.log("Error Occurred!!! " + response);
      }
    };
    getSubscribers().catch(console.error);
  }, [rerender]);

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    console.log(tableData);
    setTableData(tableData);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: values.date,
        amt: parseInt(values.amt),
        remarks: values.remarks === "" ? null : values.remarks,
        subscriber: parseInt(values.subscriber),
      }),
    };
    fetch("/api/create-subscription", requestOptions).then((response) => {
      if (response.ok) {
        setFailureAlert("");
        setSuccessAlert("The record has been created successfully!");
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

  const handleUpdateRow = (values) => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: values.id,
        date: values.date,
        amt: parseInt(values.amt),
        remarks: values.remarks === "" ? null : values.remarks,
        subscriber: parseInt(values.subscriber),
        subscriber_name: values.subscriber_name,
      }),
    };

    fetch("/api/update-subscription", requestOptions).then((response) => {
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
          name: row.original.name,
        }),
      };

      fetch("/api/delete-subscription", requestOptions).then((response) => {
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
        header: "Subscription amount",
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
        accessorKey: "subscriber",
        header: "Subscriber ID",
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
      },
      {
        accessorKey: "subscriber_name",
        header: "Subscriber Name",
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
        enableEditing: false,
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
            Create New Subscription
          </Button>
        )}
      />

      <CreateNewAccountModal
        columns={columns.slice(1)}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      <UpdateSubscriptionModal
        open={updateModalOpen}
        columns={columns}
        onClose={() => setUpdateModalOpen(false)}
        row={rowData}
        validateAmt={validateAmt}
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

  const handleSubmit = () => {
    //put your validation logic here
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
    values.amt = undefined;
    values.remarks = undefined;
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Subscription</DialogTitle>
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
                  column.accessorKey === "subscriber_name"
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
                  column.accessorKey === "subscriber" && rowData !== null
                    ? (values.subscriber = rowData.original.id)
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
                    ? (values.date = new Date().toISOString().substring(0, 10))
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
          Create New Subscription
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
        onClose={() => setSelectModalOpen(false)}
        setRowData={setRowData}
      />
    </Dialog>
  );
};

const validateAmt = (subAmt) => {
  let isValid = [];
  console.log(subAmt);
  if (String(subAmt).match(/^[0-9]+$/) == null) {
    isValid.push(false, "Please enter a valid subscription amount");
  } else if (parseInt(subAmt) <= 0) {
    isValid.push(false, "Please enter a subscription amount greater than 0");
  } else {
    isValid.push(true, "");
  }
  return isValid;
};

const validateRequired = (value) => [true, ""];

export default SusbcribersPage;
