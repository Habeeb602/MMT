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
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { sampleExpensesData } from "./Sample";
import { UpdateExpenseModal } from "../utils/UpdateExpenseModal";

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
    const getExpenses = async () => {
      console.log("Came inside useEffect");
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const jsonData = await response.json();
        console.log(`Existing Data: ${tableData}\n\nFetched Data: ${jsonData}`);
        setTableData(jsonData);
        console.log(tableData);
      } else {
        console.log("Error Occurred!!! " + response);
      }
    };
    getExpenses().catch(console.error);
  }, [rerender]);

  const handleCreateNewRow = (values) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: values.date,
        amt: parseInt(values.amt),
        type: values.type,
        remarks: values.remarks === "" ? null : values.remarks,
      }),
    };
    console.log(requestOptions);
    fetch("/api/create-expenses", requestOptions).then((response) => {
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
        type: values.type,
        remarks: values.remarks === "" ? null : values.remarks,
      }),
    };

    fetch("/api/update-expenses", requestOptions).then((response) => {
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

      fetch("/api/delete-expenses", requestOptions).then((response) => {
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
        header: "Expense amount",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
        type: "number",
      },
      {
        accessorKey: "type",
        header: "Expense type",
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
      },
      {
        accessorKey: "remarks",
        header: "Comments",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
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
            Create New Expense
          </Button>
        )}
      />

      <CreateNewAccountModal
        columns={columns.slice(1)}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />

      <UpdateExpenseModal
        open={updateModalOpen}
        columns={columns}
        onClose={() => setUpdateModalOpen(false)}
        row={rowData}
        validations={[validateAmt]}
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
  const [rowData, setRowData] = useState(null);
  const options = [
    { value: "New buy" },
    { value: "Service/Maintainence" },
    { value: "Losses" },
  ];
  const handleSubmit = () => {
    //put your validation logic here
    console.log(values);
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
      <DialogTitle textAlign="center">Create New Expense</DialogTitle>
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
                  name={column.accessorKey}
                  required={true}
                  select
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
                  key={column.accessorKey}
                  label={column.header}
                  required={column.accessorKey === "remarks" ? false : true}
                  name={column.accessorKey}
                  type={column.type}
                  value={
                    column.accessorKey === "type"
                      ? values.type
                      : column.accessorKey === "amt"
                      ? values.amt
                      : column.accessorKey === "remarks"
                      ? values.remarks
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
          Create New Expense
        </Button>
      </DialogActions>
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

const validateRequired = (value) => [true, ""];

export default DonationsPage;
