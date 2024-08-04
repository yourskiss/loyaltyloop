"use client";
import Cookies from 'js-cookie';
import { decryptText } from "@/config/crypto";
const utTime = parseInt(process.env.NEXT_PUBLIC_USER_TOKEN_TIME);
const domainname = process.env.NEXT_PUBLIC_DOMAIN_COOKIES;
 

const getUserID = () => {
  const isToken = !!Cookies.get('usertoken', { domain:domainname  });
  const isValue = Cookies.get('usertoken', { domain:domainname  });
  if(isToken)
  {
    const decryptUserToken = decryptText(isValue)
    const userID = decryptUserToken.split("|");
    return userID[0];
  }
}
const getUserMobile = () => {
  const isToken = !!Cookies.get('usertoken', { domain:domainname  });
  const isValue = Cookies.get('usertoken', { domain:domainname  });
  if(isToken)
  {
    const decryptUserToken = decryptText(isValue)
    const userMobile = decryptUserToken.split("|");
    return userMobile[1];
  }
}
const setUserCookies = (val) => {
  return Cookies.set('usertoken', val, { expires: utTime, secure: true, sameSite: 'Strict', path: '/', domain:domainname });
}
const isUserToken = () => {
  const isToken = !!Cookies.get('usertoken', { domain:domainname  });
  return isToken;
}
const getUserToken = () => {
  return Cookies.get('usertoken', { domain:domainname  });
}
const removeUserToken = () => {
  return Cookies.remove('usertoken', { domain:domainname  });
}




 
 

export {  getUserID, getUserMobile, setUserCookies, getUserToken, isUserToken, removeUserToken };