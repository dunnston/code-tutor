import React, { useEffect, useState } from 'react';

interface SpriteAnimationProps {
  spriteSheet: string;
  frameCount: number;
  frameDuration?: number; // milliseconds per frame
  width: number;
  height: number;
  onComplete?: () => void;
  loop?: boolean;
  className?: string;
  columns?: number; // Number of columns in the sprite sheet grid
}

export function SpriteAnimation({
  spriteSheet,
  frameCount,
  frameDuration = 100,
  width,
  height,
  onComplete,
  loop = false,
  className = '',
  columns = 6, // Default to 6 columns for grid layout
}: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const nextFrame = prev + 1;

        if (nextFrame >= frameCount) {
          if (loop) {
            return 0;
          } else {
            clearInterval(interval);
            if (onComplete) onComplete();
            return prev; // Stay on last frame
          }
        }

        return nextFrame;
      });
    }, frameDuration);

    return () => clearInterval(interval);
  }, [frameCount, frameDuration, loop, onComplete]);

  // Calculate position in grid
  const col = currentFrame % columns;
  const row = Math.floor(currentFrame / columns);

  const frameWidth = width;
  const frameHeight = height;

  const backgroundPositionX = -(col * frameWidth);
  const backgroundPositionY = -(row * frameHeight);

  // Calculate total sprite sheet dimensions
  const totalColumns = columns;
  const totalRows = Math.ceil(frameCount / columns);
  const totalSpriteWidth = frameWidth * totalColumns;
  const totalSpriteHeight = frameHeight * totalRows;

  return (
    <div
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${spriteSheet})`,
        backgroundSize: `${totalSpriteWidth}px ${totalSpriteHeight}px`,
        backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'auto', // Smooth scaling for better quality
      }}
    />
  );
}
