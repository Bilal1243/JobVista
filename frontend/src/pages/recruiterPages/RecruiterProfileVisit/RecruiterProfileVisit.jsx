import React, { useEffect, useState } from "react";
import RecruiterNavbar from "../../../components/recruiterComponents/Navbar/RecruiterNavbar";
import "./RecruiterProfileVisit.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, Link } from "react-router-dom";
import {
  useRecruiterVisitProfileMutation,
  useRecruiterConnectMutation,
} from "../../../redux/recruiterSlices/recruiterApiSlices";
import defualtProfile from "../../../assets/defualtProfile.jpg";
import { PROFILE_PATH, POST_IMAGES_PATH } from "../../../Utils/URL";
import SkeletonUi from "../../../components/Skeleton";
import { Dialog } from "primereact/dialog";
import { MDBInput, MDBValidation } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import RecruiterPostCard from "../../../components/recruiterComponents/PostCard/RecruiterPostCard";
import { Chip } from "primereact/chip";

function RecruiterProfileVisit() {
  const { id } = useParams();
  const { recruiterData } = useSelector((state) => state.recruiterAuth);

  const [profileData, setProfileData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [skills, setSkills] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const [recruiterVisitProfile] = useRecruiterVisitProfileMutation();
  const [recruiterConnect] = useRecruiterConnectMutation();

  const fetchUserDetails = async () => {
    try {
      const response = await recruiterVisitProfile({
        userId: id,
        ogId: recruiterData._id,
      }).unwrap();
      console.log(response);
      setProfileData(response.user[0]);
      setFollowers(response.connections.length);
      setPosts(response.detailedPosts);
      response.skill && setSkills(response.skills.skills);
      setIsLoading(false);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  const connectUser = async (connectId) => {
    try {
      const requested = await recruiterConnect({
        connectId: connectId,
        userId: recruiterData._id,
      });
      setIsPending(true);
    } catch (error) {
      console.log(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const userName = profileData.firstName + profileData.lastName;
  const isMobile = window.innerWidth <= 767;

  const loadPosts = () => {
    fetchUserDetails();
  };

  const handleShowMore = () => {
    setShowAllPosts(!showAllPosts);
  };

  const JoinedDate = new Date(profileData?.createdAt);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = JoinedDate.toLocaleDateString(undefined, options);

  return (
    <>
      <RecruiterNavbar></RecruiterNavbar>

      <div className="container" style={{ marginTop: "140px" }}>
        {isLoading ? (
          <SkeletonUi></SkeletonUi>
        ) : (
          <>
            <div className="container theme-bg-white mb-4">
              <div className="media col-12 col-md-10 col-lg-8 col-xl-7 py-5 d-flex pl-5">
                <div className="d-block">
                  <img
                    src={
                      profileData.profileImg
                        ? PROFILE_PATH + profileData.profileImg
                        : defualtProfile
                    }
                    alt=""
                    className="ui-w-100 rounded-circle"
                  />
                </div>
                <div className="media-body ml-3">
                  <h4 className="font-weight-bold mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h4>
                  <h5 className="font-weight-bold mb-1 text-muted">
                    {profileData.title}
                  </h5>
                  <div className="d-flex align-items-center mb-2 mt-2">
                    <div className="text-muted">{profileData.location}</div>
                  </div>
                  {profileData.isConnected && (
                    <>
                      <div>
                        <Link onClick={() => setShowContact(true)}>
                          Contact Info
                        </Link>
                      </div>
                      <div>
                        <Link>{followers} Connections</Link>
                      </div>
                      <div>
                        <Button
                          type="button"
                          label="message"
                          icon="pi pi-comments"
                          style={{ width: "120px" }}
                          outlined
                        ></Button>
                      </div>
                    </>
                  )}
                  {profileData.isConnected || (
                    <div>
                      <Button
                        type="button"
                        label={
                          isPending || profileData.isRequested
                            ? "Pending"
                            : "Connect"
                        }
                        icon={
                          isPending || profileData.isRequested
                            ? "pi pi-clock"
                            : "pi pi-user-plus"
                        }
                        style={{ padding: "10px", width: "120px" }}
                        outlined
                        onClick={
                          isPending || profileData.isRequested
                            ? null
                            : () => connectUser(profileData._id)
                        }
                      ></Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="d-none d-md-block col-md-4 col-xl-3 left-wrapper">
                <div className="card rounded">
                  <div className="card-body">
                    <div>
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        Joined:
                      </label>
                      <p className="text-muted">{formattedDate}</p>
                    </div>
                    <div className="mt-3">
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        Lives:
                      </label>
                      <p className="text-muted">
                        {profileData.location
                          ? profileData.location
                          : "not added"}
                      </p>
                    </div>
                    <div className="mt-3">
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        Email:
                      </label>
                      <p className="text-muted">{profileData.email}</p>
                    </div>
                    <div className="mt-3">
                      <label className="tx-11 font-weight-bold mb-0 text-uppercase">
                        Industry:
                      </label>
                      <p className="text-muted">
                        {profileData?.industry[0]?.industryName
                          ? profileData.industry[0]?.industryName
                          : "not added"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                {posts.length > 0 ? (
                  <>
                    {showAllPosts ? (
                      <div className="card">
                        <div className="p-4 d-flex align-items-center w-100">
                          <h5>Activity</h5>
                        </div>
                        {posts.map((post, index) => (
                          <RecruiterPostCard
                            post={post}
                            key={index}
                            user={profileData}
                            loadPosts={loadPosts}
                          ></RecruiterPostCard>
                        ))}
                        <div className="mt-3">
                          <Button
                            label="Show less"
                            className="p-button-secondary"
                            onClick={handleShowMore}
                            outlined
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="card">
                        <div className="card-body">
                          <h5>Activity</h5>
                          {posts.slice(0, 2).map((post, index) => (
                            <div className="items d-flex p-2 mb-2">
                              {post.mediaItems.length > 0 && (
                                <div className="media">
                                  {post.mediaItems[0].endsWith(".mp4") ? (
                                    <video
                                      src={
                                        POST_IMAGES_PATH + post.mediaItems[0]
                                      }
                                      autoPlay
                                      style={{ width: "100px", height: "100%" }}
                                    ></video>
                                  ) : (
                                    <img
                                      src={
                                        POST_IMAGES_PATH + post.mediaItems[0]
                                      }
                                      style={{ width: "100px", height: "100%" }}
                                    ></img>
                                  )}
                                </div>
                              )}
                              <div className="contents ms-3">
                                <p style={{ margin: "0" }}>
                                  {post.description}
                                </p>
                                <p style={{ margin: "0" }}>
                                  {post.likes.count} likes
                                </p>
                                <p style={{ margin: "0" }}>
                                  {post.comments.length}{" "}
                                  {post.comments.length > 1
                                    ? "comments"
                                    : "comment"}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3">
                            <Button
                              label="Show more"
                              className="p-button-secondary"
                              onClick={handleShowMore}
                              outlined
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="card">
                      <div className="card-body">
                        <h4>Activity</h4>
                        <p>{followers} connections</p>
                        <p>no posts yet!</p>
                      </div>
                    </div>
                  </>
                )}
                {profileData.education && (
                  <div className="card">
                    <div className="card-body">
                      <div>
                        <h4>Education</h4>
                        <p>{profileData.education}</p>
                      </div>
                    </div>
                  </div>
                )}
                {skills && (
                  <>
                    {skills.length > 0 ? (
                      <div className="card">
                        <div className="card-body">
                          <h4>Skills</h4>
                          <div className="col-12" style={{ border: "none" }}>
                            {skills.map((skill, index) => (
                              <Chip
                                label={skill.skill}
                                key={index}
                                style={{ width: "100%", marginBottom: "10px" }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog
        header={userName}
        visible={showContact}
        style={isMobile ? { width: "90%" } : { width: "50%" }}
        onHide={() => setShowContact(false)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ flex: 1, maxWidth: "450px", margin: "0 15px" }}>
            <MDBValidation noValidate className="row g-3">
              <div className="col-md-12">
                <MDBInput value={profileData.email} readOnly />
              </div>
              {profileData.mobile && (
                <div className="col-md-12">
                  <MDBInput value={profileData.mobile} readOnly />
                </div>
              )}
            </MDBValidation>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default RecruiterProfileVisit;
