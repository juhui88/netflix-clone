import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../../utils";
import {RiPlayCircleLine, RiInformationLine} from 'react-icons/ri'
import {TbThumbUp} from 'react-icons/tb'
import {TiHeartFullOutline} from 'react-icons/ti'
import { useNavigate } from "react-router-dom";
import {movieIdState, TvIdState } from "../../atom";
import { useRecoilState } from "recoil";


const Wrap = styled(motion.div)<{ bgphoto: string }>`
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

interface IBox {
    id : number,
    backdropPath : string,
    title: string,
    firstAirDate: string
}
function TvBox({id, backdropPath, title, firstAirDate} : IBox) {
    const [tvId,setTvId] = useRecoilState(TvIdState)
    
    const navigate = useNavigate();
    const onInfoClicked = (tvId: number) => {
        navigate(`${tvId}`);
        setTvId(tvId);
      };
    return (
      <AnimatePresence>
        <Wrap
            key={id}
            bgphoto={makeImagePath(backdropPath, "w500")}
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
                    <div onClick = {() => onInfoClicked(id)} >
                        <span>
                        <RiInformationLine/>
                        </span>
                    </div>
                </InfoIcons>
                <h4 style={{fontStyle: "italic"}}>{title}</h4>
                <InfoDetail>
                    <span>
                    {firstAirDate.slice(0,4)}
                    </span>
                </InfoDetail>
                </Info>
            </Wrap>
      </AnimatePresence>
        

    )
}

export default TvBox;