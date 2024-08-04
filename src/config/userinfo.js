"use client";
 
const setUserInfo = (name, sn, status) => {
    localStorage.setItem("userprofilename",name);
    localStorage.setItem("userprofilesn",sn);
    localStorage.setItem("verificationstatus",status);
}
const removeUserInfo = () => {
    localStorage.removeItem("userprofilename");
    localStorage.removeItem("userprofilesn");
    localStorage.removeItem("verificationstatus");
}
const getUserStatus = () => {
    if (typeof localStorage !== 'undefined') 
    {
      return localStorage.getItem('verificationstatus');
    } 
}
const getUserName = () => {
    if (typeof localStorage !== 'undefined') 
    {
      return localStorage.getItem('userprofilename');
    } 
}
const getUserShort = () => {
    if (typeof localStorage !== 'undefined') 
    {
      return localStorage.getItem('userprofilesn');
    } 
}
 
export { setUserInfo, removeUserInfo, getUserStatus, getUserName, getUserShort };