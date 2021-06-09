import fastifyCORS, { FastifyCorsOptions } from "fastify-cors";
import fp from "fastify-plugin";

export default fp<FastifyCorsOptions>(async (fastify, opts) => {
  fastify.register(fastifyCORS, {
    origin: "*",
  });
});
