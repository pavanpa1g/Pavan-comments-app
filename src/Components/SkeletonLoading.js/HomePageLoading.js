import React from "react";
import "./skeleton.css";

const HomePageLoading = () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 },{ id: 4 }, { id: 5 }, { id: 7 }];
  return (
    <div className=" skeleton-container ">
      {data.map((item) => (
        <div
          className="skeleton-item box-shadow-item "

          key={item.id}
        >
          <div className="flex items-center">
            <div className="skeleton-profile">
              {/* {profile skeleton} */}
            </div>
            <div className="skeleton-user-text">
              {/* {user text skeleton} */}
            </div>
            <div className="skeleton-timestamp">
              {/* {timestamp skeleton} */}
            </div>
          </div>

          <div className="skeleton-image">
            {" "}
            {/* {image skeleton} */}
          </div>

          <div className="flex-center-item-center">
            <div className="skeleton-comment-input">
              {/* {comment input skeleton} */}
            </div>
            <div className="skeleton-like">
              {/* {like skeleton } */}
            </div>
            <div className="skeleton-comment">
              {/* {comment skeleton } */}
            </div>
          </div>
          <div className="skeleton-actions">

            </div>
        </div>
      ))}
    </div>
  );
};

export default HomePageLoading;
