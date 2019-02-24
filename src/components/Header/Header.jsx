import React, { Component } from "react";
import MaxMilhasLogo from "../../assets/images/max-milhas.svg";
import "./Header.scss";

class Header extends Component {
  render() {
    return (
      <div className="Header">
        <img src={MaxMilhasLogo} />
      </div>
    );
  }
}

export default Header;
