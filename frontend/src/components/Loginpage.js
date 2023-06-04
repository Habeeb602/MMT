import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Typography } from "@mui/material";

const Loginpage = () => {
  const navigate = useNavigate();

  const validate = () => {
    navigate("/home");
  };

  return (
    <Grid container spacing={1} className="login">
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Masjid Markaz Thowheedullah
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField required={true} type="text" placeholder="User Name" />
      </Grid>
      <Grid item xs={12} align="center">
        <TextField required={true} type="password" placeholder="Password" />
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={validate}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default Loginpage;
