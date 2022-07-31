import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { IMovie } from "../api";
import {BiArrowFromRight, BiArrowFromLeft} from 'react-icons/bi'
import { useQuery } from "react-query";
import Box from "./Box"

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
                        id = {movie.id}
                        backdropPath = {movie.backdrop_path}
                        title = {movie.title}
                        adult = {movie.adult}
                        releaseDate = {movie.release_date}/>
                    ))}
            </Row>
            <Prev onClick = {increaseIndex} whileHover = {{scale:1.2}} key = "increase"><BiArrowFromRight /></Prev>
            <Next onClick = {decreaseIndex} whileHover = {{scale:1.2}} key = "decrease"><BiArrowFromLeft/></Next>
            </AnimatePresence>

        </SliderWrap>
        
    )
}

export default Slider;