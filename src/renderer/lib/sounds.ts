import {
        PROTOCOL_DEV, PROTOCOL_PROD,
        BASEPATH_DEV, BASEPATH_PROD,
        VOLUME } from "@/conf/soundConf";

/** Cache of Audio elements, for instant playback */
const cache: Record<string, HTMLAudioElement> = {};

const sounds: Record<string, { url: string; volume: number }> = {

    CARD_IN: {
        url: 'tm2_quiz000good.wav',
        volume: VOLUME,
    },
    CARD_OUT: {
        url: 'sounds/Jinx-_Bye_Bye_.mp3',
        volume: VOLUME,
    },
    CARD_NG: {
        url: 'sounds/se_nogood09.mp3',
        volume: VOLUME,
    }
} as const;

type SoundsName = (typeof sounds)[keyof typeof sounds];
export const preload = async (basepath = BASEPATH_PROD) => {
    const isProduction = await window?.is.production();
    console.log('isProduction=', isProduction);
    console.log('render/lib/sounds.ts: basepath=',basepath);

  	Object.keys(sounds).forEach((name) => {
        if (!cache[name]) {
            const sound = sounds[name];
            const url = (isProduction)?`${PROTOCOL_PROD}://${BASEPATH_PROD}${sound.url}`:`${PROTOCOL_DEV}://${BASEPATH_DEV}${sound.url}`;
            console.warn(`Preloading sound: ${name}, URL: ${url}`);
            cache[name] = new window.Audio();
		        cache[name].crossOrigin = '*';
			      cache[name].volume = sound.volume;
			      cache[name].src = url;
        }
    });
};

export const play = async({ name, path }: { name: string; path?: string }) => {
    const sound = name.toUpperCase();
	console.info(`Playing sound: ${name}, path: ${path}`);

	let audio: HTMLAudioElement | undefined = cache[sound];
	if (!audio) {
		preload(path);
		audio = cache[sound];
	}

	if (audio) {
		console.log('render/lib/sounds.ts: play')
		audio.currentTime = 0;
		audio.play().catch(console.error);
	}
};
