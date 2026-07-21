import { useCallback, useEffect, useRef, useState } from "react";
import { apiBlobRequest } from "../../lib/api";

const muteStorageKey = "excellence-davy-voice-muted-v1";

const masculineVoiceNames = new Set([
  "abeo",
  "alain",
  "antoine",
  "arthur",
  "axel",
  "bruno",
  "charles",
  "claude",
  "daniel",
  "elimane",
  "fabrice",
  "gerard",
  "gilles",
  "henri",
  "jean",
  "jerome",
  "louis",
  "luc",
  "male",
  "man",
  "masculin",
  "mathieu",
  "maurice",
  "maxime",
  "nicolas",
  "paul",
  "pierre",
  "raphael",
  "remy",
  "sebastien",
  "thierry",
  "thomas",
  "yves",
]);

const feminineVoiceNames = new Set([
  "alice",
  "amelie",
  "audrey",
  "aurelie",
  "brigitte",
  "celeste",
  "claire",
  "coralie",
  "denise",
  "eloise",
  "female",
  "feminin",
  "hortense",
  "jacquelyn",
  "josephine",
  "julie",
  "lea",
  "manon",
  "marie",
  "sylvie",
  "virginie",
  "vivienne",
  "woman",
]);

function normalizedVoiceTokens(voice: SpeechSynthesisVoice) {
  return new Set(
    voice.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase()
      .split(/[^a-z]+/)
      .filter(Boolean),
  );
}

function isLikelyMasculineVoice(voice: SpeechSynthesisVoice | null) {
  if (!voice) return false;
  const tokens = normalizedVoiceTokens(voice);
  return [...tokens].some((token) => masculineVoiceNames.has(token));
}

function voiceScore(voice: SpeechSynthesisVoice) {
  const locale = voice.lang.toLocaleLowerCase();
  const tokens = normalizedVoiceTokens(voice);
  const masculine = [...tokens].some((token) => masculineVoiceNames.has(token));
  const feminine = [...tokens].some((token) => feminineVoiceNames.has(token));

  let score = locale.startsWith("fr") ? 100 : -500;
  if (locale === "fr-ci") score += 50;
  else if (locale === "fr-sn") score += 45;
  else if (locale === "fr-fr") score += 40;
  else if (locale === "fr-be") score += 35;
  else if (locale === "fr-ca") score += 30;
  if (masculine) score += 1_000;
  if (feminine) score -= 1_000;
  if (voice.localService) score += 10;
  if (tokens.has("natural") || tokens.has("neural")) score += 8;
  return score;
}

function preferredFrenchVoice(voices: SpeechSynthesisVoice[]) {
  const frenchVoices = voices.filter((voice) => voice.lang.toLocaleLowerCase().startsWith("fr"));
  const candidates = frenchVoices.length > 0 ? frenchVoices : voices;
  return [...candidates].sort((left, right) => voiceScore(right) - voiceScore(left))[0] ?? null;
}

