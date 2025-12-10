'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const JavariWidget = dynamic(() => import('./JavariWidget'), {
  ssr: false,
});

interface JavariWrapperProps {
  sourceApp?: string;
}

export default function JavariWrapper({ sourceApp = 'cardverse' }: JavariWrapperProps) {
  return (
    <JavariWidget 
      sourceApp={sourceApp}
      position="bottom-right"
      enableTickets={true}
      enableEnhancements={true}
      context="CardVerse digital trading card platform"
    />
  );
}
