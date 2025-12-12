'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const JavariWidget = dynamic(() => import('./JavariWidget'), {
  ssr: false,
});

interface JavariWrapperProps {
  sourceApp?: string;
}

export default function JavariWrapper({ sourceApp = 'cravcards' }: JavariWrapperProps) {
  return (
    <JavariWidget 
      sourceApp={sourceApp}
      position="bottom-right"
      enableTickets={true}
      enableEnhancements={true}
      context="CravCards - Premium trading card collection platform for Pokemon, MTG, Sports Cards, and more"
    />
  );
}
