import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHome,
  faPlusCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";

// npm install react-router-dom
import { Link, useHistory } from "react-router-dom";
// css
import "./header.css";

const Header = () => {
  const [user, setUser] = React.useState("");

  React.useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      setUser(localStorage.getItem("user"));
    }
  });

  let history = useHistory();

  return (
    <Navbar id="navBar" expand="lg" fixed="top">
      <Container>
        <img src="https://logobly.com/wp-content/uploads/001-rocket-1.png" />
        <Link to="/home" style={{ color: "#FFF" }} className="navbar-brand">
          Operations App
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {
            user !== "" ? 
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {user}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    window.location.reload(history.push("/login"));
                  }}
                >
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            :
            ""
          }
          {
            user !== "" ?
            <Nav>
            
            <Link className="nav-link" to="/home" style={{ color: "#FFF" }}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ color: "red", marginRight: "10px" }}
              />
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
              // to="/login"
              onClick={() => {
                const confirm = window.confirm("¿Desea cerrar la sesión?");
                if(confirm){
                  window.location.reload(history.push("/login"));
                }           
              }}
              style={{ color: "#FFF" }}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: "yellow", marginRight: "10px" }}
              />
              Login
            </Link>
          </Nav>
            :
            ""
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
