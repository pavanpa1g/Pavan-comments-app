"use client";
import React, { useEffect } from "react";
import ProtectedRoute from "../../Components/ProtectedRoute";

const About = () => {
  useEffect(() => {}, []);
  return <div>page</div>;
};

export default () => (
  <ProtectedRoute>
    <About />
  </ProtectedRoute>
);


// export default middleware(About)