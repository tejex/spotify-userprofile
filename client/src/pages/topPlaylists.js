import React,{useEffect,useState} from 'react'
import axios from 'axios';
import {catchErrors} from '../utils';
import { SectionWrapper, Playlists,Loader} from '../components';
import { getUserPlaylists} from '../spotify'
import { StyledFooter } from '../styles';

//************************************************************************************/
const TopPlaylists = () =>{

    const [playlistsData,setPlaylistsData] = useState(null);
    const [playlists,setPlayists] = useState(null);
//************************************************************************************/
    useEffect(()=>{
        const fetchData = async ()=>{  
          const playlists = await getUserPlaylists();
          setPlaylistsData(playlists.data);
          setPlayists(playlists.data.items) 
        }
        catchErrors(fetchData())
      },[]);
//************************************************************************************/
      //Here we have a second useEffect hook, because the /playlists endpoint for the spotify API
      //Only returns 20 items in the array, so if we have more than 20 playlists, we will need to get all 
      //of them with an additional useEffect() hook, and by using the (next) property to make another api call to hte spotify API
      // and grab the remaining albums, this is repeated until there is no longer a (next) property
//************************************************************************************/
    useEffect(()=>{
        if(!playlistsData){
            return;
        }
        const fetchMoreData = async () =>{
            if(playlistsData.next){
                const {moreData} = await axios.get(playlistsData.next);
                setPlayists(moreData);
                setPlayists(playlists =>([
                    ...playlists ? playlists : [],
                    ...playlistsData.items
                ]))
            }
        }
        
        catchErrors(fetchMoreData());
    },[playlistsData])
//************************************************************************************/
    return (
        <main>
        <SectionWrapper title="Public Playlists" breadcrumb={true}>
        {playlists ? (
            <Playlists playlists={playlists}/>
        ): <Loader/>}
        </SectionWrapper>
        <StyledFooter className='footer'>Made with ❤️ by Bam</StyledFooter>
        </main>
    )
}
//************************************************************************************/
export default TopPlaylists