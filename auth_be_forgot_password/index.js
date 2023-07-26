import { shared } from "@appblocks/node-sdk";

const handler = async (event) => {
  const { req, res } = event;

  const {
    getBody,
    sendResponse,
    isEmpty,
    prisma,
    validateRequestMethod,
    checkHealth,
  } = await shared.getShared();

  try {
    // health check
    checkHealth(req, res);
    await validateRequestMethod(req, ["POST"]);

    const requestBody = await getBody(req);
    const { email } = requestBody;

    if (isEmpty(requestBody) || !requestBody.hasOwnProperty("email")) {
      return sendResponse(res, 400, {
        message:
          "Please provide the email address associated with your account.",
      });
    }

    const user = await prisma.admin_users.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return sendResponse(res, 400, {
        message: "No account found with the provided email.",
      });
    } else {
      return sendResponse(res, 200, {
        data: { user_id: user.id },
        message: "User data fetched",
      });
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
