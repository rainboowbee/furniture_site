/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<unknown | null>(null);

  useEffect(() => {
    let mounted = true;
    
    if (typeof window === "undefined") {
      return undefined;
    }

    let cleanup: (() => void) | undefined;

    const initScroll = async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default as any;
        
        if (!mounted) return;
        
        const scroll = new LocomotiveScroll({
          el: document.documentElement,
          smooth: true,
          lerp: 0.08,
          smartphone: { smooth: true },
          tablet: { smooth: true },
          direction: "vertical",
        } as any);
        
        scrollRef.current = scroll as unknown;

        const onResize = () => (scroll as any)?.update?.();
        window.addEventListener("resize", onResize);

        cleanup = () => {
          window.removeEventListener("resize", onResize);
          (scroll as any)?.destroy?.();
          scrollRef.current = null;
        };
      } catch (error) {
        console.warn("Failed to initialize Locomotive Scroll:", error);
      }
    };

    initScroll();

    return () => {
      mounted = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return <>{children}</>;
}