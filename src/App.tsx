import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Listing from "./pages/listing";
import Chart from "./pages/chart";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Listing />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
