import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';



export const Home = (setResponse) => {

    const inputRef = useRef(null);

    const navigate = useNavigate();
     const getSteamId = () =>{
        const id = inputRef.current.value;
        localStorage.setItem('id', id);
        navigate('/Profile');
    };


    return (  
        <div className = "input"  class="flex flex-col justify-center items-center">
            <h1>Steam Buddy</h1>
                <form class="w-full max-w-sm justify-center items-center">
                <div class="flex items-center border-b border-teal-500 py-2">
                    <input class="focus:text-white tracking-wide appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" 
                    placeholder="64 Bit Steam Id" name = "steamId" ref={inputRef}></input>
                    <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button" onClick={getSteamId}>
                    Submit
                    </button>
                </div>
                <p>Ex. 76561197960435530</p>
                </form>
        </div>
    );
}
 
export default Home;