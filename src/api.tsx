import axios from "axios";

const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates : {
        maximum:string;
        minimum:string;
    },
    results : IMovie[];
    total_pages:number;
    total_results: number;
  }
export function getNowPlayingMovies() {
  return axios.get(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&page=2`).then(res => res.data);
}
export function getPopularMovies() {
    return axios.get(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(res => res.data)
}
export function getTopRatedMovies() {
    return axios.get(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(res => res.data)
}
export function getUpcomingMovies() {
    return axios.get(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(res => res.data)
}
export function getMovie(movieId:string) {
    return axios.get(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(res => res.data);
}


export function searchMovie(query:string){
    return axios.get(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`).then(res => res.data)
}