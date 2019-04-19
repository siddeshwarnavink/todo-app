import React, { Component } from "react";

import classes from "./UsersList.module.css";

import UserListItem from "./UserListItem/UserListItem";
import SearchInput, { createFilter } from "react-search-input";

class UserList extends Component {
  state = {
    searchTerm: ""
  };

  searchUpdated = term => {
    this.setState({ searchTerm: term });
  };

  render() {
    const filteredUser = this.props.users.filter(
      createFilter(this.state.searchTerm, ["username"])
    );

    return (
      <div>
        <SearchInput onChange={this.searchUpdated} className="search-input" />
        {filteredUser.length > 0 ? (
          <ul className={classes.UserList}>
            {filteredUser.map((user, i) => (
              <UserListItem
                key={i}
                id={user.id}
                username={user.username}
                isAdmin={user.isAdmin}
              />
            ))}
          </ul>
        ) : (
          <p>No user :-)</p>
        )}
      </div>
    );
  }
}

export default UserList;
