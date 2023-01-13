import React,{useEffect,useState} from 'react'
import { getCurrentUserProfile, getUserPlaylists, getUserTopArtists, getUserTopTracks} from '../spotify'
import {catchErrors} from '../utils';
import {StyledHeader, StyledFooter} from '../styles';
import { SectionWrapper, Artists, Tracks, Playlists,Loader } from '../components';
import styled from 'styled-components';

const Profile = () =>{

    const [profile, setProfile] = useState(null);
    const [playlists, setPlayists] = useState(null);
    const [topArtists,setTopArtists] = useState(null);
    const [topTracks, setTopTracks] = useState(null);

    useEffect(()=>{
        const fetchData = async ()=>{  
          const {data} = await getCurrentUserProfile();
          setProfile(data);

          const topArtists = await getUserTopArtists();
          setTopArtists(topArtists.data);
          
          const topTracks = await getUserTopTracks();
          setTopTracks(topTracks.data);

          const playlists = await getUserPlaylists();
          setPlayists(playlists.data);

          
        }
        catchErrors(fetchData())
      },[]);

      return (
        <>
        {profile && (
        <StyledHeader type="user">
        <div className="header__inner">
            {profile.images.length && profile.images[0].url && (
                <img className="header__img" src={profile.images[0].url} alt="Avatar"/>
                )}
            <div>
            <div className="header__overline">Profile</div>
            <h1 className="header__name">{profile.display_name}</h1>
            <p className="header__meta">
            {playlists && (
                    <span>{playlists.total} Playlist{playlists.total !== 1 ? 's' : ''}</span>
                  )}
                <span>
                  {profile.followers.total} Follower{profile.followers.total !== 1 ? 's' : ''}
                </span>
            </p>
            </div>
        </div>
        </StyledHeader>
            )}
        {topArtists &&  topTracks && playlists ? (
            <main>
              <SectionWrapper title="Top artists this month" seeAllLink="/top-artists">
                <Artists artists={topArtists.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Top tracks this month" seeAllLink="/top-tracks">
                <Tracks tracks={topTracks.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Playlists" seeAllLink="/playlists">
                <Playlists playlists={playlists.items.slice(0, 10)} />
              </SectionWrapper>
              <StyledFooter className='footer'>Made with ❤️ by Bam</StyledFooter>
            </main>
          ): <Loader/>}
        </>
      )
}
export default Profile;
