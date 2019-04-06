import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../store/actions";
import authRequired from "../hoc/authRequired/authRequired";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { BrowserView, MobileView } from "react-device-detect";
import GroupCard from "../components/Groups/GroupCard/GroupCard";
import Spinner from "../components/UI/Spinner/Spinner";
import TasksList from "../components/Tasks/TasksList/TasksList";
import MobileJumbotron from "../components/UI/Jumbotron/MobileJumbotron/MobileJumbotron";
import Notificatons from "./Notification/Notification";
import NotificationContext from "../context/notification-context";

class Homepage extends Component {
  constructor(props) {
    super(props);

    props.initGroups();
    props.initTasks();
  }

  render() {
    let hrs = new Date().getHours();
    let greet;

    if (hrs < 12) greet = "Good Morning";
    else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon";
    else if (hrs >= 17 && hrs <= 24) greet = "Good Evening";

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
      <>
        <BrowserView>
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
        </BrowserView>
        <MobileView>
          <MobileJumbotron subtext={new Date().toDateString()}>
            <h1>{greet}</h1>
          </MobileJumbotron>

          <Tabs>
            <TabList>
              <Tab>
                <i className="material-icons">notes</i>
                <span>Tasks</span>
              </Tab>
              <Tab>
                <i className="material-icons">group</i>
                <span>Groups</span>
              </Tab>
              <Tab>
                <NotificationContext.Consumer>
                  {notificationCount => (
                    <>
                      <i className="material-icons">
                        {notificationCount === 0
                          ? "notifications_none"
                          : "notifications_active"}
                      </i>
                      <span>Notification</span>
                    </>
                  )}
                </NotificationContext.Consumer>
              </Tab>
            </TabList>
            <TabPanel>
              {!this.props.tasksLoading ? (
                <TasksList tasks={this.props.tasks} />
              ) : (
                <Spinner />
              )}
            </TabPanel>
            <TabPanel>{groups}</TabPanel>

            <TabPanel>
              <Notificatons />
            </TabPanel>
          </Tabs>
        </MobileView>
      </>
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
