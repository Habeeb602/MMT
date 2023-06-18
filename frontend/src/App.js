import "./App.css";
import Loginpage from "./components/Loginpage";
import Homepage from "./components/Home/Homepage";
import SusbcribersPage from "./components/Home/SubscribersPage";
import MiniDrawer from "./components/MiniDrawer";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Loginpage />}></Route>
        <Route path="/home" element={<MiniDrawer />} />
        <Route path="/subscribers" element={<SusbcribersPage />} />
      </Routes>
    </>
  );
}

export default App;
