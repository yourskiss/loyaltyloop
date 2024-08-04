"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { encryptText } from "@/config/crypto";
import Otpcountdown from "../core/timer";
import { _get } from "@/config/apiClient";
import {setUserCookies } from "@/config/userauth";
import { toast } from 'react-toastify';
import { setLoginNumber } from "@/config/registertoken";
import Loader from "../shared/LoaderComponent";
import { isCouponeCode } from "@/config/validecoupone";
import OtpInput from 'react-otp-input';
import { setUserInfo } from "@/config/userinfo";

export default function OtpPart({isMobStatus, getMobNumber, phonenumber}) {
  const [pagemsg, setPagemsg] = useState('');
  const[loading, setLoading] = useState(false);
  const [otpValues, setOtpValues] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpsent, setOtpsent] = useState(false);

  const otpcountertime = new Date();
  otpcountertime.setSeconds(otpcountertime.getSeconds() + 60);  
  const getOtpTimer =(val) =>{ setOtpsent(val); }

  const { push } = useRouter();
  const isCC = isCouponeCode();


  const otpSubmit =(e) =>{
    e.preventDefault();
    const regexOTP = /^[0-9]{6}$/i;
    if (!otpValues){setOtpError("OTP is required!");}
    else if(otpValues.length < 6){setOtpError("OTP must have at least 6 digit");}
    else if(!regexOTP.test(otpValues)){setOtpError("Invalid otp");}
    else{ 
      setOtpError('');
      if(phonenumber === '9898989898' || phonenumber === '9876543210' || phonenumber === '9090909090' || phonenumber === '9111111111' || phonenumber === '9191919191' || phonenumber === '6111111116') // || phonenumber === '9990499606' || phonenumber === '9212672201')
      {
        verifyDemo();
      }
      else
      {
        verifyotp();
      }
    }
  }
  
  const changeNumber = (e) => {
    e.preventDefault();
    isMobStatus(false);
    getMobNumber(phonenumber);
  }



  const resendotp = () => {
    setLoading(true);
    setPagemsg('Re-sending OTP');
      _get("Sms/SendOTP?mobile="+ phonenumber)
      .then((res) => {
        // console.log("send otp  - ", res);
        setLoading(false);
        isMobStatus(true); 
        setOtpsent(false);
        getMobNumber(phonenumber);
        toast.success(res.data.resultmessage);
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }

  const verifyotp = () => {
      setLoading(true);
      setPagemsg('Verifying OTP');
      _get("Sms/VerifyOTP?&mobile="+phonenumber+"&otp="+otpValues)
      .then((res) => {
        setLoading(false);
       // console.log("Verify OTP - ", res);
        if(res.data.isValid)
        {
          loginnow();
        }
        else
        {
          toast.error("Invalid OTP");
          setOtpValues('');
        }
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }
  const verifyDemo = () => {
    setLoading(true);
    setPagemsg('Verifying demo OTP');
    setTimeout(function(){ loginnow(); },1000);
  }

  
  function loginnow()
  {
    setLoading(true);
    setPagemsg('Verifying User');
    _get("Customer/UserInfo?userid=0&phonenumber="+ phonenumber)
    .then(res => {
      //  console.log("login success - ", res);
      if(res.data.result.verificationstatus === "APPROVE" || res.data.result.verificationstatus === "PENDING")
      {
          setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
          const userinfo = res.data.result.userid + "|" + res.data.result.phonenumber
          setUserCookies(encryptText(userinfo));       
          if(res.data.result)  
          {
              if(isCC)
              { 
                toast.success('Coupon Added Successfully'); 
                push('/getcoupone');
                
              }
              else 
              {
               // toast.success('Login Successfully.'); 
                push("/dashboard");
              }
          }
          else
          {
              toast.error(res.data.resultmessage);
          }
      }
      else if(res.data.result.verificationstatus === "REJECT")
      {
        toast.warn("Your request has been rejected. please Try with another mobile number.");
      }
      else
      {
        setLoginNumber(phonenumber);
        push('/register');
      }
      setTimeout(function(){ setLoading(false); },2000);
    })
    .catch(error => {
      console.log("catch loginnow");
      toast.error(error.message);
      setLoading(false); 
    });
  }



   

  useEffect(() => {
    if ('OTPCredential' in window) 
    {
      const ac = new AbortController();
      navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otp) => {
        setOtpValues(otp.code);
        ac.abort();
      }).catch((err) => {
        ac.abort();
        console.error('Error fetching OTP:', err);
      });
    } 
    else 
    {
      console.warn('OTPCredential API not supported');
    }
  }, []);



  return (<>
    <form onSubmit={otpSubmit}>
            <div className="registercontainer">
              <div className="registerHead">Enter OTP</div>
              <div className="registerMsgOtp">
                <span>We have sent an OTP to <b>+91- {phonenumber}</b></span>
                <em className="numberedit" onClick={changeNumber}>Change</em>
              </div>

 
              <div className="registerOneTimePassword">
                <OtpInput
                  autoComplete="one-time-code"
                  value={otpValues}
                  onChange={setOtpValues}
                  numInputs={6}
                  inputType="number"
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input autoComplete="on" {...props} />}
                />
              </div>
              <iframe src="https://testclub.kerakoll.com/" allow="otp-credentials" className="otpCredentialsIframe"></iframe>


 
              { otpError && <span className='registerError'>{otpError}</span>  }
              {
                !otpsent ? (<div className="registerOtpText">Resend OTP in  <Otpcountdown expiryTimestamp={otpcountertime} onSuccess={getOtpTimer} /> Seconds </div>) : (<div className="registerOtpText">Not received? <span onClick={resendotp}>Resend OTP</span></div>)
              }
            </div>
            <div className="registerSubmit">
                <button className="register_button">Sign In</button>
            </div>
        </form>



        <Loader showStatus={loading} message={pagemsg}  />
  </>)
}
