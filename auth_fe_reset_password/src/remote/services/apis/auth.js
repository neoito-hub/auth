import { request } from "../request";

const APP_ENTRYPOINT = process.env.BB_AUTH_FUNCTION_URL;

const resetPass = async (values) => {
  const response = await request.put(
    `${APP_ENTRYPOINT}/auth_be_reset_password`,
    values
  );
  return response;
};

const auth = {
  resetPass,
};

export default auth;
