import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/adminComponents/Navbar/adminNavbar";
import {
  useAdminAddSkillMutation,
  useAdminGetSkillsMutation,
  useAdminEditSkillMutation,
  useAdminListSkillMutation,
  useAdminUnlistSkillMutation,
} from "../../../redux/adminSlices/adminApiSlice";
import { toast } from "react-toastify";
import "./Skills.css";
import { Table, Form as BootstrapForm } from "react-bootstrap";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.css";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [visible, setVisible] = useState(false);
  const [skill, setSkill] = useState("");

  const [skillId, SetskillId] = useState(null);
  const [editedSkill, setEditedSkill] = useState("");

  const [editVisible, setEditVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [AdminGetSkills] = useAdminGetSkillsMutation();
  const [AdminAddSkill] = useAdminAddSkillMutation();
  const [AdminEditSkill] = useAdminEditSkillMutation();
  const [AdminListSkill] = useAdminListSkillMutation();
  const [AdminUnlistSkill] = useAdminUnlistSkillMutation();

  const fetchSkills = async () => {
    try {
      const responsefromapi = await AdminGetSkills();
      setSkills(responsefromapi.data.data);
    } catch (error) {
      toast.error(error?.data || error?.data?.message);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleEdit = async () => {
    try {
      const response = await AdminEditSkill({
        skillId: skillId,
        skill: editedSkill,
      }).unwrap();
      if (response.success) {
        toast.success("edited successfully");
        setEditedSkill("");
        setIndustryId("");
        setEditVisible(false);
      } else {
        toast.error("failed to edit skill");
        setEditedSkill("");
        setEditVisible(false);
      }
    } catch (error) {
      toast.error(error?.data || error?.data?.message);
    }
  };

  const handleListing = async (skillId) => {
    try {
      const responseData = await AdminListSkill({ skillId }).unwrap();

      if (responseData.success) {
        fetchSkills();
        toast.success("Listed Successfully");
      }
    } catch (error) {
      toast.error(error?.data || error?.data?.message);
    }
  };

  const handleUnlisting = async (skillId) => {
    try {
      const responseData = await AdminUnlistSkill({ skillId }).unwrap();

      if (responseData.success) {
        fetchSkills();
        toast.success("UnListed Successfully");
      }
    } catch (error) {
      toast.error(error?.data || error?.data?.message);
    }
  };

  const addSkill = async () => {
    try {
      const response = await AdminAddSkill({ skill }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setSkill("");
        setVisible(false);
      } else {
        toast.success(response.message);
      }
      fetchSkills();
    } catch (error) {
      toast.error(error?.message || error?.data?.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ marginTop: "100px" }}>
        <h3 className="Heading">Skills</h3>
        <Button
          label="Add"
          severity="primary"
          raised
          style={{ marginLeft: "8%" }}
          onClick={() => setVisible(true)}
        />
      </div>
      <div className="Table">
        <div className="d-flex align-items-center justify-content-end">
          <BootstrapForm>
            <BootstrapForm.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
            >
              <BootstrapForm.Control
                style={{ width: "200px" }}
                type="text"
                placeholder="Enter skill........"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </div>

        {skills.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Industry</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills &&
                [...skills]
                  .reverse()
                  .filter((skill) =>
                    skill.skill.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((filteredSkill, index) => (
                    <tr key={index}>
                      <td>{filteredSkill.skill}</td>
                      <td className="d-flex align-items-center justify-content-end">
                        <Button
                          label="Edit"
                          severity="primary"
                          raised
                          className="ms-5"
                          onClick={() => {
                            setEditVisible(true),
                              setEditedSkill(filteredSkill.skill),
                              SetskillId(filteredSkill._id);
                          }}
                        />
                        <Button
                          label={filteredSkill.isListed ? "Unlist" : "List"}
                          severity={
                            filteredSkill.isListed ? "danger" : "success"
                          }
                          raised
                          style={{ marginLeft: "10px" }}
                          onClick={() => {
                            if (filteredSkill.isListed) {
                              handleUnlisting(filteredSkill._id);
                            } else {
                              handleListing(filteredSkill._id);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        ) : (
          <h4 className="text-center">No Skills added</h4>
        )}

        <Dialog
          header="Add Skills"
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ flex: 1, maxWidth: "450px", margin: "0 15px" }}>
              <MDBCard alignment="center" className="mb-5">
                <MDBIcon icon="fas fa-industry" className="fa-3x " />

                <MDBCardBody>
                  <MDBValidation
                    noValidate
                    className="row g-3"
                    onSubmit={addSkill}
                  >
                    <div className="col-md-12">
                      <MDBValidationItem
                        className="col-md-12"
                        feedback="Please Enter any Skill"
                        invalid
                      >
                        <MDBInput
                          label="Skill"
                          type="text"
                          name="industryName"
                          value={skill}
                          onChange={(e) => setSkill(e.target.value)}
                          required
                          validation="Enter any Skill"
                          invalid
                        />
                      </MDBValidationItem>
                    </div>
                    <div className="col-12">
                      <MDBBtn
                        style={{
                          width: "100%",
                          borderRadius: "50px",
                          backgroundColor: "#387F8E",
                          color: "white",
                        }}
                        className="mt-2"
                      >
                        Add
                      </MDBBtn>
                    </div>
                  </MDBValidation>
                </MDBCardBody>
              </MDBCard>
            </div>
          </div>
        </Dialog>

        <Dialog
          header="edit Skill"
          visible={editVisible}
          style={{ width: "50vw" }}
          onHide={() => setEditVisible(false)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ flex: 1, maxWidth: "450px", margin: "0 15px" }}>
              <MDBCard alignment="center" className="mb-5">
                <MDBIcon icon="fas fa-industry" className="fa-3x " />

                <MDBCardBody>
                  <MDBValidation
                    noValidate
                    className="row g-3"
                    onSubmit={handleEdit}
                  >
                    <div className="col-md-12">
                      <MDBValidationItem
                        className="col-md-12"
                        feedback="Please Enter any Skill"
                        invalid
                      >
                        <MDBInput
                          label="Skill"
                          type="text"
                          name="industryName"
                          value={editedSkill}
                          onChange={(e) => setEditedSkill(e.target.value)}
                          required
                          validation="Enter any Skill"
                          invalid
                        />
                      </MDBValidationItem>
                    </div>
                    <div className="col-12">
                      <MDBBtn
                        style={{
                          width: "100%",
                          borderRadius: "50px",
                          backgroundColor: "#387F8E",
                          color: "white",
                        }}
                        className="mt-2"
                      >
                        Add
                      </MDBBtn>
                    </div>
                  </MDBValidation>
                </MDBCardBody>
              </MDBCard>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
}

export default Skills;
