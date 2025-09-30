<script setup lang="ts">
import { onMounted, ref } from "vue";
import logo from "../assets/logo.svg";
import useSession from "../composables/useSession";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useSound } from "@vueuse/sound";
import { useToast } from "vue-toastification";
import joinButtonSfx from "../assets/sounds/join-lobby.mp3";
import errorButtonSfx from "../assets/sounds/error.mp3";
import buttonSfx from "../assets/sounds/button.mp3";
import extractErrorMessage from "../api/extractErrorMessage";

const { play: playJoinSound } = useSound(joinButtonSfx);
const { play: playErrorSound } = useSound(errorButtonSfx);
const { play: playButtonSound } = useSound(buttonSfx);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { join, lobby, fetchLobby } = useSession();
const username = ref<string>("");
const lobbyCode = ref<string | undefined>(route.query.lobby as string);
const validatedLobby = ref<boolean>(route.query.lobby !== undefined);

onMounted(() => {
    if (lobby.value) {
        router.push("/lobby");
    }
});

async function validateLobby() {
    try {
        if (!lobbyCode.value) {
            throw Error("Please enter a lobby code!");
        }
        await fetchLobby(lobbyCode.value);
        validatedLobby.value = true;
        router.push(`?lobby=${lobbyCode.value}`);
        playButtonSound();
    } catch (err) {
        playErrorSound();
        toast.error(extractErrorMessage(err));
    }
}

async function joinLobby() {
    try {
        if (username.value.length < 1) {
            throw Error("Please enter a name!");
        }
        await join(username.value, route.query.lobby as string);
        playJoinSound();
        router.push("/lobby");
    } catch (err: unknown) {
        playErrorSound();
        toast.error(extractErrorMessage(err));
        console.error(err);
    }
}
</script>

<template>
    <div :class="$style.centered">
        <div :class="$style.vignette" />
        <img :src="logo" :class="$style.logo" draggable="false" />
        <div :class="$style.inputs">
            <Transition name="swipe">
                <form
                    :class="$style.inputStep"
                    v-if="!validatedLobby"
                    @submit.prevent="validateLobby"
                >
                    <input
                        placeholder="Enter a lobby code"
                        v-model="lobbyCode"
                        :class="`${$style.input} ${$style.lobbyCode}`"
                        type="text"
                        autofocus
                    />
                    <button type="submit" :class="$style.join">
                        <v-icon
                            scale="1.8"
                            color="#083F12"
                            name="io-arrow-forward-sharp"
                        />
                    </button>
                </form>
                <form
                    :class="$style.inputStep"
                    v-else
                    @submit.prevent="joinLobby"
                >
                    <input
                        placeholder="Enter your name"
                        v-model="username"
                        :class="$style.input"
                        type="text"
                        autofocus
                    />
                    <button type="submit" :class="$style.join">
                        <v-icon
                            scale="1.8"
                            color="#083F12"
                            name="io-arrow-forward-sharp"
                        />
                    </button>
                </form>
            </Transition>
        </div>
    </div>
</template>

<style module lang="less">
.vignette {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    pointer-events: none;
    transform: translateZ(0);
    backface-visibility: hidden;
    background: radial-gradient(
        circle,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.171) 100%
    );
}

.centered {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    gap: 2rem;
}
.logo {
    width: 90%;
    max-width: 49rem;

    transition: all 0.3s;

    &:hover {
        scale: 1.05;
    }
}

.inputs {
    display: flex;
    position: relative;
    justify-content: center;
}

.inputStep {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    position: absolute;
}

.input {
    display: flex;
    height: 5rem;
    padding: 0 1.5rem;
    font-size: 1.4rem;
    border-radius: 1rem;
    border: none;
    outline: none;
    font-weight: 500;
}

.lobbyCode {
    text-transform: uppercase;

    &::-webkit-input-placeholder {
        /* WebKit browsers */
        text-transform: none;
    }
    &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        text-transform: none;
    }
    &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        text-transform: none;
    }
    &:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        text-transform: none;
    }
    &::placeholder {
        /* Recent browsers */
        text-transform: none;
    }
}

.join {
    width: 5rem;
    height: 5rem;
    background-color: #0eaa2b;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        scale: 1.05;
        box-shadow: 0 0 1rem #083f12;
    }
}
</style>
