/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Search.css";
import codeswan from '../Images/CODESWAN.png';
import icon1 from '../Images/Layer2.png';
export default class Search extends Component {
  contest = [];

  static defaultProperty = {
    contest: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    };
    
    var str = window.location.href;
      try {
        str = window.location.href.split("=")[1].split("&")[0];
      } catch (error) {
        while(localStorage.getItem('access_token') === null){}
        if(localStorage.getItem('access_token') === null){
          alert("SESSION EXPIRED! YOU HAVE TO LOGIN AGAIN !");
          window.location.href = "http://localhost:8000/index.php";
        }
      }
      axios({
        method: "get",
        url: `http://localhost:8000/index.php/?code=${str}`,
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'}
      })
      .then((res) => {
        var tk = res.data.access_token;
        var rtk = res.data.refresh_token;
        if(tk !== undefined){
          localStorage.setItem('access_token', tk);
          localStorage.setItem('refresh_token',rtk);
        }
        axios({
        method: "get",
        url: "https://api.codechef.com/contests",
        headers: {
          'Accept': "application/json",
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        })
        .then((response) => {
          response = response.data.result.data.content.contestList;
          for (let x of response) {
            this.contest.push(x["name"] + " - " + x["code"]);
          }
        })
        .catch((err) =>{
            alert("YOU HAVE TO LOGIN AGAIN.");
            window.location.href = "http://localhost:8000/index.php";
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }



  onChange = (e) => {
    const userInput = e.currentTarget.value;
    const filteredSuggestions = this.contest.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (e) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
  };
  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };
  handleclick = (e) => {};
  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              if (index === activeSuggestion) {
                className = "";
              }
              return (
                <Link
                  class="w3-bar-item w3-button"
                  className="lst"
                  to={
                    "/contest/" +
                    suggestion.split(" - ").slice(-1)[0]
                  }
                >
                  {" "}
                  <li key={suggestion} onClick={onClick}>
                    {suggestion}
                  </li>
                </Link>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No Contest Found</em>
          </div>
        );
      }
    }

    return (
      <React.Fragment>
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
            title="My Account"
          >
            <img src={icon1} class="" height="26px" alt="Avatar" />
          </a>
        </div>
        <div class="w3-paddingw3-container">
          <h3 class="w3-center">Enter the Contest Name / Contest Code </h3>
          <div class="w3-content w3-bar-block w3-card-4">
            <input
              class="w3-input w3-padding"
              type="search"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={userInput}
              placeholder="Search.."
              id="myInput"
            />
            {suggestionsListComponent}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
