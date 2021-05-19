import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHome,
  faPlusCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { Navbar, Nav, Container } from "react-bootstrap";

// npm install react-router-dom
import { Link } from "react-router-dom";
// css
import "./header.css";

const Header = () => {
  return (
    <Navbar id="navBar" expand="lg" fixed="top">
      <Container>
        <img src="https://logobly.com/wp-content/uploads/001-rocket-1.png"/>
        <Link to="/home" style={{ color: "#FFF" }} className="navbar-brand">
          Operations App
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Link className="nav-link" to="/home" style={{ color: "#FFF" }}>
              <FontAwesomeIcon icon={faHome} style={{ color: "red", marginRight: "10px" }} />
              Home
            </Link>
            <Link
              className="nav-link link"
              to="/createOperation"
              style={{ color: "#FFF" }}
            >
              <FontAwesomeIcon
                icon={faPlusCircle}
                style={{ color: "MediumSeaGreen", marginRight: "10px" }}
              />
              Operation
            </Link>
            <Link
              className="nav-link link"
              to="/login"
              style={{ color: "#FFF" }}
            >
              <FontAwesomeIcon icon={faUser} style={{ color: "yellow", marginRight: "10px" }} />
              Login
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
