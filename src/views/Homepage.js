import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { BrowserView, MobileView } from 'react-device-detect';
import { isArray } from 'util';

import * as actions from '../store/actions';
import authRequired from '../hoc/authRequired/authRequired';
import Fab from '../components/UI/Button/Fab/Fab';
import Modal from '../components/UI/Modal/Modal';
import CreateGroupTask from '../components/Tasks/CreateGroupTask/CreateGroupTask';
import GroupCard from '../components/Groups/GroupCard/GroupCard';
import Spinner from '../components/UI/Spinner/Spinner';
import TasksList from '../components/Tasks/TasksList/TasksList';
import Notificatons from './Notification/Notification';
import NotificationContext from '../context/notification-context';
const MobileJumbotron = React.lazy(() =>
     import('../components/UI/Jumbotron/MobileJumbotron/MobileJumbotron'),
);

class Homepage extends Component {
     constructor(props) {
          super(props);

          props.initGroups();
          props.initTodos();
          props.initTasks();
     }

     state = {
          showAddTaskModel: false,
     };

     toggleAddTaskModel = () => {
          this.setState(prvState => ({
               showAddTaskModel: !prvState.showAddTaskModel,
          }));
     };

     render() {
          let hrs = new Date().getHours();
          let greet;

          if (hrs < 12) greet = 'Good Morning';
          else if (hrs >= 12 && hrs <= 17) greet = 'Good Afternoon';
          else if (hrs >= 17 && hrs <= 24) greet = 'Good Evening';

          let groups = this.props.groupsError ? (
               <p>Failed to load the groups</p>
          ) : (
               <Spinner />
          );

          if (this.props.groups) {
               groups = (
                    <div bp='grid 4@lg 1@sm'>
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
               <Suspense fallback={<Spinner />}>
                    <Modal
                         scroll
                         show={this.state.showAddTaskModel}
                         modalClosed={this.toggleAddTaskModel}
                    >
                         <CreateGroupTask
                              groupId={0}
                              isTodo
                              members={[]}
                              goFunc={this.props.history.push}
                              extFunc={() => {
                                   this.props.initTodos();
                                   this.toggleAddTaskModel();
                              }}
                         />
                    </Modal>
                    <BrowserView>
                         <main>
                              {isArray(this.props.todos) ? (
                                   this.props.todos.length > 0 ? (
                                        <React.Fragment>
                                             <h1>Todos</h1>

                                             <TasksList
                                                  tasks={this.props.todos}
                                                  isTodo
                                                  extFunc={() => {
                                                       this.props.initTodos();
                                                  }}
                                             />
                                        </React.Fragment>
                                   ) : null
                              ) : (
                                   <Spinner />
                              )}
                              <h1>Tasks</h1>
                              {!this.props.tasksLoading ? (
                                   <TasksList tasks={this.props.tasks} />
                              ) : (
                                   <Spinner />
                              )}
                              <h1>Groups</h1>
                              {groups}
                         </main>

                         <Fab
                              tooltip='Add Task'
                              clicked={this.toggleAddTaskModel}
                         >
                              <i className='material-icons'>add</i>
                         </Fab>
                    </BrowserView>
                    <MobileView>
                         <MobileJumbotron subtext={new Date().toDateString()}>
                              <h1>{greet}</h1>
                         </MobileJumbotron>

                         <Tabs>
                              <TabList>
                                   <Tab>
                                        <i className='material-icons'>home</i>
                                        <span>Home</span>
                                   </Tab>
                                   <Tab>
                                        <i className='material-icons'>group</i>
                                        <span>Groups</span>
                                   </Tab>
                                   <Tab>
                                        <NotificationContext.Consumer>
                                             {notificationCount => (
                                                  <>
                                                       <i className='material-icons'>
                                                            {notificationCount ===
                                                            0
                                                                 ? 'notifications_none'
                                                                 : 'notifications_active'}
                                                       </i>
                                                       <span>Notification</span>
                                                  </>
                                             )}
                                        </NotificationContext.Consumer>
                                   </Tab>
                              </TabList>
                              <TabPanel>
                                   {isArray(this.props.todos) ? (
                                        this.props.todos.length > 0 ? (
                                             <React.Fragment>
                                                  <h1 className='mobile-sub'>
                                                       Things Todo!
                                                  </h1>

                                                  <TasksList
                                                       isTodo
                                                       tasks={this.props.todos}
                                                       extFunc={() => {
                                                            this.props.initTodos();
                                                       }}
                                                  />
                                             </React.Fragment>
                                        ) : null
                                   ) : (
                                        <Spinner />
                                   )}

                                   <h1 className='mobile-sub'>
                                        Tasks Assigned
                                   </h1>
                                   {!this.props.tasksLoading ? (
                                        <TasksList tasks={this.props.tasks} />
                                   ) : (
                                        <Spinner />
                                   )}

                                   <Fab
                                        tooltip='Add Task'
                                        clicked={this.toggleAddTaskModel}
                                   >
                                        <i className='material-icons'>add</i>
                                   </Fab>
                              </TabPanel>
                              <TabPanel>{groups}</TabPanel>

                              <TabPanel>
                                   <Notificatons />
                              </TabPanel>
                         </Tabs>
                    </MobileView>
               </Suspense>
          );
     }
}

const mapStateToProps = state => ({
     groupsLoading: state.groups.loading,
     groups: state.groups.groups,
     groupsError: state.groups.groupsError,
     tasksLoading: state.tasks.tasksLoading,
     tasks: state.tasks.tasks,
     todos: state.tasks.todos,
});

const mapDispatchToProps = dispatch => ({
     initGroups: () => dispatch(actions.initGroups()),
     initTasks: () => dispatch(actions.initTasks()),
     initTodos: () => dispatch(actions.initTodos()),
});

export default authRequired(
     connect(
          mapStateToProps,
          mapDispatchToProps,
     )(Homepage),
);
