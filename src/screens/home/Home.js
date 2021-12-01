import"./Home.css";
import Header from "../../common/header/Header"; 
import React from 'react';
import { GridList,GridListTile,GridListTileBar} from "@material-ui/core";
import {Card,Typography,CardContent} from "@material-ui/core";
import {FormControl,Input,InputLabel} from '@material-ui/core';
import {Select,MenuItem,Checkbox,TextField} from "@material-ui/core";
import {Button,ListItemText} from "@material-ui/core";
import { useState } from "react";
import { useEffect} from "react";
import { useHistory} from "react-router-dom";
import { MuiThemeProvider,createMuiTheme } from '@material-ui/core';

  
const theme = createMuiTheme({
    palette: {
      primary: {
       
        main: '#ff4400',
        light: '#757ce8',
      } 
  }});

export default function Home( props)
{
    
      


    const history = useHistory();
    const [upcomimgMoviesList, setUpcomingMoviesList] = useState([]);
    const [releasedMoviesList, settReleasedMoviesList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [artistsList, setArtistsList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState("");
    const [selectedgenre, setSelectedGenre] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectReleaseDateStart, setReleaseDateStart] = useState("");
    const [selectReleaseDateEnd, setReleaseDateEnd] = useState("");

    useEffect(() => {
        async function getUpcomingMoviesData() {
            const dumurl = props.baseUrl + "movies?status=PUBLISHED";
            const x = await fetch(dumurl).then((response) => response.json()).then((data) => {
                return data.movies;
            }).catch(error => {
                console.log(error)
            });
            setUpcomingMoviesList(Object.values(x));
        }
        getUpcomingMoviesData();

        async function getReleasedMoviesData() {
            const dumurl = props.baseUrl + "movies?status=RELEASED";
            const x = await fetch(dumurl).then((response) => response.json()).then((data) => {
                return data.movies;
            }).catch(error => {
                console.log(error)
            });
            settReleasedMoviesList(Object.values(x));
        }
        getReleasedMoviesData();

        async function getGenreData() {
            const dumurl = props.baseUrl + "genres";
            const x = await fetch(dumurl).then((response) => response.json()).then((data) => {
                return data.genres;
            }).catch(error => {
                console.log(error)
            });
            setGenreList(Object.values(x));
        }
        getGenreData();

        async function getArtistsData() {
            const dumurl = props.baseUrl + "artists";
            const x = await fetch(dumurl).then((response) => response.json()).then((data) => {
                return data.artists;
            }).catch(error => {
                console.log(error)
            });
            setArtistsList(Object.values(x));
        }
        getArtistsData();

    }, []);

   

    async function FiltersSend(request) {
        const x = await fetch(props.baseUrl + "movies" + encodeURI(request), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
        })
            .then((response) => response.json())
            .then((data) => data.movies);

        settReleasedMoviesList(Object.values(x));

    }

    function FilterHandler() {
        let filterString = "?status=RELEASED";

        if (selectedMovie !== "") {
            filterString += "&title=" + selectedMovie;
        }
        if (selectedgenre.length > 0) {
            filterString += "&genres=" + selectedgenre.toString();
        }
        if (selectedArtists.length > 0) {
            filterString += "&artists=" + selectedArtists.toString();
        }
        if (selectReleaseDateStart !== "") {
            filterString += "&start_date=" + selectReleaseDateStart;
        }
        if (selectReleaseDateEnd !== "") {
            filterString += "&end_date=" + selectReleaseDateEnd;
        }

        FiltersSend(filterString);

    };

    
    return(
        <div>
            <Header {...props} baseUrl={props.baseUrl} showBookShowButton="false" ></Header>
            <p className="upcoming">Upcoming Movies</p>
            {/* Grid view of upcoming movies*/}
            <div className="gridStyles">
                <GridList style={{
                    flexWrap: 'nowrap',
                    transform: 'translateZ(0)'
                }} cellHeight={250} cols={6}>
                    {upcomimgMoviesList.map((data) => {
                        return (
                            <GridListTile key={data.id} >
                                <img src={data.poster_url} alt={data.poster_url} ></img>
                                <GridListTileBar title={data.title} style={{ textAlign: "start" }}></GridListTileBar>
                            </GridListTile>)
                    })
                    }
                </GridList>
            </div>
            <div>
                {/* Filter card form*/}
                
                <Card className="filter">
                    <CardContent >
                        <FormControl >
                            <MuiThemeProvider theme={theme}>
                            <Typography style={{color : theme.palette.primary.light}}>
                                FIND MOVIES BY:
                            </Typography>
                            </MuiThemeProvider>
                        </FormControl>
                        <FormControl fullWidth={true}   >
                            <InputLabel htmlFor="Movie Name">Movie Name</InputLabel>
                            <Input id="Movie Name" placeholder="Movie Name" value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)} />
                        </FormControl>

                        {/* drop down of genres*/}
                    
                        <FormControl fullWidth={true}  >
                            <InputLabel htmlFor="Genres">Genres</InputLabel>
                            <Select multiple  renderValue={selected => selected.join(',')} labelid="Genres" label="Genres" value={selectedgenre} onChange={(e) => setSelectedGenre(e.target.value)} >
                                {genreList.map((data) => {
                                    return (<MenuItem key={data.id} value={data.genre}>
                                    <Checkbox checked={selectedgenre.indexOf(data.genre) > -1} />
                                    <ListItemText primary={data.genre} />
                                </MenuItem>)
                                })}
                            </Select>
                        </FormControl>



                        {/* drop down of artists*/}
                        <FormControl fullWidth={true}  >
                            <InputLabel htmlFor="Artists">Artists</InputLabel>
                            <Select multiple  renderValue={selected => selected.join(',')} labelid="Artists" label="Artists" value={selectedArtists} onChange={(e) => setSelectedArtists(e.target.value)}>
                                {artistsList.map((data) => {
                                    return ( <MenuItem  key={data.id} value={data.first_name + " " + data.last_name}>
                                    <Checkbox checked={selectedArtists.indexOf(data.first_name + " " + data.last_name) > -1} />
                                    <ListItemText primary={data.first_name + " " + data.last_name} />
                                </MenuItem>)
                                })}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth={true}>
                            <TextField autoFocus id="ReleaseDateStart" value={selectReleaseDateStart} onChange={(e) => setReleaseDateStart(e.target.value)} InputLabelProps={{ shrink: true }} label="Release Date Start" variant="standard" type="date" placeholder="dd-mm-yy" />
                        </FormControl>

                        <FormControl fullWidth={true}>
                            <TextField id="ReleaseDateEnd" value={selectReleaseDateEnd} onChange={(e) => setReleaseDateEnd(e.target.value)} InputLabelProps={{ shrink: true }} label="Release Date End" variant="standard" type="date" placeholder="dd-mm-yy" />
                        </FormControl>
                        <br/><br/>

                        <FormControl fullWidth={true}>       
                        <Button variant="contained" color="primary" onClick={FilterHandler}>Apply</Button>
                        </FormControl>
                    </CardContent>
                </Card>
                
            </div>
            {/* Grid view based of filter by user */}
            {releasedMoviesList !== undefined && <div className="flex-container">
                <div className="left">
                    <GridList style={{
                        flexWrap: 'wrap',
                        transform: 'translateZ(0)',
                        width: '100%',
                        cursor : "pointer"
                    }} cellHeight={350} cols={4}>
                        {releasedMoviesList.map((data) => {
                            return (
                                <GridListTile key={data.id} >
                                    <img src={data.poster_url} alt={data.poster_url} onClick={() => history.push(`/movie/${data.id}`)} ></img>
                                    <GridListTileBar title={data.title} subtitle={<span>Release Date: {new Date(data.release_date).toDateString()}</span>} style={{ textAlign: "start" }}></GridListTileBar>
                                </GridListTile>)
                        })
                        }
                    </GridList>
                </div>
            </div>}
        </div>
    )
}








