import { FastifyPluginAsync } from "fastify";
import { fromEvent, Observable } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { MESSAGE_LIVESPAN, STREAM_NAME } from "../constants";
import { kvpToObj, observableToEventIterator } from "../utils";

interface EventMessage {
  /** Message payload */
  data?: string;
  /** Message identifier, if set, client will send `Last-Event-ID: <id>` header on reconnect */
  id?: string;
  /** Message type */
  event?: string;
  /** Update client reconnect interval (how long will client wait before trying to reconnect). */
  retry?: number;
}

const stream: FastifyPluginAsync = async (fastify, opts) => {
  function messageStream(lastId: string) {
    return new Observable<[string, string[]]>((subscriber) => {
      const redis = fastify.redis.duplicate();

      async function listenForMessage(id: string) {
        const results = await redis.xread(
          "BLOCK",
          0,
          "STREAMS",
          STREAM_NAME,
          id
        );
        const [, messages] = results[0];

        messages.forEach((message) => subscriber.next(message));

        if (!subscriber.closed) {
          await listenForMessage(messages[messages.length - 1][0]);
        }
      }

      listenForMessage(lastId)
        .then(() => subscriber.complete())
        .catch((err) => subscriber.error(err));
    });
  }

  fastify.get("/stream", function (request, reply) {
    const initialEvent = `${+new Date() - MESSAGE_LIVESPAN}-0`;
    const lastEventId =
      typeof request.headers["Last-Event-ID"] === "string"
        ? request.headers["Last-Event-ID"]
        : undefined || initialEvent;

    const obs$ = messageStream(lastEventId).pipe(
      map(([id, fields]) => kvpToObj([id, fields])),
      map((m) => ({ ...m, mine: m.ip === request.ip, ip: undefined })),
      map((m) => ({ id: m.id, data: JSON.stringify(m) } as EventMessage)),
      takeUntil(fromEvent(request.raw, "close"))
    );

    reply.sse(observableToEventIterator(obs$));
  });
};

export default stream;
