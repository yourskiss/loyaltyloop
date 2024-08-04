"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {isUserToken, getUserMobile, getUserID } from '@/config/userauth';
import { _get } from "@/config/apiClient";
import { setUserInfo } from '@/config/userinfo';
 
export default  function HeaderDashboard() {
  const [mounted, setMounted] = useState(true);
  const [mounted2, setMounted2] = useState(true);
  const [usersinfo, setUsersinfo] = useState('');
   
  const[notificationCount, setNotificationCount] = useState(0);
  const { push } = useRouter();
  const userToken  =  isUserToken();
  const userMobile = getUserMobile();
  const userID = getUserID();

useEffect(() => {
  if(!userToken) { push("/login"); return  }
}, []);


useEffect(() => {
    _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
    .then((res) => {
     // console.log("UserInfo response - ", res);
      if (mounted)
      {
        setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
        setUsersinfo(res.data.result);
      }
    }).catch((error) => {
        console.log("UserInfo-",error); 
    });
   
  return () => { setMounted(false); }
}, []);



useEffect(() => {
  _get("Customer/GetTotalOfUserNotification?userid="+ userID)
  .then((res) => {
   // console.log("GetTotalOfUserNotification  response - ", res);
    if (mounted2)
    {
      setNotificationCount(res.data.result[0].totalnotification);
    }
  }).catch((error) => {
      console.log("GetTotalOfUserNotification-",error); 
  });
 
return () => { setMounted2(false); }
}, []);


 

  return (
    <div className='headercontainer'>
      <header className="headersection headerDashboard">
        <aside className="logo">
          <Image onClick={() => push("/dashboard") } src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
        <section>
            <Link href="/scanqrcode" className='header_scanqrcode'><Image src="/assets/images/QR.png" width={100} height={100} alt='qr' quality={90} /></Link>
           
        
            <span className='header_notification' onClick={()=> push('/notifications') }>
              <Image src="/assets/images/notification.png" width={100} height={100} alt="notification" quality={90} />
              { parseInt(notificationCount) > 0 ? <span>{notificationCount}</span> : null} 
            </span> 
          
            
            <aside className={ usersinfo.verificationstatus === "APPROVE" ? "header_userdp status_approve" : "header_userdp status_pending" } >
              <span onClick={() => push("/profile") }>{usersinfo.shortname}</span>
            </aside>
        </section>
      </header>
    </div>
  )
}
