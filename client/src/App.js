import React,{useEffect,useState} from 'react'
import {accessToken, logout, getCurrentUserProfile} from './spotify'
import {catchErrors} from './utils';
import {BrowserRouter as Router,Routes,Route,useLocation} from 'react-router-dom';
import { GlobalStyle} from './styles';
import { Login,Profile, TopArtists, TopTracks,TopPlaylists,Playlist } from './pages';
import styled from 'styled-components/macro';
//************************************************************************************/
const StyledLogoutButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0,0,0,.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;
//************************************************************************************/
function ScrollToTop(){
  const {pathname} = useLocation();
  useEffect(()=>{
    window.scrollTo(0,0)
  },[pathname])
}
//************************************************************************************/
function App(){
  const [token,setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  
  useEffect(()=>{
    setToken(accessToken)
    const fetchData = async ()=>{  
      const {data} = await getCurrentUserProfile();
      setProfile(data);
    }
    catchErrors(fetchData())
  },[]);

  return(
    <div className='App'>
      <GlobalStyle/>
    {!token ? (
      <Login />
        ) : ( 
          <>
          <StyledLogoutButton onClick={logout}>Logout</StyledLogoutButton>
          <Router>
            <ScrollToTop/>
            <Routes>
              <Route path="/" element={<Profile/>}/>
              <Route path="/top-artists" element={<TopArtists/>}/>
              <Route path="/top-tracks"  element={<TopTracks/>}/>
              <Route path="/playlists/:id"element={<Playlist/>}/>
              <Route path="/playlists" element={<TopPlaylists/>}/>
            </Routes>
          </Router>
          </>
        )}
    </div>
  )
}
export default App;
//************************************************************************************/