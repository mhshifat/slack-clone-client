export default (token, refreshToken) => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};
