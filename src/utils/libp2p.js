import { noise } from "@chainsafe/libp2p-noise";
// import { yamux } from "@chainsafe/libp2p-yamux";
import { mplex } from "@libp2p/mplex";
import { webRTC } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import { pipe } from "it-pipe";
import { createLibp2p } from "libp2p";
import { circuitRelayTransport } from "libp2p/circuit-relay";
import { identifyService } from "libp2p/identify";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

export const createNode = async () => {
  const node = await createLibp2p({
    addresses: {
      listen: ["/webrtc"]
    },
    transports: [
      webSockets({
        filter: filters.all
      }),
      webRTC(),
      circuitRelayTransport({
        discoverRelays: 1
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

  node.addEventListener("self:peer:update", () => {
    // Update multiaddrs list
    const multiaddrs = node.getMultiaddrs().map((ma) => {
      return ma.toString();
    });
    console.log("Update multiaddrs list", multiaddrs);
  });

  function updateConnList() {
    // Update connections list
    const connListEls = node.getConnections().map((connection) => {
      return connection.remoteAddr.toString();
    });
    console.log("Update Conn List", connListEls);
  }

  node.addEventListener("connection:open", () => {
    updateConnList();
  });
  node.addEventListener("connection:close", () => {
    updateConnList();
  });

  return node;
};

export async function request(connection, topic, data) {
  console.log(1);
  if (connection.status !== "open") {
    return;
  }
  console.log(2);
  const stream = await connection.newStream([topic], {
    runOnTransientConnection: true
  });
  console.log(3);
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