export function useDavyVoice() {
  const synthesis = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const [supported] = useState(() => Boolean("AudioContext" in window || (synthesis && "SpeechSynthesisUtterance" in window)));
  const [muted, setMuted] = useState(() => window.localStorage.getItem(muteStorageKey) === "yes");
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCacheRef = useRef(new Map<string, AudioBuffer>());
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!synthesis) return;
    const loadVoice = () => {
      voiceRef.current = preferredFrenchVoice(synthesis.getVoices());
    };
    loadVoice();
    synthesis.addEventListener("voiceschanged", loadVoice);
    return () => synthesis.removeEventListener("voiceschanged", loadVoice);
  }, [synthesis]);

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    const source = sourceRef.current;
    sourceRef.current = null;
    if (source) {
      try {
        source.stop();
      } catch {
        // The source may already have finished naturally.
      }
      source.disconnect();
    }
    synthesis?.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    setPaused(false);
    setLoading(false);
  }, [synthesis]);

  const speakWithSystemVoice = useCallback((text: string, requestId: number) => {
    if (!synthesis || !("SpeechSynthesisUtterance" in window) || requestId !== requestIdRef.current) {
      setSpeaking(false);
      setLoading(false);
      return;
    }
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    const voice = voiceRef.current ?? preferredFrenchVoice(synthesis.getVoices());
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "fr-FR";
    utterance.rate = 0.92;
    // Some browsers do not expose voice gender. Prefer a known masculine voice
    // and deepen the fallback so Davy never keeps the former high-pitched tone.
    utterance.pitch = isLikelyMasculineVoice(voice) ? 0.9 : 0.76;
    utterance.volume = 1;
    utterance.onstart = () => {
      if (requestId !== requestIdRef.current) return;
      setSpeaking(true);
      setPaused(false);
      setLoading(false);
    };
    utterance.onend = () => {
      if (requestId !== requestIdRef.current) return;
      utteranceRef.current = null;
      setSpeaking(false);
      setPaused(false);
      setLoading(false);
    };
    utterance.onerror = () => {
      if (requestId !== requestIdRef.current) return;
      utteranceRef.current = null;
      setSpeaking(false);
      setPaused(false);
      setLoading(false);
    };
    utteranceRef.current = utterance;
    synthesis.speak(utterance);
  }, [synthesis]);

  const speak = useCallback((text: string) => {
    const cleanText = text.trim();
    if (!supported || muted || !cleanText) return false;
    stop();
    const requestId = requestIdRef.current;
    setSpeaking(true);
    setLoading(true);

    let audioContext = audioContextRef.current;
    if (!audioContext && "AudioContext" in window) {
      audioContext = new AudioContext();
      audioContextRef.current = audioContext;
    }
    if (audioContext?.state === "suspended") void audioContext.resume();

    void (async () => {
      try {
        if (!audioContext) throw new Error("Web Audio indisponible");
        let audioBuffer = audioCacheRef.current.get(cleanText);
        if (!audioBuffer) {
          const blob = await apiBlobRequest("/companion/speech", {
            method: "POST",
            body: JSON.stringify({ text: cleanText }),
          });
          audioBuffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
          audioCacheRef.current.set(cleanText, audioBuffer);
        }
        if (requestId !== requestIdRef.current || muted) return;

        if (audioContext.state === "suspended") await audioContext.resume();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        sourceRef.current = source;
        source.onended = () => {
          if (sourceRef.current !== source || requestId !== requestIdRef.current) return;
          sourceRef.current = null;
          source.disconnect();
          setSpeaking(false);
          setPaused(false);
          setLoading(false);
        };
        setLoading(false);
        source.start();
      } catch {
        if (requestId !== requestIdRef.current || muted) return;
        speakWithSystemVoice(cleanText, requestId);
      }
    })();
    return true;
  }, [muted, speakWithSystemVoice, stop, supported]);

  const togglePause = useCallback(() => {
    if (!speaking) return;
    const audioContext = audioContextRef.current;
    if (sourceRef.current && audioContext) {
      if (audioContext.state === "suspended") {
        void audioContext.resume();
        setPaused(false);
      } else {
        void audioContext.suspend();
        setPaused(true);
      }
      return;
    }
    if (!synthesis) return;
    if (synthesis.paused) {
      synthesis.resume();
      setPaused(false);
    } else {
      synthesis.pause();
      setPaused(true);
    }
  }, [speaking, synthesis]);

  const toggleMuted = useCallback(() => {
    const next = !muted;
    window.localStorage.setItem(muteStorageKey, next ? "yes" : "no");
    if (next) stop();
    setMuted(next);
  }, [muted, stop]);

  useEffect(() => () => {
    requestIdRef.current += 1;
    synthesis?.cancel();
    try {
      sourceRef.current?.stop();
    } catch {
      // It may already be stopped.
    }
    void audioContextRef.current?.close();
  }, [synthesis]);

  return {
    supported,
    muted,
    speaking,
    paused,
    loading,
    speak,
    stop,
    togglePause,
    toggleMuted,
  };
}
