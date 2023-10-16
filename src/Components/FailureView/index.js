import Image from "next/image";
import React from "react";

import "./index.css";

const FailureView = ({ handleRetry }) => {
  return (
    <div className="failure-inner-container ">
      <Image
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        width={240}
        height={240}
        objectFit="cover"
      />
      <p className="text-black font-semibold">Something went wrong!</p>
      <button
        className="bg-blue-500 px-4 py-2 rounded self-center"
        onClick={handleRetry}
      >
        Retry
      </button>
    </div>
  );
};

export default FailureView;
