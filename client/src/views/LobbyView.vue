<script setup lang="ts">
import { onMounted } from "vue";
import useSession from "../composables/useSession";
import { useRouter } from "vue-router";

const { lobby, name, exit: leaveLobby } = useSession();
const router = useRouter();

onMounted(() => {
    if (!lobby.value) {
        console.log("here");
        router.push("../");
    }
});

async function leave() {
    const code = lobby.value?.code;
    await leaveLobby();
    router.push(`../?lobby=${code}`);
}
</script>

<template>
    In lobby #{{ lobby?.code }} as {{ name }}
    <button @click="leave">Leave</button>
</template>

<style module lang="less"></style>
