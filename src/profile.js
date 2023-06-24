import React, {useEffect, useState } from "react";

const Profile = () => {
  const id = localStorage.getItem('id');
  const URL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.REACT_APP_STEAM_API_KEY + "&steamids=" + id;
  const [data, setData] = useState(null);


  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);
  
  console.log(data);

  return (
    <div class="flex flex-col justify-center items-center">
      <h1>Profile</h1>
    </div>

  );
}
export default Profile;