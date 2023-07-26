import * as Yup from "yup";

const verifyOtpSchema = Yup.object().shape({
  user_id: Yup.string().required("Field required"),
  otp: Yup.string().required("Field required").max(6).min(6),
});

const validation = {
  verifyOtpSchema,
};

export default validation;
