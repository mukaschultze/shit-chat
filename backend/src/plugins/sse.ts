import fp from "fastify-plugin";
import { FastifySSEPlugin } from "fastify-sse-v2";
import { SsePluginOptions } from "fastify-sse-v2/lib/types";

export default fp<SsePluginOptions>(async (fastify, opts) => {
  fastify.register(FastifySSEPlugin, opts);
});
