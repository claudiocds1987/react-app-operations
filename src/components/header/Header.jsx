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

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
          <Link to="/home" className="navbar-brand">
            Operations App
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Link className="nav-link" to="/home">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
              <Link className="nav-link" to="/createOperation">
                <FontAwesomeIcon icon={faPlusCircle} /> Operation
              </Link>
              <Link className="nav-link" to="/login">
                <FontAwesomeIcon icon={faUser} /> Login
              </Link>
            </Nav>
          </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
