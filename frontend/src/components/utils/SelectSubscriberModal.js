import { useEffect, useState, useMemo } from "react";
import { sampleSubscriberData } from "../Sample";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import MaterialReactTable from "material-react-table";
import { PersonAdd } from "@mui/icons-material";

export const SelectSubscriberModal = ({
  open,
  onClose,
  onSubmit,
  setRowData,
}) => {
  const [subscriberData, setSubscriberData] = useState(sampleSubscriberData);

  useEffect(() => {
    const getSubscribers = async () => {
      const response = await fetch("/api/subscriber");
      if (response.ok) {
        const jsonData = await response.json();
        console.log(`Subscriber Data: ${jsonData}`);
        setSubscriberData(jsonData);
      } else {
        console.log(`Error Occurred: ${response.status} - ${response.body}`);
      }
    };

    getSubscribers().catch((error) => {
      console.log(error);
    });
  }, []);

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
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 140,
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "family_name",
        header: "Family Name",
        size: 120,
      },
      {
        accessorKey: "monthly_sub_amt",
        header: "Subscription Amount",
      },
    ],
    []
  );

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Select Subscriber</DialogTitle>
      <DialogContent>
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
          data={subscriberData}
          editingMode="modal" //default
          enableColumnOrdering
          enableEditing
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="left" title="Select Subscriber">
                <IconButton
                  onClick={() => {
                    console.log(row);
                    setRowData(row);
                    onClose();
                  }}
                >
                  <PersonAdd />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
