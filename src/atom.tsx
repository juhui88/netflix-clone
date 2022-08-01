import { useQuery } from 'react-query';
import {atom} from 'recoil';
import { getNowPlayingMovies, IGetMoviesResult } from './api';

export const movieIdState = atom({
    key: "movieId",
    default: 0,
})
