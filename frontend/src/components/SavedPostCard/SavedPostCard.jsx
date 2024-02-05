import React, { useEffect, useState } from "react";
import "./Card.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { POST_IMAGES_PATH, PROFILE_PATH } from "../../Utils/URL";
import { Dialog } from "primereact/dialog";
import defualtProfile from "../../assets/defualtProfile.jpg";

import { useLikePostMutation } from "../../redux/userSlices/userApiSlice.js";
import { useSelector } from "react-redux";

function SavedPostCard({ postDetails }) {
  const { userData } = useSelector((state) => state.auth);

  const [post, setPost] = useState();
  const [postOwner, setPostOwner] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const [likePost] = useLikePostMutation();

  const isVideo = post?.mediaItems[currentImageIndex].endsWith(".mp4"); // Assuming videos end with '.mp4'

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < post?.mediaItems.length - 1 ? prevIndex + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post?.mediaItems.length - 1
    );
  };

  useEffect(() => {
    setPost(postDetails.post[0]);
    setPostOwner(postDetails.postOwner[0]);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLikeClick = async () => {
    try {
      // Make the API request to like/unlike the post
      const response = await likePost({ postId: post._id });

      // Update the likes count based on the response
      setLikesCount(response.data.likes.count);

      // Toggle the isLiked state
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const isMobile = window.innerWidth <= 767;

  return (
    <div
      className={`col-md-6 ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card">
        <div className="card-body">
          <div
            className="ui-rect ui-bg-cover position-relative"
            style={{
              height: "300px", // Set the fixed height as needed
              overflow: "hidden", // Hide content that overflows the fixed height
              position: "relative", // Make sure the position is relative
              cursor: "pointer",
            }}
          >
            {isVideo ? (
              <video
                src={POST_IMAGES_PATH + post?.mediaItems[currentImageIndex]}
                autoPlay
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              ></video>
            ) : (
              <img
                src={POST_IMAGES_PATH + post?.mediaItems[currentImageIndex]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {post?.mediaItems.length > 1 && (
              <>
                <button onClick={prevImage} className="carousel-arrow left">
                  <i className="pi pi-chevron-left"></i>
                </button>
                <button onClick={nextImage} className="carousel-arrow right">
                  <i className="pi pi-chevron-right"></i>
                </button>
              </>
            )}

            {isHovered && (
              <div className="hover-info">
                <div className="info-content">
                  <div>
                    <Button
                      type="button"
                      label="View Post"
                      icon="pi pi-users"
                      outlined
                      onClick={() => setVisible(true)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        visible={visible}
        className="createPost"
        style={
          isMobile ? { height: "100%", width: "100%" } : { height: "100%" }
        }
        onHide={() => setVisible(false)}
      >
        <div className="card pb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div
                className="d-flex mb-3"
                style={{
                  cursor: "pointer",
                }}
              >
                <img
                  src={
                    postOwner?.profileImg
                      ? PROFILE_PATH + postOwner.profileImg
                      : defualtProfile
                  }
                  alt=""
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
                <div className="ml-2">
                  {/* Display user name or any other user-related information */}
                  <h5>
                    {postOwner?.firstName} {postOwner?.lastName}
                  </h5>
                  <p>{postOwner?.title}</p>
                </div>
              </div>
              <div style={{ cursor: "pointer" }}>
                <i className="pi pi-bookmark-fill"></i>
              </div>
            </div>

            <div
              className="ui-rect ui-bg-cover position-relative m-auto"
              style={{
                height: "350px", // Set the fixed height as needed
                maxWidth: "100%", // Set the fixed max-width as needed
                objectFit: "contain",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
              }}
            >
              {isVideo ? (
                <video
                  src={POST_IMAGES_PATH + post?.mediaItems[currentImageIndex]}
                  autoPlay
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                ></video>
              ) : (
                <img
                  src={POST_IMAGES_PATH + post?.mediaItems[currentImageIndex]}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
              {post?.mediaItems.length > 1 && (
                <>
                  <button onClick={prevImage} className="carousel-arrow left">
                    <i className="pi pi-chevron-left"></i>
                  </button>
                  <button onClick={nextImage} className="carousel-arrow right">
                    <i className="pi pi-chevron-right"></i>
                  </button>
                </>
              )}
            </div>
            <div className="d-flex"></div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default SavedPostCard;
