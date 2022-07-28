import { useQuery } from "react-query";
import styled from "styled-components";
import { getNowPlayingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, IGetMoviesResult, IMovie } from "../api";
import { makeImagePath } from "../utils";
import {AnimatePresence, motion, useViewportScroll} from 'framer-motion';
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import {BiArrowFromRight, BiArrowFromLeft} from 'react-icons/bi'
import Slider from "../Components/Slider";

const Wrapper = styled.div`
    background: black;
`
const Loader = styled.div`
    height: 20vh;
    text-align:center;
    display: flex;
    justify-content: center ;
    align-items: center ;
`
const Bannner = styled.div<{bgphoto: string}>`
  height:80vh ;
    display: flex; 
    flex-direction: column ;
    justify-content: center ;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5)), url(${(props) => props.bgphoto}) ;
    background-size: cover ;
`
const Title = styled.h2`
    font-size: 58px;
    margin-bottom: 20px;
    font-weight: bolder ;
`
const OverView = styled.p`
    font-size: 20px;
    width: 40%;
`
const Sliders = styled.div`
  
`
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 40vh;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;




const rowVariants = {
  hidden: (back:boolean)=> ({
    x: back ? -window.outerWidth - 10 :  window.outerWidth + 10,
  }),
  visible: {
    x: 0,
  },
  exit:(back:boolean)=> ( {
    x: back ? window.outerWidth + 10 :  -window.outerWidth - 10,
  }),
};

const infoVariants = {
    hover: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duaration: 0.1,
        type: "tween",
      },
    },
  };
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const btnVariants = {
  hover: {
    scale:1.2,
  }
}

function Home() {
  const { data:nowPlayingData, isLoading:nowPlayingLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlayingMovies);
  const { data:popularData, isLoading:popularLoding } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
  const { data:topRatedData, isLoading:topRatedLoading } = useQuery<IGetMoviesResult>(["movies", "topLated"], getTopRatedMovies);
  const { data:upcomingData, isLoading: upcomingLoading} = useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies);

return (
  <Wrapper>{nowPlayingLoading? <Loader>Loading...</Loader> : 
  <>
    <Bannner bgphoto = {makeImagePath(nowPlayingData?.results[0].backdrop_path || "")}>
      <Title>{nowPlayingData?.results[0].title}</Title>
      <OverView>{nowPlayingData?.results[0].overview}</OverView>
    </Bannner>
    <Sliders>
      <Slider
      title="Now Playing Movies"
      data={nowPlayingData?.results ?? []}/>
      <Slider
      title="Popular Movies"
      data={popularData?.results ?? []}/>
      <Slider 
      title="Top Rated Movies"
      data={topRatedData?.results ?? []}/>
      <Slider
      title="Upcoming Movies"
      data={upcomingData?.results ?? []}/>
    </Sliders>
      
  </>
  }
  </Wrapper>
  );
}

export default Home;