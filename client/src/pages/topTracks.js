import React,{useEffect,useState} from 'react'
import {catchErrors} from '../utils';
import { SectionWrapper, Tracks,TimeRanges,Loader } from '../components';
import { getUserTopTracks} from '../spotify'
import { StyledFooter } from '../styles';


const TopTracks = () =>{

    const [topTracks,setTopTracks] = useState(null);
    const [currentRange, setRange] = useState('short')

    useEffect(()=>{
        const fetchData = async ()=>{  
          const topTracks = await getUserTopTracks(`${currentRange}_term`);
          setTopTracks(topTracks.data); 
        }
        catchErrors(fetchData())
      },[currentRange]);

    
    return (
        <main>
        {topTracks ? (
            <SectionWrapper title="Top Tracks" breadcrumb={true}>
                <TimeRanges currentRange={currentRange} setRange={setRange}/>
                <Tracks tracks={topTracks.items} />
            </SectionWrapper>
        ): <Loader/>}
        <StyledFooter className='footer'>Made with ❤️ by Bam</StyledFooter>
        </main>
    )
}

export default TopTracks