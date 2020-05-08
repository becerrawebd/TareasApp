export const authMiddleware = (history) => {
  const authToken = localStorage.getItem("AuthToken");
  if (authToken === null) {
    history.push("/login");
    return false;
  }
  return true;
};
