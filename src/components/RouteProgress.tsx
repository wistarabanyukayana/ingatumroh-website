"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "loading" | "done";

function internalPageLink(event: MouseEvent): HTMLAnchorElement | null {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  const anchor =
    event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>("a[href]")
      : null;

  if (
    !anchor ||
    (anchor.target && anchor.target !== "_self") ||
    anchor.hasAttribute("download")
  ) {
    return null;
  }

  const url = new URL(anchor.href);

  if (
    url.origin !== window.location.origin ||
    url.pathname === window.location.pathname
  ) {
    return null;
  }

  return anchor;
}

export function RouteProgress() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const doneTimer = useRef<number | null>(null);
  const stallTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  const clearTimers = useCallback(() => {
    if (doneTimer.current) {
      window.clearTimeout(doneTimer.current);
      doneTimer.current = null;
    }

    if (stallTimer.current) {
      window.clearTimeout(stallTimer.current);
      stallTimer.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setPhase("done");
    doneTimer.current = window.setTimeout(() => setPhase("idle"), 220);
  }, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();
    setPhase("loading");
    stallTimer.current = window.setTimeout(finish, 8000);
  }, [clearTimers, finish]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;
    finish();
  }, [finish, pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (internalPageLink(event)) {
        start();
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", start);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", start);
    };
  }, [start]);

  return <div aria-hidden="true" className={`route-progress ${phase}`} />;
}
