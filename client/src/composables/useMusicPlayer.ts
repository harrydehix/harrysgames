import type { ReturnedValue } from "@vueuse/sound";
import { inject, type Ref } from "vue";

export type MusicPlayer = {
    volume: Ref<number>;
    music: ReturnedValue;
};

export function useMusicPlayer() {
    return inject<MusicPlayer>("music")!;
}
