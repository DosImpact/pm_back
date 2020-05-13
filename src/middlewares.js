export const isAuthenticated = (request) => {
  if (!request.user) {
    throw Error("Need Logged in");
  }
  return true;
};
