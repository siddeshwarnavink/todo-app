import React, { Component, Suspense } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { BrowserView, MobileView } from "react-device-detect";
import { connect } from "react-redux";
import queryString from "query-string";

import classes from "./ViewTask.module.css";
import * as actions from "../../../store/actions";
import authRequired from "../../../hoc/authRequired/authRequired";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Jumbotron from "../../../components/UI/Jumbotron/Jumbotron";
import TaskMembers from "./TaskMembers/TaskMembers";
import Comments from "../../../components/Comments/Comments";
import MenuContext from "../../../context/menu-context";
import TaskManage from "./TaskManage/TaskManage";
const MobileJumbotron = React.lazy(() =>
     import("../../../components/UI/Jumbotron/MobileJumbotron/MobileJumbotron"),
);
class ViewTask extends Component {
     _menuSet = false;
     static contextType = MenuContext;

     state = { isTodo: true };

     componentDidMount() {
          const params = queryString.parse(this.props.location.search);
          const isTodo = params.isTodo === "true";

          this.setState({ isTodo });

          this.props.initTask(this.props.match.params.id, isTodo);

          if (!isTodo) {
               this.props.initTaskMembers(this.props.match.params.id);
          }
     }

     componentDidUpdate() {
          if (!this.props.taskLoading && !this._menuSet)
               this.setMenuItemsHandler();
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
                                   this.props.history.push,
                                   this.props.isTodo,
                              ),
                    },
               ]);
          }

          this._menuSet = true;
     };

     blankFunc = () => {};

     render() {
          const taskId = this.props.match.params.id;

          return !this.props.taskLoading && this.props.task ? (
               <Suspense fallback={<Spinner />}>
                    <BrowserView>
                         <Jumbotron>
                              <h1>{this.props.task.title}</h1>
                              {this.props.task.creator && !this.state.isTodo ? (
                                   <sub>
                                        Task created by{" "}
                                        <Link
                                             to={`/user/${
                                                  this.props.task.creator.id
                                             }`}
                                             style={{ color: "#8080ff" }}
                                        >
                                             {this.props.task.creator.username}
                                        </Link>
                                   </sub>
                              ) : null}
                              {this.props.isAdmin ||
                              (this.props.task.creator &&
                                   this.props.task.creator.id ===
                                        this.props.loggedInID) ? (
                                   <Button
                                        btnType='Primary'
                                        clicked={() =>
                                             this.props.completeTask(
                                                  taskId,
                                                  this.props.history.push,
                                             )
                                        }
                                        disabled={this.props.task.completed}
                                   >
                                        <i className='material-icons'>done</i>
                                        {this.props.task.completed
                                             ? "Completed"
                                             : "Complete Task"}
                                   </Button>
                              ) : (
                                   <p>This task is now closed!</p>
                              )}
                         </Jumbotron>
                    </BrowserView>
                    <MobileView>
                         <MobileJumbotron
                              subtext={
                                   this.props.task.creator && !this.state.isTodo
                                        ? `Task by ${
                                               this.props.task.creator.username
                                          }`
                                        : null
                              }
                         >
                              <h1>{this.props.task.title}</h1>
                         </MobileJumbotron>
                    </MobileView>
                    <Tabs>
                         <TabList>
                              <Tab>
                                   <i className='material-icons'>notes</i>
                                   <span>About</span>
                              </Tab>
                              {!this.state.isTodo && (
                                   <Tab>
                                        <i className='material-icons'>group</i>
                                        <span>Members</span>
                                   </Tab>
                              )}
                              {this.props.isAdmin ||
                              this.props.task.creator.id ===
                                   this.props.loggedInID ? (
                                   <Tab>
                                        <i className='material-icons'>
                                             data_usage
                                        </i>
                                        <span>Manage</span>
                                   </Tab>
                              ) : null}
                         </TabList>
                         <TabPanel>
                              <main className={classes.Main}>
                                   <h1>About the task</h1>
                                   <p>{this.props.task.description}</p>

                                   {this.props.task.taskDone && (
                                        <p>This task is now closed!</p>
                                   )}

                                   <br />

                                   <span className={classes.Dates}>
                                        From{" "}
                                        {new Date(
                                             this.props.task.starts_at,
                                        ).toDateString()}{" "}
                                        to{" "}
                                        {new Date(
                                             this.props.task.ends_at,
                                        ).toDateString()}
                                   </span>

                                   <Comments
                                        type='task'
                                        payload={parseInt(taskId)}
                                   />
                              </main>
                         </TabPanel>
                         {!this.state.isTodo && (
                              <TabPanel>
                                   <main className={classes.Main}>
                                        <TaskMembers
                                             loading={
                                                  this.props.taskMembersLoading
                                             }
                                             members={this.props.taskMembers}
                                        />
                                   </main>
                              </TabPanel>
                         )}
                         {this.state.isTodo ||
                         (this.props.isAdmin ||
                              this.props.task.creator.id ===
                                   this.props.loggedInID) ? (
                              <TabPanel>
                                   {!this.props.taskMembersLoading ||
                                   this.props.task.members ||
                                   this.state.isTodo ? (
                                        <TaskManage
                                             isTodo={this.state.isTodo}
                                             task={this.props.task}
                                             goFunc={this.props.history.push}
                                             taskId={taskId}
                                             taskMembers={
                                                  this.props.taskMembers
                                             }
                                        />
                                   ) : null}
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
     loggedInID: state.auth.user.id,
});

const mapDispatchToProps = dispatch => ({
     initTask: (taskId, isTodo) => dispatch(actions.initTask(taskId, isTodo)),
     initTaskMembers: taskId => dispatch(actions.initTaskMembers(taskId)),
     completeTask: (taskId, goFunc, isTodo) =>
          dispatch(actions.completeTask(taskId, goFunc, isTodo)),
});

export default authRequired(
     connect(
          mapStateToProps,
          mapDispatchToProps,
     )(ViewTask),
);
