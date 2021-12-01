
import {Typography} from "@material-ui/core";
import YouTube from "react-youtube";
import React, { Fragment } from "react";
import "./Details.css";
import {Link} from 'react-router-dom';
import {useEffect,useState} from 'react';
import {GridList,GridListTile,GridListTileBar} from "@material-ui/core";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Header from "../../common/header/Header";


export default function details(props)
{


    const [movieInfo, setMovieInfo] = useState([])

    const [starIcons, setStarIcons] = useState([{
        id: 1,
        stateId: "star1",
        color: "black"
    },
    {
        id: 2,
        stateId: "star2",
        color: "black"
    },
    {
        id: 3,
        stateId: "star3",
        color: "black"
    },
    {
        id: 4,
        stateId: "star4",
        color: "black"
    },
    {
        id: 5,
        stateId: "star5",
        color: "black"
    }]);
                            

    useEffect(() => {
        async function getMoviesInfo() {
            const dumurl = props.baseUrl + "movies/" + props.match.params.id;
            const x = await fetch(dumurl).then((response) => response.json()).then((data) => {
                return data;
            }).catch(error => {
                console.log(error)
            });
            setMovieInfo(x);
        }
        getMoviesInfo();
    }, [])


    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
    };

    function _onReady(event) {
        event.target.pauseVideo();
    }

    function starClickHandler(id) {
        let starIconList = [];
        for (let star of starIcons) {
            let starNode = star;
            if (star.id <= id) {
                starNode.color = "yellow"
            }
            else {
                starNode.color = "black";

            }
            starIconList.push(starNode);
        }
        setStarIcons(starIconList);
    }

    function artistClickHandler(url) {
        window.location = url;
    }


    


return(
    <Fragment>
        <Header {...props} baseUrl={props.baseUrl} showBookShowButton="true" id={props.match.params.id}></Header>
        <div className="back">
                    <Typography>
                        <Link to="/">  &#60; Back to Home</Link>
                    </Typography>
                </div>
        <div className="details">
            <div className="flex-containerDetails">
                <div className="leftDetails">
                    <img src={movieInfo.poster_url} alt={movieInfo.title} />
                </div>

                <div className="middleDetails">
                    <div>
                        <Typography variant="headline" component="h2">{movieInfo.title} </Typography>
                    </div>
                    <br />
                    <div>
                        <Typography>
                            <span className="bold">Genres: </span> {movieInfo.genres !== undefined && movieInfo.genres.join()}
                        </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold">Duration:</span> {movieInfo.duration} </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold">Release Date:</span> {new Date(movieInfo.release_date).toDateString()} </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold"> Rating:</span> {movieInfo.rating}  </Typography>
                    </div>
                    <div className="marginTop16">
                        <Typography><span className="bold">Plot:</span> <a href={movieInfo.wiki_url}>(Wiki Link)</a> {movieInfo.storyline} </Typography>
                    </div>
                    <div className="trailerContainer">
                        <Typography>
                            <span className="bold">Trailer:</span>
                        </Typography>
                        <YouTube
                            videoId={movieInfo.trailer_url !== undefined && movieInfo.trailer_url.split("?v=")[1]}
                            opts={opts}
                            onReady={_onReady}
                        />
                    </div>
                </div>

                <div className="rightDetails">
                    <Typography>
                        <span className="bold">Rate this movie: </span>
                    </Typography>
                    {starIcons.map(star => (
                        <StarBorderIcon
                            className={star.color}
                            key={"star" + star.id}
                            onClick={() => starClickHandler(star.id)}
                        />
                    ))}

                    <div className="bold marginBottom16 marginTop16">
                        <Typography>
                            <span className="bold">Artists:</span>
                        </Typography>
                    </div>
                    {/* grid view of artists */}
                    <div className="paddingRight">
                        <GridList cellHeight={160} cols={2}>
                            {movieInfo.artists != null && movieInfo.artists.map(artist => (
                                <GridListTile
                                    className="gridTile"
                                    onClick={() => artistClickHandler(artist.wiki_url)}
                                    key={artist.id}>
                                    <img src={artist.profile_url} alt={artist.first_name + " " + artist.last_name} />
                                    <GridListTileBar
                                        title={artist.first_name + " " + artist.last_name}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>
        </div>
     </Fragment>

);
}




