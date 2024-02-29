import React, { useState, useEffect } from "react";
import "./Profile.css";
import "./Actions.css";
import { Button } from "primereact/button";
import "bootstrap/dist/css/bootstrap.min.css";
import defualtProfile from "../../../assets/defualtProfile.jpg";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";

import { MDBValidation, MDBBtn, MDBTextArea, MDBInput } from "mdb-react-ui-kit";
import EmojiPicker from "emoji-picker-react";
import { Tooltip } from "primereact/tooltip";

import {
  useCreatePostMutation,
  useGetMyPostsMutation,
} from "../../../redux/userSlices/userApiSlice";

import Loader from "../../../components/Loader.jsx";
import { useSelector } from "react-redux";
import PostCard from "./PostCard.jsx";
import { PROFILE_PATH } from "../../../Utils/URL.js";

function Posts({ activeTab }) {
  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [mediaItems, setMediaItems] = useState([]);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isLoading, setIsloading] = useState(true);

  const [profileData, setProfileData] = useState([]);
  const [posts, setPosts] = useState([]);

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

  const [getMyPosts] = useGetMyPostsMutation();

  useEffect(() => {
    fetchPostData();
  }, []);

  const fetchPostData = async () => {
    try {
      const responseData = await getMyPosts();
      setProfileData(responseData.data.data[0]);
      setPosts(responseData.data.detailedPosts);
      setIsloading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
  };

  const [createPost] = useCreatePostMutation();

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
        fetchPostData();
      }
    } catch (error) {
      console.log(error?.data?.message || error?.data);
    }
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

  if (isLoading) {
    return <Loader></Loader>;
  }

  const forPostCard = () => {
    fetchPostData();
  };

  const isMobile = window.innerWidth <= 767;

  return (
    <>
      <div
        className={`tab-pane ${activeTab === "profile" ? "active" : ""}`}
        id="profile"
      >
        <div className="d-flex justify-content-end mb-2">
          <Button
            onClick={() => setVisible(true)}
            style={{ borderRadius: "10px" }}
          >
            Create Post
          </Button>
        </div>
        {posts.length > 0 ? (
          <div className="card">
            {posts
              .slice()
              .reverse()
              .map((post, index) => (
                <PostCard key={index} post={post} forPostCard={forPostCard} />
              ))}
          </div>
        ) : (
          <>
            <div className="card-body">
              <div className=" d-flex align-items-center justify-content-center">
                <h5>No Posts Yet</h5>
              </div>
            </div>
          </>
        )}
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

export default Posts;
