"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserID } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import { ipaddress, osdetails, browserdetails, geoLatitude, geoLongitude } from "../core/jio";
import {  toast } from 'react-toastify';
import { isCouponeCode, getCouponeCode } from "@/config/validecoupone";
import { _post } from "@/config/apiClient";
import HeaderDashboard from '../shared/HeaderDashboard';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';
import { removeCouponeCode } from "@/config/validecoupone";
import FooterComponent from '../shared/FooterComponent';
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function GetcouponeComponent() {
  const [pagemsg, setPagemsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponecode, setCouponecode] = useState('');
  const rewardspoints = TotalrewardpointsComponent();
  const { push } = useRouter();
  const userID = getUserID();
  const latInfo = geoLatitude();
  const lonInfo = geoLongitude();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const isCC = isCouponeCode();
  const getCC = getCouponeCode();
  
  useEffect(() => {
      if(isCC)
      {
        setLoading(true);
        setPagemsg('Coupon Checking');
        setCouponecode(getCC);
       }
       else
       {
        push("/scanqrcode");
       }
  }, []);
 
  useEffect(() => {
    if(couponecode !== '')
    {
      setTimeout(function(){ handleSubmitCode(); },1000);
    }
}, [couponecode]);


  const handleSubmitCode = () => 
  {
    setLoading(true);
    setPagemsg('Validating Coupon');
    
    const qrdata = {
      userid: userID,
      couponcode: couponecode,
      scanlocation: `{'Latitude':'${latInfo}', 'Longitude':'${lonInfo}'}`,  
      ipaddress: ipInfo,
      osdetails: osInfo,
      browserdetails: browserInfo
    }
    // console.log(qrdata);
        _post("Customer/ValidateCouponAndSave", qrdata)
        .then((res) => {
            setTimeout(function(){setLoading(false);},2000); 
            // console.log(res)
            if(res.data.resultcode === 0)
            {
                toast.success("Your code has been successfully scanned ");
                removeCouponeCode();
                push(`/scanqrcode/${res.data.result[0].pointid}`);
            } 
            else if(res.data.resultcode === -101)
            {
                toast.error("This code has already been scanned. Try again.");
                removeCouponeCode();
                setTimeout(function(){push("/scanqrcode"); },2000);
            } 
            else if(res.data.resultcode === -102)
            {
                toast.error("This coupon code is invalid. Please enter a valid coupon code.");
                removeCouponeCode();
                setTimeout(function(){push("/scanqrcode"); },2000);
            } 
            else if(res.data.resultcode === -103)
              {
                toast.error("This coupon code is inactive. Please enter a valid coupon code. ");
                removeCouponeCode();
                setTimeout(function(){push("/scanqrcode"); },2000);
            } 
            else // if(res.data.resultcode === -100)
            {
                toast.error("There is an issue while availing the coupon. kindly contact to the support team.");
                removeCouponeCode();
                setTimeout(function(){ push("/scanqrcode"); },2000);
            }
        }).catch((err) => {
          setLoading(false); 
          console.log(err.message);
        });
  }

  return (
    <div className='outsidescreen'>
      <ErrorBoundary>
        <HeaderDashboard />
      </ErrorBoundary>
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">

          <div className="scanqrcodecontainer">
            <h2>Coupone Code: <span>{couponecode}</span></h2>
            <form className="scanqrcodeForm" onSubmit={handleSubmitCode} style={{'display':'none'}}>
                <button>Validate Coupon</button>
            </form>
          </div>
 

          <div className="screenqrbottom">
            <h2>
              <em>CLUB WALLET</em>
              <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <span>Points</span>
            </h2>
            <p><Link href='/rewards'>view points</Link></p>
          </div>
          
        </div>
      </div> 
 
      <FooterComponent />

     <Loader showStatus={loading}  message={pagemsg} />
    </div>
  )
}
