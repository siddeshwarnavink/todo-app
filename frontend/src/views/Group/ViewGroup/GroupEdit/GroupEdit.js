import React, { useState, useEffect } from "react";
import EditGroup from "../../../../components/Groups/EditGroup/EditGroup";
import updateObject from "../../../../utility/updateObject";
import axios from "../../../../axios";
import Spinner from "../../../../components/UI/Spinner/Spinner";

const GroupEdit = props => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const members = [];

  props.groupMembers.forEach(member => {
    members.push(member.id);
  });

  useEffect(() => {
    axios
      .post(
        `/?token=${localStorage.getItem("token")}`,
        JSON.stringify({
          query: `
                {
                    companyStaics {
                        members {
                            id
                            username
                        }
                    }
                }  
                `
        })
      )
      .then(({ data }) => {
        setAllUsers(data.data.companyStaics.members);
        setLoading(false);
      });
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <EditGroup
      {...props}
      groupData={updateObject(props.groupData, {
        members,
        allUsers
      })}
    />
  );
};

export default GroupEdit;
