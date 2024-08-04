"use client";
import Image from 'next/image';
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import Rewardform from '../shared/Rewardform';
import { useEffect, useState } from 'react';
import { _get } from "@/config/apiClient";
import { getUserID } from '@/config/userauth';
import HeaderDashboard from '../shared/HeaderDashboard';
import FooterComponent from '../shared/FooterComponent';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

export default function RedeempointsComponents() {
    const [mounted, setMounted] = useState(true);
    const [resultdata, setResultdata] = useState('');
    const rewardspoints = TotalrewardpointsComponent();
    const userid = getUserID();
    const { push } = useRouter();

    useEffect(() => {
        _get("/Payment/GetUserPayoutInfo?userid="+userid)
        .then((res) => {
          //  console.log("User payout info - ", res);
            if (mounted)
            {
                setResultdata(res.data.result);
            }
        }).catch((error) => {
            console.log("GetUserPayoutInfo-",error); 
        });
        return () => { setMounted(false); }
    }, []);

 
    useEffect(() => {
        if(!mounted) 
        {
            resultdata.bankname === null && resultdata.accountnumber === null && resultdata.upicode === null ? push('/bankdetailsadd?q=1') : null
        }
     }, [mounted]);

  return (<>
    <ErrorBoundary>
        <HeaderDashboard />
    </ErrorBoundary>
                    
    <div className="screenmain redeemscreen"> 
        <div className="screencontainer">

            <div className='redeemcontainer'>
                <Image className='rdm_1' src="/assets/images/v3.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_2' src="/assets/images/v3.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_3' src="/assets/images/V2.png" width={95} height={95} alt="redeem img" quality={99} />
                <Image className='rdm_4' src="/assets/images/V2.png" width={95} height={95} alt="redeem img" quality={99} />

                <aside>
                    <Image src="/assets/images/redeem.png" width={459} height={448} alt="redeem img" quality={99} />
                </aside>
                <h2>Redeem your points</h2>
                <h3><CountUp duration={2} start={0}  delay={1} end={rewardspoints} /> <b>Points</b> </h3>
                <p>Redeem Kerakoll Club points for exciting cash prizes!</p>
            </div>  
            
            <Rewardform />
            
        
        </div>

    
        <div className="profile_logobottom">
            <Image src="/assets/images/logo.png" width={448} height={80} alt="logo" quality={100} />
        </div>

    </div>


    <FooterComponent />

</>)
}
