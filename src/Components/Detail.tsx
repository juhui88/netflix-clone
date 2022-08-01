import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovie, IGetMovieDetial } from "../api";
import { makeImagePath } from "../utils";
import {RiMovieFill} from 'react-icons/ri'
import { useRecoilValue } from "recoil";
import { movieIdState } from "../atom";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(1,1,1,0.7);
  opacity: 1;
  z-index:1;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 800px;
  top:0;
  left: 0;
  right: 0;
  margin: 10px auto 10px auto;
  z-index:2;
  background-color: rgb(20, 20, 20);
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  
`;
const BigInfo = styled.div`
    margin: 20px;
`
const BigInfoOne = styled.div`
    display: flex;
    p {
        margin:2px;
    }
`
const BigTitle = styled.div`
    font-style: italic ;
    color: ${(props) => props.theme.white.lighter};
    margin: 20px 0 10px 20px;
    span:first-child {
        font-size: 46px;
        font-weight: bold ;
    }
    p:last-child {
        padding-top: 20px;
        font-size: 20px;
        color: #535355
    }
  
`;

const BigRelease = styled.p`
    
`
const BigRuntime = styled.p`
`
const BigOverview = styled.div`
  color: ${(props) => props.theme.white.lighter};
  padding:5px 20px 20px 20px;
  line-height: 23px;
`;
const BigGenres = styled.div`
    padding:5px 0;
    span:first-child {
        color: #414141
    }
`
const BigWrap = styled.div`
    display:grid;
    grid-template-columns:2fr 1fr ;
`

function Detail() {
    const movieId = useRecoilValue(movieIdState)
    const navigate = useNavigate();
    const onOverlayClick = () => navigate("/movie");

    const {data, isLoading} = useQuery<IGetMovieDetial>(["detailMoive", movieId], () => getMovie(movieId))
    return (
        <AnimatePresence>
            {isLoading? null :
            <>
                <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                />
                <BigMovie exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                    <BigCover
                        style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(20,20,20,1)),url(${makeImagePath(
                            data?.backdrop_path+"",
                            "w500"
                        )})`,
                        }}
                    />
                    <BigInfo>
                        <BigInfoOne style = {{display:"flex"}}>
                            <BigRelease>{data?.release_date.slice(0,4)}</BigRelease>
                            <p><RiMovieFill/></p>
                            <BigRuntime> runtime: {data?.runtime}m </BigRuntime>
                        </BigInfoOne>
                        
                        <BigTitle>
                            <span>{data?.original_title}</span>
                            <p>{data?.tagline}</p>
                        </BigTitle>
                        <BigWrap>
                            <BigOverview>{data?.overview}</BigOverview>
                            <BigGenres>
                                <span>genre : </span> 
                                <span>{data?.genres.map(g=> g.name+"  ")}</span>
                            </BigGenres>
                        </BigWrap>
                        
                    </BigInfo>
                    
                </BigMovie>
            </>
            }
            
                   
        </AnimatePresence>
    )
}

export default Detail;