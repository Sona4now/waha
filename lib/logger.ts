/**
 * Minimal structured logger. Wraps console.error so callsites stop using
 * raw `console.log`. When you wire Sentry/LogRocket later, replace the
 * implementations here — callsites stay untouched.
 */

type LogContext = Record<string, unknown>;

function format(level: string, scope: string, msg: string, ctx?: LogContext) {
  const base = `[${level}][${scope}] ${msg}`;
  if (ctx && Object.keys(ctx).length > 0) {
    return [base, ctx];
  }
  return [base];
}

export const logger = {
  info(scope: string, msg: string, ctx?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      console.log(...format("INFO", scope, msg, ctx));
    }
  },
  warn(scope: string, msg: string, ctx?: LogContext) {
    console.warn(...format("WARN", scope, msg, ctx));
  },
  error(scope: string, msg: string, ctx?: LogContext) {
    console.error(...format("ERROR", scope, msg, ctx));
  },
};
