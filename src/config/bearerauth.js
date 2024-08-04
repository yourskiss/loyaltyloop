"use client";
import Cookies from 'js-cookie';
import axios from 'axios';
// import { useRouter } from 'next/navigation';

const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUsername = process.env.NEXT_PUBLIC_API_USERNAME;
const apiPassword = process.env.NEXT_PUBLIC_API_PASSWORD;
 
const btTime = parseInt(process.env.NEXT_PUBLIC_BEARER_TOKEN_TIME);
const domainname = process.env.NEXT_PUBLIC_DOMAIN_COOKIES;

 
const setBearerCookies = (val) => {
  return Cookies.set('bearertoken',  val, { expires: new Date(new Date().getTime() + btTime), secure: true, sameSite: 'Strict', path: '/', domain:domainname });
}
const setBearerToken = (pagevalue) => {
  axios({
    method: 'post',
    url: `${apiURL}ApiAuth/authtoken`,
  //  url:'https://api.getloyaltyloop.com/api/ApiAuth/authtoken',
    data: JSON.stringify({ "userid": apiUsername, "password": apiPassword }), 
    timeout: 4000,
    headers: {'Content-Type': 'application/json'},
  })
  .then(function (response) {
      setBearerCookies(response.data.token);
      if(pagevalue === 'home')
      {
        setTimeout(function() {  window.location.reload(); }, 500);
      }
      else
      {
        window.location.reload();
      }
  })
  .catch(function(error){
      console.log(error);
    //  router.push("/");
  })
}
const isBearerToken = () => {
  const isToken = !!Cookies.get('bearertoken', { domain:domainname  });
  return isToken;
}
const getBearerToken = () => {
  return Cookies.get('bearertoken', { domain:domainname  });
}
const removeBearerToken = () => {
  return Cookies.remove('bearertoken', { domain:domainname  });
}


export { setBearerCookies, setBearerToken, isBearerToken, getBearerToken, removeBearerToken };