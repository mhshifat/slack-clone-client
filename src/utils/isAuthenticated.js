import decode from "jwt-decode";

export default () => {
  try {
    decode(localStorage.getItem("token"));
    decode(localStorage.getItem("refreshToken"));
    return true;
  } catch (err) {
    return false;
  }
};
