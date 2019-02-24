import React, { Component } from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header/Header.jsx";
import ContentManager from "./components/ContentManager.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <ContentManager />
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("mm-app"));
