import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SteamAPI from 'steamapi';


export const Home = (setResponse) => {
    const steam = new SteamAPI(process.env.REACT_APP_STEAM_API_KEY);
    const inputRef = useRef(null);
    const navigate = useNavigate();

     const getSteamId = () =>{
        const id = inputRef.current.value;
        
        if(id.startsWith("https")){
            console.log("THIS IS A URL");
            steam.resolve(id).then(id =>{
            localStorage.removeItem('id');
            localStorage.setItem('id', id);
            }) 
          }else {
        localStorage.removeItem('id');
        localStorage.setItem('id', id);
        }
        navigate('/Profile');

    };


    return (  
        <div className="flex flex-col justify-center items-center">
            <h1>Steam Profile Buddy</h1>
                <form className="w-full max-w-lg justify-center items-center">
                <div className="flex items-center border-b border-teal-500 py-2">
                    <input className="focus:text-white tracking-wide appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" 
                    placeholder="64 Bit Steam Id or Profile URL" name = "steamId" ref={inputRef}></input>
                    <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button" onClick={getSteamId}>
                    Submit
                    </button>
                </div>
                <p>Ex. 76561198322320424</p>
                <p>Ex. https://steamcommunity.com/profiles/76561198322320424</p>
                </form>
        </div>
    );
}
 
export default Home;