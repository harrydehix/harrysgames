<script setup lang="ts">
import { useSound } from "@vueuse/sound";

import lobbyMusic from "./assets/sounds/lobby.mp3";
import { provide, ref } from "vue";

const volume = ref<number>(0.3);
const music = useSound(lobbyMusic, {
    volume,
    loop: true,
});

provide("music", {
    music,
    volume,
});
</script>

<template><RouterView /></template>

<style module lang="less"></style>
