<template>
  <robo-layout-section>
    <robo-section offset="x0" width="narrow">
      <robo-grid offset="x1" gap="x1">
        <robo-grid-item v-if="!status">
          <robo-input label="Multiaddr" v-model="addr" />
          <robo-button block @click="connect">connect</robo-button>
        </robo-grid-item>
        <robo-grid-item v-else>
          <robo-button block @click="disconnect">disconnect</robo-button>
        </robo-grid-item>
        <robo-grid-item v-if="status">
          <robo-input label="Call" v-model="command" />
          <robo-button block @click="send">send</robo-button>
          <robo-text highlight="attention">{{ response }}</robo-text>
          <div v-if="ha">
            <h3>Data</h3>
            <div>
              <pre><code>{{ ha }}</code></pre>
            </div>
          </div>
        </robo-grid-item>
      </robo-grid>
    </robo-section>
  </robo-layout-section>
</template>

<script>
import { multiaddr } from "@multiformats/multiaddr";
import { ref } from "vue";
import { createNode, handle, request, sendResponse } from "../utils/libp2p";

export default {
  setup() {
    const addr = ref(
      // "/ip4/127.0.0.1/tcp/10333/ws/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm"
      "/dns4/vol4.work.gd/tcp/443/wss/p2p/12D3KooWEmZfGh3HEy7rQPKZ8DpJRYfFcbULN97t3hGwkB5xPmjn/p2p-circuit/p2p/12D3KooWLK5cFWH47W16TKVdeyUvwey8GxYUG9TtpJ91gSaiQWJc"
    );
    const status = ref(false);
    const command = ref(JSON.stringify({ device: "lamp", state: "on" }));
    const response = ref("");
    const ha = ref(null);
    let node;
    let connection;

    setInterval(() => {
      status.value = !!(connection && connection.status === "open");
    }, 1000);

    (async () => {
      node = await createNode();
      await node.start();
      console.log(`Node started with id ${node.peerId.toString()}`);
    })();

    const connect = async () => {
      try {
        const listenerMultiaddr = multiaddr(addr.value);
        connection = await node.dial(listenerMultiaddr);
        handle(node, "/update", async (msg, stream) => {
          ha.value = msg;
          await sendResponse(stream, { result: true });
        });
      } catch (error) {
        console.log(error);
      }
      response.value = "";
    };

    const disconnect = async () => {
      try {
        ha.value = null;
        node.unhandle("/update");
        await connection.close();
      } catch (error) {
        console.log(error);
      }
    };

    const send = async () => {
      response.value = "";
      if (!status.value) {
        return;
      }
      let call = command.value;
      try {
        call = JSON.parse(call);
      } catch (error) {
        console.log(error);
      }
      response.value = await request(connection, "/call", call);
    };

    return {
      addr,
      status,
      command,
      response,
      connect,
      disconnect,
      send,
      ha
    };
  }
};
</script>
