import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Capacitor } from "@capacitor/core";

export default function useTextToSpeech({ text, onSpeechEnd }) {
  let synth;
  const pitch = ref(1);
  const rate = ref(0.7);
  const voices = ref([]);
  const voice = ref();

  const {
    isSupported: speechSynthesisSupported,
    isPlaying,
    status,
    voiceInfo,
    utterance,
    error,
    stop: speechSynthesisStop,
    toggle,
    speak: webApiSpeak,
  } = useSpeechSynthesis(text, {
    lang: "en-US",
    voice,
    pitch,
    rate,
  });

  const nativeSpeak = async () => {
    await TextToSpeech.speak({
      text: text.value,
      voice: voice.value,
      lang: "en-US",
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: "ambient",
    });
  };

  let speak = ref(Capacitor.isNativePlatform() ? nativeSpeak : webApiSpeak);

  onMounted(async (el, done) => {
    if (Capacitor.isNativePlatform()) {
      const results = await TextToSpeech.getSupportedVoices();
      console.log(results);
      voice.value = 18;
    } else {
      setTimeout(() => {
        synth = window.speechSynthesis;
        voices.value = synth.getVoices();
        voice.value = voices.value[0];
      });
    }
  });

  onUnmounted(() => {});

  return { speak };
}
