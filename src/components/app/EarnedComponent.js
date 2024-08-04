"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import Link from 'next/link';
import Image from 'next/image'
import CountUp from 'react-countup';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import { _get } from "@/config/apiClient";
import HeaderDashboard from '../shared/HeaderDashboard';
import FooterComponent from '../shared/FooterComponent';
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function EarnedComponent() {
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [pointnumber, setPointnumber] = useState(0);
    const rewardspoints = TotalrewardpointsComponent();
    const { push } = useRouter();
    const params = useParams()
    
 
   
    useEffect(() => {
        setLoading(true);
        setPagemsg('Validating Coupon');
        _get("Customer/RewardPointInfo?pointid="+params.pointid)
        .then((res) => {
          setLoading(false);
          //  console.log(" response - ", res);
            if(mounted)
            {
              setPointnumber(res.data.result[0].earnedpoints);
            }
        }).catch((error) => {
            setLoading(false);
            console.log("RewardPointInfo-", error);
        });
        return () => { setMounted(false); }
    }, []);

  return (<div className='outsidescreen'>
      <ErrorBoundary>
        <HeaderDashboard />
      </ErrorBoundary>
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">

            <div className="earnepoints_content">
                <h2>CONGRATULATIONS</h2>
                <h3>You have earned</h3>
                <h4><CountUp duration={2} start={0}  delay={1}  end={pointnumber} /></h4>
                <h5>points</h5>

                <Image className="earnpoint_img1" src="/assets/images/v1.png"  width={64} height={64} alt="scanQR" quality={99}  />
                <Image className="earnpoint_img2" src="/assets/images/V2.png"  width={123} height={123} alt="scanQR" quality={99}  />
                <Image className="earnpoint_img3" src="/assets/images/v3.png"  width={64} height={64} alt="scanQR" quality={99}  />
                <Image className="earnpoint_img4" src="/assets/images/v4.png"  width={69} height={76} alt="scanQR" quality={99}  />
            </div>

        </div>

        <div className="earnepoints_scan">
                <aside  onClick={()=> push("/scanqrcode")}> 
                  <Image src="/assets/images/scanQR.png"  width={139} height={138} alt="scanQR" quality={99}  />
                </aside>
                <p>Scan more points</p>
        </div>  


        <div className="screenqrbottom">
            <h2>
              <em>CLUB WALLET</em>
              <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <span>Points</span>
            </h2>
            <p><Link href='/rewards'>check your club wallet</Link></p>
        </div>
        
      </div> 

      <FooterComponent />


      
      <Loader showStatus={loading}  message={pagemsg} />
      
    </div>)
}
