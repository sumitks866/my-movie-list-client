import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import './Feed.scss';
import ProfilePic from '../../assets/profile_icon.png';
import { API_URL } from '../../utils/Constants';
import NavBar from '../../Components/Navbar/Navbar';
import { AuthContext } from '../../state/Store';
import FeedCard from '../../Components/FeedCard/FeedCard';
import { NavLink } from 'react-router-dom';
import MovieSearchCard from '../../Components/MovieSearchCard/MovieSearchCard';

function Feed(props) {
  const auth = useContext(AuthContext);

  const inituser = {
    username: auth.state.username,
    firstname: '',
    lastname: '',
    movies_count: 0,
    followers_count: 0,
    following_count: 0,
    watch_later_count: 0,
  };

  const [user, setUser] = useState(inituser);
  const [feeds, setFeeds] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  useState(() => {
    console.log(auth);
    props.setLoginOpen(false);
    axios
      .get(`${API_URL}/account/feed`, { withCredentials: true })
      .then((res) => {
        setFeeds(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/account?username=${auth.state.username}`)
      .then((res) => {
        setUser(res.data[0]);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth.state]);

  useEffect(() => {
    axios
      .get(`${API_URL}/movie/trending`, { withCredentials: true })
      .then((res) => {
        console.log('trending', res.data);
        setTrendingMovies(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className='feed-wrapper'>
        <div className='trending-movies'>
          Trending Movies
          {trendingMovies &&
            trendingMovies.length > 0 &&
            trendingMovies.map((m) => (
              <MovieSearchCard
                movie={m}
                ratingModalOpen={ratingModalOpen}
                setRatingModalOpen={setRatingModalOpen}
              />
            ))}
        </div>

        <div className='feed'>
          {feeds && feeds.length > 0 ? (
            feeds.map((f) => <FeedCard {...f} />)
          ) : (
            <div className='flex-center'>
              Follow other users to get their movies seen in your feed.
            </div>
          )}
        </div>

        <div className='feed-details'>
          <div className='user-card'>
            <div className='profile-img'>
              {' '}
              <img src={ProfilePic} style={{ height: '3rem' }} />
            </div>
            <div className='user-info'>
              <span style={{ fontSize: '1.2em' }}>
                {user.firstname} {user.lastname}
              </span>
              <br />
              <span style={{ fontWeight: '300' }}>@{user.username}</span>
            </div>
          </div>

          <div className='user-options'>
            <div className='option'>
              <NavLink to={`/${user.username}`} className='link'>
                <i className='fas fa-film' /> Movies
              </NavLink>
            </div>
            <div className='option'>
              <NavLink to={`/${user.username}/watchlist`} className='link'>
                <i className='far fa-clock' /> Watchlist
              </NavLink>
            </div>
            <div className='option'>
              <NavLink to={`/${user.username}/followers`} className='link'>
                <i className='fas fa-users' /> Followers
              </NavLink>
            </div>
            <div className='option'>
              <NavLink to={`/${user.username}/following`} className='link'>
                <i className='fas fa-user-friends' /> Following
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Feed;
