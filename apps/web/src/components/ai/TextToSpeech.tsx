import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@omnipdf/ui/src/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@omnipdf/ui/src/Card";
import { Slider } from "@omnipdf/ui/src/Slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@omnipdf/ui/src/Select";
import { cn } from "@omnipdf/shared/src/utils";

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female" | "neutral";
  quality: "low" | "medium" | "high";
}

export interface TTSOptions {
  voiceId: string;
  speed: number;
  pitch: number;
  volume: number;
}

export interface TextToSpeechProps {
  text: string;
  language?: string;
  onAudioGenerated?: (audioUrl: string) => void;
  className?: string;
}

const DEFAULT_VOICES: Voice[] = [
  {
    id: "en-us-male-1",
    name: "Alex (US English)",
    language: "en-US",
    gender: "male",
    quality: "high",
  },
  {
    id: "en-us-female-1",
    name: "Samantha (US English)",
    language: "en-US",
    gender: "female",
    quality: "high",
  },
  {
    id: "en-uk-male-1",
    name: "Daniel (UK English)",
    language: "en-GB",
    gender: "male",
    quality: "high",
  },
  {
    id: "en-uk-female-1",
    name: "Emily (UK English)",
    language: "en-GB",
    gender: "female",
    quality: "high",
  },
  {
    id: "es-male-1",
    name: "Carlos (Spanish)",
    language: "es-ES",
    gender: "male",
    quality: "high",
  },
  {
    id: "es-female-1",
    name: "Lucia (Spanish)",
    language: "es-ES",
    gender: "female",
    quality: "high",
  },
  {
    id: "fr-male-1",
    name: "Thomas (French)",
    language: "fr-FR",
    gender: "male",
    quality: "high",
  },
  {
    id: "fr-female-1",
    name: "Julie (French)",
    language: "fr-FR",
    gender: "female",
    quality: "high",
  },
  {
    id: "de-male-1",
    name: "Hans (German)",
    language: "de-DE",
    gender: "male",
    quality: "high",
  },
  {
    id: "de-female-1",
    name: "Anna (German)",
    language: "de-DE",
    gender: "female",
    quality: "high",
  },
  {
    id: "ja-female-1",
    name: "Yuki (Japanese)",
    language: "ja-JP",
    gender: "female",
    quality: "high",
  },
  {
    id: "zh-female-1",
    name: "Meijia (Chinese)",
    language: "zh-CN",
    gender: "female",
    quality: "high",
  },
  {
    id: "pt-male-1",
    name: "Ricardo (Portuguese)",
    language: "pt-PT",
    gender: "male",
    quality: "high",
  },
  {
    id: "pt-female-1",
    name: " Fernanda (Portuguese)",
    language: "pt-PT",
    gender: "female",
    quality: "high",
  },
  {
    id: "ko-female-1",
    name: "Yuna (Korean)",
    language: "ko-KR",
    gender: "female",
    quality: "high",
  },
  {
    id: "hi-female-1",
    name: "Priya (Hindi)",
    language: "hi-IN",
    gender: "female",
    quality: "high",
  },
];

export function TextToSpeech({
  text,
  language = "en-US",
  onAudioGenerated,
  className,
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice>(DEFAULT_VOICES[0]);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
        const matchingVoice = voices.find(
          (v) =>
            v.lang.startsWith(language) &&
            v.name.toLowerCase().includes("female"),
        );
        if (matchingVoice) {
          setSelectedVoice({
            id: matchingVoice.lang,
            name: matchingVoice.name,
            language: matchingVoice.lang,
            gender: "female",
            quality: "high",
          });
        }
      }
    }
  }, [language]);

  const handlePlayPause = useCallback(async () => {
    if (isLoading) return;

    if (!audioUrl && !synthRef.current) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voiceId: selectedVoice.id,
            speed,
            pitch,
            volume,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate audio");
        }

        const data = await response.json();
        setAudioUrl(data.audioUrl);
        onAudioGenerated?.(data.audioUrl);

        if (audioRef.current) {
          audioRef.current.src = data.audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        setError("Failed to generate audio. Please try again.");
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [
    audioUrl,
    isLoading,
    text,
    selectedVoice,
    speed,
    pitch,
    volume,
    onAudioGenerated,
    isPlaying,
  ]);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `omnipdf-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download audio");
    }
  }, [audioUrl]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  const handleSeek = useCallback((value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredVoices = DEFAULT_VOICES.filter(
    (voice) =>
      voice.language === language ||
      language.startsWith(voice.language.split("-")[0]),
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Read Aloud
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select
            value={selectedVoice.id}
            onValueChange={(value) => {
              const voice = DEFAULT_VOICES.find((v) => v.id === value);
              if (voice) setSelectedVoice(voice);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {filteredVoices.length > 0
                ? filteredVoices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))
                : DEFAULT_VOICES.slice(0, 5).map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">
                    Speed
                  </span>
                  <span className="font-medium">{speed.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={([value]) => setSpeed(value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">
                    Pitch
                  </span>
                  <span className="font-medium">{pitch.toFixed(1)}</span>
                </div>
                <Slider
                  value={[pitch]}
                  onValueChange={([value]) => setPitch(value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">
                    Volume
                  </span>
                  <span className="font-medium">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={([value]) => setVolume(value)}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSeek(Math.max(0, currentTime - 10))}
            disabled={!audioUrl}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handlePlayPause}
            disabled={isLoading}
            className="w-16 h-16 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
            disabled={!audioUrl}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            disabled={!audioUrl}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {audioUrl && (
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => handleSeek(value)}
              max={duration || 100}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-surface-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            onClick={handleStop}
            disabled={!audioUrl && !isPlaying}
          >
            Stop
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownload}
            disabled={!audioUrl}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Save as Audio
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          preload="none"
        />
      </CardContent>
    </Card>
  );
}
