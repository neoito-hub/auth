// import { APP_ENTRYPOINT } from '@/config/config';
import { request } from "../request";

const APP_ENTRYPOINT = process.env.BB_AUTH_FUNCTION_URL;

const verifyOtp = async (values) => {
  const response = await request.post(
    `${APP_ENTRYPOINT}/auth_be_verify_otp`,
    values
  );
  return response;
};
const sendOtpForVerification = async (values) => {
  const response = await request.post(
    `${APP_ENTRYPOINT}/auth_be_send_otp_for_verification`,
    values
  );
  return response;
};

const auth = {
  verifyOtp,
  sendOtpForVerification,
};

export default auth;
