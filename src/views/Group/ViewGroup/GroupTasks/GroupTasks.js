import React, { Component } from "react";

import Spinner from "../../../../components/UI/Spinner/Spinner";
import TasksList from "../../../../components/Tasks/TasksList/TasksList";
import Fab from "../../../../components/UI/Button/Fab/Fab";
import Modal from "../../../../components/UI/Modal/Modal";
import CreateGroupTask from "../../../../components/Tasks/CreateGroupTask/CreateGroupTask";

class GroupTasks extends Component {
  state = {
    showAddTaskModel: false
  };

  toggleAddTaskModel = () => {
    this.setState(prvState => ({
      showAddTaskModel: !prvState.showAddTaskModel
    }));
  };

  render() {
    return (
      <div>
        {!this.props.loading ? (
          <>
            <h2>Tasks</h2>
            <TasksList tasks={this.props.tasks} />

            <Modal
              scroll
              show={this.state.showAddTaskModel}
              modalClosed={this.toggleAddTaskModel}
            >
              <CreateGroupTask
                groupId={this.props.groupId}
                members={this.props.members}
                goFunc={this.props.goFunc}
              />
            </Modal>

            <Fab tooltip="Add Task" clicked={this.toggleAddTaskModel}>
              <i className="material-icons">add</i>
            </Fab>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default GroupTasks;
