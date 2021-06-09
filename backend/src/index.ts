import Fastify from "fastify";
import serverFactory from "./app";

const fastify = Fastify({
  trustProxy: true,
  logger: { level: "info" },
});

serverFactory(fastify, {});

fastify.listen(3000, "0.0.0.0");
