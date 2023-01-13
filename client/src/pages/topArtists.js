import React,{useEffect,useState} from 'react'
import { getUserTopArtists} from '../spotify'
import {catchErrors} from '../utils';
import { SectionWrapper, Artists,TimeRanges,Loader } from '../components';
import { StyledRangeButtons,StyledFooter } from '../styles';




const TopArtists = ()=>{

    const [topArtists,setTopArtists] = useState(null);
    const [currentRange, setRange] = useState('short')

    useEffect(()=>{
        const fetchData = async ()=>{  
          const topArtists = await getUserTopArtists(`${currentRange}_term`);
          setTopArtists(topArtists.data); 
        }
        catchErrors(fetchData())
      },[currentRange]);
      
    return (
        <main>
        {topArtists ? (
            <SectionWrapper title="Top Artists" breadcrumb={true}>
                <TimeRanges currentRange={currentRange} setRange={setRange}/>
                <Artists artists={topArtists.items.slice(0, 20)} />
            </SectionWrapper>
        ): <Loader/>}
        <StyledFooter className='footer'>Made with ❤️ by Bam</StyledFooter>
        </main>
    )
}

export default TopArtists;