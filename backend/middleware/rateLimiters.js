import { rateLimit } from "express-rate-limit";

const windowMs = 15 * 60 * 1000;

function handleRateLimit(_request, response, _next, options) {
  response.status(options.statusCode).json({ message: options.message });
}

const sharedOptions = {
  windowMs,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
  handler: handleRateLimit,
};

export const apiLimiter = rateLimit({
  ...sharedOptions,
  limit: 300,
});

export const authLimiter = rateLimit({
  ...sharedOptions,
  limit: 10,
  skipSuccessfulRequests: true,
});
