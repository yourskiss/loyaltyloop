 "use client";
import { useRouter } from 'next/navigation';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import HeaderDashboard from "../shared/HeaderDashboard";
import { getUserMobile } from '@/config/userauth';
import { _get } from "@/config/apiClient";
import Loader from "../shared/LoaderComponent";
import FooterComponent from "../shared/FooterComponent";
import { setUserInfo } from "@/config/userinfo";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function ApprovalComponent() {
    const [pagemsg, setPagemsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(true);
    const [mounted2, setMounted2] = useState(true);

    const[productimg, setProductimg] = useState({});
    
    const[usershort, setUsershort] = useState('');
    const[userstatus, setUserstatus] = useState('PENDING');
    const[username, setUsername] = useState('');

    const { push } = useRouter();
    const userMobile = getUserMobile();
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    const imageSection = process.env.NEXT_PUBLIC_SECTION_APPROVAL;

    useEffect(() => {
        setLoading(true);
        setPagemsg('Validating your status');
        _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
        .then((res) => {
            setLoading(false);
         // console.log("response - ", res);
          if (mounted)
          {
            setUserInfo(res.data.result.fullname, res.data.result.shortname, res.data.result.verificationstatus);
            setUsershort(res.data.result.shortname);
            setUserstatus(res.data.result.verificationstatus);
            setUsername(res.data.result.fullname);
          }
        }).catch((error) => {
            setLoading(false);
            console.log("UserInfo-",error); 
        });
       
      return () => { setMounted(false); }
    }, []);

    useEffect(() => {
        if(userstatus !== 'PENDING') { push('/dashboard'); }
    }, [userstatus]);


 

    useEffect(() => {
        setLoading(true);
        setPagemsg('Fatching products');
        _get(`/Cms/ProductBannerImage?section=${imageSection}`)
        .then((res) => {
            setLoading(false);
           // console.log("ProductBannerImage approval - ", res);
            if (mounted2)
            {
                const strAscending = [...res.data.result].sort((a, b) => a.alternativetext > b.alternativetext ? 1 : -1);
                setProductimg(strAscending);
            }
        }).catch((error) => {
            setLoading(false);
           console.log("ProductBannerImage-",error); 
        });
      return () => { setMounted2(false); }
    }, []);


    
    var settingsApproval = {
        dots: true,
        infinite: true,
        speed: 500,
        adaptiveHeight:false,
        slidesToShow: 1,
        slidesToScroll: 1,
        focusOnSelect: true
      };




  return (
    <>
    <ErrorBoundary>
        <HeaderDashboard />
    </ErrorBoundary>
    
    <div className="screenmain"> 
        <div className="screencontainer">
                <div className="approvalcontainer">
                        <dl>
                            {/* <dt>
                                <aside><span>{usersn}</span></aside>
                            </dt> */}
                            <dd>
                                <p>
                                    <span><b>{username}</b>,</span>
                                    <span>Your approval request has gone to the local Kerakoll representative. You can start redeeming points once your profile is approved.</span>
                                </p>
                            </dd>
                        </dl>    
 
                        
                        <section>
                            <h3>We have the right solution for every building-related problem</h3>
                            <Slider className="pc_slider" {...settingsApproval}>
                            {  
                               productimg && productimg.map && productimg.map((val, index) => <div className="pc_item" key={index} data-bannerid={val.bannerid} data-bannerimageid={val.bannerimageid}>
                                    <img src={`${imageUrl}${val.imagepath}`} alt={val.alternativetext} />
                                    <p>{val.alternativetext}</p>
                                </div>) 
                            }
                             

                            </Slider>
                        </section>
                </div>
            </div>
      </div>

      <FooterComponent />
      <Loader showStatus={loading}  message={pagemsg} />
    </>
  )
}
