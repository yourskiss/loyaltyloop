"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import { getUserID, removeUserToken } from '@/config/userauth';
import { _get } from "@/config/apiClient";
import { motion } from "framer-motion";
import FooterComponent from "../shared/FooterComponent";
import { setUserInfo, removeUserInfo } from "@/config/userinfo";
import {  getUserMobile, isUserToken } from "@/config/userauth";
 
export default function ProfileComponent() {
  const [mounted, setMounted] = useState(true);
  const [mounted2, setMounted2] = useState(true);
  const [usersinfo, setUsersinfo] = useState('');
  const [headload, setHeadLoad] = useState(false);

  const rewardspoints = parseInt(TotalrewardpointsComponent());
  const userid = getUserID();
  const [resultdata, setResultdata] = useState('');
  const Router = useRouter();
  const userToken   =  isUserToken();
  const userMobile = getUserMobile();

  useEffect(() => {
    if(!userToken) { Router.push("/login"); return  }
    setTimeout(function(){ setHeadLoad(true); },1000);
  }, []);
   

  useEffect(() => {
    _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
    .then((res) => {
     // console.log("UserInfo response - ", res);
      if (mounted2)
      {
        setUsersinfo(res.data.result);
        setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
      }
    }).catch((error) => {
        console.log("UserInfo-",error); 
    });
   
  return () => { setMounted2(false); }
}, []);






  const redeemprompt = () => {
    if(usersinfo.verificationstatus === "PENDING")
    {
      Router.push("/approval");
      return 
    }
    Router.push("/redeempoints");
  }

  const logoutnow = () => {
    removeUserInfo();
    removeUserToken();
    Router.push("/login") ;
    toast.success('Logout Successfully.'); 
}



useEffect(() => {
  _get("/Payment/GetUserPayoutInfo?userid="+userid)
  .then((res) => {
     // console.log(" response - ", res);
      if(mounted)
      {
        setResultdata(res.data.result);
      }
  }).catch((error) => {
      console.log("GetUserPayoutInfo-",error); 
  });
  return () => { setMounted(false); }
}, [resultdata]);


const backbuttonHandal = () => {
  Router.back();
}


  return (<>
  <motion.div initial={{ x: "100vw" }} animate={{ x:0 }}  transition={{ duration: 1, delay: 0, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}>
 
    { headload && <div className='headercontainer'><header className='headersection headerProfiles'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={backbuttonHandal} title='Back' />
        </aside>
        <aside className='scanqrnow'>
            <Image src="/assets/images/QR.png" width={42} height={42} alt="scanqrcode" quality={99} onClick={() => Router.push('/scanqrcode')} title='Scan QR Code' />
        </aside>
      </header></div> }
    
    <div className="screenmain screenprofile"> 
        <div className="screencontainer">
           
        



            <div className="profile_status">
                <dl>
                  <dt className={ usersinfo.verificationstatus === "APPROVE" ? "status_approve" : "status_pending" }>
                    <span>{usersinfo.shortname}</span>
                  </dt>
                  <dd>
                    <h2>{usersinfo.fullname}</h2>
                    <p><b>Status:</b> <span className={ usersinfo.verificationstatus === "APPROVE" ? "approvedStatus" : "pendingStatus" }>{usersinfo.verificationstatus}</span></p>
                    <p><b>Pan:</b> <span>{resultdata.pan === null || resultdata.pan === '' ? 'NA' : resultdata.pan }</span></p>
                    <p><b>Mobile:</b> <span>{usersinfo.phonenumber}</span></p>
                  </dd>
                </dl> 
                <aside onClick={()=> Router.push('/update-profile')}>Edit</aside>
            </div>

            <div className="profile_menu">
                <ul>
                  {
                     resultdata.bankname === null && resultdata.accountnumber === null && resultdata.upicode === null ? <li onClick={()=> Router.push('/bankdetailsadd?q=0')}>ADD BANK DETAILS</li> : <li onClick={()=> Router.push('/bankdetailupdate')}>UPDATE BANK DETAILS</li>
                  }
                  <li onClick={redeemprompt}>
                    REWARD POINTS <em><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> Points</em>
                  </li>
                  <li onClick={()=> Router.push('/rewards')}>REWARD HISTORY</li>
                  <li onClick={()=> Router.push('/redemptionhistory')}>REDEMPTION HISTORY</li>
                  <li onClick={logoutnow}>SIGN OUT</li>
                </ul>
            </div>
 


        </div>

        {/* <div className="profile_logobottom">
            <Image src="/assets/images/logo.png" width={448} height={80} alt="logo" quality={100} />
        </div> */}

    </div>


    <FooterComponent />

  </motion.div>
</>)
}