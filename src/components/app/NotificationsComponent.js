"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { _get, _post } from "@/config/apiClient";
import { getUserID } from '@/config/userauth';
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import Loader from '../shared/LoaderComponent';
import { isUserToken } from '@/config/userauth';
import { isBearerToken } from '@/config/bearerauth';
import Sectionloader from '../shared/SectionLoad';

export default function NotificationsComponent() {
  const [pagemsg, setPagemsg] = useState('');
  const[loading, setLoading] = useState(false);
  const[loadNoti, setLoadNoti] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [mounted2, setMounted2] = useState(true);
  const[notificationCount, setNotificationCount] = useState(0);
  const [notifyList, setNotifyList] = useState({});
  const [notifyCount, setNotifyCount] = useState(0);
  const [headload, setHeadLoad] = useState(false);
  const Router = useRouter();
  const userID = getUserID();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const userToken  =  isUserToken();
  const bearerToken = isBearerToken();

  useEffect(() => {
    if(!userToken) { Router.push("/login"); return  }
    if(!bearerToken) { Router.push("/"); return  }
    setTimeout(function(){ setHeadLoad(true); },1000);
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
  }, [notificationCount]);



useEffect(() => {
  setLoadNoti(true);
  _get("Customer/GetUserNotifications?userid="+ userID)
  .then((res) => {
   // console.log("GetUserNotifications  response - ", res.data.result.length, res);
    setTimeout(function(){setLoadNoti(false);}, 500);
    if (mounted)
    {
      setNotifyCount(parseInt(res.data.result.length));
      setNotifyList(res.data.result);
    }
  }).catch((error) => {
    setLoadNoti(false);
    console.log("GetUserNotifications-",error); 
  });
  return () => { setMounted(false); }
}, []);
 

const readNotification = (e) => {
    e.preventDefault();
    const datafinal = {
        userid: userID,
        ipaddress: ipInfo,
        osdetails: osInfo,
        browserdetails: browserInfo
    }
    // console.log(datafinal);
    if(parseInt(notificationCount) !== 0)
    {
      setLoading(true);
      setPagemsg('Updating');
      _post("Customer/MarkReadUserNotification", datafinal)
      .then((res) => {
       // console.log("MarkReadUserNotification", res);
        setLoading(false);
        Router.back();
      }).catch((err) => {
        console.log(err.message);
        setLoading(false); 
      });
    }
    else
    {
      Router.back();
    }
  } 

  return (<>
    <motion.div initial={{ y: "-250px" }} animate={{ y:0 }} transition={{ duration:1, delay: 0, origin: 1, ease: [0, 0.71, 0.2, 1.01] }}>
      
    { headload && <div className='headercontainer'><header className='headersection headerNotification'>
        <aside className="backarrow">
          <Image src="/assets/images/back-arrow.png" width={65} height={24} alt="back" quality={99} onClick={readNotification} title='Back' />
        </aside>
        <div className='head_notification'>Notifications</div>
      </header></div> }

    <div className="screenmain screennotification"> 
        <div className="screencontainer">
            { loadNoti ? <Sectionloader /> : <>
             <ul className='notificationList'>
             {notifyCount === 0 ? <li><h6>Notifications not available</h6></li> : null }
             {  
               notifyList.map &&  notifyList.slice(0, 10).map((val, index) => <li key={val.notificationid} data-deliverystatus={val.deliverystatus} data-notificationtype={val.notificationtype} data-isread={val.isread} className={val.isread === 0 ? "notify_list" : "notified_list" }>
                 <h3>{val.notificationmessage}</h3>
               </li>)
             } 
            </ul>
            </> }
            

        </div>
    </div>
    </motion.div>

    <Loader showStatus={loading} message={pagemsg} />
  </>)
}
