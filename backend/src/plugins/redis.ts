import fp from "fastify-plugin";
import fastifyRedis from "fastify-redis";
import { SsePluginOptions } from "fastify-sse-v2/lib/types";

export default fp<SsePluginOptions>(async (fastify, opts) => {
  fastify.register(fastifyRedis, { host: "redis" });
});
