"use client";
import Cookies from 'js-cookie';
const scanqrTime = parseInt(process.env.NEXT_PUBLIC_QR_SCAN_TIME);
const domainname = process.env.NEXT_PUBLIC_DOMAIN_COOKIES;

const setCouponeCode = (val) => {
  return Cookies.set('couponecodecookies', val, { expires: new Date(new Date().getTime() + scanqrTime), secure: true, sameSite: 'Strict', path: '/', domain:domainname });
 }
 const isCouponeCode = () => {
   const isToken = !!Cookies.get('couponecodecookies', { domain:domainname  });
   return isToken;
 }
 const getCouponeCode = () => {
   return Cookies.get('couponecodecookies', { domain:domainname  });
 }
 const removeCouponeCode = () => {
  return Cookies.remove('couponecodecookies', { domain:domainname  });
}

 
export {  setCouponeCode, isCouponeCode, getCouponeCode, removeCouponeCode };