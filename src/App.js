import './App.css';
import React, { useState } from 'react'
import firebase from './firebase'
import Axios from 'axios'
import copy from "copy-to-clipboard"

function App() {

  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    aadhar: "",
    vehical: "",
    otp: "",
    vehical_img: "",
    aadhar_img: ""
  })
  const [otp, setOtp] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [hash, setHash] = useState("")
  const [copyText, setCopyText] = useState('');

  function handle(e) {
    const newData = {...data}
    newData[e.target.id] = e.target.value
    setData(newData)
  }

  const handleCopyText = (e) => {
      setCopyText(e.target.value);
  } 
  
  const copyToClipboard = () => {
      copy(hash);
      alert(`You have copied "${hash}"`);
  }

  function submit(e){
    e.preventDefault()

    // firebase mobile verification
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
              setHash(res.data.hash)
              if(!success) setSuccess(!success)
              // http://localhost:4000/validate-driver/test12/29d02980c977387beb71ac8fc864372e
          })          
        }).catch((error) => {
          if(!fail) setFail(!fail)
        })
    })

    // Normmal code
    // if(!otp) setOtp(!otp) // otp = true
  }

  // otp enter function
  // function submitOtp(e) {
  //   e.preventDefault()

  //   let code = data.otp
  //   if(code == '123456'){
  //     Axios.post("http://localhost:4000/write-data", {
  //       data: data
  //     })
  //     .then(res => {
  //         setHash(res.data.hash)
  //         if(!success) setSuccess(!success)
  //         // localhost:4000/validate-driver/test/hashkey
  //     })
  //   }else{
  //     if(!fail) setFail(!fail)
  //   }
  // }

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
          <label>Upload Vehical License: </label>
          <input value={data.vehical_img} id="vehical_img" type="file" required="true" onChange={(e) => handle(e)} ></input>
          <label>Upload Aadhar Image: </label>
          <input value={data.aadhar_img} id="aadhar_img" type="file" required="true" onChange={(e) => handle(e)} ></input>
          
          <input type="submit" className="btn" ></input>
          
        </form>}
        {!success && !fail && !otp && <div id='recaptcha'></div>}
        {/* {otp && !success && !fail && <form onSubmit={(e) => submitOtp(e)} method="post">
          <label>Enter OTP Here: </label>
          <input value={data.otp} 
            id="otp" 
            type="text" 
            placeholder="OTP" 
            required="true" 
            onChange={(e) => handle(e)} 
          ></input>
          <input type="submit" className="btn"></input>
        </form>} */}
        {success && otp && !fail &&
          <h1 className="pass"> Your Data is successfully Stored 
            <br /> <br />
            <div className="hash"> 
            <input  
              type="text" 
              className="copy-text"
              value={hash} 
              onChange={handleCopyText}
              placeholder={hash}
            />
            <button className="btn-copy" onClick={copyToClipboard}>
              Copy To Clipboard
            </button>
            </div> 
          </h1>
        }
        {fail && otp && !success && <h1 className="fail"> Something went wrong </h1>}
      </div>
    </div>
  );
}

export default App;
