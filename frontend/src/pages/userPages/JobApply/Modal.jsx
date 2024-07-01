import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Dialog } from "primereact/dialog";

const UserProfileModal = ({ show, onSubmit, onClose }) => {

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Dialog visible={show} style={{ width: "70vw" }} onHide={() => onClose()}>
      <div className="text-center">
        <h6>use profile details</h6>
      </div>
      <div className="text-center">
        <p>we will add necessary details automatically</p>
      </div>
      <div className="d-flex align-items-center justify-content-evenly">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Proceed
        </Button>
      </div>
    </Dialog>
  );
};

export default UserProfileModal;
