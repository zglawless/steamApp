import React, { useEffect, useState } from "react";
import './profile.css';
import errorImg from './images/error.jpg';
import { useNavigate } from "react-router-dom";
/* eslint eqeqeq: 0 */
const Profile = () => {
  var id = localStorage.getItem('id');
  // var URL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamids=" + id;
  // var gURL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id + "&format=json&include_appinfo=1";
  // var rURL = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id + "&format=json&include_appinfo=1";
  // var bURL = "https://api.steampowered.com/IPlayerService/GetProfileBackground/v1/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamid=" + id;
  // var iURL = "https://steamcommunity.com/inventory/" + id + "/730/2?l=english&count=2000";
  // var mURL = "https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=";
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [recent, setRecent] = useState([]);
  const [recentCount, setRecentCount] = useState(null);
  const [gamesCount, setGamesCount] = useState(null);
  const [profileBackground, setProfileBackground] = useState(null);
  const [inv, setInv] = useState([]);
  const [showGame, setShowGame] = useState(true);
  const [showInv, setShowInv] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [price, setPrice] = useState(null);
  const [pages, setPages] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(25);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isInvPrivate, setIsInvPrivate] = useState(true);



  const fetchProfile = () => {
    setLoading(true);
    var newURL = "http://localhost:3005/getplayersummary/?" + id;
    fetch(newURL)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setData(json.response.players[0]);
        if (json.response.players[0].communityvisibilitystate == 1) {
          json.response.players[0].communityvisibilitystate = "Private";
        } else {
          json.response.players[0].communityvisibilitystate = "Public"; 
        }
        if (json.response.players[0].steamid == null) {
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
    fetch("http://localhost:3005/getownedgames/?" + id)
      .then(response => {
        return response.json();
      })
      .then(json => {
        if(json.response.games != null){
        var temp = [...json.response.games].sort((a, b) => b.playtime_forever - a.playtime_forever);
        setGames(temp);
        setGamesCount(json.response.game_count);
        setIsPrivate(false);
      } else setIsPrivate(true);
      })
    setLoading(false);
  }
  const fetchInv = async () => {
    setLoading(true);
    if (inv != []) {
      await fetch("http://localhost:3005/getplayerinv/?" + id)
        .then(response => {
          return response.json();
        })
        .then(code => {
          if (code != null) {
            const asset = code.assets;
            const description = code.descriptions;
            for (var i = 0; i < asset.length; i++) {
              for (var x = 0; x < description.length; x++) {
                if (asset[i].classid == description[x].classid) {
                  asset[i].description = description[x].descriptions;
                  asset[i].icon_url = description[x].icon_url;
                  asset[i].market_actions = description[x].market_actions;
                  asset[i].market_name = description[x].market_name;
                  asset[i].tags = description[x].tags;
                  asset[i].tradable = description[x].tradable;
                  break;
                }
              }

            }
            setInv(asset);
            setIsInvPrivate(false);
          } else setIsInvPrivate(true);
        })

    }
    setLoading(false);
  }


  const fetchRecent = () => {
    setLoading(true);
    fetch("http://localhost:3005/getrecentlyplayed/?" + id)
      .then(response => {
        return response.json();
      })
      .then(json => {
        if(json.response.games != null){
        if (json.response.total_count == 0) {
          setRecent([]);
        } else {
          var temp = [...json.response.games].sort((a, b) => b.playtime_forever - a.playtime_forever);
          setRecent(temp);
        }
        setRecentCount(json.response.total_count);
      }
      })
    setLoading(false)
  }
  const fetchProfileBackground = () => {
    setLoading(true);
    fetch("http://localhost:3005/getprofilebackground/?" + id)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setProfileBackground("https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/" + json.response.profile_background.movie_mp4);
      })
  }
  function getImg(id) {
    return "https://steamcdn-a.akamaihd.net/steam/apps/" + id + "/library_600x900_2x.jpg";
  }
  function getCsgoImg(hash) {
    return "http://cdn.steamcommunity.com/economy/image/" + hash;
  }
  function getDate(unix) {
    var date = new Date(unix * 1000).toLocaleDateString("en-US");
    return date;
  }

  function twoDecimal(min) {
    var temp = min / 60;
    temp = temp.toFixed(2);
    return temp;
  }

  // const getPrice = async (market) => {
  //   console.log(selectItem);
  //   const res = await fetch("http://localhost:3005/getprice/?" + market);
  //   const data = await res.json();
  //   console.log(data);
  //   return (data);
  // }
  

  const selectedItem = async (index, market) =>  {
    setLoading(true);
    setSelectItem(index);
    console.log(market);
    const uri = "http://localhost:3005/getprice/?" + market;
    const res = await fetch(uri);
    const data = await res.json();
    setPrice(data.lowest_price)
    setLoading(false);
  }

  useEffect(() => {
    fetchProfile();
    fetchGames();
    fetchRecent();
    fetchProfileBackground();
    fetchInv();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  if (loading) {
    return <h1>Loading...</h1>
  }


    if (data.personastate == 0) {
      data.personastate = "Offline";
    } else if (data.personastate == 1) {
      data.personastate = "Online";
    } else if (data.personastate == 2) {
      data.personastate = "Busy";
    } else if (data.personastate == 3) {
      data.personastate = "Away";
    } else if (data.personastate == 4) {
      data.personastate = "Snooze";
    } else if (data.personastate == 5) {
      data.personastate = "Looking to trade";
    } else if (data.personastate == 6) {
      data.personastate = "Looking to play";
    }  


  function Header() {
    if(loading === false){
    return (
    <><video id='video' autoPlay loop muted>
      <source src={profileBackground} type='video/mp4' />
      Your browser does not support the video tag.
    </video>
      <div className="lg:grid lg:grid-cols-3 h-full w-screen md:w-7/12 bg-gray-800 border-gray-900 border-8 justify-items-center p-5 ">
        <div className="h-fit grid col-span-1">
          <img className="m-auto"src={data.avatarfull} alt="profile"></img>
        </div>
        <div className="h-fit grid lg:col-span-2 lg:grid-cols-2">
        <div className="p-2 text-center">
          <p>{data.personaname}</p>
          <p>Profile Id: {id}</p>
          <a className="underline" href={data.profileurl} target="_blank" rel="noreferrer">View Profile</a>
        </div>
        <div className="h-fit p-2 text-center">
          <p>Profile Status: {data.communityvisibilitystate}</p>
          <p>{data.personastate}</p>
          <p>Account Created: {getDate(data.timecreated)}</p>
        </div>
        </div>
      </div></>);
    }
  }

  function Games() {
    if(loading === false && isPrivate === false){
    return (
    <div className="w-screen md:w-7/12 bg-gray-900 h-fit p-5">
      <h1 className=" text-center">Recently Played Games: {recentCount}</h1>
      <div className=" w-full grid md:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-1 bg-gray-900 h-fit mx-0 pt-5 auto-cols-auto">
        {recent.map(item => <div className="text-white" key={item.appid}>{item.name}
          <br></br>
          Playtime: {twoDecimal(item.playtime_forever)} hours
          <br></br>
          Past two weeks: {twoDecimal(item.playtime_2weeks)} hours
          <img className="w-fit h-fit" src={getImg(item.appid)} alt="game"></img>
        </div>)}
      </div>
      <h1 id="toggle" className="text-center text-white "> View All Owned Games: {gamesCount}</h1>
      <div id="games" className=" w-full grid md:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-1 bg-gray-900 h-fit mx-0 auto-cols-fr auto-rows-min">
        {games.map(game => <div className="text-white w-fit h-full flex flex-wrap" key={game.appid}>{game.name} <br></br>Playtime: {twoDecimal(game.playtime_forever)} hours
          <img className="w-fit h-fit self-end" src={getImg(game.appid)} onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = errorImg;
          }} alt="game"></img>
        </div>)}
      </div>
    </div>);
    }
    else if (isPrivate === true){
      return(
        <div className="w-screen md:w-7/12 h-full text-center bg-gray-900">
          <h1 className="text-red-600">This Profile is private</h1>
        </div>
      )
    }
  }
  function Inventory() {
    if (selectItem == null) {
      selectedItem(0, inv[0].market_name);
    }
    console.log(selectItem);
    setPages(Math.ceil(inv.length / 25));
    let subset = inv.slice(startIndex, endIndex);

    if (loading === false && isInvPrivate === false) {
      return (
        <div className=" w-screen md:w-7/12 bg-gray-900 h-fit p-5 grid grid-cols-1 grid-rows-1 xs:grid-cols-3 xs:grid-rows-1 gap-2">
          <div className="col-span-2 grid">
            { <div className=" grid grid-cols-5 grid-rows-5 gap-2 h-fit mx-0 bg-gray-800">
              {subset.map((asset, index) => <div onClick={() => selectedItem(index, subset[index].market_name)} className="hover:bg-gray-700 text-white border-2 border-white gap-1" key={index}><img alt={index} src={getCsgoImg(asset.icon_url)}></img></div>)}
            </div> }
            <div className="flex justify-end mt-4">
              <button className="text-white text-sm p-1 border rounded-lg" onClick={() => {setCurrPage(currPage - 1); setStartIndex(startIndex-25); setEndIndex(endIndex-25); selectedItem(0, subset[0].market_name);}}
                disabled={currPage === 1}>Last</button>
              <p className=" text-gray-700 text-xs p-1">{currPage} of {pages}</p>
              <button className="text-white text-sm p-1 border rounded-lg" onClick={() => {setCurrPage(currPage + 1); setStartIndex(startIndex+25); setEndIndex(endIndex+25); selectedItem(0, subset[0].market_name);}}
                disabled={currPage == pages}>Next</button>
            </div>
          </div>
          <div className="border-2 border-white p-3">
            <img className="bg-gray-800 w-full h-max object-contain" src={getCsgoImg(subset[selectItem].icon_url)} alt="item"></img>
            <h1 className="text-fuchsia-700">{subset[selectItem].market_name}</h1>
            <br></br>
            <p className="text-white">Market Price: {price}</p>
          </div>
        </div>
      );
    } else if (isInvPrivate === true){
      return (
        <div className="w-screen md:w-7/12 bg-gray-900 h-full text-center">
        <h1 className="text-red-600">This inventory is private</h1>
        </div>
      )
    }
  }

  return (
    <div className="grid h-screen justify-items-center">
      <Header />
      <div className="grid grid-cols-2 w-screen md:w-7/12 bg-gray-900 justify-items-center p-5">
        <div className="hover:bg-gray-700 h-fit" onClick={() => { setShowGame(true); setShowInv(false); }}>
        <h2 className="text-white px-20 py-5" >Games</h2>
        </div>
        <div className="hover:bg-gray-700 h-fit" onClick={() => { setShowGame(false); setSelectItem(0); setShowInv(true); }}>
        <h2 className="text-white px-20 py-5" >Inventory</h2>
        </div>
      </div>
      {showGame && <Games />}
      {showInv && <Inventory />}
    </div>
  );
}



export default Profile;

