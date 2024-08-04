"use client";
import { useEffect, useState } from "react";
import { getUserID  } from "@/config/userauth";
import { _get } from "@/config/apiClient";

export default function TotalrewardpointsComponent() {
    const [points, setPoints] = useState(0);
    const [mounted, setMounted] = useState(true);
    const userID = getUserID();
 
        useEffect(() => {
            _get("Customer/UserTotalRewardPoints?userid="+ userID)
            .then((res) => {
               // console.log("UserTotalRewardPoints response - ", res);
               if(mounted)
                {
                    setPoints(res.data.result[0].totalpoints);
                }
            }).catch((error) => {
                console.log(error.message);
            });

            return () => { setMounted(false); }
        }, [userID]);

        return points;
  }