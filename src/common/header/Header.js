import React, {  useState } from 'react';
import Button from "@material-ui/core/Button";
import "./Header.css";
import "../common.css";
import image from "../../assets/logo.svg"
import Modal from 'react-modal';
import {FormControl,FormHelperText} from '@material-ui/core';
import {Tab,Tabs,Input,InputLabel} from '@material-ui/core';
import {Link} from 'react-router-dom';
Modal.setAppElement('#root');



export default function Header(props)
{
  const [tabSelected, settabSelected] = useState(0);
  const [modalVar, setModalVar] = useState(false);
  const [loggedIn, setLoggedIn] = useState(window.sessionStorage.getItem("access-token") == null ? false : true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [inputFirstName, setFirstName] = useState("")
  const [inputLastName, setLastName] = useState("")
  const [inputPassword, setInputpassword] = useState("")
  const [inputContactNo, setContactNo] = useState("")
  const [inputEmailId, setEmailId] = useState("")
  const [usernameRequired,setUserNameRequired] = useState("")
  const [loginPasswordRequired,setLoginPasswordRequired]= useState("")
  const [firstNameRequired,setFirstNameRequired] = useState("")
  const [lastnameRequired,setLastnameRequired] = useState("")
  const [emailRequired,setEmailRequired] = useState("")
  const [contactRequired,setContactRequired] = useState("")
  const [registerPasswordRequired,setRegisterPasswordRequired] = useState("")
  const [registrationSuccess,setRegistrationSuccess] = useState(false)

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  //Login Button click handler
  async function LoginHandler() {

    userName === "" ? setUserNameRequired("showBlock") : setUserNameRequired("showNone");
    password === "" ? setLoginPasswordRequired("showBlock") : setLoginPasswordRequired( "showNone" );

    const params = window.btoa(`${userName}:${password}`);
    const x = await fetch(props.baseUrl + "auth/login", {
      method: 'POST',
      headers: {
        "Accept": "application/json;charset=UTF-8",
        "authorization": `Basic ${params}`
      }
    });

    if (x.ok) {
      window.sessionStorage.setItem("access-token", x.headers.get('access-token'));
      setLoggedIn(true);
    }


  }


  //Register / SignUp click handler 
  async function RegisterHandler() {


    inputFirstName === "" ? setFirstNameRequired("showBlock") : setFirstNameRequired("showNone");
    inputLastName === "" ? setLastnameRequired("showBlock") : setLastnameRequired("showNone");
    inputEmailId === "" ? setEmailRequired("showBlock") : setEmailRequired("showNone");
    inputPassword === "" ? setRegisterPasswordRequired("showBlock") : setRegisterPasswordRequired("showNone");
    inputContactNo === "" ? setContactRequired("showBlock") : setContactRequired("showNone");

    const x = await fetch(props.baseUrl + "signup", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        "email_address": inputEmailId,
        "first_name": inputFirstName,
        "last_name": inputLastName,
        "mobile_number": inputContactNo,
        "password": inputPassword
      })
    }).then(response => response.json()).catch(e => console.log(e))


    if(x.status==="ACTIVE")
    {
      setRegistrationSuccess(true);
    }
    else
    {
      setRegistrationSuccess(false)
    }
   
    
  }


  //Logout button click handler
  function LogoutHandler(e) {

    e.preventDefault();
    window.sessionStorage.removeItem("access-token");
    setLoggedIn(false);
  }



  return(
    <div>
      <header>
           <img src={image} className='rotate' alt="appLogo" ></img>
           {/*Login Button*/}
        {!loggedIn && <div >
          <Button variant="contained" color="default" onClick={() => setModalVar(true)} className="loginButton" >LOGIN</Button>
        </div>}
 
          {/*Logout Button*/}
        {loggedIn && <div>
          <Button variant="contained" color="default" style={{ float: 'right' }} onClick={LogoutHandler} >LOGOUT</Button>
        </div>}

        {/* if bookshow button should appear if logged in*/}
        {props.showBookShowButton === "true" && loggedIn
          ? <div className="bookshow-button">
            <Link to={"/bookshow/" + props.id}>
              <Button variant="contained" color="primary">
                Book Show
              </Button>
            </Link>
          </div>
          : ""
        }

        {/* bookshow should redirect to modal if not logged in */}
        {props.showBookShowButton === "true" && !loggedIn
          ? <div className="bookshow-button">
              <Button variant="contained" color="primary" onClick={() => setModalVar(true)} >
                Book Show
              </Button>
          </div>
          : ""
        }
      </header>       
           

          {/* Modal for Login and Register/Signup tabs*/}
        <div>
          <Modal isOpen={modalVar} onRequestClose={() => setModalVar(false)} style={modalStyle}>
            <div>
              <Tabs value={tabSelected} onChange={(event, newValue) => { settabSelected(newValue) }} >
                <Tab label="LOGIN" />
                <Tab label="REGISTER" />
              </Tabs>

              {/* if tab selected is login */}
              {tabSelected === 0 && <div className="tabs">
                
              <FormControl required={true}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input id="username" type="text" value={userName} onChange={e => setUserName(e.target.value)} />
                <FormHelperText className={usernameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required={true}>
                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                <Input id="loginPassword" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <FormHelperText className={loginPasswordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              {loggedIn === true &&
                <FormControl>
                  <span className="successText">
                    Login Successful!
                  </span>
                </FormControl>
              }
                
                <br/>
                <Button variant="contained" color="primary" onClick={LoginHandler} >LOGIN</Button>
              </div>}

              {/* if tab selected is register/signup*/}
              {tabSelected === 1 && <div className="tabs" >

              <FormControl required={true}>
                <InputLabel htmlFor="firstname">First Name</InputLabel>
                <Input id="firstname" type="text" value={inputFirstName} onChange={(e) => setFirstName(e.target.value)} />
                <FormHelperText className={firstNameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required={true}>
                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                <Input id="lastname" type="text" value={inputLastName} onChange={(e) => setLastName(e.target.value)} />
                <FormHelperText className={lastnameRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required={true}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" type="text" value={inputEmailId} onChange={(e) => setEmailId(e.target.value)} />
                <FormHelperText className={emailRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required={true}>
                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                <Input id="registerPassword" type="password" value={inputPassword} onChange={(e) => setInputpassword(e.target.value)} />
                <FormHelperText className={registerPasswordRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              <FormControl required={true}>
                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                <Input id="contact" type="text" value={inputContactNo} onChange={(e) => setContactNo(e.target.value)} />
                <FormHelperText className={contactRequired}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br /><br />
              {registrationSuccess === true &&
                <FormControl>
                  <span className="successText">
                    Registration Successful. Please Login!
                  </span>
                </FormControl>
              }
      
                <br/>
                <Button variant="contained" color="primary" onClick={RegisterHandler} >REGISTER</Button>
              </div>}
            </div>
          </Modal>
        </div> 
    </div>
  );
};


 