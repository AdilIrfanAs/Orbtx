import React, { useEffect } from "react";

const AuthLayout = ({ title, children }) => {

  useEffect(() => {
    if (title)
      document.title = title;
    else
      document.title = "OrbtX";
  }, [title]);

  useEffect(() => {
    if (localStorage.uToken) {
      window.location.href = '/portfolio';
    }
  }, []);

  return <div className="auth-layout">
    {children}
  </div>
};

export default AuthLayout;
