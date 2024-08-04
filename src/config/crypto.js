"use client";
import CryptoJS from 'crypto-js';
const secretKey = "*&$#@+-!";

const encryptText = (text) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

const decryptText = (text) => {
    const bytes = CryptoJS.AES.decrypt(text, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export {decryptText, encryptText};
  