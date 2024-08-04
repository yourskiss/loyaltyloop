"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import { getUserID, getUserMobile } from "@/config/userauth";
import { toast } from 'react-toastify';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import CitystateUpdateComponent from "../shared/CitystateUpdateComponent";
import { _get, _post } from "@/config/apiClient";
import HeaderDashboard from "../shared/HeaderDashboard";
import FooterComponent from "../shared/FooterComponent";
import { setUserInfo } from "@/config/userinfo";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function UpdateprofileComponent() {
    const [pagemsg, setPagemsg] = useState('');
    const[loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [mounted2, setMounted2] = useState(true);
    const [mounted3, setMounted3] = useState(true);

    const [seList, setSeList] = useState([]);
    const [userdata, setUserdata] = useState({});

    const [agentcode, setAgentcode] = useState('');
    const [erroragentcode, setErroragentcode] = useState('');
    const [firstname, setFirstname] = useState('');
    const [errorfirstname, setErrorfirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [errorlastname, setErrorlastname] = useState('');
    const [postalcode, setPostalcode] = useState('');
    const [errorpostalcode, setErrorpostalcode] = useState('');
    const [pan, setPan] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [errorpan, setErrorpan] = useState('');
    const[fullname, setFullname] = useState('');
    const [cityStateName, setCityStateName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');
    const [citymount, setCitymount] = useState(false);


    const [bankname,setBankname] = useState('');  
    const [bankcode,setBankcode] = useState('');       
    const [accountnumber,setAccountnumber] = useState('');  
    const [upicode,setUpicode] = useState('');     
        
    const { push } = useRouter();
    const userID = getUserID();
    const userMobile = getUserMobile();
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();
    
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    const symbolsExcept = ["+", "-", "."];

    useEffect(() => {
        setLoading(true);
        setPagemsg('Profile details fetching');
        _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
        .then((res) => {
            // console.log("UserInfo onload ", res);
            setLoading(false);
            if(mounted)
            {
                setCitymount(true);
                setUserdata(res.data.result);
                
                res.data.result.agentcode !== null ? setAgentcode(res.data.result.agentcode) : setAgentcode('');
                res.data.result.fullname !== null ? setFullname(res.data.result.fullname) : setFullname('');
                res.data.result.firstname !== null ? setFirstname(res.data.result.firstname) : setFirstname('');
                res.data.result.lastname !== null ? setLastname(res.data.result.lastname) : setLastname('');
                res.data.result.postalcode !== null ? setPostalcode(res.data.result.postalcode) : setPostalcode('');
                res.data.result.aadhaarinfo !== null ? setAadhaar(res.data.result.aadhaarinfo) : setAadhaar('');
 
                setCityStateName(`${res.data.result.city} (${res.data.result.state})`)
                setStateName(res.data.result.state);
                setCityName(res.data.result.city);

            }
        }).catch((err) => {
            console.log("UserInfo onload ", err.message);
            setLoading(false); 
        });
        return () => { setMounted(false); }
    }, []);


    useEffect(() => {
        _get("/Payment/GetUserPayoutInfo?userid="+userID)
        .then((respons) => {
            // console.log("GetUserPayoutInfo onload ", respons.data.result.pan, respons);
            if(mounted2)
            { 
                respons.data.result.pan !== null ? setPan(respons.data.result.pan) : setPan('');
                respons.data.result.bankname !== null ? setBankname(respons.data.result.bankname) : setBankname('');
                respons.data.result.ifcscode !== null ? setBankcode(respons.data.result.ifcscode) : setBankcode('');
                respons.data.result.accountnumber !== null ? setAccountnumber(respons.data.result.accountnumber) : setAccountnumber('');
                respons.data.result.upicode !== null ? setUpicode(respons.data.result.upicode) : setUpicode('');
            }
        }).catch((error) => {
            console.log("GetUserPayoutInfo onload ", error); 
        });
        return () => { setMounted2(false); }
    }, []);
    

    useEffect(() => {
        _get("Cms/SEAgentCode")
        .then((res) => {
           // console.log("SEAgentCode - ", res);
            if(mounted3)
            {
                setSeList(res.data.result);
            } 
        }).catch((err) => {
            console.log("StateCity add - ", err.message);
        });
      return () => { setMounted3(false); }
    }, []); 

    const handleOptionChange = (sc, st, ct) => {
        setCityStateName(sc);
        setStateName(st);
        setCityName(ct);
        // console.log("change update - ", cityStateName, " - ", stateName, " - ", cityName);
     };

    const handalonKeyup = (e) => {
       // debugger;
        if(e.target.value.length === 4)
        {
            setLoading(true);
            setPagemsg('Validating Sales Executive ID.');
            const filteredResults = filterArrayByInput(seList, e.target.value);
           // console.log(filteredResults);
            if(filteredResults === 0)
            {
                setTimeout(function(){ setLoading(false); }, 500);
                setErroragentcode("Please enter valid Sales Executive ID.");
                setAgentcode('');
            }
            else 
            {
                setTimeout(function(){ setLoading(false); }, 500);
                setErroragentcode("");
                setAgentcode(e.target.value);
            }
        }
    }
    function filterArrayByInput(datafromAPI, searchValue) {
        const filteredData = datafromAPI.filter(value => {
            const searchStr = searchValue.toUpperCase();
            const nameMatches = value.agentcode.toUpperCase().includes(searchStr);
            return nameMatches;
        });   
        return filteredData.length;
    }
 
    const handleSubmit = (e) =>{
        e.preventDefault();
        const regexPan = /^[a-z]{5}[0-9]{4}[a-z]{1}$/i;
        if(agentcode !=='' && agentcode?.length !== 4) { setErroragentcode("Please enter valid Sales Executive ID."); return }
        else if(firstname==='') { setErrorfirstname("First name is required."); return }
        else if(pan==='') { setErrorpan("PAN number is required");  return }
        else if(pan?.length !== 10) { setErrorpan("Please enter valid PAN number"); return }
        else if(!regexPan.test(pan)){setErrorpan("Invalid PAN Number!");}
        else
        {
            if(lastname === '' || lastname === null)
            {
                setFullname(firstname);
            }
            else
            {
                setFullname(firstname + " " + lastname);
            }
            updateuserinfo();
        }
    }

   

    
    const updateuserinfo = () => {
           const datafinal = 
           {
            userid: userID,
            firstname: firstname,
            lastname: lastname,
            fullname: fullname,
            gender: "",
            phonenumber: userMobile,
            emailaddress: "",
            aadhaarinfo: aadhaar,
            addressline1: "",
            city: cityName,
            state: stateName,
            country: 'India',
            postalcode: postalcode,
            profilepictureurl: '',
            dateofbirth: "",
            languagepreference: "English",
            agentcode: agentcode,
            locationpage: "/update-profile",
            ipaddress: ipInfo,
            osdetails: osInfo,
            browserdetails: browserInfo
          }
          // console.log("datafinal: ",datafinal);
            setLoading(true);
            setPagemsg('Profile details updating');
            _post("Customer/SaveUser", datafinal)
            .then((res) => {
               // console.log("SaveUser update ",res);
                if(res.data.result)
                {
                    setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);  
                    toast.success("Profile Updated Successfully.");
                    updatebankdetail();
                }
                else
                {
                    setLoading(false);
                    toast.warn(res.data.resultmessage)
                }
            }).catch((err) => {
                setLoading(false); 
                toast.error(err.message);
            });
    }

        const updatebankdetail = () => 
        {
          const bankinfo = {
            userid: userID,
            bankname: bankname,
            ifcscode: bankcode,
            accountnumber: accountnumber,
            upicode: upicode,
            aadhaar: aadhaar,
            pan: pan,
            username: fullname,
            rmn: userMobile,
            locationpage: "/update-profile",
            ipaddress: ipInfo,
            osdetails: osInfo,
            browserdetails: browserInfo
          }
          // console.log("UpdateUserPayoutInfo string - ",bankinfo);
          _post("/Payment/UpdateUserPayoutInfo", bankinfo)
          .then((res) => {
            // console.log("UpdateUserPayoutInfo update ", res);
             setLoading(false);
            if(res.data.result === null)
            {
                toast.error(res.data.resultmessage);
            }
            else
            {
                push('/profile');
            }
          }).catch((error) => {
              console.log(error); 
          });
        }


        

  return (
    <>
      <ErrorBoundary>
        <HeaderDashboard />
      </ErrorBoundary>
    <div className='screenmain'>
        <section className="screencontainer">
        <form onSubmit={handleSubmit}>
            <div className="registercontainer">
                <div className="registerHead">Update your profile</div>


                <div className="registerField">
                    <div className="registertext">Sales Executive ID</div>
                    <input
                        className="registerinput"
                        type="text"
                        name="agentcode"
                        maxLength={4}
                        onInput={(e)=> e.target.value = e.target.value.slice(0, e.target.maxLength) }
                        value={ agentcode || '' }
                        onChange={(e)=>{setAgentcode(e.target.value);setErroragentcode("");} }
                        onKeyUp={handalonKeyup}
                    />
                    <span className="registerError">{ erroragentcode  &&  erroragentcode }</span>
                </div>
 
                
                <div className="registerField">
                    <div className="registertext">First Name - As per PAN Card<small>*</small></div>
                    <input
                        className="registerinput"
                        type="text"
                        name="firstname"
                        maxLength={25}
                        onInput={(e)=> e.target.value = e.target.value.slice(0, e.target.maxLength) }
                        value={ firstname  || ''  }
                        onChange={(e)=> {setFirstname(e.target.value.replace(/[^a-z]/gi, '')); setErrorfirstname('');}}
                    />
                    <span className="registerError">{ errorfirstname  && errorfirstname }</span>
                </div>

                <div className="registerField">
                    <div className="registertext">Last Name - As per PAN Card </div>
                    <input
                        className="registerinput"
                        type="text"
                        name="lastname"
                        maxLength={25}
                        onInput={(e)=> e.target.value = e.target.value.slice(0, e.target.maxLength) }
                        value={ lastname  || ''  }
                        onChange={(e)=> {setLastname(e.target.value.replace(/[^a-z]/gi, '')); setErrorlastname('');}}
                    />
                   <span className="registerError">{ errorlastname &&  errorlastname }</span>
                </div>
 
 
                <div className="registerField" style={{'userSelect':'none','pointerEvents':'none'}}>
                      <div className="registertext">City of work area<small>*</small></div>
                      { citymount && <ErrorBoundary>
                          <CitystateUpdateComponent scChange={handleOptionChange} nameSC={cityStateName} nameS={stateName} nameC={cityName} />
                      </ErrorBoundary>}
                      
                      {/* <div className="registerLineText">Enter State name to pick nearby City</div> */}
                </div>

                <div className="registerField">
                    <div className="registertext">Pincode of work area<small>*</small></div>
                    <input
                        className="registerinput"
                        type="number"
                        name="postalcode"
                        min="0"
                        readOnly
                        maxLength={6}
                        onInput={(e)=> e.target.value = e.target.value.slice(0, e.target.maxLength) }
                        value={ postalcode || '' }
                        onChange={(e)=> {setPostalcode(e.target.value.replace(/[^a-z0-9]/gi, '')); setErrorpostalcode('');}}
                        onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault() }
                    />
                    <span className="registerError">{ errorpostalcode  &&  errorpostalcode }</span> 
                </div> 

                <div className="registerField">
                    <div className="registertext">PAN Number<small>*</small></div>
                    <input
                        className="registerinput"
                        type="text"
                        name="pan"
                        min="0"
                        maxLength={10}
                        onInput={(e)=> e.target.value = e.target.value.slice(0, e.target.maxLength) }
                        value={ pan || '' }
                        onChange={(e)=> { setPan(e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase()); setErrorpan('');}}
                        onKeyDown={(e) => symbolsExcept.includes(e.key) && e.preventDefault() }
                    />
                    <span className="registerError">{ errorpan && errorpan }</span> 
                </div>

       
                <div className="registerSubmit">
                  <button className="register_button">Update</button>
                </div>
            </div>
        </form>
    </section>
    </div>
 
    <FooterComponent />

    <Loader showStatus={loading} message={pagemsg} />
    </>
  )
}

  
 
 