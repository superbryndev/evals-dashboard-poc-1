import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import WaveSurfer from 'wavesurfer.js';

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const WaveformContainer = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  
  &:hover .hover-time {
    opacity: 1;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  
  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  
  .current {
    color: var(--color-accent);
    font-weight: 600;
    min-width: 45px;
  }
  
  .separator {
    color: var(--color-muted);
  }
  
  .total {
    color: var(--color-muted);
    min-width: 45px;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-left: auto;
  
  svg {
    width: 18px;
    height: 18px;
    color: var(--color-muted);
  }
  
  input[type="range"] {
    width: 80px;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    appearance: none;
    cursor: pointer;
    
    &::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      background: var(--color-accent);
      border-radius: 50%;
      cursor: pointer;
      transition: transform var(--transition-fast);
      
      &:hover {
        transform: scale(1.2);
      }
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  color: var(--color-muted);
  font-size: 0.8125rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  color: var(--color-muted);
  font-size: 0.8125rem;
`;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const VolumeIcon = ({ muted }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {muted ? (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    )}
  </svg>
);

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const WaveformPlayer = ({ src, duration: propDuration }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const isDestroyedRef = useRef(false);
  const loadingTimeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(propDuration || 0);
  const [volume, setVolume] = useState(0.8);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  // Get CSS variables for colors
  const getColors = useCallback(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      waveColor: styles.getPropertyValue('--color-border').trim() || '#E0E0E0',
      progressColor: styles.getPropertyValue('--color-accent').trim() || '#855CF1',
      cursorColor: styles.getPropertyValue('--color-accent').trim() || '#855CF1',
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    const colors = getColors();
    
    // Create WaveSurfer instance
    // Use MediaElement backend for better CORS compatibility with S3
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: colors.waveColor,
      progressColor: colors.progressColor,
      cursorColor: colors.cursorColor,
      cursorWidth: 2,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 60,
      responsive: true,
      normalize: true,
      partialRender: true,
      backend: 'MediaElement', // Better CORS support than WebAudio
      mediaControls: false,
    });

    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on('ready', () => {
      setIsLoading(false);
      setDuration(wavesurfer.getDuration());
      wavesurfer.setVolume(volume);
    });

    wavesurfer.on('audioprocess', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('seeking', () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('finish', () => setIsPlaying(false));

    wavesurfer.on('error', (err) => {
      // Ignore errors if already destroyed or using fallback
      if (isDestroyedRef.current) return;
      
      const errorMsg = err.message || err.toString() || 'Unknown error';
      
      // Suppress abort errors during cleanup - these are expected
      if (errorMsg.includes('aborted') && isDestroyedRef.current) {
        return; // Ignore cleanup-related abort errors
      }
      
      // Check for specific error types - use fallback for abort/signal errors
      if (errorMsg.includes('aborted') || errorMsg.includes('signal') || errorMsg.includes('AbortError')) {
        console.warn('WaveSurfer failed, using fallback HTML5 audio player');
        isDestroyedRef.current = true;
        setUseFallback(true);
        setIsLoading(false);
        // Clear timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        // Don't destroy here - let cleanup handle it
      } else if (errorMsg.includes('CORS') || errorMsg.includes('network') || errorMsg.includes('Failed to fetch')) {
        isDestroyedRef.current = true;
        setError('CORS or network error. The recording may not be accessible from this domain.');
        setUseFallback(true);
        setIsLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      } else {
        isDestroyedRef.current = true;
        setError(`Failed to load audio: ${errorMsg}`);
        setUseFallback(true);
        setIsLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      }
    });

    // Load audio with timeout
    loadingTimeoutRef.current = setTimeout(() => {
      if (!isDestroyedRef.current) {
        console.warn('Audio loading timeout - switching to fallback');
        isDestroyedRef.current = true;
        setUseFallback(true);
        setIsLoading(false);
        // Don't destroy here - let cleanup handle it to avoid conflicts
      }
    }, 10000); // 10 second timeout

    try {
      wavesurfer.load(src);
    } catch (err) {
      console.error('Failed to load audio source:', err);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      isDestroyedRef.current = true;
      setError('Failed to initialize audio player');
      setUseFallback(true);
      setIsLoading(false);
    }

    // Clear timeout on success
    wavesurfer.on('ready', () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    });

    // Cleanup
    return () => {
      // Mark as destroyed first to prevent error handlers from running
      isDestroyedRef.current = true;
      
      // Clear timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      // Safely destroy wavesurfer only if not already destroyed
      if (wavesurferRef.current) {
        try {
          // Remove all event listeners first to prevent error callbacks
          wavesurfer.removeAllListeners();
          wavesurfer.destroy();
        } catch (e) {
          // Silently ignore destroy errors during cleanup - these are expected
          // when component unmounts or when switching to fallback
        } finally {
          wavesurferRef.current = null;
        }
      }
    };
  }, [src, getColors]);

  // Update colors on theme change
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (wavesurferRef.current) {
        const colors = getColors();
        wavesurferRef.current.setOptions({
          waveColor: colors.waveColor,
          progressColor: colors.progressColor,
          cursorColor: colors.cursorColor,
        });
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [getColors]);

  // Update volume
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume);
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  if (!src) {
    return <ErrorMessage>No recording available</ErrorMessage>;
  }

  // Use fallback HTML5 audio player if WaveSurfer fails or is disabled
  if (useFallback || (error && !isLoading)) {
    return (
      <PlayerContainer>
        {error && <ErrorMessage style={{ marginBottom: 'var(--space-sm)' }}>{error}</ErrorMessage>}
        <div>
          <audio 
            controls 
            src={src} 
            style={{ 
              width: '100%', 
              height: '40px',
              borderRadius: 'var(--radius-sm)',
            }}
            onLoadedMetadata={(e) => {
              if (e.target.duration && !propDuration) {
                setDuration(e.target.duration);
              }
            }}
            onTimeUpdate={(e) => {
              setCurrentTime(e.target.currentTime);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
        <Controls>
          <TimeDisplay>
            <span className="current">{formatTime(currentTime)}</span>
            <span className="separator">/</span>
            <span className="total">{formatTime(duration)}</span>
          </TimeDisplay>
        </Controls>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      <WaveformContainer>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        {isLoading && (
          <LoadingOverlay>Loading waveform...</LoadingOverlay>
        )}
      </WaveformContainer>
      
      <Controls>
        <PlayButton onClick={handlePlayPause} disabled={isLoading}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </PlayButton>
        
        <TimeDisplay>
          <span className="current">{formatTime(currentTime)}</span>
          <span className="separator">/</span>
          <span className="total">{formatTime(duration)}</span>
        </TimeDisplay>
        
        <VolumeControl>
          <VolumeIcon muted={volume === 0} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
      </Controls>
    </PlayerContainer>
  );
};

export default WaveformPlayer;

