import "./App.css";
import Loginpage from "./components/Loginpage";
import Homepage from "./components/Homepage";
import SusbcribersPage from "./components/SubscribersPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Loginpage />}></Route>
        <Route path="/home" element={<Homepage />} />
        <Route path="/subscribers" element={<SusbcribersPage />} />
      </Routes>
    </>
  );
}

export default App;
