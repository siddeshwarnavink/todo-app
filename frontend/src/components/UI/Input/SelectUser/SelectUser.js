import React, { Component } from "react";

import classes from "./SelectUser.module.css";

import SearchInput, { createFilter } from "react-search-input";
import Checkbox from "../../Checkbox/Checkbox";
import Spinner from "../../Spinner/Spinner";

class SelectUser extends Component {
  state = {
    searchTerm: "",
    selectedUsers: []
  };

  searchUpdated = term => {
    this.setState({ searchTerm: term });
  };

  onChangeHandler = (event, userId) => {
    let users = [...this.state.selectedUsers];

    if (event.target.checked) {
      users.push(userId);
    } else {
      users = users.filter(uid => uid !== userId);
    }

    this.setState({
      selectedUsers: users
    });

    this.props.changed({
      target: {
        value: users
      }
    });
  };

  componentDidMount() {
    this.setState({
      selectedUsers: this.props.value
    });
  }

  render() {
    const filteredUser = this.props.users.filter(
      createFilter(this.state.searchTerm, ["username"])
    );

    return (
      <div className={classes.SelectUser}>
        <div className={classes.Header}>
          <h3>Select Users</h3>
        </div>

        {!this.props.loading ? (
          <>
            <SearchInput
              onChange={this.searchUpdated}
              className="search-input"
            />

            <ul className={classes.List}>
              {filteredUser.map((user, i) => (
                <li key={i}>
                  <span>{user.username}</span>
                  <Checkbox
                    onChange={event => this.onChangeHandler(event, user.id)}
                    checked={this.state.selectedUsers.indexOf(user.id) !== -1}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default SelectUser;
