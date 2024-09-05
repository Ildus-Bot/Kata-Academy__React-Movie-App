import React from 'react';
import { Pagination } from 'antd';

import './normalize.css';
import './App.css';

import MovieList from '../MovieList';
import Search from '../Search';
import Tabs from '../Tabs';
import MovieServices from '../../services/MovieServices';
import ErrorOnAllWindow from '../ErrorOnAllWindow';
import { GenresProvider } from '../GenresContext';

export default class App extends React.Component {
  MovieServices = new MovieServices();

  state = {
    movieName: null,
    page: 1,
    totalPages: null,
    isRatedButtonPressed: false,
    genres: null,
    isError: false,
  };

  componentDidMount() {
    this.MovieServices.getGenres()
      .then((result) => {
        this.setStateGenres(result.genres);
      })
      .catch((error) => {
        this.setState({
          isError: true,
        });
      });

    if (this.MovieServices.hasGuestSession()) {
      return;
    }

    this.MovieServices.createGuestSession().catch((error) => {
      throw new Error('Could not create guest session', error);
    });
  }

  setStateGenres = (genres) => {
    this.setState({
      genres,
    });
  };

  handleSetMovieName = (movieName) => {
    this.setState({
      movieName,
      page: 1,
    });
  };

  handleSetTotalPages = (totalPages) => {
    this.setState({
      totalPages,
    });
  };

  handleSetPage = (page) => {
    this.setState({
      page,
    });
  };

  handleChangeState = (booleanValue) => {
    if (booleanValue) {
      this.setState({
        isRatedButtonPressed: booleanValue,
        page: 1,
        movieName: null,
      });
    } else {
      this.setState({
        isRatedButtonPressed: booleanValue,
        page: 1,
        movieName: undefined,
        totalPages: null,
      });
    }
  };

  render() {
    const { movieName, page, totalPages, isRatedButtonPressed, isError, genres } = this.state;

    if (isError) {
      return <ErrorOnAllWindow />;
    }

    const providerOptions = {
      genres,
      movieServices: this.MovieServices,
    };

    return (
      <div className="wrapper">
        <div className="main-page">
          <GenresProvider value={providerOptions}>
            <Tabs onChangeState={this.handleChangeState} />
            {!isRatedButtonPressed ? <Search onSetMovieName={this.handleSetMovieName} /> : null}
            <MovieList
              rated={isRatedButtonPressed}
              movieName={movieName}
              onSetTotalPages={this.handleSetTotalPages}
              page={page}
            />
            <Pagination
              align="center"
              pageSize={20}
              onChange={(page) => {
                this.handleSetPage(page);
              }}
              current={page}
              showSizeChanger={false}
              total={totalPages}
            />
          </GenresProvider>
        </div>
      </div>
    );
  }
}
