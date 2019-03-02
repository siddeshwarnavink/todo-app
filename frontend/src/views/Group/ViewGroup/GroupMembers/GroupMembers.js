import React from "react";

import Spinner from "../../../../components/UI/Spinner/Spinner";
import UserList from "../../../../components/Users/UsersList/UsersList";

const GroupMembers = props => (
  <div>
    {!props.loading ? (
      <>
        <h2>Members</h2>
        <UserList users={props.members} />
      </>
    ) : (
      <Spinner />
    )}
  </div>
);

export default GroupMembers;
