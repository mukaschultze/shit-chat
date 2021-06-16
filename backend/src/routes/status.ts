import { FastifyPluginAsync } from "fastify";

const status: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/status", async function (request, reply) {
    return "OK";
  });
};

export default status;
