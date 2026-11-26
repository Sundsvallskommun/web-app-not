import cors from 'cors';
import { RequestHandler } from 'express';

interface CorsMiddlewareOptions {
  /** Comma-separated list of allowed origins, as in the ORIGIN env var. `*` allows any. */
  allowedOrigins: string;
  credentials: boolean;
  /** Allow every origin (local development). */
  allowAnyOrigin: boolean;
  /**
   * Paths that skip the origin check entirely. The SAML callbacks receive a cross-origin form
   * POST from the IdP (Origin: the IdP, or `null`). That is a top-level navigation, not a CORS
   * request, and the SAML response is authenticated by its signature, so rejecting it here would
   * only turn a valid login into a 500.
   */
  exemptPaths: string[];
}

export const createCorsMiddleware = ({ allowedOrigins, credentials, allowAnyOrigin, exemptPaths }: CorsMiddlewareOptions): RequestHandler => {
  const whitelist = new Set(
    allowedOrigins
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin !== ''),
  );
  const exempt = new Set(exemptPaths);

  const corsHandler = cors({
    credentials,
    origin: (origin, callback) => {
      if (origin === undefined || allowAnyOrigin || whitelist.has('*') || whitelist.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  return (req, res, next) => {
    if (exempt.has(req.path)) {
      next();
      return;
    }
    corsHandler(req, res, next);
  };
};
