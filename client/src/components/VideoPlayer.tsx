import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize2, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { trackVideoPlay, trackVideoComplete, trackTranscriptCopy, trackVideoDownload, trackVideoMute } from "@/lib/videoAnalytics";

/**
 * VideoPlayer Component
 * 
 * Professional video player with:
 * - Play/pause controls
 * - Volume control
 * - Fullscreen support
 * - Transcript display
 * - Accessibility features
 * - Download option
 * 
 * Design: Dark theme with teal accents
 */

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  transcript?: string;
  duration?: string;
}

export function VideoPlayer({
  videoUrl,
  title,
  description,
  transcript,
  duration = "5:00",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        trackVideoPlay(title);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      trackVideoMute(title, !isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setTotalDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * totalDuration;
    }
  };

  const handleCopyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      trackTranscriptCopy(title);
      toast.success("Transcript copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card className="bg-black border-border overflow-hidden">
        <div className="relative bg-black aspect-video flex items-center justify-center group">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play Button Overlay */}
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors group-hover:bg-black/30"
            >
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center hover:bg-accent/90 transition-colors">
                <Play className="w-8 h-8 text-black fill-black ml-1" />
              </div>
            </button>
          )}

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
            {/* Progress Bar */}
            <div
              onClick={handleProgressClick}
              className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 hover:h-2 transition-all"
            >
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{
                  width: `${totalDuration ? (currentTime / totalDuration) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  aria-label="Play/Pause"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={handleMute}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  aria-label="Mute/Unmute"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                <span className="text-sm text-white font-mono">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Video Info */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Duration: {duration}</span>
          <span>•</span>
          <span>Professional Setup Guide</span>
        </div>
      </div>

      {/* Transcript Section */}
      {transcript && (
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Video Transcript</h4>
            <button
              onClick={handleCopyTranscript}
              className="flex items-center gap-2 px-3 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="prose prose-invert max-w-none text-sm text-muted-foreground space-y-3">
              {transcript.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Download Button */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            trackVideoDownload(title);
            const a = document.createElement("a");
            a.href = videoUrl;
            a.download = `${title}.mp4`;
            a.click();
          }}
        >
          <Download className="w-4 h-4" />
          Download Video
        </Button>
      </div>
    </div>
  );
}
