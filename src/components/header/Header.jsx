import React from "react";

import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";

// npm install react-router-dom
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link to="/home" className="navbar-brand">Operation App</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link className="nav-link" to="/home">
              Home
            </Link>
            <Link className="nav-link" to="/createOperation">
              New Operation
            </Link>
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </Nav>
          <Form>
            <div className="d-flex">
              <div>
                <FormControl type="text" placeholder="Search" />
              </div>
              <div>
                <Button variant="outline-success">Search</Button>
              </div>
            </div>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
