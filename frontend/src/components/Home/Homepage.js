import React, { useState } from "react";
import { Grid, Tab, Tabs } from "@mui/material";
import SusbcribersPage from "./SubscribersPage";
import SusbcriptionsPage from "./SubscriptionsPage";
import DonationsPage from "./DonationsPage";
import ExpensesPage from "./ExpensesPage";

const LinkTab = (props) => {
  return <Tab component="button" {...props} />;
};

function renderPage(value) {
  switch (value) {
    case 0:
      return <SusbcribersPage />;

    case 1:
      return <SusbcriptionsPage />;

    case 2:
      return <DonationsPage />;

    case 3:
      return <ExpensesPage />;

    default:
      <SusbcribersPage />;
  }
}

const Homepage = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={1} sx={{ marginTop: "4rem" }}>
      <Grid item xs={12} className="navbar">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <LinkTab label="Subscribers" />
          <LinkTab label="Subscriptions" />
          <LinkTab label="Donations" />
          <LinkTab label="Expenses" />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {renderPage(tabValue)}
      </Grid>
    </Grid>
  );
};

export default Homepage;
