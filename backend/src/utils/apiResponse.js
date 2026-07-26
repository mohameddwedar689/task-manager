/**
 * Consistent success-response shape across every endpoint.
 * Keeping this in one helper means the frontend can always rely on
 * { success, data, meta } instead of guessing each endpoint's shape.
 */
function sendSuccess(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess };
