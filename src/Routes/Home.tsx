import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "./utils";
import {AnimatePresence, motion} from 'framer-motion';
import { useState } from "react";

const Wrapper = styled.div`
    background: black;
    height: 113vh;
`
const Loader = styled.div`
    height: 20vh;
    text-align:center;
    display: flex;
    justify-content: center ;
    align-items: center ;
`
const Bannner = styled.div<{bgPhoto: string}>`
    height: 100vh;
    display: flex; 
    flex-direction: column ;
    justify-content: center ;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5)), url(${(props) => props.bgPhoto}) ;
    background-size: cover;
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
const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  font-size: 30px;
  text-align: center ;
  background-image: url(${(props) => props.bgPhoto}) ;
  background-position: center center;
  background-size: cover;
  &:first-child {
    transform-origin: center left ;
  }
  &:last-child {
    transform-origin: center right ;
  }
`;
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

const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};
const boxVariants = {
    normal: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      borderRadius : "10px",
      y: -80,
      transition: {
        delay: 0.5,
        duaration: 0.1,
        type: "tween",
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

const offset = 6;
function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);

    return (
        <Wrapper>{isLoading? <Loader>Loading...</Loader> : 
        <>
            <Bannner onClick = {incraseIndex} bgPhoto = {makeImagePath(data?.results[0].backdrop_path || "")}>
                <Title>{data?.results[0].title}</Title>
                <OverView>{data?.results[0].overview}</OverView>
            </Bannner>
            <Slider>
                <AnimatePresence initial = {false} onExitComplete={toggleLeaving}>
                    {/* 맨 처음에는 애니 작동 x */}
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 1 }}
                        key={index}
                        >
                         {data?.results
                            .slice(1)
                            .slice(offset * index, offset * index + offset)
                            .map((movie) => (
                                <Box
                                key={movie.id}
                                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                variants = {boxVariants}
                                whileHover = "hover"
                                initial = "normal"
                                >

                                    <Info variants={infoVariants}>
                                        {movie.title}
                                    </Info>
                                </Box>
                            ))}
                    </Row>
                </AnimatePresence>
            </Slider>
        </>
        }
        </Wrapper>
    );
}

export default Home;