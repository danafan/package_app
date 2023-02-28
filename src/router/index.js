import Vue from "vue";
import Router from "vue-router";

const login = (resolve) => require(["@/pages/login"], resolve);
const index = (resolve) => require(["@/pages/index"], resolve);
const package_page = (resolve) => require(["@/pages/package_page"], resolve);
const printer = (resolve) => require(["@/pages/printer"], resolve);

Vue.use(Router);

const router = new Router({
  routes: [
  {
    path: "/login",
    component: login,
    name: "登录",
  },
  {
    path: "/index",
    component: index,
    name: "打包系统",
  },
  {
    path: "/package_page",
    component: package_page,
    name: "打包",
  },
  {
    path: "/printer",
    component: printer,
    name: "选择打印机",
  }
  ]
});

router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(from)
  next();
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
export default router;
