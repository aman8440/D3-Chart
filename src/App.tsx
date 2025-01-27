import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Listing from "./pages/listing";
import Chart from "./pages/chart";

function App() {
  // Get items from localStorage and parse it as JSON
  const data = JSON.parse(localStorage.getItem("items") || "[]");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Listing />} />
          <Route path="/chart" element={<Chart data={data} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
