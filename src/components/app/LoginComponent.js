"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {isUserToken } from "@/config/userauth";
import { isCouponeCode } from "@/config/validecoupone";
import HeaderFirst from "../shared/HeaderFirst";
import FooterComponent from "../shared/FooterComponent";
import LoginPart from "../shared/LoginPart";
import OtpPart from "../shared/OtpPart";



export default function LoginComponent() {  
    const [isMobile, setIsMobile] = useState(false);
    const [phonenumber, setPhonenumber] = useState('');
    const userToken   =  isUserToken();
    const isCC = isCouponeCode();
    const { push } = useRouter();

    useEffect(() => {
      if(userToken && !isCC) { push("/dashboard"); return }
      if(userToken && isCC) { push("/getcoupone"); return }
    }, []);
  
    const isMobStatus = (val) => {
      setIsMobile(val)
    }
    const getMobNumber = (val) => {
      setPhonenumber(val)
    }

  return (
  <>
    <HeaderFirst />
    <div className='screenmain'>
      <section className="screencontainer">
        { !isMobile ? <LoginPart isMobStatus={isMobStatus} getMobNumber={getMobNumber} phonenumber={phonenumber} /> :  <OtpPart isMobStatus={isMobStatus} getMobNumber={getMobNumber} phonenumber={phonenumber} /> }
      </section>
    </div>
    <FooterComponent />
  </>
  )
}



 