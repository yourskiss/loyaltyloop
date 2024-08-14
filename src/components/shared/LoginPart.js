"use client";
import { useState } from "react";
import { _get } from "@/config/apiClient";
import { toast } from 'react-toastify';
import Loader from "../shared/LoaderComponent";

export default function LoginPart({isMobStatus, getMobNumber, phonenumber}) {
  const [pagemsg, setPagemsg] = useState('');
  const[loading, setLoading] = useState(false);
  const [mobileValues, setMobileValues] = useState(phonenumber || '');
  const [mobileError, setMobileError] = useState('');
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const mobileChange = (e) =>{setMobileValues(e.target.value.replace(/[^0-9]/gi, '')); setMobileError(""); }
  const onInputmaxLength = (e) => {
    if(e.target.value.length > e.target.maxLength)
    {
      e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "").slice(0, e.target.maxLength);
    }
    else
    {
      e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "")
    }
  }
  const mobileSubmit =(e) =>{
    e.preventDefault();
    const regexMobile = /^[6789][0-9]{9}$/i;
    if (!mobileValues){setMobileError("Please enter your mobile number"); }
    else if(mobileValues.length < 10){setMobileError("Mobile Number  must have at least 10 Digit");}
    else if(!regexMobile.test(mobileValues)){setMobileError("Invalid mobile number!");}
    else { 
      setMobileError("");  
        if(mobileValues === '9898989898' || mobileValues === '9876543210' || mobileValues === '9090909090' || mobileValues === '9111111111' || mobileValues === '9191919191' || mobileValues === '6111111116') // || mobileValues === '9990499606' || mobileValues === '9212672201')
        {
          sendDemo();
        }
        else
        {
          sendotp();
        }
    }
  }

  const sendotp = () => {
    setLoading(true);
    setPagemsg('Sending OTP');
      _get("Sms/SendOTP?mobile="+ mobileValues)
      .then((res) => {
        // console.log("send otp  - ", res);
        setLoading(false);
        isMobStatus(true); 
        getMobNumber(mobileValues);
        toast.success(res.data.resultmessage);
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }
  
  const sendDemo = () => {
    setLoading(true);
    setPagemsg('Sending demo OTP');
    setTimeout(function(){
        setLoading(false);
        isMobStatus(true); 
        getMobNumber(mobileValues);
        toast.success('OTP sent successfully');
    },1000);
  }


  return (<>
    <form onSubmit={mobileSubmit}>
              <div className="registercontainer">
                <div className="registerHead">Welcome to LoyaltyLoop!</div>
                <div className="registerField">
                  <div className="registertext">To proceed further please enter your mobile number.</div>
                  <div className="registerinputformobile">
                    <span>+91-</span>
                    <input className="registerinput" type="number" name="mobile" autoComplete="off" min="0" maxLength={10} minLength={10} value={mobileValues} onChange={mobileChange} onInput={onInputmaxLength} onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault() } />
                  </div>
                  { mobileError && <span className='registerError'>{mobileError}</span> } 
                </div>
 
              </div>
              <div className="registerSubmit">
                <button className="register_button">SEND OTP</button>
              </div>
            </form>


    <Loader showStatus={loading} message={pagemsg}  />
    </>)
}
