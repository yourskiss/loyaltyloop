"use client";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TotalrewardpointsComponent from './TotalrewardpointsComponent';
import { getUserID } from '@/config/userauth';
import Loader from '../shared/LoaderComponent';
import { ipaddress, osname  } from "../core/jio";
import { _get } from "@/config/apiClient";
import { getUserStatus } from "@/config/userinfo";
import TotalRedeemedPoints from '../shared/totalredemption';


export default function Rewardform() {
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [pendingorder, setPendingorder] = useState(0);
    const[redeempoint, setRedeempoint] = useState(''); 
    const[errorMsg, setErrorMsg] = useState(''); 
    const[userstatus, setUserstatus] = useState('');
    const[pointsEligible, setPointsEligible] = useState('');
    const[isEligible, setIsEligible] = useState('');

    const gtUST = getUserStatus();
    const redeemedpointTotal = parseInt(TotalRedeemedPoints());
    const rewardspoints = parseInt(TotalrewardpointsComponent());
    const pointvalue = parseInt(process.env.NEXT_PUBLIC_POINT_VALUE);
    const redeemminimumpoint = parseInt(process.env.NEXT_PUBLIC_REDEEM_MIN_POINT);
    const redeemmaximumpoint = parseInt(process.env.NEXT_PUBLIC_REDEEM_MAX_POINT);

    const userID = getUserID();
    const { push } = useRouter();
    const ipInfo = ipaddress();
    const osn = osname();
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    
    useEffect(() => {
        setUserstatus(gtUST);
    }, []);

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

    useEffect(() => {
        setLoading(true);
        setPagemsg('Checking pendding order');
        _get(`/Payment/UserPendingOrder?userID=${userID}`)
        .then((res) => {
            setLoading(false);
           // console.log("Previous order - ", res.data.result[0].pendingorder,  res);
            if(mounted)
            {
                setPendingorder(parseInt(res.data.result[0].pendingorder));
            }
        }).catch((error) => {
            setLoading(false);
            console.log(error); 
        });
        return () => { setMounted(false); }
    }, []);


    const checkEligibility = (valuespoint) => {
        // debugger;
        if(valuespoint === '' || valuespoint === ' ' || valuespoint === '0' || valuespoint === 'NaN' || parseInt(valuespoint) === 0 || parseInt(valuespoint) === NaN)
        {
           return
        }

            _get(`/Customer/CheckUserRedemptionEligibility?userid=${userID}&pointstoredeem=${valuespoint}`)
            .then((res) => {
               // console.log("CheckUserRedemptionEligibility: ", res.data.result[0]);
                setPointsEligible(res.data.result[0].pendingpoints);
                setIsEligible(res.data.result[0].isusereligiblefor2000);            
            }).catch((error) => {
                console.log(error); 
            });
        
    }

    const pointvalueChange = (e) => {
        const pointval = e.target.value;
        setRedeempoint(pointval);
        checkEligibility(pointval);
        setErrorMsg('');
    }
    const pointvalueSubmit = (e) => {
        e.preventDefault();
       // console.log(redeempoint);
        if(userstatus !== 'APPROVE')
        {
            setErrorMsg('');
            toast.info('Reward points will redeem after profile approval.'); 
            push("/approval");
            return;
        }
        if(pendingorder > 0)
        {
            setErrorMsg('');
            toast.info('Your Previous order is already in pending.'); 
            push("/redemptionhistory");
            return;
        }
        if(redeempoint === '0' || redeempoint === '' || redeempoint === ' ' || redeempoint == NaN || parseInt(redeempoint) === 0 || parseInt(redeempoint) === NaN)
        {
            setErrorMsg('Please enter your reward points'); 
            return;
        }
        if(redeemedpointTotal === 0 && parseInt(redeempoint) < redeemminimumpoint)
        {  
            setErrorMsg(`You can redeem minimum ${redeemminimumpoint} reward points.`); 
            return;
        }
        if(parseInt(redeempoint) > rewardspoints)
        {
            setErrorMsg(`You can redeem maximum ${rewardspoints} reward points.`); 
            return;
        }
        if(parseInt(redeempoint) > redeemmaximumpoint)
        {
            setErrorMsg(`You can redeem maximum ${redeemmaximumpoint} reward points.`); 
            return;
        }
        if(!isEligible || parseInt(redeempoint) > parseInt(pointsEligible))
        {
            // setErrorMsg(`You are eligible to redeem up to ${pointsEligible} reward points.`); 
            setErrorMsg(`You have exceeded redemption limit of ${redeemmaximumpoint} points in a day. Please come back tomorrow.`); 
            return;
        }
        
        setLoading(true);
        setPagemsg('Payment Initiation');
        _get(`/Payment/UserPayout?userID=${userID}&points=${parseInt(redeempoint)}&amount=${parseInt(redeempoint) * pointvalue}&ipaddress=${ipInfo}&osdetails=${osn}`)
        .then((res) => {
            setLoading(false);
          // console.log("Payout request - ", res);
           if(res.data.status === 0)
            {
                if(res.data.data === null)
                {
                    setErrorMsg(res.data.message); 
                }
                else
                {
                    setErrorMsg(res.data.data.error);
                }
            }
            else
            {
                setErrorMsg('');
                payoutstatus(res.data.userorderid);
            }
        }).catch((error) => {
            setLoading(false);
            console.log(error); 
        });
     
    }

    const payoutstatus = (val) => {
            if(val === undefined || val === null || val === '' || val === ' ')
            {
                return
            }
                setLoading(true);
                setPagemsg('Payment Initiating');
                _get(`/Payment/UserPayoutStatus?userID=${userID}&orderID=${val}`)
                .then((res) => {   
                  //  console.log("Payout Status - ", res); 
                   setTimeout(() => {
                       setLoading(false);
                       toast.success("Payment Initiated"); 
                       push("/redemptionhistory");    
                   }, 5000);
                }).catch((error) => {
                    setLoading(false);
                    console.log(error); 
                });
            
    }
 
    // useEffect(() => {
    //     if(userOrderID === '' || userOrderID === ' ' || userOrderID === undefined || userOrderID === null) 
    //     {
    //         return
    //     }
    //         setLoading(true);
    //         setPagemsg('Payment Initiating');
    //         const interval = setInterval(() => {
    //             payoutstatus(userOrderID);
    //         }, 5000);  
    //         setTimeout(() => {
    //             setLoading(false);
    //             clearInterval(interval);
    //             toast.success("Payment Initiated"); 
    //             push("/redemptionhistory");    
    //         }, 30000);
    //         return () => {
    //             setLoading(false);
    //             clearInterval(interval); 
    //         };
    // }, [userOrderID]);

 
    
  return (<>
        <div className='redeemforms'>
            <form onSubmit={pointvalueSubmit}>
                <p>1 POINTS = {pointvalue} INR</p>
                <input type="number" placeholder="ENTER POINTS" min="0"  maxLength={4} onInput={onInputmaxLength} name="redeempoint" value={redeempoint} onChange={pointvalueChange}  onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault() }  />
                { errorMsg && <span>{errorMsg}</span> }
                <aside>
                    <button type='submit'>Redeem Points</button>
                </aside>
            </form>
        </div>


         <Loader showStatus={loading} message={pagemsg} />  
  </>)
}
