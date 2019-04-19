import React, { Component, Suspense } from "react";
import { connect } from "react-redux";

import classes from "./ViewTask.module.css";
import * as actions from "../../../store/actions";
import authRequired from "../../../hoc/authRequired/authRequired";

import { Link } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { BrowserView, MobileView } from "react-device-detect";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Jumbotron from "../../../components/UI/Jumbotron/Jumbotron";
import TaskMembers from "./TaskMembers/TaskMembers";
import Comments from "../../../components/Comments/Comments";
import MenuContext from "../../../context/menu-context";
import TaskManage from "./TaskManage/TaskManage";
const MobileJumbotron = React.lazy(() =>
  import("../../../components/UI/Jumbotron/MobileJumbotron/MobileJumbotron")
);
class ViewTask extends Component {
  _menuSet = false;
  static contextType = MenuContext;

  constructor(props) {
    super(props);

    props.initTask(props.match.params.id);
  }

  componentDidUpdate() {
    if (!this.props.taskLoading && !this._menuSet) this.setMenuItemsHandler();
  }

  componentWillUnmount() {
    this._menuSet = false;
  }

  setMenuItemsHandler = () => {
    if (!this.props.task.completed) {
      this.context.setMenuItems([
        {
          label: "Complete",
          icon: "done",
          to: "/task/" + this.props.match.params.id,
          clicked: () =>
            this.props.completeTask(
              this.props.match.params.id,
              this.props.history.push
            )
        }
      ]);
    }

    this._menuSet = true;
  };

  render() {
    const taskId = this.props.match.params.id;

    return !this.props.taskLoading && this.props.task.creator ? (
      <Suspense fallback={<Spinner />}>
        <BrowserView>
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
        </BrowserView>
        <MobileView>
          <MobileJumbotron
            subtext={`Task by ${this.props.task.creator.username}`}
          >
            <h1>{this.props.task.title}</h1>
          </MobileJumbotron>
        </MobileView>
        <Tabs>
          <TabList>
            <Tab>
              <i className="material-icons">notes</i>
              <span>About</span>
            </Tab>
            <Tab onClick={() => this.props.initTaskMembers(taskId)}>
              <i className="material-icons">group</i>
              <span>Members</span>
            </Tab>
            {this.props.isAdmin ||
            this.props.task.creator.id === this.props.loggedInID ? (
              <Tab onClick={() => this.props.initTaskMembers(taskId)}>
                <i className="material-icons">data_usage</i>
                <span>Manage</span>
              </Tab>
            ) : null}
          </TabList>
          <TabPanel>
            <main className={classes.Main}>
              <h1>About the task</h1>
              <p>{this.props.task.description}</p>

              {this.props.task.taskDone && <p>This task is now closed!</p>}

              <br />

              <span className={classes.Dates}>
                From {new Date(this.props.task.starts_at).toDateString()} to{" "}
                {new Date(this.props.task.ends_at).toDateString()}
              </span>

              <Comments type="task" payload={parseInt(taskId)} />
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
          this.props.task.creator.id === this.props.loggedInID ? (
            <TabPanel>
              {!this.props.taskMembersLoading && this.props.task.members && (
                <TaskManage
                  task={this.props.task}
                  goFunc={this.props.history.push}
                  taskId={taskId}
                  taskMembers={this.props.taskMembers}
                />
              )}
            </TabPanel>
          ) : null}
        </Tabs>
      </Suspense>
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
