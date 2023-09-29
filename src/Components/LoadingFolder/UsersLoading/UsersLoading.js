import React from "react";

import './usersloading.css'


const data = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
];
const UsersLoading = () => {
  return (
    <div className="loading-chat-container ">
      {data.map((item) => {
        return (
          <div
            key={item.id}
            className="loading-chat-item "
          >
            <div className="loading-profile-image"></div>
            <div className="loading-name-and-text">
              <div className="loading-name"></div>
              <div className="loading-text"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersLoading