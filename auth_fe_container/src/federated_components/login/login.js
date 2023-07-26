import React from "react";
import { useFederatedComponent } from "@appblocks/js-sdk";

const Login = (props) => {
  const system = {
    url: process.env.BB_AUTH_ELEMENTS_URL,
    scope: "remotes",
    module: "./auth_fe_login",
  };
  const { Component: FederatedComponent, errorLoading } = useFederatedComponent(
    system?.url,
    system?.scope,
    system?.module,
    React
  );

  return (
    <>
      <React.Suspense fallback={""}>
        {errorLoading
          ? `Error loading module "${module}"`
          : FederatedComponent && <FederatedComponent {...props} />}
      </React.Suspense>
      {/* <div className="text-white">fghjklkjhgf</div>s */}
    </>
  );
};

export default Login;
