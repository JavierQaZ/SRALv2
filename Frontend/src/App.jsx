import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Home from "./views/Home.jsx"
import Login from "./views/Login.jsx"

function App() {

  return (
    <Router>
      <Routes>
        <Route
          path = "/"
          element = {<Navigate to = "login"/>}/>

        <Route
          path = "/login"
          element = { <Login/> } />


        <Route
          path = "/home/*"
          element = { <Home/> }/>

      </Routes>
    </Router>
  )
}

export default App;