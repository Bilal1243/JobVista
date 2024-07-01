import React, { useState, useEffect } from "react";
import "./PostCard.css";
import { POST_IMAGES_PATH } from "../../Utils/URL";
import defualtProfile from "../../assets/defualtProfile.jpg";
import TimeAgo from "../../Utils/TimeAgo.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import {
  useLikePostMutation,
  usePostCommentMutation,
  useDeleteCommentMutation,
  useUserSavePostMutation,
  useUserUnsavePostMutation,
} from "../../redux/userSlices/userApiSlice.js";
import InputEmoji from "react-input-emoji";
import { PROFILE_PATH } from "../../Utils/URL.js";
import { useNavigate } from "react-router-dom";

function PostCard({ user, post, loadPosts }) {
  const { userData } = useSelector((state) => state.auth);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState("");
  const [displayedComments, setDisplayedComments] = useState(2);
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const [likePost] = useLikePostMutation();
  const [postComment] = usePostCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [userSavePost] = useUserSavePostMutation();
  const [userUnsavePost] = useUserUnsavePostMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (post.likes.users.includes(userData._id)) {
      setIsLiked(true);
    }
    setLikesCount(post.likes.count);
  }, [post]);

  const handleShowMore = () => {
    setDisplayedComments(post.comments.length);
    setCommentsExpanded(true);
  };

  const handleShowLess = () => {
    setDisplayedComments(2);
    setCommentsExpanded(false);
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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < post.mediaItems.length - 1 ? prevIndex + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post.mediaItems.length - 1
    );
  };

  const isVideo =
    post.mediaItems.length > 0 &&
    post.mediaItems[currentImageIndex].endsWith(".mp4"); // Assuming videos end with '.mp4'

  const addComment = async () => {
    try {
      const responseData = await postComment({
        postId: post._id,
        ownerId: userData._id,
        content: comment,
      }).unwrap();
      setComment("");
      loadPosts();
    } catch (error) {}
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const deleted = await deleteComment({ commentId: commentId });
      loadPosts();
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const savepost = async () => {
    try {
      if (post.isSaved) {
        const response = await userUnsavePost({
          userId: userData._id,
          postId: post._id,
        }).unwrap();
        loadPosts();
      } else {
        const response = await userSavePost({
          userId: userData._id,
          postId: post._id,
        }).unwrap();
        loadPosts();
      }
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const isMobile = window.innerWidth <= 767;

  const isCommentOwner = (commentOwnerId) => {
    return userData._id === commentOwnerId;
  };

  return (
    <div className="card">
      <div class="card-body">
        <div class="border-top-0 border-right-0 border-bottom-0 ui-bordered pl-3 mt-2 mb-2">
          <div class="media mb-3 d-flex  justify-content-between">
            <div className="media mb-1 d-flex">
              <img
                src={
                  user.profileImg
                    ? PROFILE_PATH + user.profileImg
                    : defualtProfile
                }
                class="d-block ui-w-40 rounded-circle"
                alt=""
              />
              <div class="media-body ml-2">
                {user.firstName + " " + user.lastName}
                <div>
                  <TimeAgo createdAt={post.createdAt}></TimeAgo>
                </div>
              </div>
            </div>
            <div>
              {post.isSaved ? (
                <span
                  className="pi pi-bookmark-fill"
                  style={{
                    cursor: "pointer",
                    fontSize: "17px",
                  }}
                  onClick={() => savepost()}
                ></span>
              ) : (
                <span
                  className="pi pi-bookmark"
                  style={{
                    cursor: "pointer",
                    fontSize: "17px",
                  }}
                  onClick={() => {
                    savepost();
                  }}
                ></span>
              )}
            </div>
          </div>
          <p style={{ whiteSpace: "pre-line" }}>{post.description}</p>
          {post.mediaItems.length > 0 && (
            <div className="ui-rect ui-bg-cover position-relative">
              {isVideo ? (
                <video
                  src={POST_IMAGES_PATH + post.mediaItems[currentImageIndex]}
                  autoPlay
                  controls
                  style={{ width: "100%", height: "100%" }}
                ></video>
              ) : (
                <img
                  src={POST_IMAGES_PATH + post.mediaItems[currentImageIndex]}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              )}
              {post.mediaItems.length > 1 && (
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
          )}
        </div>
        <div class="card-footer">
          <div className="d-inline-block text-muted ml-2">
            <small
              className="align-middle"
              style={{ cursor: "pointer" }}
              onClick={handleLikeClick}
            >
              <strong>{likesCount}</strong>{" "}
              <i
                className={`pi ${
                  isLiked ? "pi-thumbs-up-fill" : "pi-thumbs-up"
                }`}
              ></i>
            </small>
          </div>
          <div className="d-inline-block text-muted ml-4">
            <small class="align-middle" style={{ cursor: "pointer" }}>
              <strong>{post.comments.length}</strong>{" "}
              <i className="pi pi-comments"></i>
            </small>
          </div>
          <div className="mt-2">
            <div className="col-12 d-flex flex-row align-items-center justify-content-start">
              <img
                src={
                  userData.image !== null
                    ? PROFILE_PATH + userData.image
                    : defualtProfile
                }
                alt="avatar 1"
                style={{ width: "35px", height: "100%", borderRadius: "50%" }}
              />
              <InputEmoji
                value={comment}
                onChange={setComment}
                placeholder="Add a Comment"
              />
            </div>
            {comment && (
              <button className="post-button" onClick={addComment}>
                Post
              </button>
            )}
          </div>
          <div class="comments-section">
            {post.comments
              .slice(0, displayedComments)
              .reverse()
              .map((comment, index) => (
                <div className="col-12 d-flex flex-row justify-content-start mb-3">
                  <img
                    src={
                      comment.ownerDetails[0].profileImg
                        ? PROFILE_PATH + comment.ownerDetails[0].profileImg
                        : defualtProfile
                    }
                    alt="avatar 1"
                    style={{
                      width: "35px",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    className="p-2 ms-2"
                    style={{
                      width: "100%",
                      borderRadius: "15px",
                      backgroundColor: "rgba(57, 192, 237,.2)",
                    }}
                  >
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>
                          {comment.ownerDetails[0].firstName +
                            " " +
                            comment.ownerDetails[0].lastName}
                        </strong>
                        {isCommentOwner(comment.ownerDetails[0]._id) && (
                          <span
                            className="pi pi-trash"
                            style={{
                              cursor: "pointer",
                              fontSize: "10px",
                              color: "red",
                              marginLeft: "auto",
                            }}
                            onClick={() => handleDeleteComment(comment._id)}
                          ></span>
                        )}
                      </div>
                      <small
                        className="text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        {comment.ownerDetails[0].title}
                      </small>
                      <p className="mt-2">{comment.content}</p>
                    </div>
                    {/* Add a delete icon here */}
                  </div>
                </div>
              ))}
            {post.comments.length > 2 && (
              <small
                className="show-more-button"
                onClick={commentsExpanded ? handleShowLess : handleShowMore}
              >
                {commentsExpanded ? "Show Less" : "Show More"}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
