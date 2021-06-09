import { FastifyPluginAsync } from "fastify";
import { STREAM_NAME } from "../constants";
import { md5, objToKvp, robohash } from "../utils";

function bodyIsMessagePost(body: any): body is {
  content: string;
} {
  if (typeof body !== "object") return false;
  if (!body.content) return false;
  return true;
}

const message: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/messages", async function (request, reply) {
    if (!bodyIsMessagePost(request.body))
      return reply.badRequest("Body is in the wrong format");

    const salt = "c9d5fe6c-979a-4a86-9d2a-234d79bb1d89";
    const message = {
      content: request.body.content,
      date: new Date().toISOString(),
      ip: request.ip,
      avatar: robohash(md5(`${salt}-${request.ip}`), 4),
    };

    const kvp = objToKvp(message);
    const id = await fastify.redis.xadd(STREAM_NAME, "*", ...kvp);

    return { id, ...message };
  });
};

export default message;
