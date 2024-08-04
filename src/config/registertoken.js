"use client";
import Cookies from 'js-cookie';
const domainname = process.env.NEXT_PUBLIC_DOMAIN_COOKIES;
const registerMobileTime = parseInt(process.env.NEXT_PUBLIC_REGISTATION_MOBILE_TIME);
 

const setLoginNumber = (val) => {
    return Cookies.set('loginnumber',  val, { expires: new Date(new Date().getTime() + registerMobileTime), secure: true, sameSite: 'Strict', path: '/', domain:domainname });
  }
  const isLoginNumber = () => {
    const isToken = !!Cookies.get('loginnumber', { domain:domainname  });
    return isToken;
  }
  const getLoginNumber = () => {
    return Cookies.get('loginnumber', { domain:domainname  });
  }
  const removeLoginNumber = () => {
    return Cookies.remove('loginnumber', { domain:domainname  });
  }
  
  export {  setLoginNumber, isLoginNumber, getLoginNumber, removeLoginNumber };