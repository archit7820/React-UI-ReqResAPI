
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login/Login";
import Create from "./component/Create/Create";
import Home from "./component/Home/Home";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path = "/create_user" element = {<Create/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

