export const handleAsync = async (fn, { onError, onFinally } = {}) => {
  try {
    return await fn();
  } catch (err) {
    if (onError) {
      onError(err);
    } else {
      console.error("Unhandled async error:", err);
    }
    throw err; // Optional: Rethrow if the calling code still wants to catch
  } finally {
    if (onFinally) {
      onFinally();
    }
  }
};
