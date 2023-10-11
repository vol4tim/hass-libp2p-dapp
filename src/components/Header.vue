<template>
  <robo-layout-header
    logoIcon="images/logo-white.png"
    :title="title"
    :version="version"
  />
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Robonomics Dapp"
    }
  },
  data() {
    return {
      navigation: [
        {
          title: "Other",
          links: [
            {
              title: "Services",
              // link: this.$router.resolve({ name: "services" }).path,
              link: "https://robonomics.network/xrt/",
              type: "router"
            }
          ]
        },

        {
          title: "Tokenomics",
          links: [
            {
              title: "Uniswap",
              link: "https://app.uniswap.org/#/swap?inputCurrency=0x7de91b204c1c737bcee6f000aaa6569cf7061cb7&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
              type: "external"
            },
            {
              title: "About XRT",
              link: "https://robonomics.network/xrt/",
              type: "external"
            }
          ]
        },

        {
          title: "Tools",
          links: [
            {
              title: "Substrate Portal",
              link: "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.rpc.robonomics.network%2F#/explorer",
              type: "external"
            },
            {
              title: "Subscan",
              link: "https://robonomics.subscan.io/",
              type: "external"
            },
            {
              title: "Polkassembly",
              link: "https://robonomics.polkassembly.io/",
              type: "external"
            }
          ]
        },

        {
          title: "Kusama XCM",
          links: [
            {
              title: "Moonriver",
              link: "https://apps.moonbeam.network/moonriver",
              type: "external"
            },
            {
              title: "Solarbeam",
              link: "https://analytics.solarbeam.io/pairs/0x5261e0ce96289e6c3a16da45a2e52d1ab1a0e9c3",
              type: "external"
            }
          ]
        }
      ],
      version: " "
    };
  }
};
</script>
