import React from "react";
import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css"; esta importando en index.js
// components
import Protected from "./components/auth/Protected"
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import CreateOperation from "./components/operation/createOperation/createOperation";
import EditOperation from "./components/operation/editOperation/EditOperation";
import Login from "./components/auth/login/Login";
import SignUp from "./components/auth/signUp/SignUp";
import Footer from "./components/footer/Footer";

// npm install react-router-dom
// import { BrowserRouter as router, Route, Router } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";


function App() {

  return (
    <Router>
      <Header />
      <div className="box">
        <Route exact path="/">
          <Protected Cmp={Home} />
        </Route>
        <Route exact path="/home">
          <Protected Cmp={Home} />
        </Route> 
        
        {/* <Route exact path="/" component={Home}></Route> */}
        {/* <Route exact path="/home" component={Home}></Route> */}
        

        <Route path="/createOperation">
          <Protected Cmp={CreateOperation} />
        </Route>
        <Route path="/editOperation/:id" component={EditOperation}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/signup" component={SignUp}></Route>
        
      </div>
      <Footer />
    </Router>
   
  );
}

export default App;
