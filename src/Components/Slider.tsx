import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { IGetGenres, IMovie } from "../api";
import { makeImagePath } from "../utils";
import {BiArrowFromRight, BiArrowFromLeft} from 'react-icons/bi'
import { useQuery } from "react-query";
import {RiPlayCircleLine, RiInformationLine} from 'react-icons/ri'
import {TbThumbUp} from 'react-icons/tb'
import {TiHeartFullOutline,TiHeartOutline} from 'react-icons/ti'

const SliderWrap = styled.div`
margin-top: 10px;
  margin-bottom: 30px;
  height:250px;
`
const SliderTitle = styled.div`
  font-size:24px;
  margin-bottom: 10px;
  font-weight:bold ;
`
const Row = styled(motion.div)<{offset: number}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.offset},1fr);
  position: absolute;
  gap:10px;
  width: 100%;
  
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
justify-self: center;
  background-color: white;
  height: 200px;
  width: 260px;
  background-image: url(${(props) => props.bgphoto}) ;
  background-position: center center;
  background-size: cover;
  border-radius: 5px ;
  &:first-child {
    transform-origin: center left ;
  }
  &:last-child {
    transform-origin: center right ;
  }
`;
const Prev = styled(motion.button)`
  position: absolute ;
  background:rgba(0,0,0,0);
  height:18vh;
  font-size:40px;
  color: white;
  z-index: 1;
  overflow:none ;
`
const Next = styled(Prev)`
    right:0;

`
const Info = styled(motion.div)`
  padding: 10px;
  color:${(props)=>props.theme.white.lighter};
  background-color: rgba(1,1,1,0.7);
  font-size: 15px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-radius:5px ;
  
  h4 {
    text-align: center;
    font-size: 18px;
    font-weight:bold;
    margin:15px;
  }
`
const InfoDetail = styled.div`
  display:flex;
  justify-content: space-between;
`
const InfoIcons = styled(InfoDetail)`
  font-size:25px;
  div:last-child {
    cursor:pointer
    
  }
`

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
    },
    
  },
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

interface SlidersProps {
  title?: string;
  movieData: IMovie[];
}
function Slider({title, movieData }: SlidersProps) {
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [back, setBack] = useState(false);
    const [offset, setOffset] = useState(6);

    const handleResize = () => {
      if (window.outerWidth > 1400) {
        setOffset(6)
      } else if( window.outerWidth > 1100) {
        setOffset(5)
      } else if (window.outerWidth > 800) {
        setOffset(4)
      } else {
        setOffset(3)
      }
    }
    useEffect(()=> {
      window.addEventListener('resize', handleResize)
    }, [])

  const increaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setBack(false);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
    
  const decreaseIndex = () =>{
      if (movieData) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = movieData.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setBack(true);
        setIndex((prev) => (prev === 0 ? maxIndex :prev -1 ));
    }
  }

    return (
        <SliderWrap>
            <SliderTitle>
                {title}
            </SliderTitle>
            <AnimatePresence custom = {back} initial = {false} onExitComplete={toggleLeaving}>
                {/* 맨 처음에는 애니 작동 x */}
            <Row offset = {offset}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
                custom = {back}
                >
                    {movieData
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                        <Box
                        key={movie.id}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        variants={boxVariants}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        >
                          <Info
                          variants={infoVariants}
                          >
                            <InfoIcons>
                              <div>
                                <span>
                                <RiPlayCircleLine/>
                              </span>
                              <span>
                                <TbThumbUp/>
                              </span>
                              <span >
                                <TiHeartFullOutline/> 
                              </span>
                              </div>
                              <div>
                                <span>
                                  <RiInformationLine/>
                                </span>
                              </div>
                            </InfoIcons>
                            <h4>{movie.title}</h4>
                            <InfoDetail>
                              <span>
                                {movie.adult ? "청소년 관람 불가능" : "청소년 관람 가능"}
                              </span>
                              <span>
                                {movie.release_date}
                              </span>
                            </InfoDetail>
                          </Info>
                        </Box>
                    ))}
            </Row>
            <Prev onClick = {increaseIndex} whileHover = {{scale:1.2}} key = "increase"><BiArrowFromRight /></Prev>
            <Next onClick = {decreaseIndex} whileHover = {{scale:1.2}} key = "decrease"><BiArrowFromLeft/></Next>
            </AnimatePresence>
        </SliderWrap>
        
    )
}

export default Slider;