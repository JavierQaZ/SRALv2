import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Home from "./views/Home.jsx"
import Login from "./views/Login.jsx"
import SignUp from "./views/SignUp.jsx";
import Recover from "./views/Recover.jsx";

function App() {

    return (
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

            <Route
                path = "/signup"
                element = { <SignUp/> }/>

            <Route
                path = "/recover"
                element = { <Recover/> }/>
        </Routes>
    )
}

export default App;