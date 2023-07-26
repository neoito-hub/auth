import { shared, env } from "@appblocks/node-sdk";

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
    generateRandomString,
  } = await shared.getShared();
  try {
    // health check
    checkHealth(req, res);

    await validateRequestMethod(req, ["POST"]);

    const requestBody = await getBody(req);

    if (
      isEmpty(requestBody) ||
      !requestBody.hasOwnProperty("user_id") ||
      !requestBody.hasOwnProperty("otp") ||
      requestBody?.otp?.length !== 6
    ) {
      return sendResponse(res, 400, {
        message: "Please provide a valid User ID and OTP",
      });
    }

    const user = await prisma.admin_users.findFirst({
      where: {
        id: requestBody.user_id,
      },
    });

    if (!user) {
      return sendResponse(res, 400, {
        message: "Please enter a valid user id",
      });
    } else {
      // Retrieve the value of the key
      const otp = await redis.get(user.id);
      if (!otp) {
        return sendResponse(res, 400, {
          message: "Invalid OTP. Please try again or generate new otp",
        });
      }

      if (otp == requestBody.otp) {
        const userAuthToken = generateRandomString(32);
        // Store the otp with an expiry stored in env.function in seconds
        await redis.set(userAuthToken, user.id, {
          EX: Number(process.env.BB_AUTH_OTP_EXPIRY_TIME_IN_SECONDS),
        });

        sendResponse(res, 200, {
          data: { user_auth_token: userAuthToken },
          message: "OTP verified successfully",
        });
      } else {
        return sendResponse(res, 400, {
          message: "Invalid OTP. Please try again or generate new otp",
        });
      }
    }
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
