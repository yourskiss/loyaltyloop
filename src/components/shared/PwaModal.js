"use client";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { setPwaPropt, isPwaPropt } from '@/config/pwa';
import { isMobile } from 'react-device-detect';

 

export default function PwaModal() {
    const[installModal, setInstallModal] = useState(false);
    const[pmtEvt, setPmtEvt] = useState(null);
    const lastPrompt = isPwaPropt();
 
    useEffect(()=> {
     // console.log(isMobile, !window.matchMedia('(display-mode:standalone)').matches)
        const handalbeforeinstallprompt = (evt) => {
          evt.preventDefault();
          setPmtEvt(evt);
          if(isMobile && !window.matchMedia('(display-mode:standalone)').matches)
          {
            setInstallModal(true);
          }
        }
        if(!lastPrompt) 
        { 
          window.addEventListener("beforeinstallprompt",handalbeforeinstallprompt); 
        }
        return () => {  window.removeEventListener("beforeinstallprompt",handalbeforeinstallprompt); }
    },[]);


    const handalCancel = (e) => {
      e.preventDefault();
      setPwaPropt(true);
      setInstallModal(false);
      window.location.reload();
    }
    const handalInstall = (e) => {
      e.preventDefault();
        if(pmtEvt)
        {
            pmtEvt.prompt();
            pmtEvt.userChoice.then(function(choiceResult)
            {
                if(choiceResult.outcome==="dismissed")
                {
                    setPwaPropt(true);
                    window.location.reload();
                }
                else
                {
                    toast.success("Installation Start.");
                }     
            });
            setPmtEvt(null);
            setInstallModal(false);
        }
    }




  return (<>{ installModal && <div className="pwaPromptPopup">
  <motion.div initial={{ y: -100 }} animate={{  y: 100 }} transition={{ duration: 1, delay:0, origin: 1, ease:'easeIn' }}> 
    <section>
      <div className="pwaPromptContainer">
          <Image src="/assets/images/icons/pwa-prompt.png" width={100} height={100} alt="logo" quality={99}  />
          <h2>
              Kerakoll Club
              <span>Get our app. It won't take up space on your phone</span>
          </h2>
      </div>

        <p>
            <button id="pwaInstall" className="pwaPromptButton" onClick={handalInstall}>Install</button>
            <button id="pwaCancel" className="pwaPromptButton pwacancelBtn"  onClick={handalCancel}>Not Now</button>
        </p>
    </section>
  </motion.div>
</div> }</>)
}


 