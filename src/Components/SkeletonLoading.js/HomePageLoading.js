import React from "react";
import "./skeleton.css";

const HomePageLoading = () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 },{ id: 4 }, { id: 5 }, { id: 7 }];
  return (
    <div className="w-full flex flex-wrap justify-between mt-3 ">
      {data.map((item) => (
        <div
          className="w-full sm:w-[49%] lg:w-[32%]  rounded-md mb-2 box-shadow-item px-4 py-4 "

          key={item.id}
        >
          <div className="flex items-center ">
            <div className="w-[28px] h-[28px] rounded-full bg-gray-400 mr-2 animate-pulse">
              {/* {profile skeleton} */}
            </div>
            <div className="w-[90px] bg-gray-300 h-[20px] rounded animate-pulse">
              {/* {user text skeleton} */}
            </div>
            <div className="w-[70px] h-[18px] bg-gray-200 ml-auto rounded animate-pulse">
              {/* {timestamp skeleton} */}
            </div>
          </div>

          <div className="h-[150px] bg-gray-200 animate-pulse  my-2 ">
            {" "}
            {/* {image skeleton} */}
          </div>

          <div className="flex items-center">
            <div className="w-[150px] bg-gray-300 h-[30px] rounded animate-pulse">
              {/* {comment input skeleton} */}
            </div>
            <div className="w-[20px] h-[20px] rounded bg-gray-300 ml-auto mr-2 animate-pulse">
              {/* {like skeleton } */}
            </div>
            <div className="w-[20px] h-[20px] rounded bg-gray-300 animate-pulse">
              {/* {comment skeleton } */}
            </div>
          </div>
          <div className="flex items center justify-between h-[30px] bg-gray-200 mt-2 animate-pulse">

            </div>
        </div>
      ))}
    </div>
  );
};

export default HomePageLoading;
