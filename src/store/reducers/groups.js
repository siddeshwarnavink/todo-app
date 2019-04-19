import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  loading: false,
  groups: [],
  groupsError: false,
  group: {},
  groupMembersLoading: false,
  groupMembers: [],
  groupMembersError: false
};

const groupStart = (state, action) => {
  return updateObject(state, {
    loading: true
  });
};

const groupSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    groups: action.groups
  });
};

const groupFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    groupsError: true
  });
};

const setGroup = (state, action) => {
  return updateObject(state, {
    group: action.group
  });
};

const startGroupMembers = (state, action) => {
  return updateObject(state, {
    groupMembersLoading: true
  });
};

const successGroupMembers = (state, action) => {
  return updateObject(state, {
    groupMembersLoading: false,
    groupMembers: action.groupMembers
  });
};

const failedGroupMembers = (state, action) => {
  return updateObject(state, {
    groupMembersLoading: false,
    groupMembersError: true
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GROUPS_START:
      return groupStart(state, action);

    case actionTypes.GROUPS_SUCCESS:
      return groupSuccess(state, action);

    case actionTypes.GROUPS_FAILED:
      return groupFailed(state, action);

    case actionTypes.SET_GROUP:
      return setGroup(state, action);

    case actionTypes.START_GROUP_MEMBERS:
      return startGroupMembers(state, action);

    case actionTypes.SUCCESS_GROUP_MEMBERS:
      return successGroupMembers(state, action);

    case actionTypes.FAILED_GROUP_MEMBERS:
      return failedGroupMembers(state, action);

    default:
      return state;
  }
};

export default reducer;
