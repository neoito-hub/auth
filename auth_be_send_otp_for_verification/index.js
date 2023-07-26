/* eslint-disable import/extensions */
import { shared, env } from "@appblocks/node-sdk";
import hbs from "hbs";
import otpTemp from "./templates/otp-email-temp.js";

env.init();
const handler = async (event) => {
  const { req, res } = event;

  const {
    sendResponse,
    getBody,
    prisma,
    validateRequestMethod,
    checkHealth,
    isEmpty,
    redis,
    sendMail,
    generateRandomString,
  } = await shared.getShared();
  try {
    // health check
    checkHealth(req, res);

    await validateRequestMethod(req, ["POST"]);

    const requestBody = await getBody(req);

    if (isEmpty(requestBody) || !requestBody.hasOwnProperty("user_id")) {
      return sendResponse(res, 400, {
        message: "Please provide a User ID",
      });
    }

    const user = await prisma.admin_users.findFirst({
      where: {
        id: requestBody.user_id,
      },
    });

    if (!user) {
      return sendResponse(res, 400, {
        message: "Invalid User ID",
      });
    }

    //otp is retreived from redis if they exists, or new otp is generated
    let otp;
    if (await redis.get(user.id)) {
      otp = await redis.get(user.id);
    } else {
      otp = generateRandomString();

      // Store the otp with an expiry stored in env.function in seconds
      await redis.set(user.id, otp, {
        EX: Number(process.env.BB_AUTH_OTP_EXPIRY_TIME_IN_SECONDS),
      });
    }

    const emailTemplate = hbs.compile(otpTemp);

    const message = {
      to: user.email,
      from: {
        name: process.env.BB_AUTH_MAILER_NAME,
        email: process.env.BB_AUTH_MAILER_EMAIL,
      },
      subject: "Verify OTP",
      text: "Please verify your otp",
      html: emailTemplate({
        logo: process.env.BB_AUTH_LOGO_URL,
        user: user.full_name,
        otp,
      }),
    };
    await sendMail(message);

    return sendResponse(res, 200, {
      data: { user_id: user.id, email: user.email, name: user.full_name },
      message:
        "We have sent you an email containing One time password to registered email",
    });
  } catch (e) {
    console.log(e.message);
    if (e.errorCode && e.errorCode < 500) {
      return sendResponse(res, e.errorCode, {
        message: e.message,
      });
    } else {
      return sendResponse(res, 500, {
        message: "failed",
      });
    }
  }
};

export default handler;
