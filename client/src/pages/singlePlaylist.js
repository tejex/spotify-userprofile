import React,{useEffect,useState, useMemo} from 'react'
import { useParams } from 'react-router-dom';
import { getAudioFeaturesForSongs, getPlaylistById} from '../spotify'
import { catchErrors } from '../utils';
import {StyledHeader, StyledFooter, StyledDropdown} from '../styles';
import { SectionWrapper, Tracks,Loader } from '../components';
import axios, { all } from 'axios';
//************************************************************************************/
const Playlist = () =>{

    const { id } = useParams();
    const [playlist, setPlayist] = useState(null); 
    //This is the playlist the user will click on, we will get that playlist and store it in the playlist variable
    // through the setPlaylist() method.

    const [playistSongs, setPlayistSongs] = useState(null); 
  // This is to get and store all the songs in that playlist we just grabbed.
  // We will grab the songs that are in this playlist through the {tracks} object found in the playlist we just grabbed.
  // The {tracks} object is a paging object because there is a limit of 20 objects it will return at once, so in the event
  // that there are more than 20 songs in the playlist, we have to handle the paging {track} object and use the (next) property
  // to make another API call and get the remaining songs, and if there are more than 20 again, then this process is repeated until
  // (playlistSongs.next) is false. 
  //so the data in here is just an array of objects, and all of the objects in here are the songs that are in the playlist.                                           

    const [songs,setSongs] = useState(null);
  //We have this state variable to grab the songs in the playlist, in the format that our Track Component wants it to be.
  //We will use the useMemo() react hook to grab the individual {track} objects from the songs array containing objects of each of the
  //tracks in the playlist.
  //This state variable contains all of the songs as Objects, but the data required by our Track component is embedded in these Objects, and is 
  //another object called {track} which is info about the current track.
  
  const [sortValue, setSortValue] = useState('');
  const sortOptions = ['danceability','tempo','energy'];

    const [audioFeatures,setFeatures] = useState(null);

    useEffect(()=>{
        const fetchData = async () =>{
            const {data} = await getPlaylistById(id);
            setPlayist(data);
            setPlayistSongs(data.tracks)
        }
        catchErrors(fetchData());
    },[id]);

//************************************************************************************/
    useEffect(()=>{
        if(!playistSongs){
            return;
        }
        const fetchMoreData = async()=>{
            if(playistSongs.next){
                const {data} = await axios.get(playistSongs.next); 
                setPlayistSongs(data);
            }
        }
        setSongs(songs => ([
          ...songs ? songs : [],
          ...playistSongs.items
      ]))

        catchErrors(fetchMoreData())
        const fetchAudioFeatures = async()=>{
            const ids = playistSongs.items.map(({track}) => track.id);
            const {data} = await getAudioFeaturesForSongs(ids);
            setFeatures(audioFeatures =>([
                ...audioFeatures ? audioFeatures : [],
                ...data['audio_features']
            ]));
        }


        catchErrors(fetchAudioFeatures());
    },[playistSongs])
//************************************************************************************/
 ///UseMemo react hook is confusing, gonnna have to read more on that first

 //Update: Alright, so the reason we are using this hook is so that we can generate an array of objects that is
 // of the right data type / format for our Tracks Component. We are essentially just making the data 'fit' correctly
 // for our Track component. This involves going through all of the songs data and returning just 'track' object for each song
 // This track object is what our Track component expects to see and so we will use the useMemo hook to create a memoized array of 
 //track objects to pass to our track component. The reason we will use the useMemo hook is because we dont need this expensive function
 // needlessly running. 
     const songsForPlaylist = useMemo(()=>{
        if(!songs || !audioFeatures){
            return;
        }
      
        return songs.map(({track})=> {
          const trackToAdd = track;

          if(!track.audio_features){
            const audioFeaturesObject = audioFeatures.find(item =>{
              if(!item ||!track){
                return null;
              }
              return item.id === track.id;
            });
            trackToAdd['audio_features']  = audioFeaturesObject;
          }
          return trackToAdd;
        });
    },[songs, audioFeatures])

      // Sort tracks by audio feature to be used in template
      //This function is called everytime the 
  const sortedTracks = useMemo(() => {
    if (!songsForPlaylist) {
      return null;
    }

    return [...songsForPlaylist].sort((a, b) => {
      const aFeatures = a['audio_features'];
      const bFeatures = b['audio_features'];

      if (!aFeatures || !bFeatures) {
        return false;
      }

      return bFeatures[sortValue] - aFeatures[sortValue];
    });
  }, [sortValue, songsForPlaylist]);


    return (
        <>
    {playlist ? (
      <>
        <StyledHeader>
          <div className="header__inner">
            {playlist.images.length && playlist.images[0].url && (
              <img className="header__img" src={playlist.images[0].url} alt="Playlist Artwork"/>
            )}
            <div>
              <div className="header__overline">Playlist</div>
              <h1 className="header__name">{playlist.name}</h1>
              <p className="header__meta">
                {playlist.followers.total ? (
                  <span>{playlist.followers.total} {`follower${playlist.followers.total !== 1 ? 's' : ''}`}</span>
                ) : null}
                <span>{playlist.tracks.total} {`song${playlist.tracks.total !== 1 ? 's' : ''}`}</span>
              </p>
            </div>
          </div>
        </StyledHeader>
        <main>
            <SectionWrapper title={playlist.name} breadcrumb={true}>
            <StyledDropdown>
                <label className="sr-only" htmlFor="order-select">Sort tracks</label>
                <select
                  name="track-order"
                  id="order-select"
                  onChange={e => setSortValue(e.target.value)}
                  >
                  <option value="">Sort tracks</option>
                  {sortOptions.map((option, i) => (
                    <option value={option} key={i}>
                      {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                    </option>
                  ))}
                </select>
              </StyledDropdown>
                {songsForPlaylist ?  (
                    <Tracks tracks={sortedTracks}></Tracks>
                ) : <h1>No tracks in this playlist</h1>}
            </SectionWrapper>
            <StyledFooter className='footer'>Made with ❤️ by Bam</StyledFooter>
        </main>
      </>
    ): <Loader/>}
  </>
    )
}
//************************************************************************************/

export default Playlist;