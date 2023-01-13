import React,{useEffect,useState} from 'react'
import { StyledRangeButtons } from '../styles';

const TimeRanges = ({currentRange, setRange}) =>{

    

    return (
        <StyledRangeButtons>
        <li><button className={currentRange === 'short' ? 'active' : ''} onClick={()=> setRange('short')}>This Month</button></li>
        <li><button className={currentRange === 'medium' ? 'active' : ''} onClick={()=>setRange('medium')}>Last 6 Months</button></li>
        <li><button className={currentRange === 'long' ? 'active' : ''} onClick={()=>setRange('long')}>All time</button></li>
    </StyledRangeButtons>
    )
}
export default TimeRanges;