"use client";
import platform from 'platform';
import { useState, useEffect } from 'react';


const osname = () => {
  const osn = `${platform.os.family || ''}`;
  return osn;
}


const osdetails = () => {
  const os = `${platform.os.family || ''}  ${platform.os.version || ''}`;
  return os;
}

const browserdetails = () => {
  const bd = `${platform.name || ''}  ${platform.version || ''}`;
  return bd;
}

const geoLatitude = () => {
  const [latitude, setLatitude] = useState('');
  useEffect(() => {
    fetch('https://geolocation-db.com/json/')
      .then(response => response.json())
      .then(data => {
        setLatitude(data.latitude)
      })
      .catch(error => console.log(error))
  }, []);
 return latitude;
}

const geoLongitude = () => {
  const [longitude, setLongitude] = useState('');
  useEffect(() => {
    fetch('https://geolocation-db.com/json/')
      .then(response => response.json())
      .then(data => {
        setLongitude(data.longitude)
      })
      .catch(error => console.log(error))
  }, [])
 return longitude;
}


const ipaddress = () => {
  const [ip, setIP] = useState('');
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIP(data.ip))
      .catch(error => console.log(error))
  }, []);
  return ip;
};

export { ipaddress, osname, osdetails, browserdetails, geoLatitude, geoLongitude };
 