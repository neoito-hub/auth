/* eslint-disable max-len */
import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "./PublicRoute";
import url_constants from "../common/url_constants";

const { LOGIN, RESET_PASSWORD, VERIFY_EMAIL, FORGOT_PASSWORD } = url_constants;

export default function RouterMain() {
  const Login = lazy(() => import("../federated_components/login/login"));
  const VerifyEmail = lazy(() =>
    import("../federated_components/verify-email/verify-email")
  );
  const ResetPassword = lazy(() =>
    import("../federated_components/reset-password/reset-password")
  );
  const ForgotPassword = lazy(() =>
    import("../federated_components/forgot-password/forgot-password")
  );

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={RESET_PASSWORD}
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path={VERIFY_EMAIL}
          element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          }
        />
        <Route
          path={FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  );
}
