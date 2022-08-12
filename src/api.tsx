import axios from "axios";

const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    adult: boolean;
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    release_date:string;
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

 interface IGenre {
    id: number,
    name: string
}
export interface IGetMovieDetial {
    adult: boolean,
    genres : IGenre[],
    id : number,
    original_title : string,
    overview: string,
    backdrop_path: string,
    runtime: number,
    release_date:string,
    tagline: string,
}

export interface ITv{
    id: number;
    backdrop_path: string;
    original_name: string;
    overview: string;
    first_air_date:string;
}
export interface IGetTvsResult {
    results : ITv[];
    total_pages:number;
    total_results: number;
}

export interface IGetTvDetail {
    backdrop_path: string,
    first_air_date: string,
    genres: IGenre[],
    id: number,
    original_name: string,
    number_of_episodes: number,
    number_of_seasons: number,
    overview: string;
}

interface ISearch {
    media_type : string;

    id: number;
    backdrop_path: string;
    overview: string;

    original_name: string;
    first_air_date:string; // Tv

    adult: boolean;
    title: string;
    release_date:string; // Movie
}
export interface IGetSearchResult {
    results: ISearch[];
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
export function getMovie(movieId:number) {
    return axios.get(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(res => res.data);
}

export function getAiringTodayTv(){
    return axios.get(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(res=>res.data);
}
export function getOnTheAirTv(){
    return axios.get(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&page=2`).then(res=>res.data);
}
export function getPopularTv(){
    return axios.get(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(res=>res.data);
}
export function getTopRatedTv(){
    return axios.get(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(res=>res.data);
}
export function getTv(tvId:number){
    return axios.get(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then(res => res.data);
}

export function getSearchInfo(query:string){
    return axios.get(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`).then(res => res.data)
}

