import React, {useEffect, useState } from "react";
import './profile.css';
import { useNavigate } from "react-router-dom";
/* eslint eqeqeq: 0 */
const Profile = () => {
  var id = localStorage.getItem('id');
  var URL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamids=" + id;
  var gURL = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id + "&format=json&include_appinfo=1";
  var rURL = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id + "&format=json&include_appinfo=1";
  var bURL = "https://api.steampowered.com/IPlayerService/GetProfileBackground/v1/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id;
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [recent, setRecent] = useState([]);
  const [recentCount, setRecentCount] = useState(null);
  const [gamesCount, setGamesCount]= useState(null);
  const [profileBackground, setProfileBackground] = useState(null);

  const fetchProfile = () => {
    setLoading(true);
      fetch(URL)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setLoading(false);
        setData(json.response.players[0]);
        if(json.response.players[0].steamid == null){
          navigate('/');
          alert("Could not fetch users profile");
        }
      })
      .catch(error => {
        navigate('/');
        alert("Could not fetch users profile");
      })
      setLoading(false);
  }

  const fetchGames = () => {
    setLoading(true);
      fetch(gURL)
      .then(response => {
        return response.json();
      })
      .then(json => {
        var temp = [...json.response.games].sort((a, b) => b.playtime_forever - a.playtime_forever);
        setGames(temp);
        setGamesCount(json.response.game_count);
      })
  }

  const fetchRecent = () => {
    setLoading(true);
      fetch(rURL)
      .then(response => {
        return response.json();
      })
      .then(json => {
        var temp = [...json.response.games].sort((a, b) => b.playtime_forever - a.playtime_forever);
        setRecent(temp);
        setRecentCount(json.response.total_count);
      })
  }
  const fetchProfileBackground = () => {
    setLoading(true);
      fetch(bURL)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setProfileBackground("https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/" + json.response.profile_background.movie_mp4);
      })
  }
  function getImg(id){
    return("https://steamcdn-a.akamaihd.net/steam/apps/" + id + "/library_600x900_2x.jpg");
  }
  function getDate(unix){
    var date = new Date(unix * 1000).toLocaleDateString("en-US");
    return date;
  }

  function twoDecimal (min){
    var temp = min /60;
    temp = temp.toFixed(2);
    return temp;
  }

  useEffect(() => {
    fetchProfile();
    fetchGames();
    fetchRecent();
    fetchProfileBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  if (loading){
    return <h1>Loading...</h1>
  }

  if(data.communityvisibilitystate == 1){
    data.communityvisibilitystate = "Private";
  } else data.communityvisibilitystate = "Public";

  if (data.personastate == 0){
    data.personastate = "Offline";
  } else if (data.personastate == 1){
    data.personastate = "Online";
  } else if (data.personastate == 2){
    data.personastate = "Busy";
  } else if (data.personastate == 3){
    data.personastate = "Away";
  } else if (data.personastate == 4){
    data.personastate = "Snooze";
  } else if (data.personastate == 5){
    data.personastate = "Looking to trade";
  }else if (data.personastate == 6){
    data.personastate = "Looking to play";
  }

  console.log(profileBackground);
  return (


    <div className="grid h-screen justify-items-center">
    <video id='video' autoPlay loop muted>
    <source src={profileBackground} type='video/mp4' />
    Your browser does not support the video tag.
    </video>
    <div className="grid grid-cols-3 gap-2 h-fit  w-7/12 bg-gray-900 justify-items-center p-5">
        <div className="">
        <img src = {data.avatarfull} alt = "profile"></img>
        </div>
        <div>
        <p>{data.personaname}</p>
        <p>Profile Id: {id}</p>
        <a className ="underline" href = {data.profileurl} target="_blank" rel="noreferrer">View Profile</a>
        </div>
        <div>
        <p>Profile Status: {data.communityvisibilitystate}</p>
        <p>{data.personastate}</p>
        <p>Account Created: {getDate(data.timecreated)}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-7/12 bg-gray-900 justify-items-center p-5">
        <h2 className="hover:bg-gray-700"><a href="" >Games</a></h2>
        <h2><a href="">Inventory</a></h2>
        <h2><a href="">Achievements</a></h2>

      </div>
      <div className="w-7/12 bg-gray-900 h-screen p-5">
      <h1 className=" text-center">Recently Played Games: {recentCount}</h1>
      <div className="grid grid-cols-3 gap-1 bg-gray-900 h-fit mx-0 pt-5">
      {recent.map(item => (
        <div className = "text-white" key={item.appid}>{item.name} 
        <br></br>
        Playtime: {twoDecimal(item.playtime_forever)} hours
        <br></br>
        Past two weeks: {twoDecimal(item.playtime_2weeks)} hours
        <img className="w-fit h-fit" src={getImg(item.appid)} alt = "game"></img>
        </div>
      ))}
      </div>
      <h1 id = "toggle" className="text-center text-white "> View All Owned Games: {gamesCount}</h1>
      <div id="games" className="grid grid-cols-3 gap-1 bg-gray-900 h-fit mx-0">
      {games.map(game => (
        <div className = "text-white w-fit h-fit" key={game.appid}>Playtime: {twoDecimal(game.playtime_forever)} hours 
        <img className=" w-fit h-fit" src={getImg(game.appid)} alt = "game"></img>
        </div>
      ))}
      </div>
      </div>
      </div>
  );
}
export default Profile;