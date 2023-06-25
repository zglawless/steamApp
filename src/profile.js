import React, {useEffect, useState } from "react";
import './index.css';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  var id = localStorage.getItem('id');
  var URL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamids=" + id;
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  console.log(id);

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
    <div class="flex flex-col items-center h-screen">
        <div className="justify-start">
          <img src = {data.avatarfull} alt = "profile image"></img>
        </div>
        <p>{data.personaname}</p>
        <a href = {data.profileurl} target="_blank">View Profile</a>
      </div>
  );
}
export default Profile;