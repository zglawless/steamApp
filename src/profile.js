import React from "react";
import SteamAPI from "steamapi";

const Profile = () => {

  const steam = new SteamAPI('06FD0EDD81BACE6DD0C11FF850D36939');
  const id = localStorage.getItem('id');
  steam.resolve('https://steamcommunity.com/profiles/76561198322320424/').then(id => {
	  console.log(id); // 76561198146931523
  });
  
  steam.getUserSummary(id).then(summary => {
    console.log(summary);
  });
  
  return (
    <div class="flex flex-col justify-center items-center">
      <h1>Profile</h1>
    </div>

  );
}
export default Profile;