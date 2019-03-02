import React, { useState } from "react";

import GroupListItem from "./GroupListItem/GroupListItem";
import SearchInput, { createFilter } from "react-search-input";

import classes from "./GroupList.module.css";

const GroupList = props => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchTermUpdatedHandler = term => {
    setSearchTerm(term);
  };

  const filteredGroups = props.groups.filter(
    createFilter(searchTerm, ["title"])
  );

  return (
    <div>
      <SearchInput
        onChange={searchTermUpdatedHandler}
        className="search-input"
      />
      {filteredGroups.length > 0 ? (
        <ul className={classes.GroupList}>
          {filteredGroups.map((group, i) => (
            <GroupListItem key={i} id={group.id} title={group.title} />
          ))}
        </ul>
      ) : (
        <p>No groups :-)</p>
      )}
    </div>
  );
};

export default GroupList;
