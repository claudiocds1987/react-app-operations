import React from "react";
import "./App.css";
//import "./components/auth/Login.css"
import "bootstrap/dist/css/bootstrap.min.css";
// components
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import CreateOperation from "./components/operation/createOperation/createOperation";
import Login from "./components/auth/Login";
import Footer from "./components/footer/Footer";

// npm install react-router-dom
// import { BrowserRouter as router, Route, Router } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <div className="box">
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/home" component={Home}></Route>
        <Route path="/createOperation" component={CreateOperation}></Route>
        <Route path="/login" component={Login}></Route>
      </div>
      <Footer />
    </Router>
   
  );
}

export default App;
