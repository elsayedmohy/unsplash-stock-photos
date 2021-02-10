import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
import axios from "axios";
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const fetchingImages = () => {
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        setPhotos((oldphotos) => {
          if (query && page === 1) {
            return data.results;
          } else if (query) {
            return [...oldphotos, ...data.results];
          } else {
            return [...oldphotos, ...data];
          }
        });
      });
  };

  useEffect(() => {
    fetchingImages();
  }, [page, query]);

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        setPage((oldpage) => {
          return oldpage + 1;
        });
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <main>
      <div className="header">
        <h1>Descovery</h1>
      </div>
      <section className="search">
        <form className="search-form">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input"
            type="text"
            placeholder="Search"
          />
          <button onClick={handleSubmit} type="submit" className="submit-btn">
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => {
            return <Photo key={index} {...photo} />;
          })}
        </div>
      </section>
    </main>
  );
}

export default App;
