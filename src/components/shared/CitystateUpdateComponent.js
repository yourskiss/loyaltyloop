"use client";
import Select from 'react-select';
import { useEffect, useState } from "react";
import { _get } from "@/config/apiClient";

export default function CitystateUpdateComponent({scChange, nameSC, nameS, nameC}) {
    const [citystateList, setCitystateList] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [mounted, setMounted] = useState(true);
      useEffect(() => {
        setIsMounted(true);
      }, []);
      
      useEffect(() => {
          _get("CommonUtility/StateCity")
          .then((res) => {
             // console.log("city state - ", res);
             if (mounted)
              {
                setCitystateList(res.data);
              } 
          }).catch((err) => {
              console.log("StateCity update - ",err.message);
          });
        return () => { setMounted(false); }
      }, [isMounted]);

      

      const onchangevalue = (val) => {
        scChange(val.label, val.statename, val.cityname);
        // console.log("oncomponnent - ", val, " - ", val.label, " - ", val.statename, " - ", val.cityname);
      }
  return (
 <>
    <Select
    id="idcitystate"
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