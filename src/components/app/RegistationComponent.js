"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Loader from '../shared/LoaderComponent';
import { toast } from 'react-toastify';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import CityStateComponent from "../shared/CitystateComponent";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { _post } from "@/config/apiClient";
import { isUserToken, setUserCookies } from "@/config/userauth";
import HeaderFirst from "../shared/HeaderFirst";
import { encryptText } from "@/config/crypto";
import { isCouponeCode } from "@/config/validecoupone";
import { getLoginNumber,  isLoginNumber, removeLoginNumber } from "@/config/registertoken";
import FooterComponent from "../shared/FooterComponent";
import { setUserInfo } from "@/config/userinfo";

export default function RegistationComponent() {
  const [step, setStep] = useState(1);
  const [pagemsg, setPagemsg] = useState('');
  const[loading, setLoading] = useState(false);
  
  const [cityStateName, setCityStateName] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const[citystateErrors, setCitystateErrors] = useState('');

  const[firstname, setFirstname] = useState('');
  const[fnErrors, setfnErrors] = useState('');
  const[lastname, setLastname] = useState('');
  const[allName, setAllName] = useState('');
  const[lnErrors, setlnErrors] = useState('');
  const[pincode, setPincode] = useState('');
  const[pincodeErrors, setPincodeErrors] = useState('');
  const [tnc, setTnc] = useState(false);
  const [tncError, setTncError] = useState('');
  const [mobilenumber, setMobilenumber] = useState('');
  const [paninfo, setPaninfo] = useState('');
  const [panErrors, setPanErrors] = useState('');
  
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const symbolsExcept = ["+", "-", "."];
 

  const onInputmaxLength = (e) => {
      if(e.target.name === 'pincode')
      {
          if(e.target.value.length > e.target.maxLength)
          {
            e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "").slice(0, e.target.maxLength);
          }
          else
          {
            e.target.value = e.target.value.replace(/[e\+\-\.]/gi, "")
          }
      }
      else
      {
          if(e.target.value.length > e.target.maxLength)
          {
            e.target.value = e.target.value.slice(0, e.target.maxLength);
          }
      }
  }
 
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const getLoginID = getLoginNumber();
  const isLoginID = isLoginNumber();
  const userToken =  isUserToken();
  const { push } = useRouter();
  const isCC = isCouponeCode();
 
 
 

 useEffect(() => {
  if(userToken && !isCC) { push("/dashboard"); return }
  if(userToken && isCC) { push("/getcoupone"); return }
  if(isLoginID) { setMobilenumber(getLoginID) } else { push('/login');}
 }, []);

  const checkboxHandler = () => {
    tnc === false ? setTnc(true) : setTnc(false);
    setTncError("");
  }
 

 

  const handleOptionChange = (sc, st, ct) => {
    setCitystateErrors(''); 
     setCityStateName(sc);
     setStateName(st);
     setCityName(ct);
    // console.log("handel change - ", cityStateName, " - ", stateName, " - ", cityName);
  };
 
 
  const backtostep = (e) => {
    e.preventDefault();
    if(step === 2) {setStep(1);}
    if(step === 3) {setStep(2);}
  } 

  const handleStep1 = (e) => {
    e.preventDefault();
    setfnErrors('');
    setlnErrors('');
   // if(firstname === '' && lastname === '') { setfnErrors('First name is required.'); setlnErrors('Last name is required.');  }
    if(firstname === '') { setfnErrors('First name is required.'); }
  //  else if(lastname === '') { setlnErrors('Last name is required.'); }
    else { setStep(2); }
  } 
  const handleStep2 = (e) => {
    e.preventDefault();
    setPincodeErrors('');
    setCitystateErrors(''); 
    if(cityStateName  === '' && pincode === '') { setCitystateErrors('City is required.'); setPincodeErrors('Postal code in required.'); }
    else if(cityStateName  === '') { setCitystateErrors('City is required.'); }
    else if(pincode === '') {  setPincodeErrors('Postal code in required.'); }
    else if(pincode.length !== 6) { setPincodeErrors('Postal code  must have at least 6 Digits.'); }
    else { setStep(3); }
  } 
  const handleStep3 = (e) => {
    e.preventDefault();
    setPanErrors(""); 
    setTncError("");
    const regexPan = /^[a-z]{5}[0-9]{4}[a-z]{1}$/i;
    if (!paninfo && !tnc) { setPanErrors('Pan is required.'); setTncError("Please agree with our Terms & conditions");}
    else if(paninfo === '') { setPanErrors('Pan is required.'); }
    else if(paninfo.length !== 10) { setPanErrors('Pan must have at least 10 Digits.'); }
    else if(!regexPan.test(paninfo)){setPanErrors("Invalid PAN Number!");}
    else if(!tnc) { setTncError("Please agree with our Terms & conditions"); }
    else { 
        handleRegistration();
     }
  } 

   
   
  const handleRegistration = () => 
  { 
    if(lastname === '')
    {
      setAllName(firstname);
    }
    else
    {
      setAllName(firstname + " " + lastname);
    }

    setLoading(true);
    setPagemsg('Information Savings');
    const datafinal = {
      firstname: firstname,
      lastname: lastname,
      fullname: allName,
      gender: '',
      phonenumber: mobilenumber,
      emailaddress:'',
      aadhaarinfo: '',
      addressline1: "",
      city: cityName,
      state: stateName,
      country: "India",
      postalcode: pincode,
      profilepictureurl: '',
      dateofbirth: "",
      languagepreference: "English",
      agentcode:'',
      locationpage: "/register",
      ipaddress: ipInfo,
      osdetails: osInfo,
      browserdetails: browserInfo
    }
    // console.log(datafinal);

 
      _post("Customer/SaveUser", datafinal)
      .then((res) => {
       // console.log("SaveUser ", res);
        setLoading(false);
        if(res.data.result)
        {
          setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
          const userinfo = res.data.result.userid + "|" + res.data.result.phonenumber
          setUserCookies(encryptText(userinfo));
          savebankdetail(res.data.result.userid, paninfo, res.data.result.fullname, mobilenumber);
          removeLoginNumber();
              if(isCC)
              { 
                toast.success('Coupon Added Successfully'); 
                push('/getcoupone');
                
              }
              else 
              {
                toast.success('Registation Successfully.'); 
                push("/dashboard");
              }
        }
        else
        {
          toast.warn(res.data.resultmessage);
        }
      }).catch((err) => {
        console.log(err.message);
        setLoading(false); 
      });
  }

 
  const savebankdetail = (userid, paninfo, fullname, mobileno) => 
    {
      const bankinfo = {
        userid: userid,
        bankname: '',
        ifcscode: '',
        accountnumber: '',
        upicode: '',
        aadhaar: '',
        pan:paninfo,
        username:fullname,
        rmn: mobileno,
        locationpage: "/registation",
        ipaddress: ipInfo,
        osdetails: osInfo,
        browserdetails: browserInfo
      }
      _post("/Payment/SaveUserPayoutInfo", bankinfo)
      .then((res) => {
          console.log("SaveUserPayoutInfo save - ", res);
      }).catch((error) => {
          console.log(error); 
      });
    }
  
 
  return (<>
    <HeaderFirst />
    <div className="screenmain">
        <div className="screencontainer">
          <div className="registercontainer">
              {
                step !== 1 ? <div className="registerback"><span onClick={backtostep} title="Back">&#8592; Back</span></div> : null 
              }
              <div className="registerSmallHead">SIGN UP</div>
              <div className="registerHead">Setup your profile</div>
 
              { step === 1 && <form onSubmit={handleStep1}>
                <div className="registerField">
                  <div className="registertext">First Name - As per PAN Card<small>*</small></div>
                  <input
                    className="registerinput"
                    type="text"
                    name="firstname"
                    autoComplete="off"
                    maxLength={20}
                    value={firstname}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setFirstname(e.target.value.replace(/[^a-z]/gi, '')); setfnErrors(''); } }
                  />
                  {fnErrors && <span className="registerError">{fnErrors}</span> }
                </div>
                <div className="registerField">
                  <div className="registertext">Last Name - As per PAN Card </div>
                  <input
                    className="registerinput"
                    type="text"
                    name="lastname"
                    autoComplete="off"
                    maxLength={20}
                    value={lastname}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setLastname(e.target.value.replace(/[^a-z]/gi, '')); setlnErrors(''); } }
                  />
                  {lnErrors && <span className="registerError">{lnErrors}</span> }
                </div> 

                <div className="registerSubmit">
                  <button className="register_button">CONTINUE</button>
                </div>    
              </form> }
 
              { step === 2 && <form onSubmit={handleStep2}>
                <div className="registerField">
                      <div className="registertext">City of work area<small>*</small></div>
                      <ErrorBoundary>
                          <CityStateComponent scChange={handleOptionChange} nameSC={cityStateName} nameS={stateName} nameC={cityName} />
                      </ErrorBoundary>
                      { citystateErrors && <span className="registerError"> {citystateErrors}</span> } 
                </div>
              

                <div className="registerField">
                  <div className="registertext">Pincode of work area<small>*</small></div>
                  <input
                    className="registerinput"
                    type="number"
                    name="pincode"
                    autoComplete="off"
                    min="0"
                    maxLength={6}
                    value={pincode}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setPincode(e.target.value.replace(/[^0-9]/gi, '')); setPincodeErrors(''); }}
                    onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault() }
                  />
                  {pincodeErrors && <span className="registerError">{pincodeErrors}</span> }
                </div>

                

                <div className="registerSubmit">
                  <button className="register_button">CONTINUE</button>
                </div>
              </form> }
              

              { step === 3 && <form onSubmit={handleStep3}>
 

                <div className="registerField">
                  <div className="registertext">Pan Number<small>*</small></div>
                  <input
                    className="registerinput"
                    type="text"
                    name="paninfo"
                    autoComplete="off"
                    min="0" 
                    maxLength={10}
                    value={paninfo}
                    onInput={onInputmaxLength}
                    onChange={(e) => { setPaninfo(e.target.value.replace(/[^0-9a-z]/gi, '').toUpperCase()); setPanErrors('');  }}
                    onKeyDown={(e) => symbolsExcept.includes(e.key) && e.preventDefault() }
                  />
                  <div className="registerLineText">Pan required for payment verification</div>
                  {panErrors && <span className="registerError">{panErrors}</span> }
                </div>

                <div className="registerTncAccept">
                  <input id="accepttnc" type="checkbox" value={tnc} onChange={checkboxHandler}  />
                  <label htmlFor="accepttnc"><span>By signing you agree to our </span><Link href="/assets/pdf/terms-of-use.pdf" target="_blank">Terms & condition</Link></label>
                  { tncError && <span className='registerError'>{tncError}</span> } 
                </div>

                <div className="registerSubmit"> 
                  <button className="register_button">Submit</button>
                </div>
              </form>}


          </div>
        </div>
    </div>

    <FooterComponent />

    <Loader showStatus={loading} message={pagemsg} />
</>)
}
