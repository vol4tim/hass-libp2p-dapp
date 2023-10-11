import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { pipe } from "it-pipe";
import { createLibp2p } from "libp2p";
import { identifyService } from "libp2p/identify";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

export const createNode = async () => {
  const node = await createLibp2p({
    transports: [
      webSockets({
        filter: filters.all
      })
    ],
    streamMuxers: [mplex()],
    connectionEncryption: [noise()],
    services: {
      identify: identifyService()
    },
    connectionGater: {
      denyDialMultiaddr: () => {
        return false;
      }
    }
  });
  return node;
};

export async function request(connection, topic, data) {
  if (connection.status !== "open") {
    return;
  }
  const stream = await connection.newStream([topic]);
  return pipe(
    [uint8ArrayFromString(JSON.stringify(data))],
    stream,
    async function (source) {
      let result = "";
      for await (const data of source) {
        result += uint8ArrayToString(data.subarray());
      }
      try {
        return JSON.parse(result);
      } catch (error) {
        return result;
      }
    }
  );
}
