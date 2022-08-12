import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router";
import styled from "styled-components";
import { getSearchInfo, IGetSearchResult } from "../api";
import {RiPlayCircleLine, RiInformationLine} from 'react-icons/ri'
import {TbThumbUp} from 'react-icons/tb'
import {TiHeartFullOutline} from 'react-icons/ti'
import { useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";

const Wrapper = styled.div`
width: 100%;
margin: 67px 40px 0 40px;

`
const Loader = styled.div`
    height: 20vh;
    text-align:center;
    display: flex;
    justify-content: center ;
    align-items: center ;
`
const SearchTitle = styled.div`
  font-size: 30px;
  font-weight: bold ;
  margin: 10px 0 10px 0;
`

const Wrap = styled.div<{offset: number}>`
display: grid;
grid-template-columns: repeat(${(props) => props.offset},1fr);
gap:10px;
`
const SearchWrap = styled(motion.div)<{ bgphoto: string }>`
    margin: 15px 0 15px 0;
    justify-self: center;
    height: 200px;
    width: 260px;
    background-image: url(${(props) => props.bgphoto}) ;
    background-position: center center;
    background-size: cover;
    border-radius: 5px ;
`;
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
  font-size: 12px;
`
const InfoIcons = styled(InfoDetail)`
  font-size:25px;
  
  div:last-child {
    a{
        color: ${props=> props.theme.white.lighter};
    }
    cursor:pointer
  }
`

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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  
  const {data, isLoading} = useQuery<IGetSearchResult>(["searchMovie", keyword], ()=> getSearchInfo(keyword as string));

  const navigate = useNavigate();
  const onInfoClicked = (id: number) => {
    navigate(`${id}`);
  };

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

  return (
    <Wrapper>
      {isLoading? <Loader>Loading...</Loader> : 
      <>
      <SearchTitle>search results for {keyword}</SearchTitle>
      <AnimatePresence>
          <Wrap offset = {offset}>
          {data?.results.map(s=> 
            <SearchWrap
            key={s.id}
            bgphoto={makeImagePath(s.backdrop_path, "w500")}
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
                    <div onClick = {() => onInfoClicked(s.id)} >
                        <span>
                        <RiInformationLine/>
                        </span>
                    </div>
                  </InfoIcons>
                  <h4 style={{fontStyle: "italic"}}>{s.media_type === "movie" ? s.title : s.original_name}</h4>
                  <h5>{s.media_type}</h5>
                </Info>
            </SearchWrap>
          )}
        </Wrap>
      </AnimatePresence>
      
      </>
      
  }
    </Wrapper>
    
    
  );
}
export default Search;