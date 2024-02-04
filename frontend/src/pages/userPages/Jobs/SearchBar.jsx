import React, { useState } from "react";
import countrydata from "../../../Utils/Countries.js";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./JobListing.css";
import { useSelector } from "react-redux";

function SearchBar({ jobs, onSearch }) {
  const { userData } = useSelector((state) => state.auth);

  const [countries, setCountries] = useState(countrydata);

  const [locationQuery, setLocalionQuery] = useState("");
  const [locationSuggestion, setLocationSuggestion] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const showLocationSuggestions = (query) => {
    setLocalionQuery(query);

    const filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );

    if (query.length > 0) {
      setLocationSuggestion(filteredCountries);
    } else {
      setLocationSuggestion([]);
    }
  };

  const handleSuggestionClick = (countryName) => {
    setLocalionQuery(countryName);
    setLocationSuggestion([]);
  };

  const showSuggestions = (query) => {
    setSearchQuery(query);

    // Assuming `jobs` is an array of job objects
    const filteredJobs = jobs.filter((job) =>
      job.jobRole.toLowerCase().includes(query.toLowerCase())
    );

    if (query.length > 0) {
      setSuggestions(filteredJobs);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchClick = (jobRole) => {
    setSearchQuery(jobRole);
    setSuggestions([]);
  };

  // const searchControll = async()=>{
  //   try {
  //     const response = await userSearchJob({userId : userData._id,searchQuery,locationQuery}).unwrap()
  //     console.log(response)
  //   } catch (error) {

  //   }
  // }

  const searchControll = async () => {
    try {
      // Call the onSearch prop with searchQuery and locationQuery
      await onSearch(searchQuery, locationQuery);

      // Clear the search input fields
      setSearchQuery("");
      setLocalionQuery("");
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <>
      <div className="container" style={{ marginTop: "150px" }}>
        <div className="card mb-4 d-flex justify-content-center align-items-center">
          <div className="col-12">
            <div className="col-12 col-md-4 d-flex align-items-center position-relative">
              <i className="pi pi-search me-2"></i>
              <input
                type="text"
                className="search-control"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => showSuggestions(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 position-relative">
              <div className="d-flex align-items-center">
                <i className="pi pi-map-marker me-2"></i>
                <input
                  type="text"
                  placeholder="Location (search country)"
                  className="search-control"
                  value={locationQuery}
                  onChange={(e) => showLocationSuggestions(e.target.value)}
                />
              </div>
              {locationSuggestion.length > 0 && (
                <div
                  className="suggestion-box"
                  style={{
                    backgroundColor: "white",
                    padding: "10px",
                    width: "100%",
                    height: "200px",
                    overflowY: "auto",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 100,
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                >
                  {locationSuggestion.map((country) => (
                    <div
                      key={country.code}
                      className="suggestion-item m-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSuggestionClick(country.name)}
                    >
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-12 col-md-4 d-flex align-items-center justify-content-center">
              <Button
                label="find jobs"
                severity="primary"
                raised
                style={{ borderRadius: "10px", padding: "10px", width: "100%" }}
                onClick={() => searchControll()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
