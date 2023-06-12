/*
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Collapse,
  Alert,
  Box,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import MaterialReactTable from "material-react-table";

const MaterialTableUtil = (
  columns,
  tableData,
  successMsg,
  failureMsg,
  tableTab
) => {
  const [successAlert, setSuccessAlert] = useState(successMsg);
  const [failureAlert, setFailureAlert] = useState(failureMsg);
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
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
            Create New {{ tableTab }}
          </Button>
        )}
      />

      <CreateNewAccountModal
        columns={columns.slice(1)}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

export default MaterialTableUtil;

*/
