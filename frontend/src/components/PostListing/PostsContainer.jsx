import React, { useEffect, useState } from "react";

import {
  useUserlistPostsMutation,
  useGetProfileMutation,
  useUserLogoutMutation,
  useCreatePostMutation,
} from "../../redux/userSlices/userApiSlice";
import { logout } from "../../redux/userSlices/userAuthSlice";

import PostCard from "./PostCard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Style.css";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_PATH } from "../../Utils/URL";
import defualtProfile from "../../assets/defualtProfile.jpg";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";

import { MDBValidation, MDBBtn, MDBTextArea, MDBInput } from "mdb-react-ui-kit";
import EmojiPicker from "emoji-picker-react";
import { Tooltip } from "primereact/tooltip";

import Loader from "../Loader";

function PostsContainer() {
  const { userData } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({});
  const [followers, setFollowers] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userlistPosts] = useUserlistPostsMutation();
  const [createPost] = useCreatePostMutation();
  const [getProfile] = useGetProfileMutation();
  const [userLogout] = useUserLogoutMutation();

  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleEmojiPickerToggle = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const handleEmojiSelected = (emoji) => {
    setDescription((prev) => prev + emoji.emoji);
    setEmojiPickerOpen(false);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const imagesArray = Array.from(files);
    setMediaItems(imagesArray);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const responseData = await getProfile({ userId: userData._id }).unwrap();
      console.log(responseData)
      setProfileData(responseData.data);
      setFollowers(responseData.followers[0].followersList.length);
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await userlistPosts().unwrap();
      setPosts(response);
      setIsloading(false);
    } catch (error) {
      console.log(error?.message || error?.data?.message);
    }
  };

  const submitForm = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", profileData._id);
      formData.append("description", description);
      mediaItems.forEach((image, index) => {
        formData.append(`mediaItems`, image);
      });

      const response = await createPost(formData);
      if (response.data.success) {
        setIsloading(false);
        setVisible(false);
        setDescription("");
        setMediaItems([]);
        fetchPosts();
      }
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  function redirectToEmail() {
    var email = "muhammedbilal6211@gmail.com";

    var mailtoLink = "mailto:" + email;

    window.location.href = mailtoLink;
  }

  const logoutUser = async () => {
    try {
      await userLogout().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  const loadPosts = () => {
    fetchPosts();
    fetchProfileData();
  };

  const header = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div class="media d-flex">
            <img
              src={
                profileData.profileImg
                  ? PROFILE_PATH + profileData.profileImg
                  : defualtProfile
              }
              class="d-block ui-w-40 rounded-circle"
              alt=""
            />
            <div class="media-body ml-2">{profileData.userName}</div>
          </div>
        </div>
      </div>
    );
  };

  const isMobile = window.innerWidth <= 767;

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <>
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-2 d-none d-md-block">
            <div className="card">
              <div className="card-body flex-column align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src={
                      userData.image !== null
                        ? PROFILE_PATH + userData.image
                        : defualtProfile
                    }
                    alt=""
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-center mt-2">
                  <h6>
                    {profileData.firstName} {profileData.lastName}
                  </h6>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ fontSize: "13px" }}
                >
                  <p>{profileData.title}</p>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ fontSize: "13px" }}
                >
                  <p>Connections : {followers}</p>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ fontSize: "13px" }}
                >
                  <Button
                    type="button"
                    label="edit profile"
                    icon="pi pi-pencil"
                    outlined
                    onClick={() => {
                      navigate("/profile");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <Button
              rounded
              severity="help"
              aria-label="Favorite"
              label="create post"
              icon="pi pi-plus"
              className="w-100 mt-2 mb-2"
              onClick={() => setVisible(true)}
            />
            <hr />
            {posts.length > 0 ? (
              <>
                {[...posts].reverse().map((post, index) => (
                  <div className="card mb-2">
                    <PostCard
                      post={post}
                      key={index}
                      loadPosts={loadPosts}
                    ></PostCard>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center">No Posts</p>
            )}
          </div>

          <div className="col-md-2  d-none d-md-block">
            <div class="card mb-3">
              <div class="card-body d-flex justify-content-center align-items-center">
                <Button
                  type="button"
                  label="logout"
                  icon="pi pi-sign-out"
                  outlined
                  onClick={() => {
                    logoutUser();
                  }}
                />
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h6 class="card-title font-weight-bold">Support</h6>
                <p class="card-text">
                  Get fast, free help from our friendly assistants.
                </p>
                <Button
                  label="contact us"
                  rounded
                  severity="help"
                  aria-label="Favorite"
                  onClick={() => redirectToEmail()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        header={header}
        visible={visible}
        className="createPost"
        onHide={() => setVisible(false)}
        style={
          isMobile
            ? { width: "100%", height: "90%" }
            : { width: "60%", height: "90%" }
        }
      >
        <div
          style={{
            flex: 1,
            maxWidth: "100%",
            height: "100%",
            margin: "0 10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <MDBValidation
            noValidate
            onSubmit={submitForm}
            encType="multipart/form-data"
          >
            <div className="col-md-12">
              <MDBTextArea
                label="What do you want to talk about?"
                placeholder="What do you want to talk about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="description mt-2"
              ></MDBTextArea>

              <MDBInput
                type="file"
                accept=".jpg, .jpeg, .png, .avif, .mp4, .mov, .avi, .mkv"
                onChange={handleFileChange}
                required
                multiple
                className="mediaBtn"
              />
              <Tooltip target=".mediaBtn" content="add media" position="top" />

              <p
                className="emojiBtn"
                style={{
                  fontSize: "40px",
                  cursor: "pointer",
                }}
                onClick={handleEmojiPickerToggle}
              >
                ☺
              </p>

              {/* EmojiPicker button/icon */}
              <div className="emoji d-flex">
                {isEmojiPickerOpen && (
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelected}
                    className="emojiPicker"
                    style={{ zIndex: 2 }} // Set a higher z-index for the EmojiPicker
                  />
                )}
              </div>
            </div>

            <div className="col-12 d-flex justify-content-end ps-5 pe-3">
              <MDBBtn
                style={{
                  width: "100px",
                  borderRadius: "50px",
                  backgroundColor: "#387F8E",
                  color: "white",
                }}
                className="mt-2"
                disabled={description.length === 0}
                type="submit"
              >
                post
              </MDBBtn>
            </div>
          </MDBValidation>
        </div>
      </Dialog>
    </>
  );
}

export default PostsContainer;
