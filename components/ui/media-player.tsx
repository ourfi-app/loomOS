
'use client';

/**
 * LoomOS Media Player Components
 * Based on LoomOS design patterns for audio/video playback
 */

import * as React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// ========================
// AUDIO PLAYER
// ========================

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export function AudioPlayer({ src, className }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && value[0] !== undefined) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current && value[0] !== undefined) {
      audioRef.current.volume = value[0];
      setVolume(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn('bg-card border border-border rounded-lg p-4', className)}>
      <audio ref={audioRef} src={src} />
      
      {/* Playback Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          className="h-10 w-10 rounded-full hover:bg-primary/10"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
        </Button>

        {/* Progress Bar */}
        <div className="flex-1 space-y-1">
          <div className="relative">
            {/* Download Progress (background) */}
            <div className="absolute inset-0 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/30 transition-all"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            {/* Playback Progress (foreground) */}
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="relative z-10"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="w-20">
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================
// VIDEO PLAYER
// ========================

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  embedded?: boolean;
}

export function VideoPlayer({ src, poster, className, embedded = false }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={cn(
        'relative group bg-black rounded-lg overflow-hidden',
        embedded ? 'aspect-video' : '',
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(!isPlaying)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Overlay Controls */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-opacity',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Play/Pause Button Overlay */}
        {!isPlaying && (
          <Button
            size="icon"
            onClick={togglePlay}
            className="h-16 w-16 rounded-full bg-black/60 hover:bg-black/80"
          >
            <Play className="h-8 w-8 fill-current" />
          </Button>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3',
          'flex items-center gap-3 transition-opacity',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
        </Button>

        <div className="flex-1" />

        <Button
          size="icon"
          variant="ghost"
          onClick={toggleFullscreen}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
