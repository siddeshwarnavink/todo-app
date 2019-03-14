import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../store/actions";
import authRequired from "../hoc/authRequired/authRequired";

import GroupCard from "../components/Groups/GroupCard/GroupCard";
import Spinner from "../components/UI/Spinner/Spinner";
import TasksList from "../components/Tasks/TasksList/TasksList";

class Homepage extends Component {
  constructor(props) {
    super(props);

    props.initGroups();
    props.initTasks();
  }

  render() {
    let groups = this.props.groupsError ? (
      <p>Failed to load the groups</p>
    ) : (
      <Spinner />
    );

    if (this.props.groups) {
      groups = (
        <div bp="grid 4@lg 1@sm">
          {this.props.groups.map(group => (
            <GroupCard
              key={group.id}
              id={group.id}
              title={group.title}
              description={group.description}
            />
          ))}
        </div>
      );
    }

    return (
      <main>
        <h1>Tasks</h1>
        {!this.props.tasksLoading ? (
          <TasksList tasks={this.props.tasks} />
        ) : (
          <Spinner />
        )}
        <h1>Groups</h1>
        {groups}
      </main>
    );
  }
}

const mapStateToProps = state => ({
  groupsLoading: state.groups.loading,
  groups: state.groups.groups,
  groupsError: state.groups.groupsError,
  tasksLoading: state.tasks.tasksLoading,
  tasks: state.tasks.tasks
});

const mapDispatchToProps = dispatch => ({
  initGroups: () => dispatch(actions.initGroups()),
  initTasks: () => dispatch(actions.initTasks())
});

export default authRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Homepage)
);
