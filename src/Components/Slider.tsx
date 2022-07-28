import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";
import {BiArrowFromRight, BiArrowFromLeft} from 'react-icons/bi'

const SliderWrap = styled.div`
  margin-bottom: 50px;
  height:250px;
`
const SliderTitle = styled.div`
  font-size:24px;
  margin-bottom: 10px;
  font-weight:bold ;
`
const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6,1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgphoto}) ;
  background-position: center center;
  background-size: cover;
  border-radius: 10px ;
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
  height:200px;
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

const offset = 6;
interface SlidersProps {
  title?: string;
  data: IMovie[];
}
function Slider({title, data }: SlidersProps) {
    console.log(data)
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [back, setBack] = useState(false);


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
        <SliderWrap>
            <SliderTitle>
                {title}
            </SliderTitle>
            <AnimatePresence custom = {back} initial = {false} onExitComplete={toggleLeaving}>
                {/* 맨 처음에는 애니 작동 x */}
            <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
                custom = {back}
                >
                    {data
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                        <Box
                        key={movie.id}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        />
                    ))}
            </Row>
            <Prev onClick = {increaseIndex} whileHover = {{scale:1.2}} key = "increase"><BiArrowFromRight/></Prev>
            <Next onClick = {decreaseIndex} whileHover = {{scale:1.2}} key = "decrease"><BiArrowFromLeft/></Next>
            </AnimatePresence>
        </SliderWrap>
        
    )
}

export default Slider;