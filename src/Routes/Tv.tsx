import { useQuery } from "react-query";
import styled from "styled-components";
import { getAiringTodayTv, getOnTheAirTv, getPopularTv, getTopRatedTv, IGetTvsResult } from "../api";
import { makeImagePath } from "../utils";
import { Route, Routes, useNavigate } from "react-router-dom";
import {RiInformationLine} from 'react-icons/ri'
import { useRecoilState, } from "recoil";
import { TvIdState } from "../atom";
import TvDetail from "../Components/Tv/TvDetail";
import TvSlider from "../Components/Tv/TvSlider";

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

function Tv() {
  const { data:airingData, isLoading:airingLoading } = useQuery<IGetTvsResult>(["Tvs", "airingToday"], getAiringTodayTv);
  const { data:onTheAirgData, isLoading:onTheAirgLoading } = useQuery<IGetTvsResult>(["Tvs", "ontheAir"], getOnTheAirTv);
  const { data:popularData, isLoading:popularLoading } = useQuery<IGetTvsResult>(["Tvs", "popular"], getPopularTv);
  const { data:topRatedData, isLoading:topRatedLoading } = useQuery<IGetTvsResult>(["Tvs", "topRated"], getTopRatedTv);

  const [tvId,setTvId] = useRecoilState(TvIdState);
  
  const navigate = useNavigate();

  const onInfoClicked = (tvId: number) => {
    navigate(`${tvId}`);
    setTvId(tvId);
  };

  const loading = airingLoading && onTheAirgLoading && popularLoading && topRatedLoading
  return (
    <Wrapper>{loading? <Loader>Loading...</Loader> : 
    <>
      <Bannner bgphoto = {makeImagePath(airingData?.results.slice(-1)[0].backdrop_path || "")}>
        <Title>{airingData?.results.slice(-1)[0].original_name}</Title>
        <OverView>{airingData?.results.slice(-1)[0].overview}</OverView>
        <DetailBtn onClick = {() => onInfoClicked(airingData?.results.slice(-1)[0].id || 0)}> 
          <RiInformationLine/>
          <span>상세 정보</span> 
        </DetailBtn>
      </Bannner>
      <Sliders>
        <TvSlider
        title="Airing Today Tv shows"
        data={airingData?.results ?? []}/>
        <TvSlider
        title="On the Air Tv shows"
        data={onTheAirgData?.results ?? []}/>
        <TvSlider
        title="Popular Tv shows"
        data={popularData?.results ?? []}/>
        <TvSlider 
        title="Top Rated Tv shows"
        data={topRatedData?.results ?? []}/>
      </Sliders>
    </>
    }
    <Routes>
      <Route path = {`${tvId}`} element = {<TvDetail/>}/>
    </Routes>
    </Wrapper>
  );
}

export default Tv;