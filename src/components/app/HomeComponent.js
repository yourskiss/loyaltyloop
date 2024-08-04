"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";
import { isBearerToken, setBearerToken  } from '@/config/bearerauth';
import { isUserToken } from '@/config/userauth';
 
export default function HomeComponent() {
  const [bt, setBT] = useState(0);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const getqrcode = searchParams.get('code');
  const isCC = isCouponeCode();
  const isBT = isBearerToken();
  const isUT = isUserToken();

  useEffect(() => {
    if(getqrcode !== null) { setCouponeCode(getqrcode); }
  }, [getqrcode]);

  useEffect(() => {
    if(isBT && isUT && isCC) { push("/getcoupone"); return }

    if(!isBT)
    {
      setBT(1);
      setBearerToken('home');
    }
    else
    {
      setBT(2);
      setTimeout(function(){  isUT && !isCC ? push("/dashboard") : isUT && isCC ? push("/getcoupone") : push("/login"); }, 500);
    }
  },[]);

  
  
  return (<>
      <div className="videoloader">
        <div className='videoconainer'>
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} /> 
        </div>
    </div>
  </>);
}
 