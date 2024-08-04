"use client";
import Cookies from 'js-cookie';
const promptTime = parseInt(process.env.NEXT_PUBLIC_PWA_PROMPT_TIME);
const domainname = process.env.NEXT_PUBLIC_DOMAIN_COOKIES;


const setPwaPropt = (val) => {
    return Cookies.set('pwarequest', val, { expires: promptTime, secure: true, sameSite: 'Strict', path: '/', domain:domainname });
}
const isPwaPropt = () => {
    const isToken = !!Cookies.get('pwarequest', { domain:domainname  });
    return isToken;
}
const getPwaPropt = () => {
    const isValue = Cookies.get('pwarequest', { domain:domainname  });
    return isValue;
}



const setPwaIos = (val) => {
    return Cookies.set('pwaIos', val, { expires: promptTime, secure: true, sameSite: 'Strict', path: '/', domain:domainname });
}
const isPwaIos = () => {
    const isToken = !!Cookies.get('pwaIos', { domain:domainname  });
    return isToken;
}
const getPwaIos = () => {
    const isValue = Cookies.get('pwaIos', { domain:domainname  });
    return isValue;
}

export { setPwaPropt, isPwaPropt, getPwaPropt, setPwaIos, isPwaIos, getPwaIos };