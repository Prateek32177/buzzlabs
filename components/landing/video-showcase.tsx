'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const enterFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className='w-full  relative overflow-hidden'>
      {/* Gradient background similar to the image */}
      <div className='absolute inset-0 opacity-90'></div>

      <div className=' px-4 mx-auto relative z-10'>
        {/* Glassmorphism container */}
        <div className='max-w-5xl mx-auto rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl'>
          <div className='p-6 md:p-8'>
            {/* Video player with controls */}
            <div className='relative rounded-2xl overflow-hidden aspect-video bg-black/40'>
              {/* Video element */}
              <video
                ref={videoRef}
                className='w-full h-full object-cover'
                poster='https://images.klipfolio.com/website/public/36ab37e3-6007-4918-9c3d-778105fe65d0/executive%20dashboard%20example.png'
                onClick={togglePlay}
                src='https://youtu.be/XTHdMtxrj-w?si=9HJTd_MIuj-tAH_3'
              >
                <source
                  src='https://youtu.be/XTHdMtxrj-w?si=9HJTd_MIuj-tAH_3'
                  type='video/mp4'
                />
                Your browser does not support the video tag.
              </video>

              {/* Play/Pause overlay */}
              {!isPlaying && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                  <div className='rounded-full bg-white/10 backdrop-blur-md p-4 border border-white/20'>
                    <Play className='h-12 w-12 text-white' />
                  </div>
                </div>
              )}

              {/* Video controls */}
              <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-white hover:bg-white/20'
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className='h-6 w-6' />
                  ) : (
                    <Play className='h-6 w-6' />
                  )}
                </Button>

                <Button
                  variant='ghost'
                  size='icon'
                  className='text-white hover:bg-white/20'
                  onClick={enterFullscreen}
                >
                  <Maximize className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
