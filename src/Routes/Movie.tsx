import { useQuery } from "react-query";
import styled from "styled-components";
import { getNowPlayingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { Route, Routes, useNavigate } from "react-router-dom";
import MovieSlider from "../Components/Movie/MovieSlider";
import {RiInformationLine} from 'react-icons/ri'
import { useRecoilState, } from "recoil";
import {movieIdState } from "../atom";
import MovieDetail from "../Components/Movie/MovieDetail";

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
    height:100vh ;
    width:100vw;
    display: flex; 
    flex-direction: column ;
    justify-content: center ;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${(props) => props.bgphoto}) ;
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
  position: relative;
  top: -100px;
`
const DetailBtn = styled.button`
  background-color: rgba(65, 65, 65, 0.7);
  height: 50px;
  width: 180px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  margin:20px 20px 20px 0;
  border-radius:10px ;
  display:flex;
  align-items:center ;
  justify-content: center ;
  svg {
    margin-right: 5px;
  }
  cursor: pointer;
`

function Movie() {
  const { data:nowPlayingData, isLoading:nowPlayingLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlayingMovies);
  const { data:popularData, isLoading:popularLoding } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
  const { data:topRatedData, isLoading:topRatedLoading } = useQuery<IGetMoviesResult>(["movies", "topLated"], getTopRatedMovies);
  const { data:upcomingData, isLoading: upcomingLoading} = useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies);

  const [movieId,setMovieId] = useRecoilState(movieIdState);
  
  const navigate = useNavigate();

  const onInfoClicked = (movieId: number) => {
    navigate(`${movieId}`);
    setMovieId(movieId);
  };
  const loading = nowPlayingLoading && popularLoding && topRatedLoading && upcomingLoading;
  return (
    <Wrapper>{loading? <Loader>Loading...</Loader> : 
    <>
      <Bannner bgphoto = {makeImagePath(nowPlayingData?.results.slice(-1)[0].backdrop_path || "")}>
        <Title>{nowPlayingData?.results.slice(-1)[0].title}</Title>
        <OverView>{nowPlayingData?.results.slice(-1)[0].overview}</OverView>
        <DetailBtn onClick = {() => onInfoClicked(nowPlayingData?.results.slice(-1)[0].id || 0)}> 
          <RiInformationLine/>
          <span>상세 정보</span> 
        </DetailBtn>
      </Bannner>
      <Sliders>
        <MovieSlider
        title="Now Playing Movies"
        data={nowPlayingData?.results ?? []}/>
        <MovieSlider
        title="Popular Movies"
        data={popularData?.results ?? []}/>
        <MovieSlider 
        title="Top Rated Movies"
        data={topRatedData?.results ?? []}/>
        <MovieSlider
        title="Upcoming Movies"
        data={upcomingData?.results ?? []}/>
      </Sliders>
    </>
    }
    <Routes>
      <Route path = {`${movieId}`} element = {<MovieDetail/>}/>
    </Routes>
    </Wrapper>
  );
}

export default Movie;