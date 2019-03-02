import React, { useState } from "react";

import GroupList from "../../../../components/Groups/GroupList/GroupList";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import Fab from "../../../../components/UI/Button/Fab/Fab";
import Modal from "../../../../components/UI/Modal/Modal";
import AddGroup from "../../../../components/Groups/AddGroup/AddGroup";

const CompanyGroups = props => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModalHandler = () => {
    setModalIsOpen(!modalIsOpen);
  };

  return (
    <div>
      <h1>Groups</h1>
      {props.loading ? <Spinner /> : <GroupList groups={props.groups} />}

      <Modal scroll show={modalIsOpen} modalClosed={toggleModalHandler}>
        <AddGroup
          members={props.members}
          loadGroups={props.loadGroups}
          modalClose={toggleModalHandler}
        />
      </Modal>

      <Fab clicked={toggleModalHandler}>
        <i className="material-icons">add</i>
      </Fab>
    </div>
  );
};

export default CompanyGroups;
