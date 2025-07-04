export const handleAsync = async (fn) => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
