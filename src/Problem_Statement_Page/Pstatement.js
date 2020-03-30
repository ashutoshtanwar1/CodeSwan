import React, { Component } from "react";
import axios from "axios";
import "./Pstatement.css";
import AceEditor from "react-ace";
import Parser from "html-react-parser";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-github";

class Pstatement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pcode: "",
      pname: "",
      statement: "",
      sizelt: "",
      timelt: "",
      auth: "",
      sucsub: "",
      totsub: "",
      lang: "c_cpp",
      theme: "tommorrow",
      codeval: " // Write your code here ... ",
      input: "",
      issubmit:false,
      langdict: {
        c_cpp: "C++14",
        java: "JAVA",
        python: "PYTH 3.6",
        javascript: "JS"
      },
      runstatus: false,
      loading:false,
      output:''
    };

    this.handleChange3 = this.handleChange3.bind(this);
    this.clickhandle = this.clickhandle.bind(this);
    var str = window.location.href;
    str = str.split("/");
    while(localStorage.getItem('access_token') === null){}
    var ccd = str[4];
    var pcd = str[5];
    // if(this.code === ''){
      
    axios({
      method: "get",
      url: `https://api.codechef.com/contests/${ccd}/problems/${pcd}`,
      headers: { Accept: "application/json", Authorization: `Bearer `+localStorage.getItem('access_token') },
    })
      .then((res) => {
        res = res.data.result.data.content;
        this.setState({
          pname: res["problemName"],
          pcode: res["problemCode"],
          statement: Parser(res["body"]),
          sizelt: res["sourceSizeLimit"],
          timelt: res["maxTimeLimit"],
          auth: res["author"],
          sucsub: res["successfulSubmissions"],
          totsub: res["totalSubmissions"]
         
        });
      })
      .catch((err) => {
        console.log("NOT DONE");
        console.log(err.response);
        // alert("SESSION EXPIRED! YOU HAVE TO LOGIN AGAIN !");
        // window.location.href = 'http://localhost:8000/index.php'
      });
    // }
  }
  handleChange1 = (e) => {
    this.setState({ lang: e.target.value });
  };
  handleChange2 = (e) => {
    this.setState({ theme: e.target.value });
  };
  handleChange3 = (e) => {
    this.setState({ codeval: e });
  };
  handleChange4 = (e) => {
    this.setState({ input: e.target.value });
  };
  submit = (e) => {
    this.setState({ issubmit: true });
  };
  getresfromlink = (e, link) => {
    axios({
      method: "get",
      url: `https://api.codechef.com/ide/status?link=${link}`,
      headers: { Accept: "application/json", Authorization: `Bearer ` + localStorage.getItem('access_token') },
    })
      .then((resp) => {
        if (resp.data.result.data.memory === 0) {
          setTimeout(() => {
            console.log(resp);
            this.getresfromlink(e, link);
          }, 15000);
        } else {
          console.log(resp);
          this.setState({
            output: resp.data.result.data.output,
            loading:false
          });
        }
      })
      .catch((err) => {
        console.log("NOT DONE565");
        console.log(err.response);
      });
  };
  clickhandle = (e, input, codeval, lang) => {
    this.setState({
      loading: true,
      runstatus : true
    });
    axios({
      method: "post",
      url: "https://api.codechef.com/ide/run",
      headers: { Accept: "application/json", Authorization: `Bearer `+localStorage.getItem('access_token') },
      params: { sourceCode: codeval, language: lang, input: input },
    })
      .then((res) => {
        var link = res.data.result.data.link;
        this.getresfromlink(e,link);
      })
      .catch((err) => {
        console.log(err);
      });
      
  };
  render() {
    const {
      state: {
        pcode,
        pname,
        statement,
        sizelt,
        timelt,
        auth,
        sucsub,
        totsub,
        langdict,
        lang,
        theme,
        issubmit,
        codeval,
        input,
        runstatus,
        loading,
        output
      },
    } = this;
    return (
      <div>
        <div class="split left">
          <div class="w3-container" max-width="" margin-top="80px">
            <div class="w3-row">
              <div class="w3-col">
                <div class="">
                  <div class="w3-col">
                    <div class="w3-card-4 w3-round w3-white">
                      <div class="w3-container w3-padding">
                        <h1 class="w3-center">
                          {pname} ({pcode})
                        </h1>
                        <p class="w3-center">
                          Successful Submissions : {sucsub} <br></br>Total
                          Submissions : {totsub}
                        </p>
                        <hr />
                        {/* dangerouslySetInnerHTML={{__html: statement }} */}
                        <div>{statement}</div>
                        <hr />
                        <p>Author : {auth}</p>
                        <p>Maximum Size Limit : {sizelt}</p>
                        <p>Maximum Time Limit : {timelt}</p>
                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="split right">
          <div class="w3-container" max-width="" margin-top="80px">
            <div class="w3-row">
              <div class="w3-col">
                <div class="">
                  <div class="w3-col">
                    <div class="w3-card-4 w3-round w3-white">
                      <div class="w3-container w3-padding">
                        <h1 class="w3-center"> Editor </h1>
                        <div>
                          <div align="center">
                            <div class="w3-row-padding">
                              <div class="w3-half">
                                <select
                                  class="w3-select"
                                  value={lang}
                                  onChange={this.handleChange1}
                                >
                                  <option value="c_cpp">C++</option>
                                  <option value="java">Java</option>
                                  <option value="python">Python</option>
                                  <option value="javascript">Javascript</option>
                                </select>
                              </div>
                              <div class="w3-half">
                                <select
                                  class="w3-select"
                                  width="10%"
                                  value={theme}
                                  onChange={this.handleChange2}
                                >
                                  <option value="monokai">Monokai</option>
                                  <option value="tomorrow">Tomorrow</option>
                                  <option value="github">Github</option>
                                </select>
                              </div>
                            </div>
                            <br />
                            {issubmit === true && <div class="w3-panel w3-pale-green">
                              <h3>Code Submitted Successfully! </h3>
                            </div>}
                            <br/>
                            <AceEditor
                            style = {{
                              borderRadius: "6px",
                              padding:"10px",
                              width:"95%",
                              height:"600px"
                            }}
                              mode={lang}
                              theme={theme}
                              value={codeval}
                              onChange={this.handleChange3}
                              name="aceEditor"
                              editorProps={{ $blockScrolling: true }}
                              fontSize={18}
                            />
                            <br></br>
                            <div class="w3-row-padding">
                              <div class="w3-half">
                                <em>
                                  <h5 class="w3-left-align">Custom Input</h5>
                                </em>
                                <textarea
                                  onChange={this.handleChange4}
                                  rows="4"
                                  cols="50"
                                ></textarea>
                                <br />
                                <br />
                                <button
                                  class="w3-btn w3-ripple w3-teal"
                                  onClick={(e) =>
                                    this.clickhandle(
                                      e,
                                      input,
                                      codeval,
                                      langdict[`${lang}`]
                                    )
                                  }
                                >
                                  Run
                                </button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button 
                                  class="w3-btn w3-ripple w3-teal"
                                  onClick={(e)=>this.submit(e)}
                                  >
                                  Submit
                                </button>
                                <br />
                                <br />
                              </div>
                              <div class="w3-half">
                                <br/><br/>
                                {runstatus===true && <div class="w3-panel w3-pale-blue w3-border-blue">
                                  {loading===false && <div> <p>Output : </p> <p class="w3-code">{output}</p> </div>}
                                  {loading===true && <p class="w3-xxlarge fa fa-circle-o-notch fa-spin"></p>}
                                </div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Pstatement;
