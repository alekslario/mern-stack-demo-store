import cookie from "js-cookie";
import Router from "next/router";

const handleLogin = token => {
  cookie.set("token", token);
  Router.push("/account");
};

const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};

const handleLogout = () => {
  cookie.remove("token");
  window.localStorage.setItem("logout", Date.now());
  Router.push("/login");
};

export { handleLogin, redirectUser, handleLogout };
