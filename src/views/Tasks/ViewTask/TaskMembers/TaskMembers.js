import React from "react";

import Spinner from "../../../../components/UI/Spinner/Spinner";
import UserList from "../../../../components/Users/UsersList/UsersList";

const TaskMembers = props => {
  const completedMembers = props.members
    .filter(member => member.completed)
    .map(member => member.user);

  const not_completedMembers = props.members
    .filter(member => !member.completed)
    .map(member => member.user);

  return (
    <div>
      {!props.loading ? (
        <>
          <h2>Completed</h2>
          <UserList users={completedMembers} />

          <h2>Not Completed</h2>
          <UserList users={not_completedMembers} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default TaskMembers;
