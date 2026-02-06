// サウンド定義
import useSound from 'use-sound';
import SoundByBy from '../../../assets/sounds/Jinx-_Bye_Bye_.mp3';

const soundByBy = () => {
    const [play] = useSound(SoundByBy);
    play();
}

export const Sounds = {
    soundByePlay: soundByBy,
    soundInPlay: soundByBy,
    soundNGPlay: soundByBy,
}