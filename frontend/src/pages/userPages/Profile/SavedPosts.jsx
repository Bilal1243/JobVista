import React, { useEffect, useState } from "react";
import "./Profile.css";
import "./Actions.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";

import Loader from "../../../components/Loader.jsx";
import { useUserlistSavedPostsMutation } from "../../../redux/userSlices/userApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SavedPostCard from "../../../components/SavedPostCard/SavedPostCard.jsx";

function SavedPosts({ activeTab }) {
  const [posts, setPosts] = useState([]);

  const [userlistSavedPosts] = useUserlistSavedPostsMutation();

  const fetchPosts = async () => {
    try {
      const response = await userlistSavedPosts().unwrap();
      setPosts(response);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div
        className={`tab-pane ${activeTab === "saved-posts" ? "active" : ""}`}
        id="saved-posts"
      >
        <div className="row">
          {posts.map((postDetails, index) => (
            <SavedPostCard
              postDetails={postDetails}
              key={index}
            ></SavedPostCard>
          ))}
        </div>
      </div>
    </>
  );
}

export default SavedPosts;
