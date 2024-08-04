"use client";
import Select from 'react-select';
import { useEffect, useState } from "react";
import { _get } from "@/config/apiClient";

export default function CityStateComponent({scChange, nameSC, nameS, nameC}) {
    const [citystateList, setCitystateList] = useState([]);
    const [mounted, setMounted] = useState(true);
    useEffect(() => {
        _get("CommonUtility/StateCity")
        .then((res) => {
           // console.log("city state - ", res);
            if(mounted)
            {
              setCitystateList(res.data);
            } 
        }).catch((err) => {
            console.log("StateCity add - ", err.message);
        });
      return () => { setMounted(false); }
    }, []);

      const onchangevalue = (val) => {
        let sc = val.label;
        let ct = val.cityname;
        let st = val.statename;
        scChange(sc, st, ct);
       // console.log("oncomponnent - ", val, " - ", sc, " - ", st, " - ", ct);
      }
  return (
 <>
    <Select
    defaultValue={{label: nameSC, value:nameSC, cityname: nameC, statename: nameS}}
    className="searchableContainer"
    classNamePrefix="searchable"
    Loading
    searchable 
    Clearable
    name="citystatelist"
    options={citystateList.map((entry) => ({
      label: entry.statecityname,
      value: entry.statecityname,
      cityname:entry.cityname,
      statename:entry.statename
    }))}
    onChange={(values) => {onchangevalue(values)}}
  />
                       
</>                   
  )
}