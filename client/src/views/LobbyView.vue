<script setup lang="ts">
import { onMounted } from "vue";
import useSession from "../composables/useSession";
import { useRouter } from "vue-router";
import { useMusicPlayer } from "../composables/useMusicPlayer";

const { lobby, name, exit: leaveLobby } = useSession();
const router = useRouter();
const { music } = useMusicPlayer();

onMounted(() => {
    if (!lobby.value) {
        console.log("here");
        router.push("../");
    }
});

async function leave() {
    const code = lobby.value?.code;
    await leaveLobby();
    music.stop();
    router.push(`../?lobby=${code}`);
}
</script>

<template>
    In lobby #{{ lobby?.code }} as {{ name }}
    <button @click="leave">Leave</button>
    {{ music.isPlaying }}
</template>

<style module lang="less"></style>
