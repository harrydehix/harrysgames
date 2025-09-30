import { ref } from "vue";
import { client } from "../api/client";

const name = ref<string | null>(localStorage.getItem("name"));
const token = ref<string | null>(localStorage.getItem("token"));

const localLobby = localStorage.getItem("lobby");
const lobby = ref<{
    name: string;
    code: string;
} | null>(localLobby ? JSON.parse(localLobby) : null);

async function join(playerName: string, lobbyCode: string) {
    const res = await client.post(`/players`, {
        name: playerName,
        lobby: lobbyCode,
    });

    name.value = playerName;
    localStorage.setItem("name", playerName);
    token.value = res.data.token;
    localStorage.setItem("token", res.data.token);
    lobby.value = res.data.lobby;
    localStorage.setItem("lobby", JSON.stringify(res.data.lobby));

    client.defaults.headers.common["Authorization"] = token.value;

    console.log(
        `Created player '${playerName}' and joined lobby '${lobbyCode}'!`
    );
}

async function fetchLobby(code: string) {
    const res = await client.get(`/lobbies/${code}`);
    return res.data as {
        name: string;
        code: string;
    };
}

async function exit() {
    try {
        await client.delete(`/players/lobby`);
    } catch (err) {
        console.warn(err);
    }
    console.log(`Left lobby '${lobby.value}'!`);
    lobby.value = null;
    localStorage.removeItem("lobby");
}

export default function useSession() {
    return {
        join,
        exit,
        fetchLobby,
        name,
        token,
        lobby,
    };
}
