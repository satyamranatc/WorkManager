import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

dotenv.config();

// Middleware to validate the JWT
export const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

// Middleware to attach user info to the request object
// In a real Auth0 setup, the 'sub' field in the JWT is the unique User ID
export const attachUser = (req, res, next) => {
  if (req.auth && req.auth.payload) {
    req.userId = req.auth.payload.sub;
    console.log(`User attached: ${req.userId}`);
  } else {
    console.warn("Auth info missing in request - attachUser middleware");
  }
  next();
};
