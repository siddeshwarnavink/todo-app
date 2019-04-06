import React, { Component } from "react";

import classes from "./TasksList.module.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";

import { TransitionGroup } from "react-transition-group";
import SearchInput, { createFilter } from "react-search-input";
import TaskListItem from "./TaskListItem/TaskListItem";

class TasksList extends Component {
  state = {
    searchTerm: ""
  };

  searchUpdated = term => {
    this.setState({ searchTerm: term });
  };

  render() {
    const filteredTasks = this.props.tasks.filter(
      createFilter(this.state.searchTerm, ["title", "description"])
    );

    return (
      <div>
        <SearchInput onChange={this.searchUpdated} className="search-input" />

        {filteredTasks.length > 0 ? (
          <TransitionGroup component="ul" className={classes.TasksList}>
            {filteredTasks.map(task => (
              <TaskListItem
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                isCompleted={task.completed}
                completeTask={() => this.props.completedTask(task.id)}
              />
            ))}
          </TransitionGroup>
        ) : (
          <p>No tasks :-)</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAdmin: state.auth.user.isAdmin,
  currentUid: state.auth.user.id
});

const mapDispatchToProps = dispatch => ({
  completedTask: taskId => dispatch(actions.completeTask(taskId, url => {}))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksList);
