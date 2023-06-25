import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import SteamAPI from "steamapi";

const Profile = () => {
  const id = localStorage.getItem('id');
  const URL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamids=" + id;
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const fetchData = () => {
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
        console.log(error.message);
        setLoading(false);
        navigate('/');
        alert("Could not fetch users profile");
      })
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading){
    return <h1>Loading...</h1>
  }


  return (
    <div class="flex flex-col justify-center items-center">
      <h1>Profile</h1>
      <div>
        <img src = {data.avatarfull} alt = "profile image"></img>
        <p>{data.personaname}</p>
        <a href = {data.profileurl}>View Profile</a>

      </div>
      
    </div>


  );
}
export default Profile;