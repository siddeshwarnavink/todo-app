import * as actionTypes from "./actionTypes";
import * as actions from "./";

import axios from "../../axios";

// Sync
const groupStart = () => ({
  type: actionTypes.GROUPS_START
});

const groupSuccess = groups => ({
  type: actionTypes.GROUPS_SUCCESS,
  groups
});

const setGroup = group => ({
  type: actionTypes.SET_GROUP,
  group
});

const startGroupMembers = () => ({
  type: actionTypes.START_GROUP_MEMBERS
});

const successGroupMembers = groupMembers => ({
  type: actionTypes.SUCCESS_GROUP_MEMBERS,
  groupMembers
});

// Async
export const initGroups = () => dispatch => {
  dispatch(groupStart());
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        {
          groups {
            id,
            title,
            description,
          }
        }
        `
      })
    )
    .then(({ data }) => {
      dispatch(groupSuccess(data.data.groups));
    });
};

export const group = groupId => dispatch => {
  dispatch(groupStart());
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        {
          group(id: ${groupId}) {
            title,
            description
          }
        }
        `
      })
    )
    .then(({ data }) => {
      dispatch(groupSuccess([]));
      dispatch(setGroup(data.data.group));
    });
};

export const groupMembers = groupId => dispatch => {
  dispatch(startGroupMembers());
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
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
      `
      })
    )
    .then(({ data }) => {
      dispatch(successGroupMembers(data.data.group.members));
    })
    .catch(error => {
      alert(error.response.data.errors[0].message);

      dispatch(
        actions.notify({
          members: error.response.data.errors[0].message
        })
      );

      window.location.assign("/");
    });
};
