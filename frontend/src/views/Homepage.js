import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./Homepage.module.css";
import * as actions from "../store/actions";
import authRequired from "../hoc/authRequired/authRequired";

import GroupCard from "../components/Groups/GroupCard/GroupCard";
import Spinner from "../components/UI/Spinner/Spinner";

class Homepage extends Component {
  constructor(props) {
    super(props);

    props.initGroups();
  }

  render() {
    return (
      <main>
        <h1>Groups</h1>
        {!this.props.groupsLoading ? (
          <div bp="grid 4">
            {this.props.groups.map(group => (
              <GroupCard
                key={group.id}
                id={group.id}
                title={group.title}
                description={group.description}
              />
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </main>
    );
  }
}

const mapStateToProps = state => ({
  groupsLoading: state.groups.loading,
  groups: state.groups.groups
});

const mapDispatchToProps = dispatch => ({
  initGroups: () => dispatch(actions.initGroups())
});

export default authRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Homepage)
);
