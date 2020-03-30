/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import "./Problems.css";
import axios from "axios";
import moment from "moment";
import codeswan from '../Images/CODESWAN.png';
import icon1 from '../Images/Layer2.png';
import Parser from "html-react-parser";
import { Link } from "react-router-dom";
class Problems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      name: "",
      timestatus: "",
      d: "",
      h: "",
      m: "",
      s: "",
      banner: "",
      isdone1:false,
      isdone2:false,
      isdone3:false,
      problemlist: [],
      announcements: "",
      details: [],
      usrfetched: false,
      userdetails: { },
      subdetails: []
    };

    this.get_contest_details();
  }

  get_contest_details() {
    var str = window.location.href;
    try {
      str = str.split("/")[4];
    } catch {
      alert("CONTEST CODE IS INVALID");
      window.location.href = "http://localhost:8000/index.php";
    }
    while (localStorage.getItem("access_token") === null) {}
    axios({
      method: "get",
      url: `https://api.codechef.com/contests/${str}/?sortBy=successfulSubmissions&sortOrder=desc`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ` + localStorage.getItem("access_token"),
      },
    })
      .then((res) => {
        res = res.data.result.data.content;
        var st = moment(res["startDate"]).diff(moment());
        if (res["isParent"] === false || st > 0) {
          var lst = [];
          for (let x of res.problemsList) {
            let a = {
              pcode: x["problemCode"],
              ssub: x["successfulSubmissions"],
              acc: x["accuracy"],
            };
            lst.push(a);
          }
          this.setState({
            name: res["name"],
            code: res["code"],
            st: res["startDate"],
            en: res["endDate"],
            banner: res["bannerFile"],
            announcements: res["announcements"],
            problemlist: lst,
            isdone1: true,
          });
          if (st <= 0) {
            axios({
              method: "get",
              url: `https://api.codechef.com/rankings/${str}?fields=`,
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ` + localStorage.getItem("access_token"),
              },
            })
              .then((res) => {
                res = res.data.result.data.content;

                var lst = [];
                for (let x of res) {
                  let a = {
                    rank: x["rank"],
                    user: x["username"],
                    totaltime: x["totalTime"],
                    country: x["country"],
                    totalScore: x["totalScore"],
                  };
                  lst.push(a);
                }
                this.setState({
                  details: lst,
                  isdone2: true,
                });
              })
              .catch((err) => {
                console.log(err);
              });

            axios({
              method: "get",
              url: `https://api.codechef.com/submissions/?&contestCode=${str}`,
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ` + localStorage.getItem("access_token"),
              },
            })
              .then((res) => {
                res = res.data.result.data.content;

                var lst = [];
                for (let x of res) {
                  let a = {
                    user: x["username"],
                    lag: x["language"],
                    probcode: x["problemCode"],
                    result: x["result"],
                    score: x["score"],
                  };
                  lst.push(a);
                }
                this.setState({
                  subdetails: lst,
                  isdone3: true,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          axios({
            method: "get",
            url: "https://api.codechef.com/users/me",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ` + localStorage.getItem("access_token"),
            },
          })
            .then((resp) => {
              var i;
              resp = resp.data.result.data.content;
              var a = {
                userid: resp['username'],
                fullusrname: resp['fullname'],
                rating : resp.ratings['allContest'],
                band : resp['band']
              };
              this.setState({ userdetails: a, usrfetched: true});
              if (resp.ratings['allContest'] >= 1800) {
                i = 0;
              } else {
                i = 1;
              }
              axios({
                method: "get",
                url: `https://api.codechef.com/contests/${res["children"][i]}/?sortBy=successfulSubmissions&sortOrder=desc`,
                headers: {
                  Accept: "application/json",
                  Authorization:
                    `Bearer ` + localStorage.getItem("access_token"),
                },
              })
                .then((res) => {
                  res = res.data.result.data.content;
                  var lst = [];
                  for (let x of res.problemsList) {
                    let a = {
                      pcode: x["problemCode"],
                      ssub: x["successfulSubmissions"],
                      acc: x["accuracy"]
                    };
                    lst.push(a);
                  }
                  this.setState({
                    name: res["name"],
                    code: res["code"],
                    st: res["startDate"],
                    en: res["endDate"],
                    banner: res["bannerFile"],
                    announcements: res["announcements"],
                    problemlist: lst,
                    isdone1: true
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
              axios({
                method: "get",
                url: `https://api.codechef.com/rankings/${res["children"][i]}?fields=`,
                headers: {
                  Accept: "application/json",
                  Authorization:
                    `Bearer ` + localStorage.getItem("access_token"),
                },
              })
                .then((res) => {
                  res = res.data.result.data.content;

                  var lst = [];
                  for (let x of res) {
                    let a = {
                      rank: x["rank"],
                      user: x["username"],
                      totaltime: x["totalTime"],
                      country: x["country"],
                      totalScore: x["totalScore"]
                    };
                    lst.push(a);
                  }
                  this.setState({
                    details: lst,
                    isdone2: true
                  });
                })
                .catch((err) => {
                  console.log(err);
                });

              axios({
                method: "get",
                url: `https://api.codechef.com/submissions/?&contestCode=${res["children"][i]}`,
                headers: {
                  Accept: "application/json",
                  Authorization:
                    `Bearer ` + localStorage.getItem("access_token"),
                },
              })
                .then((res) => {
                  res = res.data.result.data.content;

                  var lst = [];
                  for (let x of res) {
                    let a = {
                      user: x["username"],
                      lag: x["language"],
                      probcode: x["problemCode"],
                      result: x["result"],
                      score: x["score"]
                    };
                    lst.push(a);
                  }
                  this.setState({
                    subdetails: lst,
                    isdone3: true,
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        if (localStorage.getItem("refresh_token") === null) {
          alert("SESSION EXPIRED! YOU HAVE TO LOGIN AGAIN ! ");
          window.location.href = "http://localhost:8000/index.php";
        } else {
          axios({
            method: "get",
            url: `http://localhost:8000/index.php/?ref_token=${localStorage.getItem(
              "refresh_token"
            )}`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
          })
            .then((resp) => {
              var tk = resp.data.access_token;
              var rtk = resp.data.refresh_token;
              localStorage.setItem("access_token", tk);
              localStorage.setItem("refresh_token", rtk);
              this.get_contest_details();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    if (this.usrfetched === false) {
      axios({
        method: "get",
        url: "https://api.codechef.com/users/me",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ` + localStorage.getItem("access_token"),
        },
      })
        .then((resp) => {
          resp = resp.data.result.data.content;
              var a = {
                userid: resp['username'],
                fullusrname: resp['fullname'],
                rating : resp.ratings['allContest'],
                band : resp['band']
              };
              this.setState({ userdetails: a, usrfetched: true});
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setInterval(() => {
      var et = moment(this.state.en).diff(moment());
      var stt = moment(this.state.st).diff(moment());

      if (et <= 0 && stt <= 0) {
        this.setState({ timestatus: "ended" });
      } else if (et >= 0 && stt <= 0) {
        this.setState({ timestatus: "running" });
        this.setState({
          h: moment.duration(moment(this.state.en).diff(moment())).hours(),
          m: moment.duration(moment(this.state.en).diff(moment())).minutes(),
          s: moment.duration(moment(this.state.en).diff(moment())).seconds(),
        });
      } else if (stt > 0) {
        this.setState({ timestatus: "notstarted" });
        this.setState({
          d: moment.duration(moment(this.state.st).diff(moment())).days(),
          h: moment.duration(moment(this.state.st).diff(moment())).hours(),
          m: moment.duration(moment(this.state.st).diff(moment())).minutes(),
          s: moment.duration(moment(this.state.st).diff(moment())).seconds(),
        });
      }
    }, 1000);
  }

  render() {
    const {
      state: {
        code,
        name,
        timestatus,
        d,
        h,
        m,
        s,
        banner,
        isdone1,
        isdone2,
        isdone3,
        problemlist,
        announcements,
        userdetails,
        details,
        subdetails,
        usrfetched
      },
    } = this;
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
          <div
            href="/"
            class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white"
          >{usrfetched=== true && (<em>Welcome {userdetails['userid']} ( {userdetails['band']} ) &nbsp;&nbsp; </em>)}
            <img src={icon1} class="" height="26px" alt="Avatar" />
          </div>
        </div>
        <br />
        <div class="w3-row ">
          <div class="w3-col w3-twothird">
            {isdone1 === true && (
              <div class="w3-row-padding">
                <div class="w3-col ">
                  <div class="w3-card-4 w3-round w3-white">
                    <div class="w3-padding">
                      <p class="w3-xxlarge w3-center ">
                        {name} - ({code})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isdone1 === true && (
              <div class="w3-container w3-card-4 w3-white w3-round w3-margin">
                <br />
                <img src={banner} class=" w3-round" alt="Banner" width="100%" />
                <hr class="w3-clear" />
                <div class="w3-row-padding" margin="0 -16px">
                  <table class="w3-table w3-bordered w3-hoverable">
                    <thead>
                      <tr class="w3-light-blue">
                        <th class="w3-large w3-center">S.No.</th>
                        <th class="w3-large w3-center">Problem Code</th>
                        <th class="w3-large w3-center">Submissions</th>
                        <th class="w3-large w3-center">Accuracy</th>
                      </tr>
                    </thead>
                    {problemlist.map((prob, i) => (
                      <tr>
                        <td class="w3-large w3-center">{i + 1}.</td>
                        <td class="w3-center">
                          <Link
                            className="w3-hover-text-aqua w3-large"
                            to={"/problem/" + code + "/" + prob.pcode}
                          >
                            {prob.pcode}
                          </Link>
                        </td>
                        <td class="w3-large w3-center">{prob.ssub}</td>
                        <td class="w3-large w3-center">
                          {prob.acc.toPrecision(3)}
                        </td>
                      </tr>
                    ))}
                  </table>
                  <hr />
                  <h3 class="w3-center">Announcements</h3>
                  <div
                    class="w3-center"
                    dangerouslySetInnerHTML={{ __html: Parser(announcements) }}
                  ></div>
                  <br />
                </div>
              </div>
            )}
          </div>

          <div class="w3-col w3-quarter">
            {isdone1 === true && (
              <div class="w3-card-4 w3-round w3-padding-32 w3-white w3-center">
                {timestatus === "notstarted" && (
                  <div>
                    <h3>Contest Begins In</h3>
                    <p>
                      <span class="w3-tag w3-xxlarge w3-blue w3-round-large">
                        {String(d).padStart(2, "0")}
                      </span>{" "}
                      <span class="w3-tag w3-xxlarge w3-blue w3-round-large">
                        {String(d).padStart(2, "0")}
                      </span>{" "}
                      <span class="w3-tag w3-xxlarge w3-blue w3-round-large">
                        {String(m).padStart(2, "0")}
                      </span>{" "}
                      <span class="w3-tag w3-xxlarge w3-blue w3-round-large">
                        {String(s).padStart(2, "0")}
                      </span>{" "}
                    </p>
                    <p>
                      <span class="w3-large">Days &emsp;</span>{" "}
                      <span class="w3-large">Hrs &emsp;</span>{" "}
                      <span class="w3-large">Mins &emsp;</span>{" "}
                      <span class="w3-large">Secs</span>{" "}
                    </p>
                  </div>
                )}
                {timestatus === "running" && (
                  <div>
                    <h3>Contest Ends In </h3>
                    <p>
                      <span class="w3-tag w3-xxlarge w3-blue w3-round-large">
                        {String(h).padStart(2, "0")}
                      </span>{" "}
                      <span class="w3-tag w3-xxlarge w3-blue w3-round-large">
                        {String(m).padStart(2, "0")}
                      </span>{" "}
                      <span class="w3-tag w3-xxlarge w3-blue w3-round-large">
                        {String(s).padStart(2, "0")}
                      </span>
                    </p>
                    <p>
                      <span class="w3-large">Hrs &emsp;</span>{" "}
                      <span class="w3-large">Mins &emsp;</span>{" "}
                      <span class="w3-large">Secs</span>{" "}
                    </p>
                  </div>
                )}
                {timestatus === "ended" && (
                  <div>
                    <h2>Contest Ended</h2>
                  </div>
                )}
              </div>
            )}
            <br />
            {isdone2 === true && (
              <div class="w3-card-4 w3-round w3-white w3-center">
                <div class="w3-container">
                  <h3>RANKING</h3>
                  <hr/>
                  <table
                    class="w3-center w3-table w3-responsive w3-bordered w3-hoverable"
                    height="450px"
                  >
                    <thead>
                      <tr class="w3-light-grey">
                        <th class="w3-center">Rank</th>
                        <th class="w3-center">User</th>
                        <th class="w3-center">Country</th>
                        <th class="w3-center">Time</th>
                        <th class="w3-center">Score</th>
                      </tr>
                    </thead>
                    {details.map((det) => (
                      <tr>
                        <td class="w3-center">{det.rank}.</td>
                        <td class="w3-center">{det.user}</td>
                        <td class="w3-center">{det.country}</td>
                        <td class="w3-center">{det.totaltime}</td>
                        <td class="w3-center">{det.totalScore}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            )}
            <br />

            {isdone3 === true && (
              <div class="w3-card-4 w3-round w3-white w3-center">
                <div class="w3-container">
                  <h3>RECENTS ACTIVITIES</h3>
                  <hr/>
                  <table
                    class="w3-table w3-responsive w3-bordered w3-hoverable"
                    height="450px"
                    overflow-x="auto"
                  >
                    <thead>
                      <tr class="w3-light-grey">
                        <th class="w3-center">User</th>
                        <th class="w3-center">Problem</th>
                        <th class="w3-center">Language</th>
                        <th class="w3-center">Result</th>
                        <th class="w3-center">Score</th>
                      </tr>
                    </thead>
                    {subdetails.map((det, i) => (
                      <tr>
                        <td class="w3-center">{det.user}</td>
                        <td class="w3-center">{det.probcode}</td>
                        <td class="w3-center">{det.lag}</td>
                        <td class="w3-center">{det.result}</td>
                        <td class="w3-center">{det.score}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            )}
            <br/>
          </div>
        </div>
        {isdone1 === false &&
          <div class="w3-center">
            <p class="w3-jumbo w3-padding-64 fa fa-gear fa-spin"></p>
          </div>}
      </div>
    );
  }
}
export default Problems;
