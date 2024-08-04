"use server";
 import { Suspense } from 'react';
 import HomeComponent from '@/components/app/HomeComponent';
 

 
export default async function Home() {



// async function setMainToken() {
//     const response = await fetch(apiURL+"ApiAuth/authtoken", {
//       method: 'POST',
//       body: JSON.stringify({ "userid": apiUsername, "password": apiPassword }), 
//        headers: {'Content-Type': 'application/json'},
//     });
//     const data = await response.json();
//     console.log(data.token);
//     return data.token;
// }

  return (
    <Suspense fallback={<p>.</p>}>
      <HomeComponent />
  </Suspense> 
  );
}
 