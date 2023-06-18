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
import { sampleSubscriberData } from "./Sample";
import { UpdateSubscriberModal } from "../utils/UpdateSubscriberModal";

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
      const response = await fetch("/api/subscriber");
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
        name: values.name,
        address: values.address === "" ? null : values.address,
        phone: values.phone,
        family_name: values.family_name === "" ? null : values.family_name,
        monthly_sub_amt: parseInt(values.monthly_sub_amt),
      }),
    };
    fetch("/api/create-subscriber", requestOptions).then((response) => {
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
    const request = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        address: values.address === "" ? null : values.address,
        phone: values.phone,
        family_name: values.family_name,
        monthly_sub_amt: values.monthly_sub_amt,
      }),
    };

    fetch("/api/update-subscriber", request).then((response) => {
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

      fetch("/api/delete-subscriber", requestOptions).then((response) => {
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
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
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
            cell.column.id === "name"
              ? validateName(event.target.value)
              : cell.column.id === "phone"
              ? validatePhoneNumber(event.target.value)
              : cell.column.id === "monthly_sub_amt"
              ? validateSubAmt(+event.target.value)
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
        accessorKey: "name",
        header: "Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "number",
        }),
      },
      {
        accessorKey: "family_name",
        header: "Family Name",
        size: 120,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "text",
      },
      {
        accessorKey: "monthly_sub_amt",
        header: "Subscription Amount",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        type: "number",
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
            Create New Subscriber
          </Button>
        )}
      />

      <CreateNewAccountModal
        columns={columns.slice(1)}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      <UpdateSubscriberModal
        columns={columns}
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSubmit={handleUpdateRow}
        validations={[validateName, validatePhoneNumber, validateSubAmt]}
        row={rowData}
      />
    </>
  );
};

export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    // console.log("Values -->");
    console.log(values);

    const validations = [
      validateName(values.name),
      validatePhoneNumber(values.phone),
      validateSubAmt(values.monthly_sub_amt),
    ];
    console.log(validations);
    for (let x of validations) {
      if (!x[0]) {
        window.alert(x[1]);
        return;
      }
    }
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Subscriber</DialogTitle>
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
                required={
                  column.accessorKey === "name" ||
                  column.accessorKey === "phone" ||
                  column.accessorKey === "monthly_sub_amt"
                    ? true
                    : false
                }
                type={column.type}
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Subscriber
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validatePhoneNumber = (phone) => {
  let isValid = [];
  if (String(phone).match(/^[0-9]+$/) == null) {
    isValid.push(false, "The Phone number should be consists of only numbers!");
  } else if (phone.length !== 10) {
    isValid.push(false, "The Phone number should consists of 10 digits!");
  } else {
    isValid.push(true, "");
  }
  return isValid;
};

const validateName = (subName) => {
  let isValid = [];
  if (subName.length === 0) {
    isValid.push(false, "The 'Name' should not be empty!");
  } else {
    isValid.push(true, "");
  }
  return isValid;
};

const validateSubAmt = (subAmt) => {
  let isValid = [];
  console.log(subAmt);
  if (String(subAmt).match(/^[0-9]+$/) == null) {
    isValid.push(false, "Please enter a valid amount");
  } else if (parseInt(subAmt) <= 0) {
    isValid.push(false, "Please enter a subscription amount greater than 0");
  } else {
    isValid.push(true, "");
  }
  return isValid;
};

const validateRequired = (value) => [true, ""];

export default SusbcribersPage;
