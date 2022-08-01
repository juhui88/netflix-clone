import React from 'react';
import {BrowserRouter ,Routes, Route} from 'react-router-dom'
import Header from './Components/Header';
import Home from './Routes/Home';
import Movie from './Routes/Movie';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <BrowserRouter /*basename="/netflix-clone/"*/>
      <Header/>
      <Routes>
        <Route path = "/tv" element = {<Tv/>}/>
        <Route path = "/search" element = {<Search/>}/>
        <Route path = "/" element = {<Home/>}/>
        <Route path = "/movie" element={<Movie/>}/>
        <Route path = "/movie/*" element={<Movie />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;