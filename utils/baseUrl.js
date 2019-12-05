const baseUrl =
  process.env.NODE_ENV === "production"
    ? "react-next-demo.now.sh"
    : "http://localhost:3000";

export default baseUrl;
