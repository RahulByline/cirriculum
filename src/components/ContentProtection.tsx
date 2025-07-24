import React, { useEffect } from 'react';

interface ContentProtectionProps {
  children: React.ReactNode;
}

const ContentProtection: React.FC<ContentProtectionProps> = ({ children }) => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable common keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow pasting in input and textarea elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Allow Ctrl+V for paste, Ctrl+A for select all, Ctrl+C for copy, Ctrl+X for cut in form fields
        if (e.ctrlKey && (e.key === 'v' || e.key === 'V' || e.key === 'a' || e.key === 'A' || e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
          return; // Allow these operations in form fields
        }
      }
      
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // Add CSS to prevent text selection and disable print
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      @media print {
        body { display: none !important; }
      }
      
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 9999;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.head.removeChild(style);
    };
  }, []);

  // Add watermark overlay
  useEffect(() => {
    const watermark = document.createElement('div');
    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 100px,
        rgba(0,0,0,0.02) 100px,
        rgba(0,0,0,0.02) 200px
      );
      background-size: 200px 200px;
    `;
    
    const watermarkText = document.createElement('div');
    watermarkText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 48px;
      color: rgba(0,0,0,0.03);
      font-weight: bold;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    `;
    watermarkText.textContent = 'KODEIT CONFIDENTIAL';
    
    watermark.appendChild(watermarkText);
    document.body.appendChild(watermark);

    return () => {
      if (document.body.contains(watermark)) {
        document.body.removeChild(watermark);
      }
    };
  }, []);

  return <>{children}</>;
};

export default ContentProtection;