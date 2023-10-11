<template>
  <main-layout :title="title">
    <router-view />
  </main-layout>
</template>

<script>
import MainLayout from "@/components/layouts/Main.vue";

export default {
  name: "App",
  components: {
    MainLayout
  },
  data() {
    return {
      title: ""
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.title = route?.meta?.title;
        document.title = this.title
          ? `${this.title} – Robonomics Network dApp`
          : "Robonomics Network dApp";
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    this.$store.commit("rws/setKey", process.env.VUE_APP_ROBONOMICS_UI_KEY);
    this.$store.dispatch("rws/init");
  }
};
</script>
