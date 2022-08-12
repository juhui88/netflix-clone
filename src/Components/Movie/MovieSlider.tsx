import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { IMovie } from "../../api";
import {BiArrowFromRight, BiArrowFromLeft} from 'react-icons/bi'
import MovieBox from "./MovieBox"

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
  height:200px;
  font-size:40px;
  color: white;
  overflow:none ;
`
const Next = styled(Prev)`
    right:0;

`

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  opacity: 0;
  z-index: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 40vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 1;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  height: 400px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigTitle = styled.h3`
`;

const BigOverview = styled.p`
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


interface SlidersProps {
  title?: string;
  data: IMovie[];
}
function MovieSlider({title, data }: SlidersProps) {
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
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.length;
      const maxIndex = Math.floor(totalMovies / offset);
      setBack(false);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
    
  const decreaseIndex = () =>{
      if (data) {
        if (leaving) return;
        toggleLeaving();
        const totalMovies = data.length - 1;
        const maxIndex = Math.floor(totalMovies / offset) - 1;
        setBack(true);
        setIndex((prev) => (prev === 0 ? maxIndex :prev -1 ));
    }
  }
  
    return (
      <>
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
                    {data
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                        <MovieBox
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
          </>
        
            

        
        
        
    )
}

export default MovieSlider;