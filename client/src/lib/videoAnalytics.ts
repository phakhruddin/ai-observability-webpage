/**
 * Video Analytics Module
 * 
 * Tracks user interactions with video content:
 * - Video plays
 * - Video completions
 * - Transcript views
 * - Video downloads
 * - Engagement metrics
 */

import { trackEvent } from "./analytics";

export function trackVideoPlay(videoTitle: string) {
  trackEvent({
    category: "feature_interaction",
    action: "video_play",
    label: videoTitle,
  });
}

export function trackVideoComplete(videoTitle: string, duration: number) {
  trackEvent({
    category: "feature_interaction",
    action: "video_completed",
    label: videoTitle,
    value: duration,
  });
}

export function trackVideoPause(videoTitle: string, currentTime: number) {
  trackEvent({
    category: "feature_interaction",
    action: "video_paused",
    label: videoTitle,
    value: currentTime,
  });
}

export function trackTranscriptView(videoTitle: string) {
  trackEvent({
    category: "feature_interaction",
    action: "transcript_viewed",
    label: videoTitle,
  });
}

export function trackTranscriptCopy(videoTitle: string) {
  trackEvent({
    category: "feature_interaction",
    action: "transcript_copied",
    label: videoTitle,
  });
}

export function trackVideoDownload(videoTitle: string) {
  trackEvent({
    category: "download",
    action: "video_downloaded",
    label: videoTitle,
  });
}

export function trackVideoFullscreen(videoTitle: string) {
  trackEvent({
    category: "feature_interaction",
    action: "video_fullscreen",
    label: videoTitle,
  });
}

export function trackVideoMute(videoTitle: string, isMuted: boolean) {
  trackEvent({
    category: "feature_interaction",
    action: isMuted ? "video_muted" : "video_unmuted",
    label: videoTitle,
  });
}

export function trackSlackVideoPlay() {
  trackVideoPlay("Slack Integration Setup");
}

export function trackSlackVideoComplete(duration: number) {
  trackVideoComplete("Slack Integration Setup", duration);
}
