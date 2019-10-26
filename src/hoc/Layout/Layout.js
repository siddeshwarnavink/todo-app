import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../store/actions';
import classes from './Layout.module.css';
import axios from '../../axios';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import FlasNotify from '../../components/FlashNotify/FlashNotify';
import QuickAction from '../../components/QuickAction/QuickAction'
import NotificationContext from '../../context/notification-context';
import MenuContext from '../../context/menu-context';
import QuickActionContext from '../../context/quickAction-context';

const Layout = props => {
     const menuContext = useContext(MenuContext);
     const [notificationCount, setNotificationCount] = useState(0);
     const [selectedItems, setSelectedItems] = useState([]);
     const [quickActionPayload, setQuickActionPayload] = useState('');

     useEffect(() => {
          if (localStorage.getItem('token') !== null) {
               setInterval(() => {
                    axios.post(
                         `/?token=${localStorage.getItem('token')}`,
                         JSON.stringify({
                              query: `
            {
              notificationCount
            }
            `,
                         }),
                    ).then(({ data }) => {
                         if (
                              notificationCount !== data.data.notificationCount
                         ) {
                              setNotificationCount(data.data.notificationCount);
                         }
                    });
               }, 3500);
          }
     }, []);

     useEffect(() => {
          updateMenuHandler();
     }, [props.location, props.isLoggedIn]);

     const updateMenuHandler = () => {
          let menuItems = [];

          if (props.isLoggedIn) {
               menuItems.push({
                    label: 'Profile',
                    icon: 'person',
                    to: '/profile',
               });

               if (props.isAdmin) {
                    menuItems.push({
                         label: 'Admin Area',
                         icon: 'security',
                         to: '/admin/',
                    });
               }
          } else {
               menuItems.push({
                    label: 'Auth',
                    icon: 'person',
                    to: '/auth',
               });
          }

          menuContext.setMenuItems(menuItems);
     };

     

     return (
          <NotificationContext.Provider value={notificationCount}>
               <QuickActionContext.Provider value={{
                    selected: selectedItems,
                    payload: quickActionPayload,
                    onSelect: (key, payload) => {
                         const selectedItems_ = [...selectedItems];
                         selectedItems_.push(key);

                         setSelectedItems(selectedItems_);
                         setQuickActionPayload(payload);
                    },
                    onClear: () => {
                         setSelectedItems([]);
                         setQuickActionPayload('');
                    },
                    onDelete: () => {
                         const prms = [];

                         switch(quickActionPayload) {
                              case 'task':
                                   selectedItems.forEach(taskId => {
                                        prms.push(axios.post(
                                             `/?token=${localStorage.getItem('token')}`,
                                             JSON.stringify({
                                                  query: `
                                                       mutation {
                                                            deleteTask(id: ${taskId})
                                                       }
                                                  `,
                                             }),
                                        ))
                                   });
                                   break;
                              default: break;
                         }

                         Promise.all(prms).then(res => {
                              console.log(res);
                              window.location.reload();
                         })
                    },
                    // TASK ONLY ACTION
                    onComplete: () => {
                         const prms = [];

                         selectedItems.forEach(taskId => {
                              prms.push(axios.post(
                                   `/?token=${localStorage.getItem('token')}`,
                                   JSON.stringify({
                                        query: `
                                             mutation {
                                                  completeTask(taskId: ${taskId})
                                             }
                                        `,
                                   }),
                              ))
                         });

                         Promise.all(prms).then(res => {
                              console.log(res);
                              window.location.reload();
                         })
                    }
               }}>
                    <Toolbar
                         isLoggedIn={props.isLoggedIn}
                         isAdmin={props.isAdmin}
                         logo={props.logo}
                         userId={props.userId}
                    />
                    <div>{props.children}</div>

                    <div className={classes.FlasNotifyArea}>
                         {props.notifyMessages.map((message, i) => (
                              <FlasNotify key={i}>{message.message}</FlasNotify>
                         ))}
                    </div>
                    {selectedItems.length > 0 && <QuickAction />}
               </QuickActionContext.Provider>
          </NotificationContext.Provider>
     );
};

const mapStateToProps = state => ({
     userId: state.auth.user.id,
     isLoggedIn: state.auth.isLoggedIn,
     notifyMessages: state.flashNotify.messages,
     isAdmin: state.auth.user.isAdmin === true,
     logo: state.auth.user.logo,
});

const mapDispatchToProps = dispatch => ({
     flasNotify: messages => dispatch(actions.notify(messages)),
});

export default connect(
     mapStateToProps,
     mapDispatchToProps,
)(withRouter(Layout));
