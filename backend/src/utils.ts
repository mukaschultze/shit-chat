import * as crypto from "crypto";
import EventIterator from "event-iterator";
import { Observable } from "rxjs";

export function observableToEventIterator<T>(observable: Observable<T>) {
  return new EventIterator<T>((queue) => {
    const sub = observable.subscribe(
      (data) => queue.push(data),
      (err) => queue.fail(err),
      () => queue.stop()
    );
    return () => sub.unsubscribe();
  });
}

export function kvpToObj([id, fields]: [string, string[]]) {
  const obj: Record<string, string> & { id: string } = { id };
  for (let i = 0; i < fields.length; i += 2) {
    obj[fields[i]] = fields[i + 1];
  }
  obj.id = id;
  return obj;
}

export function objToKvp(obj: Record<string, string>) {
  return Object.entries(obj).flatMap(([key, value]) => [key, value]);
}

export function robohash(data: string, set: number) {
  return `https://robohash.org/${data}.png?set=set${set}`;
}

export function md5(data: string) {
  return crypto.createHash("md5").update(data).digest("hex");
}
