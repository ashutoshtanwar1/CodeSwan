/* eslint-disable react/style-prop-object */
import React, { Component } from "react";
import codeswan from '../Images/CODESWAN.png';
import icon1 from '../Images/Layer2.png';
class Login extends Component {
  handleClick() {
    window.location.href = "http://localhost:8000/index.php";
  }
  render() {
    return (
      <div>
        <div class="w3-bar w3-theme-d2 w3-left-align w3-large">
          <a
            href="/"
            class="w3-bar-item w3-button w3-padding-large w3-theme-d4"
          >
            <i class="fa fa-home w3-margin-right"></i>
            <img src={codeswan} height="14px" alt="Avatar"></img>
          </a>
          <a
            href="/"
            class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white"
          >
            <img src={icon1} class="" height="26px" alt="Avatar" />
          </a>
        </div>
        <div
          class="w3-padding-64 w3-margin-top w3-container w3-content"
          max-width="1400px"
          margin-top="80px"
        >
          <div class="w3-row">
            <div class="w3-panel w3-card-4 w3-round w3-white w3-center">
              <div class="w3-container ">
                <h2 class="w3-center">Login</h2>
                <h4>Welcome To</h4>
                <p class="w3-center">
                  <img src="cdsw.png" height="50px" alt="Avatar" />
                </p>
                <p>
                  <button
                    type="submit"
                    onClick={(e) => this.handleClick()}
                    class="w3-btn w3-ripple w3-teal"
                  >
                    Login
                  </button>
                </p>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
