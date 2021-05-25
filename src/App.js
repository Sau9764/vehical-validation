import './App.css';
import React, { useState } from 'react'
import firebase from './firebase'
import Axios from 'axios'

function App() {

  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    aadhar: "",
    vehical: "",
    otp: ""
  })
  const [otp, setOtp] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)

  function handle(e) {
    const newData = {...data}
    newData[e.target.id] = e.target.value
    setData(newData)
  }

  function submit(e){
    e.preventDefault()

    let recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha')
    firebase.auth().signInWithPhoneNumber('+91' + data.mobile, recaptcha).then(function(e) {
        if(!otp) setOtp(!otp)
        let code = prompt('Enter OTP')
        if(code == null) return
        e.confirm(code).then(function(result){
          console.log(result)

          Axios.post("http://localhost:4000/write-data", {
            data: data
          })
          .then(res => {
            if(res.data == "written"){
              if(!success) setSuccess(!success)
            }
          })          
        }).catch((error) => {
          if(!fail) setFail(!fail)
        })
    })
  }


  return (
    <div className="App">
      <div className="form-contaner">
        {!otp && !success && <form onSubmit={(e) => submit(e)} method="post">
          <label>Enter Your Name: </label>
          <input value={data.name} id="name" type="text" placeholder="Robel Joi" required="true" onChange={(e) => handle(e)} ></input>
          <label>Enter Mobile Number: </label>
          <input value={data.mobile} id="mobile" type="number" placeholder="Exanple 9898989898"  required="true" onChange={(e) => handle(e)} ></input>
          <label>Enter Email Address: </label>
          <input value={data.email} id="email" type="email" placeholder="xyz@domain.ext"  required="true" onChange={(e) => handle(e)} ></input>
          <label>Enter Aadhar Number: </label>
          <input value={data.aadhar} id="aadhar" type="number" placeholder="7676-8978-8869-8962"  required="true" onChange={(e) => handle(e)} ></input>
          <label>Enter Vehical Number: </label>
          <input value={data.vehical} id="vehical" type="text" placeholder="Example MH02-AB-1212" required="true" onChange={(e) => handle(e)} ></input>
          <input type="submit" className="btn" ></input>
        </form>}
        {!success && !fail && <div id='recaptcha'></div>}
        {success && otp && <h1 className="pass"> Your Data is successfully Stored </h1>}
        {fail && otp && <h1 className="fail"> Something went wrong </h1>}
      </div>
    </div>
  );
}

export default App;
