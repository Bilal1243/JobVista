import React, { useEffect, useState } from "react";
import "./Profile.css";
import "./Actions.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";

import Loader from "../../../components/Loader.jsx";
import { useUserlistSavedPostsMutation } from "../../../redux/userSlices/userApiSlice";
import SavedPostCard from "../../../components/SavedPostCard/SavedPostCard.jsx";

function SavedPosts({ activeTab }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  const [userlistSavedPosts] = useUserlistSavedPostsMutation();

  const fetchPosts = async () => {
    try {
      const response = await userlistSavedPosts().unwrap();
      setPosts(response);
      setIsloading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadPosts = () => {
    setIsloading(true)
    fetchPosts();
  };

  return (
    <>
      <div
        className={`tab-pane ${activeTab === "saved-posts" ? "active" : ""}`}
        id="saved-posts"
      >
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <>
            {posts.length > 0 ? (
              <div className="row">
                {posts.map((postDetails, index) => (
                  <div className="card">
                    <SavedPostCard
                      postDetails={postDetails}
                      key={index}
                      loadPosts={loadPosts}
                    ></SavedPostCard>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No Saved Posts</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SavedPosts;
