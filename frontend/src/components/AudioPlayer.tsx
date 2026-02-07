import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string | null;
  loading?: boolean;
}

export default function AudioPlayer({ src, loading }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!src) return;
    const sound = new Howl({
      src: [src],
      format: ['mp3'],
      html5: true,
      onend: () => setPlaying(false),
      onloaderror: () => setPlaying(false),
    });
    soundRef.current = sound;
    return () => {
      sound.unload();
    };
  }, [src]);

  const toggle = () => {
    if (!soundRef.current) return;
    if (playing) {
      soundRef.current.pause();
      setPlaying(false);
    } else {
      soundRef.current.play();
      setPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm text-primary-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Generating audio...</span>
      </div>
    );
  }

  if (!src) return null;

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100 active:scale-[0.98]"
    >
      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      <Volume2 className="h-4 w-4" />
      <span>{playing ? 'Pause' : 'Listen'}</span>
    </button>
  );
}
