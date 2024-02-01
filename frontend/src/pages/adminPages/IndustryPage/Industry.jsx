import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../../components/adminComponents/Navbar/adminNavbar';
import { useAdminGetIndustriesMutation, useAdminAddIndustriesMutation, useAdminEditIndustryMutation } from '../../../redux/adminSlices/adminApiSlice';
import { toast } from 'react-toastify';
import './Industry.css'
import { Table, Form as BootstrapForm } from 'react-bootstrap'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBInput,
  MDBValidation,
  MDBValidationItem,
} from 'mdb-react-ui-kit'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.css';

function Industry() {
  const [industries, setIndustries] = useState([]);
  const [visible, setVisible] = useState(false)
  const [industryName, setIndustryName] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [editVisible, setEditVisible] = useState(false)

  const [searchTerm, setSearchTerm] = useState("");


  const [AdminGetIndustries] = useAdminGetIndustriesMutation();
  const [AdminAddIndustry] = useAdminAddIndustriesMutation()
  const [AdminEditIndustry] = useAdminEditIndustryMutation()

  const fetchIndustries = async () => {
    try {
      const responsefromapi = await AdminGetIndustries();
      setIndustries(responsefromapi.data.data);
    } catch (error) {
      toast.error(error?.data || error?.data?.message);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleEdit = async () => {
    try {

      const response = await AdminEditIndustry({ id: selectedId, industryName: selectedIndustry }).unwrap()
      if(response.success){
        toast.success('updated successfully')
        setIndustryName('')
        setSelectedId('')
        setEditVisible(false)
        fetchIndustries()
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.data)
    }
  };


  const addIndustry = async () => {
    try {
      const response = await AdminAddIndustry({ industryName }).unwrap()
      toast.success('succefully added')
      setVisible(false)
      fetchIndustries()
    } catch (error) {
      toast.error(error?.message || error?.data?.message)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div style={{ marginTop: '100px' }}>
        <h3 className="Heading">Industry Types</h3>
        <Button label="Add" severity="primary" raised style={{ marginLeft: '8%' }} onClick={() => setVisible(true)} />
      </div>
      <div className="Table">
        <div className="d-flex align-items-center justify-content-end">

          <BootstrapForm>
            <BootstrapForm.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
            >
              <BootstrapForm.Control
                style={{ width: '200px' }}
                type="text"
                placeholder="Enter Industry Name........"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Industry</th>
              <th className='text-end'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {industries && [...industries]
              .reverse()
              .filter((industry) =>
                industry.industryName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((filteredIndustry, index) => (
                <tr key={index}>
                  <td>{filteredIndustry.industryName}</td>
                  <td className='d-flex align-items-center justify-content-end'>
                    <Button label="Edit" severity="primary" raised className='ms-5' onClick={() => { setEditVisible(true), setSelectedIndustry(filteredIndustry.industryName), setSelectedId(filteredIndustry._id) }} />
                  </td>
                </tr>
              ))}
          </tbody>

        </Table>

        <Dialog header="Add Industry" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ flex: 1, maxWidth: '450px', margin: '0 15px' }}>
              <MDBCard alignment="center" className="mb-5">
                <MDBIcon icon="fas fa-industry" className="fa-3x " />


                <MDBCardBody>
                  <MDBValidation
                    noValidate
                    className="row g-3"
                    onSubmit={addIndustry}
                  >
                    <div className="col-md-12">
                      <MDBValidationItem
                        className="col-md-12"
                        feedback="Please Enter Industry Name"
                        invalid
                      >
                        <MDBInput
                          label="Industry Name"
                          type="text"
                          name="industryName"
                          value={industryName}
                          onChange={(e) => setIndustryName(e.target.value)}
                          required
                          validation="Enter Industry Name"
                          invalid
                        />
                      </MDBValidationItem>
                    </div>
                    <div className="col-12">
                      <MDBBtn
                        style={{
                          width: '100%',
                          borderRadius: '50px',
                          backgroundColor: '#387F8E',
                          color: 'white',
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

        <Dialog header="Edit Industry" visible={editVisible} style={{ width: '50vw' }} onHide={() => setEditVisible(false)}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ flex: 1, maxWidth: '450px', margin: '0 15px' }}>
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
                        feedback="Please Enter Industry Name"
                        invalid
                      >
                        <MDBInput
                          label="Industry Name"
                          type="text"
                          name="industryName"
                          value={selectedIndustry}
                          onChange={(e) => setSelectedIndustry(e.target.value)}
                          required
                          validation="Enter Industry Name"
                          invalid
                        />
                      </MDBValidationItem>
                    </div>
                    <div className="col-12">
                      <MDBBtn
                        style={{
                          width: '100%',
                          borderRadius: '50px',
                          backgroundColor: '#387F8E',
                          color: 'white',
                        }}
                        className="mt-2"
                      >
                        Save
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

export default Industry;
