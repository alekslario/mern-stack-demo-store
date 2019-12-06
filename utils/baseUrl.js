const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://next-react.now.sh"
    : "http://localhost:3000";

export default baseUrl;
