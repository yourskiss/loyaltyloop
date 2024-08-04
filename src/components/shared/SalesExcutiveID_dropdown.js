"use client";
import Select from 'react-select';
import { useEffect, useState } from "react";
import { _get } from "@/config/apiClient";

export default function SalesExcutiveID({seChange, seID}) {
    const [seList, setSeList] = useState([]);
    const [mounted, setMounted] = useState(true);
    useEffect(() => {
        _get("Cms/SEAgentCode")
        .then((res) => {
           // console.log("se id list - ", res);
            if(mounted)
            {
                setSeList(res.data.result);
            } 
        }).catch((err) => {
            console.log("StateCity add - ", err.message);
        });
      return () => { setMounted(false); }
    }, []);

      const onchangevalue = (val) => {
        seChange(val.label);
       // console.log("se list change - ", val);
      }

      const customComponents = {
        DropdownIndicator: () => null,
      };

      const option = seList.map((entry) => ({ label: entry.agentcode, value: entry.agentcode }))

      const filterOption = (option, seID) => {
        // Your custom filtering logic here
        return option.label.toLowerCase().includes(seID.toLowerCase());
      };


  return (
 <>
  <Select
    components={customComponents}
    defaultValue={{label: seID, value:seID}}
    className="searchableContainer"
    classNamePrefix="searchable"
    Loading
    searchable
    Clearable
    name="seList"
    options={option}
    filterOption={filterOption}
    onChange={(values) => {onchangevalue(values)}}
  />                     
</>                   
  )
}