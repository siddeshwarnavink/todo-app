import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./ViewTask.module.css";
import * as actions from "../../../store/actions";
import authRequired from "../../../hoc/authRequired/authRequired";

import { Link } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Jumbotron from "../../../components/UI/Jumbotron/Jumbotron";
import TaskMembers from "./TaskMembers/TaskMembers";
import EditTask from "../../../components/Tasks/EditTask/EditTask";

class ViewTask extends Component {
  constructor(props) {
    super(props);

    props.initTask(props.match.params.id);
  }
  render() {
    const taskId = this.props.match.params.id;

    return !this.props.taskLoading && this.props.task.creator ? (
      <>
        <Jumbotron>
          <h1>{this.props.task.title}</h1>
          <sub>
            Task created by{" "}
            <Link
              to={`/user/${this.props.task.creator.id}`}
              style={{ color: "#8080ff" }}
            >
              {this.props.task.creator.username}
            </Link>
          </sub>
          {!this.props.task.taskDone ? (
            <Button
              btnType="Primary"
              clicked={() =>
                this.props.completeTask(taskId, this.props.history.push)
              }
              disabled={this.props.task.completed}
            >
              <i className="material-icons">done</i>
              {this.props.task.completed ? "Completed" : "Complete Task"}
            </Button>
          ) : (
            <p>This task is now closed!</p>
          )}
        </Jumbotron>
        <Tabs>
          <TabList>
            <Tab>
              <i className="material-icons">notes</i>
              About
            </Tab>
            <Tab onClick={() => this.props.initTaskMembers(taskId)}>
              <i className="material-icons">group</i>
              Members
            </Tab>
            {this.props.isAdmin ||
              (this.props.task.creator.id === this.props.loggedInID && (
                <Tab>
                  <i className="material-icons">edit</i>
                  Edit
                </Tab>
              ))}
          </TabList>
          <TabPanel>
            <main className={classes.Main}>
              <h1>About the task</h1>
              <p>{this.props.task.description}</p>
              <span className={classes.Dates}>
                From {new Date(this.props.task.starts_at).toDateString()} to{" "}
                {new Date(this.props.task.ends_at).toDateString()}
              </span>
            </main>
          </TabPanel>
          <TabPanel>
            <main className={classes.Main}>
              <TaskMembers
                loading={this.props.taskMembersLoading}
                members={this.props.taskMembers}
              />
            </main>
          </TabPanel>
          {this.props.isAdmin ||
            (this.props.task.creator.id === this.props.loggedInID && (
              <TabPanel>
                <main className={classes.Main}>
                  {this.props.task.members && (
                    <EditTask
                      groupId={this.props.task.group.id}
                      goFunc={this.props.history.push}
                      taskId={taskId}
                      taskData={this.props.task}
                      taskMembers={this.props.task.members.map(m => m.user.id)}
                    />
                  )}
                </main>
              </TabPanel>
            ))}
        </Tabs>
      </>
    ) : (
      <Spinner />
    );
  }
}

const mapStateToProps = state => ({
  taskLoading: state.tasks.taskLoading,
  task: state.tasks.task,
  taskMembersLoading: state.tasks.taskMembersLoading,
  taskMembers: state.tasks.taskMembers,
  isAdmin: state.auth.user.isAdmin,
  loggedInID: state.auth.user.id
});

const mapDispatchToProps = dispatch => ({
  initTask: taskId => dispatch(actions.initTask(taskId)),
  initTaskMembers: taskId => dispatch(actions.initTaskMembers(taskId)),
  completeTask: (taskId, goFunc) =>
    dispatch(actions.completeTask(taskId, goFunc))
});

export default authRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ViewTask)
);
