"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getUserID } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import CountUp from 'react-countup';
import { _get } from "@/config/apiClient";
import { toast } from 'react-toastify';
import TotalRedeemedPoints from '../shared/totalredemption';
import HeaderDashboard from '../shared/HeaderDashboard';
import FooterComponent from '../shared/FooterComponent';
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function RedemptionhistoryComponemt () {
  const [pagemsg, setPagemsg] = useState('');
  const [btnload, setBtnload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [mounted2, setMounted2] = useState(true);
  const [pointhistory, setPointhistory] = useState({});
  const [nodata, setNodata] = useState('');
  const userID = getUserID();
  const { push } = useRouter();
  const redeemedpointTotal = TotalRedeemedPoints();

  useEffect(() => {
     setLoading(true);
     setPagemsg('Redeemed history fetching');
    _get(`Customer/UserRedeemedPointsHistory?userid=${userID}`)
    .then((res) => {
        setLoading(false);
        // console.log("Redeemed Points History - ", res);
        if (mounted)
        {
            if(res.data.result.length !== 0)
            {
              setPointhistory(res.data.result)
              previousOrderStatusUpdate();
            }
            else
            {
              setNodata('Redemption history not available.');
            }
        }
    }).catch((error) => {
        setLoading(false);
        console.log("UserRedeemedPointsHistory-",error); 
    });
    return () => { setMounted(false); }
  }, []);

const previousOrderStatusUpdate = () => {
    _get(`/Payment/UserPendingOrder?userID=${userID}`)
    .then((res) => {
            // console.log("Previous order - ", res.data.result[0].pendingorder,  res.data.result[0].orderid, res);
            if(res.data.result[0].pendingorder !== '0' || res.data.result[0].pendingorder !== 0)
            {
              setLoading(true);
              setPagemsg('Updating payment status');
                _get(`/Payment/UserPayoutStatus?userID=${userID}&orderID=${res.data.result[0].orderid}`)
                .then((dataa) => { 
                  // console.log("UserPayoutStatus - ",  dataa);
                   if(res.status === 200)
                    {
                      setTimeout(function(){
                        setLoading(false);
                      }, 3000);
                    }
                    else
                    {
                      setLoading(false);
                      console.log(res.statusText); 
                    }
                }).catch((error) => {
                    setLoading(false);
                    console.log("UserPayoutStatus-",error); 
                });
            }
    }).catch((error) => {
      console.log("UserPendingOrder-",error); 
    });
  }




  const payoutstatus = (od) => {
   // debugger;
   if(od === null || od === undefined || od === '')
    {
      return 
    }
    setLoading(true);
    setBtnload(true);
    setPagemsg('Checking payment status');
    _get(`/Payment/UserPayoutStatus?userID=${userID}&orderID=${od}`)
    .then((res) => { 
     // console.log("Status inside - ", res.data.isclose, res.data.ispayment, res.data.pgrequeystatus, res); 
      if(res.status === 200)
      {
        setTimeout(function(){
          setLoading(false);
          setBtnload(false);
          window.location.reload();
        }, 10000);
      }
      else
      {
        setLoading(false);
        setBtnload(false);
        toast.info(res.statusText); 
      }
    }).catch((error) => {
        setLoading(false);
        setBtnload(false);
        console.log(error); 
    });
  }
 
 
  return (
  <div className="outsiderewads">
      <ErrorBoundary>
        <HeaderDashboard />
      </ErrorBoundary>
    <div className="screenmain screenrewads"> 
      <div className="screencontainer">
 

          <div className="rewardscontainer">
            <h2>Redemption History</h2>
            <h3>
              <CountUp duration={2} start={0}  delay={1} end={redeemedpointTotal} /> <b>Points</b> 
              <em>Redeemed Points</em>
            </h3>
          </div>
          
            { nodata ? <div className="norewardsavailable">{nodata}</div> : (
            <div className="rewardstables">
              <h4>HISTORY TRANSITION</h4>
              <ol>
                <li>
                  <p><b>SN.</b></p>
                  <p><b>Points</b><br /><small>Date</small></p>
                  <p><b>Amount</b><br /><small>Transaction ID</small></p>
                  <p><b>Status</b><br /><small>Order ID</small></p>
                  <p></p>
                </li>
                {  pointhistory.map &&  pointhistory.map((val, index) => <li key={val.transactionid} data-id={val.status}>
                  <p>{index+1}</p>
                  <p>{val.pointsredeemed} <span>{val.redemptiondate}</span></p>
                  <p>{ val.transactionamount } <span>{val.transactionid}</span></p>
                  <p>{val.status} <span>{val.orderid}</span></p>
                  {
                    val.status === 'Pending' ? <><p><Image className={ btnload ? "rotedrefreshimg" : null } src="/assets/images/refresh_icon.png" onClick={()=> payoutstatus(val.orderid)}  width={20} height={20} alt="Pending" quality={99} title='Click to refresh' /></p></> :  val.status === 'Success' ? <p><Image src="/assets/images/success_icon.png"  width={20} height={20} alt="Success" quality={99} className='transition_success'  /></p> : <p><Image src="/assets/images/failed_icon.png"  width={20} height={20} alt="Failed" quality={99}  className='transition_failed'  title='Transition Failed' /></p>
                  }
                </li>) }
              </ol>
            </div>
            )}
          
 
      </div>
    </div> 


    <FooterComponent />


    <Loader showStatus={loading} message={pagemsg} /> 
  </div>
  )
}
 

 
 

          
 
 