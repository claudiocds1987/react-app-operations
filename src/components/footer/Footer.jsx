import React from "react";
// css
import "./Footer.css";

// fontawesome brands
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <div id="footer" className="container-fluid bg-light d-flex justify-content-center">
      <div className="d-flex align-items-center">
        <div>
          <FontAwesomeIcon icon={faFacebook} size="2x" />
          {"  "}
          <FontAwesomeIcon icon={faInstagram} size="2x" />
          {"  "}
          <FontAwesomeIcon icon={faWhatsapp} size="2x" />
          {"  "}
        </div>
      </div>
    </div>
  );
};

export default Footer;
