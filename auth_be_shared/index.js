import httpStatusCodes from "./utils/httpStatusCodes.js";
import prisma from "./utils/prisma.js";
import validateRequestMethod from "./validation/validateMethod.js";
import authenticateUser from "./validation/validateUser.js";
import { createClient } from "redis";
import { env } from "@appblocks/node-sdk";
import { sendMail } from "./emailService.js";
import generateRandomString from "./generateRandomString.js";

/**
 * Function to format and send response
 * @param {*} res
 * @param {*} code
 * @param {*} data
 * @param {*} type
 */
const sendResponse = (res, code, data, type = "application/json") => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    "Content-Type": type,
  };
  console.log("END:", data, code);

  res.writeHead(code, headers);
  res.write(JSON.stringify(data));
  res.end();
};

/**
 * Function to extract the body from the request
 * @param {*} req
 * @returns
 */
const getBody = async (req) => {
  const bodyBuffer = [];
  for await (const chunk of req) {
    bodyBuffer.push(chunk);
  }
  const data = Buffer.concat(bodyBuffer).toString();
  return JSON.parse(data || "{}");
};

const checkHealth = (req, res) => {
  if (req.params.health === "health") {
    sendResponse(res, 200, { success: true, message: "Health check success" });
    return true;
  }
  return false;
};

const isEmpty = (value) => {
  if (value === null) {
    return true;
  }
  if (typeof value !== "number" && value === "") {
    return true;
  }
  if (typeof value === "undefined" || value === undefined) {
    return true;
  }
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.keys(value).length
  ) {
    return true;
  }
  return false;
};

env.init();

const redis = createClient({
  url: `redis://${process.env.BB_AUTH_REDIS_HOST}:${process.env.BB_AUTH_REDIS_PORT}`,
});

// const redis = createClient();

redis.on("error", (err) => {
  console.log("\nRedis client error ");
  console.log(err);
  console.log("\n");
});

redis.on("connect", (e) => {
  console.log("\nRedis client connected");
});

(async () => {
  await redis.connect();
})();

export default {
  sendResponse,
  getBody,
  httpStatusCodes,
  prisma,
  validateRequestMethod,
  authenticateUser,
  checkHealth,
  isEmpty,
  redis,
  sendMail,
  generateRandomString,
};
