import React, { Component, Suspense } from "react";

import classes from "./ViewGroup.module.css";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import authRequired from "../../../hoc/authRequired/authRequired";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { BrowserView, MobileView } from "react-device-detect";
import Jumbotron from "../../../components/UI/Jumbotron/Jumbotron";
import Spinner from "../../../components/UI/Spinner/Spinner";
import GroupTasks from "./GroupTasks/GroupTasks";
import GroupMembers from "./GroupMembers/GroupMembers";
import GroupEdit from "./GroupEdit/GroupEdit";
const MobileJumbotron = React.lazy(() =>
  import("../../../components/UI/Jumbotron/MobileJumbotron/MobileJumbotron")
);
class ViewGroup extends Component {
  constructor(props) {
    super(props);
    this.init();
  }

  init = () => {
    this.props.initGroup(this.props.match.params.id);
    this.props.initGroupTasks(this.props.match.params.id);
    this.props.initGroupMembers(this.props.match.params.id);
    this.props.initGroupTasks(this.props.match.params.id);
  };

  render() {
    const groupId = this.props.match.params.id;

    return (
      <div>
        {!this.props.groupsLoading ? (
          <Suspense fallback={<Spinner />}>
            <BrowserView>
              <Jumbotron>
                <h1>{this.props.group.title}</h1>
                <sub>{this.props.group.description}</sub>
              </Jumbotron>
            </BrowserView>

            <MobileView>
              <MobileJumbotron subtext={this.props.group.description}>
                <h1>{this.props.group.title}</h1>
              </MobileJumbotron>
            </MobileView>

            <Tabs>
              <TabList>
                <Tab>
                  <i className="material-icons">notes</i>
                  <span>Tasks</span>
                </Tab>
                <Tab>
                  <i className="material-icons">group</i>
                  <span>Members</span>
                </Tab>

                {this.props.isAdmin && (
                  <Tab>
                    <i className="material-icons">edit</i>
                    <span>Edit</span>
                  </Tab>
                )}
              </TabList>
              <TabPanel>
                <main className={classes.Main}>
                  <GroupTasks
                    groupId={groupId}
                    loading={this.props.groupTasksLoading}
                    tasks={this.props.groupTasks}
                    members={this.props.groupMembers}
                    goFunc={this.props.history.go}
                  />
                </main>
              </TabPanel>
              <TabPanel>
                <main className={classes.Main}>
                  <GroupMembers
                    loading={this.props.groupMembersLoading}
                    members={this.props.groupMembers}
                  />
                </main>
              </TabPanel>
              {this.props.isAdmin && (
                <TabPanel>
                  <main className={classes.Main}>
                    <GroupEdit
                      groupData={this.props.group}
                      groupMembers={this.props.groupMembers}
                      initPage={this.init}
                      groupId={this.props.match.params.id}
                    />
                  </main>
                </TabPanel>
              )}
            </Tabs>
          </Suspense>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groupsLoading: state.groups.loading,
  group: state.groups.group,
  groupMembersLoading: state.groups.groupMembersLoading,
  groupMembers: state.groups.groupMembers,
  groupTasksLoading: state.tasks.groupTasksLoading,
  groupTasks: state.tasks.groupTasks,
  isAdmin: state.auth.user.isAdmin
});

const mapDispatchToProps = dispatch => ({
  initGroup: groupId => dispatch(actions.group(groupId)),
  initGroupMembers: groupId => dispatch(actions.groupMembers(groupId)),
  initGroupTasks: groupId => dispatch(actions.initGroupTasks(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(authRequired(ViewGroup));
