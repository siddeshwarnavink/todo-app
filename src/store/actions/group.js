import * as actionTypes from './actionTypes';
import * as actions from './';

import axios from '../../axios';

// Sync
const groupStart = () => ({
     type: actionTypes.GROUPS_START,
});

const groupSuccess = groups => ({
     type: actionTypes.GROUPS_SUCCESS,
     groups,
});

const setGroup = group => ({
     type: actionTypes.SET_GROUP,
     group,
});

const startGroupMembers = () => ({
     type: actionTypes.START_GROUP_MEMBERS,
});

const successGroupMembers = groupMembers => ({
     type: actionTypes.SUCCESS_GROUP_MEMBERS,
     groupMembers,
});

// Async
export const initGroups = () => dispatch => {
     dispatch(groupStart());
     axios.post(
          `/?token=${localStorage.getItem('token')}`,
          JSON.stringify({
               query: `
        {
          groups {
            id,
            title,
            description,
          }
        }
        `,
          }),
     ).then(({ data }) => {
          dispatch(groupSuccess(data.data.groups));
     });
};

export const group = groupId => dispatch => {
     dispatch(groupStart());
     axios.post(
          `/?token=${localStorage.getItem('token')}`,
          JSON.stringify({
               query: `
        {
          group(id: ${groupId}) {
            title,
            description
          }
        }
        `,
          }),
     )
          .then(({ data }) => {
               dispatch(groupSuccess([]));
               dispatch(setGroup(data.data.group));
          })
          .catch(() => {
               alert('Group failed to load / does not exist!');
               window.location.assign('/');
          });
};

export const groupMembers = groupId => dispatch => {
     dispatch(startGroupMembers());
     axios.post(
          `/?token=${localStorage.getItem('token')}`,
          JSON.stringify({
               query: `
        {
          group(id: ${groupId}) {
            members {
              id,
              username,
              isAdmin
            }
          }
        }
      `,
          }),
     )
          .then(({ data }) => {
               dispatch(successGroupMembers(data.data.group.members));
          })
          .catch(error => {
               dispatch(
                    actions.notify({
                         members: 'Failed to load the members',
                    }),
               );

               window.location.assign('/');
          });
};

export const addGroup = (
     title,
     description,
     members,
     cb = () => {},
) => dispatch => {
     dispatch(groupStart());
     axios.post(
          `/?token=${localStorage.getItem('token')}`,
          JSON.stringify({
               query: `
        mutation {
            addGroup(title: "${title}", description: "${description}", members:"[${members}]")
        }
    `,
          }),
     ).then(() => {
          dispatch(groupSuccess());
          cb();
     });
};

export const editGroup = (
     id,
     title,
     description,
     members,
     cb = () => {},
) => dispatch => {
     dispatch(groupStart());
     axios.post(
          `/?token=${localStorage.getItem('token')}`,
          JSON.stringify({
               query: `
        mutation {
          editGroup(id: ${id}, title: "${title}", description: "${description}"
        members: "[${members}]")
        }
    `,
          }),
     ).then(() => {
          dispatch(groupSuccess());
          dispatch(
               actions.notify({
                    message: 'Group Updated Successfully',
               }),
          );
          cb();
     });
};

export const deleteGroup = (id, cb = () => {}) => () => {
     axios.post(
          `/?token=${localStorage.getItem('token')}`,
          JSON.stringify({
               query: `
          mutation {
            deleteGroup(id: ${id})
          }
        `,
          }),
     ).then(() => {
          cb();
     });
};
