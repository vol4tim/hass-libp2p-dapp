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
        </robo-grid-item>
      </robo-grid>
    </robo-section>
  </robo-layout-section>
</template>

<script>
import { multiaddr } from "@multiformats/multiaddr";
import { ref } from "vue";
import { createNode, request } from "../utils/libp2p";

export default {
  setup() {
    const addr = ref(
      "/ip4/127.0.0.1/tcp/10333/ws/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm"
    );
    const status = ref(false);
    const command = ref(JSON.stringify({ device: "id1", command: "on" }));
    const response = ref("");
    let node;
    let connection;

    setInterval(() => {
      status.value = !!(connection && connection.status === "open");
    }, 1000);

    (async () => {
      node = await createNode();
      await node.start();
    })();

    const connect = async () => {
      try {
        const listenerMultiaddr = multiaddr(addr.value);
        connection = await node.dial(listenerMultiaddr);
        console.log(connection.remoteAddr.toString(), connection.status);
      } catch (error) {
        console.log(error);
      }
      response.value = "";
    };

    const disconnect = async () => {
      try {
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

    return { addr, status, command, response, connect, disconnect, send };
  }
};
</script>
