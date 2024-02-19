import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/adminComponents/Navbar/adminNavbar";
import { useAdminLoadDashboardMutation } from "../../../redux/adminSlices/adminApiSlice";
import ChartUi from "../../../components/adminComponents/Chart";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../../components/Loader";

function AdminDashboard() {
  const [AdminLoadDashboard] = useAdminLoadDashboardMutation();
  const [details, setDetails] = useState();
  const [currentMonthDetails, setCurrentMonthDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const responseData = await AdminLoadDashboard().unwrap();
      setDetails(responseData);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const filteredDetails = {
        users: responseData.users.filter((user) => {
          const userDate = new Date(user.createdAt);
          return userDate.getMonth() === currentMonth;
        }),
        recruiters: responseData.recruiters.filter((recruiter) => {
          const recruiterDate = new Date(recruiter.createdAt);
          return recruiterDate.getMonth() === currentMonth;
        }),
        posts: responseData.posts.filter((post) => {
          const postDate = new Date(post.createdAt);
          return postDate.getMonth() === currentMonth;
        }),
        jobs: responseData.jobs.filter((job) => {
          const jobDate = new Date(job.createdAt);
          return jobDate.getMonth() === currentMonth;
        }),
      };
      setCurrentMonthDetails(filteredDetails);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("en-US", { month: "long" });

  return (
    <>
      <AdminNavbar />
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div className="container" style={{ marginTop: 150 }}>
          <div className="col-lg-12">
            <div className="card p-4">
              <div className="text-center mb-2">
                <h4>Total Overview</h4>
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <div className="card text-center">
                    <h5>Total Users</h5>
                    <p>{details?.users.length}</p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card text-center">
                    <h5>Total Recruiters</h5>
                    <p>{details?.recruiters.length}</p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card text-center">
                    <h5>Total Posts</h5>
                    <p>{details?.posts.length}</p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card text-center">
                    <h5>Total Jobs</h5>
                    <p>{details?.jobs.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card p-4">
              <div className="text-center mb-2">
                <h4>Current Month Overview ({monthName})</h4>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <ChartUi details={currentMonthDetails}></ChartUi>
                </div>
                <div className="col-lg-6 d-flex flex-column align-items-start justify-content-center">
                  <div className="row">
                    <div className="col-lg-6">
                      <div
                        className="card p-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#0088FE" }}
                      >
                        <p style={{ fontWeight: 500, color: "white" }}>
                          Number of Users: {currentMonthDetails?.users.length}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div
                        className="card p-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#00C49F" }}
                      >
                        <p style={{ fontWeight: 500, color: "white" }}>
                          Number of Recruiters:{" "}
                          {currentMonthDetails?.recruiters.length}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div
                        className="card p-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#FFBB28" }}
                      >
                        <p style={{ fontWeight: 500, color: "white" }}>
                          Number of Posts: {currentMonthDetails?.posts.length}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div
                        className="card p-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#FF8042" }}
                      >
                        <p style={{ fontWeight: 500, color: "white" }}>
                          Number of Jobs: {currentMonthDetails?.jobs.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
