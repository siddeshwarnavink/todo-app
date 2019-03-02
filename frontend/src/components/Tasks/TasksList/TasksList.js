import React, { Component } from "react";

import classes from "./TasksList.module.css";

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
          <ul className={classes.TasksList}>
            {filteredTasks.map(task => (
              <TaskListItem
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
              />
            ))}
          </ul>
        ) : (
          <p>No tasks :-)</p>
        )}
      </div>
    );
  }
}

export default TasksList;
