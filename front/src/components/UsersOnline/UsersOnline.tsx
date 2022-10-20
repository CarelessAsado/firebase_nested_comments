import React from "react";
import UserOnlineItem from "./auxiliaries/UserOnlineItem";

const UsersOnline = ({ users }: { users: UserNotNull[] }) => {
  if (users.length === 0) {
    return <>"NO USERS ONLINE AT THE MOMENT"</>;
  }
  return (
    <>
      {users.map((i) => {
        return <UserOnlineItem userOnline={i} />;
      })}
    </>
  );
};

export default UsersOnline;
