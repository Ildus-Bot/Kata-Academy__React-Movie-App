class MovieServices {
  baseUrl = 'https://api.themoviedb.org/';
  apiPoster = 'https://image.tmdb.org/t/p/w500';
  bearerToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMGY3NjBlODU4ODA3MTcyNGFlOGY5OWY3OTJlM2JlNSIsIm5iZiI6MTcyNDg2NjI3My4zMjM2OCwic3ViIjoiNjZhZDA5MmE3OGU0ODYzNGQ1Y2Q4NDlkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.bV-KXaw9joJnu-o9xJ35PTKuvbdGk7U5Qv9GQEBqq-U';

  async createGuestSession() {
    const res = await fetch(`${this.baseUrl}3/authentication/guest_session/new`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('The guest session was not created');
    }

    const body = await res.json();

    localStorage.setItem('guestSessionId', body.guest_session_id);
  }

  hasGuestSession() {
    return localStorage.getItem('guestSessionId') ? true : false;
  }

  async getGenres() {
    const result = await fetch(`${this.baseUrl}3/genre/movie/list?language=en`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        accept: 'application/json',
      },
    });

    if (!result.ok) {
      throw new Error('Сouldn`t get genres');
    }

    return await result.json();
  }

  async addRating(id, vote) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.bearerToken}`,
      },
      body: `{"value":${vote}}`,
    };

    const res = await fetch(
      `${this.baseUrl}3/movie/${id}/rating?guest_session_id=${localStorage.getItem('guestSessionId')}`,
      options
    );

    if (!res.ok) {
      throw new Error('Сouldn`t add rating');
    }

    return await res.json();
  }

  async getRatedMovies(page) {
    const res = await fetch(
      `${this.baseUrl}3/guest_session/${localStorage.getItem('guestSessionId')}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.bearerToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Сouldn`t get rated movies');
    }

    return await res.json();
  }

  async getTopRated(page) {
    const res = await fetch(`${this.baseUrl}3/movie/top_rated?page=${page}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Сouldn`t get top rated movies');
    }

    return await res.json();
  }

  async getMovies(name, page) {
    if (!window.navigator.onLine) {
      throw new Error('The Internet is not connected');
    }

    const res = await fetch(`${this.baseUrl}3/search/movie?query=${name}&page=${page}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Сouldn't get ${name} movie`);
    }

    return await res.json();
  }

  async getPosterOfMovie(path) {
    const res = await fetch(`${this.apiPoster}${path}`);

    if (!res.ok) {
      throw new Error('Сouldn`t get poster');
    }

    const blob = await res.blob();

    return new Promise((onSuccess) => {
      try {
        const reader = new FileReader();
        reader.onload = function () {
          onSuccess(this.result);
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        throw new Error('Сouldn`t get poster');
      }
    });
  }
}

export default MovieServices;
