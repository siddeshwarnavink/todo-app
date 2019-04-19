import React, { useState } from "react";

import Fab from "../../../../components/UI/Button/Fab/Fab";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import UserList from "../../../../components/Users/UsersList/UsersList";
import Modal from "../../../../components/UI/Modal/Modal";
import AddUser from "../../../../components/Users/AddUser/AddUser";

const CompanyEmployees = props => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModalHandler = () => {
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <div>
      {!props.loading ? (
        <>
          <h1>Employees</h1>
          <UserList users={props.members} />

          <Modal
            size={6.8}
            scroll={false}
            show={modalIsOpen}
            modalClosed={toggleModalHandler}
          >
            <AddUser
              modalClose={toggleModalHandler}
              loadMembers={props.loadMembers}
            />
          </Modal>

          <Fab clicked={toggleModalHandler}>
            <i className="material-icons">add</i>
          </Fab>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default CompanyEmployees;
