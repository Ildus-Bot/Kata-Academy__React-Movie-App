import React from 'react';
import { format } from 'date-fns';
import { Rate, Spin } from 'antd';

import ErrorOnAllMovieCard from '../ErrorOnAllMovieCard';
import { GenresConsumer } from '../GenresContext';
import './Movie.css';
import noPhoto from '../../assets/images/not-photo.webp';

export default class Movie extends React.Component {
  state = {
    image: null,
    hasError: false,
    errorMessage: '',
  };

  componentDidMount() {
    const { poster } = this.props;

    if (!poster) {
      this.setState({
        image: 'uknown',
      });

      return;
    }

    this.props.movieServices
      .getPosterOfMovie(poster)
      .then((image) => {
        this.setState({
          image,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  createGenresElements = (genres, genreIds) => {
    return genreIds.map((genreId) => {
      const genre = genres.filter((genre) => {
        return genre.id === genreId;
      });

      return (
        <div key={genreId} className="genres">
          <p className="genres__type">{genre[0].name}</p>
        </div>
      );
    });
  };

  determineСolorOfRating = (vote) => {
    let voteColor;

    if (vote < 3) {
      voteColor = 'terrible';
    } else if (3 <= vote && vote < 5) {
      voteColor = 'bad';
    } else if (5 <= vote && vote < 7) {
      voteColor = 'normal';
    } else {
      voteColor = 'good';
    }

    return voteColor;
  };

  handleChange = async (id, value) => {
    await this.props.movieServices.addRating(id, value).catch((error) => {
      this.handleError(error);
    });
    this.props.onSetIsUserClickOnRate();
  };

  handleError = (e) => {
    this.setState({
      hasError: true,
      errorMessage: e.message,
    });
  };

  render() {
    let {
      title = 'unknown',
      release = 'unknown',
      description = 'unknown',
      voteAverage,
      genreIds,
      id,
      rating,
    } = this.props;

    let { hasError, errorMessage } = this.state;

    if (hasError) {
      return <ErrorOnAllMovieCard textOfError={errorMessage} />;
    }

    const vote = Math.round(voteAverage * 10) / 10;
    let voteCircleColor = this.determineСolorOfRating(vote);

    if (release) {
      const year = release[0] + release[1] + release[2] + release[3];
      const month = release[5] + release[6];
      const day = release[8] + release[9];

      release = format(new Date(year, month, day), 'PP');
    }

    return (
      <div className="movie">
        {this.state.image !== 'uknown' && this.state.image && (
          <img className="movie__image" src={this.state.image} alt="Image of movie" />
        )}
        {this.state.image === 'uknown' && (
          <div className="movie__uknown">
            <img className="movie__uknown-photo" src={noPhoto} alt="No photo" />
          </div>
        )}
        {this.state.image === null && (
          <div className="movie__spin">
            <Spin />
          </div>
        )}

        <div className="movie__description">
          <h2 className="movie__name">{title}</h2>
          <p className="movie__release-date">{release}</p>
          <div className="movie__genres">
            <GenresConsumer>
              {({ genres }) => {
                if (genreIds.length !== 0) {
                  return this.createGenresElements(genres, genreIds);
                }

                return;
              }}
            </GenresConsumer>
          </div>
          <p className="movie__description-text">{description}</p>
          <Rate
            allowHalf
            className="rating-of-stars"
            style={{ fontSize: '15px' }}
            onChange={(value) => this.handleChange(id, value)}
            defaultValue={rating ? rating : null}
            count={10}
          />
          <div className={voteCircleColor + ' round-rating'}>{vote}</div>
        </div>
      </div>
    );
  }
}
