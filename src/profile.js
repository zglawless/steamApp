import React, {useEffect, useState } from "react";
import './profile.css';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  var id = localStorage.getItem('id');
  var URL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamids=" + id;
  var gURL = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id + "&format=json&include_appinfo=1";
  var rURL = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id + "&format=json&include_appinfo=1";
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [recent, setRecent] = useState([]);
  const [recentCount, setRecentCount] = useState(null);
  const [gamesCount, setGamesCount]= useState(null);

  const fetchProfile = () => {
    setLoading(true);
      fetch(URL)
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json.response);
        setLoading(false);
        setData(json.response.players[0]);
        if(json.response.players[0].steamid == null){
          navigate('/');
          alert("Could not fetch users profile");
        }
      })
      .catch(error => {
        setLoading(false);
        navigate('/');
        alert("Could not fetch users profile");
      })
  }

  const fetchGames = () => {
    setLoading(true);
      fetch(gURL)
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(json => {
        setLoading(false);
        console.log(json.response)
        var temp = [...json.response.games].sort((a, b) => b.playtime_forever - a.playtime_forever);
        setGames(temp);
        setGamesCount(json.response.total_count);
      })
  }

  const fetchRecent = () => {
    setLoading(true);
      fetch(rURL)
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(json => {
        setLoading(false);
        console.log(json.response)
        var temp = [...json.response.games].sort((a, b) => b.playtime_forever - a.playtime_forever);
        setRecent(temp);
        setRecentCount(json.response.total_count);
      })
  }
  function getImg(id, hash){
    return("http://media.steampowered.com/steamcommunity/public/images/apps/" + id + "/" + hash + ".jpg");
  }

  useEffect(() => {
    fetchProfile();
    fetchGames();
    fetchRecent();
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


  return (
    <div className="grid h-screen justify-items-center">
    <div className="grid grid-cols-3 gap-2 h-fit w-3/4 bg-gray-900 justify-items-center p-5">
        <div className="">
          <img src = {data.avatarfull} alt = "profile image"></img>
        </div>
        <div>
        <p>{data.personaname}</p>
        <p>Profile Id: {id}</p>
        <a className ="underline" href = {data.profileurl} target="_blank">View Profile</a>
        </div>
        <div>
        <p>Profile Status: {data.communityvisibilitystate}</p>
        <p>{data.personastate}</p>
        </div>
      </div>
      <div className="w-3/4 bg-gray-900 h-screen">
      <h1 className=" text-center">Recently Played Games {recentCount}</h1>
      <div className="grid grid-cols-3 gap-1 w-3/4 bg-gray-900 h-fit mx-0">
      {recent.map(item => (
        <div className = "text-white" key={item.appid}>{item.name} 
        <img className="w-max h-max" src={getImg(item.appid, item.img_icon_url)}></img>
        </div>
      ))}
      </div>
      <h1 className=" text-center">All Owned Games {gamesCount}</h1>
      <div className="grid grid-cols-3 gap-1 w-3/4 bg-gray-900 h-fit mx-0">
      {games.map(game => (
        <div className = "text-white w-fit h-fit" key={game.appid}>{game.playtime_forever} 
        <img className="w-max h-max" src={getImg(game.appid, game.img_icon_url)}></img>
        </div>
      ))}
      </div>
      </div>
      </div>
  );
}
export default Profile;