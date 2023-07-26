import { request } from "../request";

const APP_ENTRYPOINT = process.env.BB_AUTH_FUNCTION_URL;

const login = async (values) => {
  const response = await request.post(
    `${APP_ENTRYPOINT}/auth_be_login`,
    values
  );
  return response;
};

const auth = {
  login,
};

export default auth;
