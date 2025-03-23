import "dotenv/config";

export default {
  expo: {
    name: "TaskFlow",
    slug: "task-flow",
    scheme: "myapp",
    extra: {
      SERVER_ROUTE: process.env.SERVER_ROUTE,
    }
  }
};