import './index.css';
import Home from './Home';
import Profile from './profile'
import {BrowserRouter,Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path = "/" element={<Home/>}>
        </Route>
        <Route path = "/profile" element={<Profile/>}>
        </Route>
      </Routes>
      </BrowserRouter>
   
  );
}

export default App;
