import React, { useState, useRef, useEffect, useCallback } from "react";

type AnyLayer = any;
const interpolateLayers = (a: any, b: any, p: number) => a;
const applyOverrides = (base: any, overrides: any, state: string) => base;

const useEditor = () => ({
  doc: {
    meta: { width: 390, height: 844 },
    docs: {
      floating: { layers: [], stateOverrides: {} },
      background: { layers: [], stateOverrides: {} },
    },
  },
});

const PHONE_STATES = {
  LOCKED: "Locked",
  UNLOCK: "Unlock",
  SLEEP: "Sleep",
};

export function TopBar({ showTopBar }: { showTopBar: boolean }) {
  if (!showTopBar) return null;
  return (
    <div className="absolute top-4 left-0 right-0 h-8 px-5 flex items-center justify-between text-xs font-semibold text-white pointer-events-none z-40">
      <span className="font-bold">9:41</span>
      <div className="flex items-center space-x-1">
        <svg className="w-4 h-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
        <svg className="w-6 h-6 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <line x1="21" y1="12" x2="23" y2="12" />
        </svg>
        <span className="-mb-px">100%</span>
      </div>
    </div>
  );
}

export function LockScreen({
  onHomeBarMouseDown,
  onHomeBarTouchStart,
  isDragging,
  homeBarTranslateY,
  showTopBar,
  showBottomBar,
  showButtons,
}: {
  onHomeBarMouseDown: any;
  onHomeBarTouchStart: any;
  isDragging: boolean;
  homeBarTranslateY: number;
  showTopBar: boolean;
  showBottomBar: boolean;
  showButtons: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        showTopBar ? 'opacity-100' : 'opacity-0'
      } pointer-events-none`}
    >
      {showBottomBar && (
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 flex justify-center items-center pointer-events-auto"
          style={{ transform: `translateX(-50%) translateY(${homeBarTranslateY}px)` }}
        >
          <div
            className={`w-1/3 h-[5px] rounded-full ${
              isDragging ? 'bg-white' : 'bg-white/70'
            } transition-colors duration-100 cursor-grab select-none touch-none active:cursor-grabbing`}
            onMouseDown={onHomeBarMouseDown}
            onTouchStart={onHomeBarTouchStart}
          />
        </div>
      )}

      {showButtons && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-between px-6 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md pointer-events-auto shadow-lg hover:bg-white/30 transition">
            <svg className="w-6 h-6 text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14l-2 5h6l-2-5h3l-4-9h-3l4 9h-3z" />
            </svg>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md pointer-events-auto shadow-lg hover:bg-white/30 transition">
            <svg className="w-6 h-6 text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.12 4H9.88L8.6 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-4.6l-1.28 2zM12 18c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}


type Props = {
  children: React.ReactNode;
  showPreview: boolean;
  setPreviewLayers: (layers: AnyLayer[] | null) => void;
  scale: number;
}

export default function DevicePreview({
  children,
  showPreview,
  setPreviewLayers,
  scale,
}: Props) {
  const { doc } = useEditor();
  const {
    floating,
    background,
  } = doc?.docs || {}
  
  const canvasWidth = doc?.meta.width ?? 390;
  const canvasHeight = doc?.meta.height ?? 844;

  const [phoneState, setPhoneState] = useState(PHONE_STATES.LOCKED);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimatingToSleep, setIsAnimatingToSleep] = useState(false);
  const [isAnimatingFromSleep, setIsAnimatingFromSleep] = useState(false);
  const [isAnimatingDragCancel, setIsAnimatingDragCancel] = useState(false);
  const [isAnimatingDragComplete, setIsAnimatingDragComplete] = useState(false);
  
  const toSleepAnimationRef = useRef<number | null>(null);
  const fromSleepAnimationRef = useRef<number | null>(null);
  const dragCancelAnimationRef = useRef<number | null>(null);
  const dragCompleteAnimationRef = useRef<number | null>(null);
  const sleepAnimationStartRef = useRef<number | null>(null);
  const previousStateRef = useRef(PHONE_STATES.LOCKED);
  const wasSleepingRef = useRef(false);
  const dragCancelStartRef = useRef<number | null>(null);
  const dragCancelFromProgressRef = useRef<number>(0);
  const dragCompleteStartRef = useRef<number | null>(null);
  const dragCompleteFromProgressRef = useRef<number>(0);
  const dragCompleteTargetStateRef = useRef<string>(PHONE_STATES.UNLOCK);
  const dragStartYRef = useRef<number | null>(null);
  const dragDirectionRef = useRef<"up" | "down" | null>(null);
  const phoneScreenRef = useRef<HTMLDivElement | null>(null);
  const dragStartElementRef = useRef<"home-bar" | "status-bar" | null>(null);


  const updateLayersWithProgress = useCallback((targetState: string, progress: number) => {
    if (!showPreview) return;

    const floatingOverrides = floating?.stateOverrides || {};
    const backgroundOverrides = background?.stateOverrides || {};

    const baseFloatingLayers = floating?.layers || [];
    const baseBackgroundLayers = background?.layers || [];

    const currentFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, phoneState);
    const currentBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, phoneState);

    const targetFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, targetState);
    const targetBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, targetState);

    const interpolatedFloating = interpolateLayers(currentFloatingLayers, targetFloatingLayers, progress);
    const interpolatedBackground = interpolateLayers(currentBackgroundLayers, targetBackgroundLayers, progress);

    setPreviewLayers([
      ...interpolatedBackground,
      ...interpolatedFloating,
    ]);
  }, [showPreview, floating, background, phoneState, setPreviewLayers]);

  useEffect(() => {
    if (!showPreview) {
      setPreviewLayers(null);
    } else {
      setPhoneState(PHONE_STATES.LOCKED);
      setDragOffset(0);
      const floatingOverrides = floating?.stateOverrides || {};
      const backgroundOverrides = background?.stateOverrides || {};

      const baseFloatingLayers = floating?.layers || [];
      const baseBackgroundLayers = background?.layers || [];

      const lockedFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, PHONE_STATES.LOCKED);
      const lockedBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, PHONE_STATES.LOCKED);

      setPreviewLayers([
        ...lockedBackgroundLayers,
        ...lockedFloatingLayers,
      ]);
    }
  }, [showPreview, floating, background]);

  useEffect(() => {
    if (phoneState === PHONE_STATES.SLEEP && !isAnimatingToSleep && !wasSleepingRef.current) {
      const fromState = previousStateRef.current;
      setIsAnimatingToSleep(true);
      sleepAnimationStartRef.current = performance.now();
      wasSleepingRef.current = true;

      const animate = (currentTime: number) => {
        if (!sleepAnimationStartRef.current) return;

        const elapsed = currentTime - sleepAnimationStartRef.current;
        const duration = 500;
        const progress = Math.min(elapsed / duration, 1);

        const floatingOverrides = floating?.stateOverrides || {};
        const backgroundOverrides = background?.stateOverrides || {};

        const baseFloatingLayers = floating?.layers || [];
        const baseBackgroundLayers = background?.layers || [];

        const fromFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, fromState);
        const fromBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, fromState);

        const targetFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, PHONE_STATES.SLEEP);
        const targetBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, PHONE_STATES.SLEEP);

        const interpolatedFloating = interpolateLayers(fromFloatingLayers, targetFloatingLayers, progress);
        const interpolatedBackground = interpolateLayers(fromBackgroundLayers, targetBackgroundLayers, progress);

        setPreviewLayers([
          ...interpolatedBackground,
          ...interpolatedFloating,
        ]);

        if (progress < 1) {
          toSleepAnimationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimatingToSleep(false);
          sleepAnimationStartRef.current = null;
        }
      };

      toSleepAnimationRef.current = requestAnimationFrame(animate);

      return () => {
        if (toSleepAnimationRef.current) {
          cancelAnimationFrame(toSleepAnimationRef.current);
        }
        setIsAnimatingToSleep(false);
        sleepAnimationStartRef.current = null;
      };
    }

    if (phoneState !== PHONE_STATES.SLEEP) {
      previousStateRef.current = phoneState;
    }
  }, [phoneState, floating, background]);

  useEffect(() => {
    if (phoneState !== PHONE_STATES.SLEEP && wasSleepingRef.current && !isAnimatingFromSleep) {
      const targetState = phoneState;
      setIsAnimatingFromSleep(true);
      sleepAnimationStartRef.current = performance.now();

      const animate = (currentTime: number) => {
        if (!sleepAnimationStartRef.current) return;

        const elapsed = currentTime - sleepAnimationStartRef.current;
        const duration = 500;
        const progress = Math.min(elapsed / duration, 1);

        const floatingOverrides = floating?.stateOverrides || {};
        const backgroundOverrides = background?.stateOverrides || {};

        const baseFloatingLayers = floating?.layers || [];
        const baseBackgroundLayers = background?.layers || [];

        const fromFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, PHONE_STATES.SLEEP);
        const fromBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, PHONE_STATES.SLEEP);

        const targetFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, targetState);
        const targetBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, targetState);

        const interpolatedFloating = interpolateLayers(fromFloatingLayers, targetFloatingLayers, progress);
        const interpolatedBackground = interpolateLayers(fromBackgroundLayers, targetBackgroundLayers, progress);

        setPreviewLayers([
          ...interpolatedBackground,
          ...interpolatedFloating,
        ]);

        if (progress < 1) {
          fromSleepAnimationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimatingFromSleep(false);
          sleepAnimationStartRef.current = null;
          wasSleepingRef.current = false;
        }
      };

      fromSleepAnimationRef.current = requestAnimationFrame(animate);

      return () => {
        if (fromSleepAnimationRef.current) {
          cancelAnimationFrame(fromSleepAnimationRef.current);
        }
        setIsAnimatingFromSleep(false);
        sleepAnimationStartRef.current = null;
        wasSleepingRef.current = false;
      };
    }
  }, [phoneState, floating, background]);

  useEffect(() => {
    if (isAnimatingDragCancel) {
      const startProgress = dragCancelFromProgressRef.current;
      dragCancelStartRef.current = performance.now();

      const animate = (currentTime: number) => {
        if (!dragCancelStartRef.current) return;

        const elapsed = currentTime - dragCancelStartRef.current;
        const duration = 300;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentInterpolation = startProgress * (1 - easeProgress);

        const targetState = phoneState;

        const tempCurrentState = phoneState === PHONE_STATES.LOCKED ? PHONE_STATES.UNLOCK : PHONE_STATES.LOCKED;
        
        const floatingOverrides = floating?.stateOverrides || {};
        const backgroundOverrides = background?.stateOverrides || {};
        const baseFloatingLayers = floating?.layers || [];
        const baseBackgroundLayers = background?.layers || [];

        const fromFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, tempCurrentState);
        const fromBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, tempCurrentState);

        const targetFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, phoneState);
        const targetBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, phoneState);

        const interpolatedFloating = interpolateLayers(targetFloatingLayers, fromFloatingLayers, currentInterpolation);
        const interpolatedBackground = interpolateLayers(targetBackgroundLayers, fromBackgroundLayers, currentInterpolation);


        setPreviewLayers([
            ...interpolatedBackground,
            ...interpolatedFloating,
          ]);

        if (progress < 1) {
          dragCancelAnimationRef.current = requestAnimationFrame(animate);
        } else {
          const finalFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, phoneState);
          const finalBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, phoneState);
          setPreviewLayers([
            ...finalBackgroundLayers,
            ...finalFloatingLayers,
          ]);

          setIsAnimatingDragCancel(false);
          dragCancelStartRef.current = null;
          dragCancelFromProgressRef.current = 0;
        }
      };

      dragCancelAnimationRef.current = requestAnimationFrame(animate);

      return () => {
        if (dragCancelAnimationRef.current) {
          cancelAnimationFrame(dragCancelAnimationRef.current);
        }
      };
    }
  }, [isAnimatingDragCancel, phoneState, floating, background, updateLayersWithProgress]);

  useEffect(() => {
    if (isAnimatingDragComplete) {
      const startProgress = dragCompleteFromProgressRef.current;
      const targetState = dragCompleteTargetStateRef.current;
      const fromState = targetState === PHONE_STATES.LOCKED ? PHONE_STATES.UNLOCK : PHONE_STATES.LOCKED;

      dragCompleteStartRef.current = performance.now();

      const animate = (currentTime: number) => {
        if (!dragCompleteStartRef.current) return;

        const elapsed = currentTime - dragCompleteStartRef.current;
        const duration = 200;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 2);

        const currentInterpolation = startProgress + (1 - startProgress) * easeProgress;
        
        const floatingOverrides = floating?.stateOverrides || {};
        const backgroundOverrides = background?.stateOverrides || {};
        const baseFloatingLayers = floating?.layers || [];
        const baseBackgroundLayers = background?.layers || [];

        const fromFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, fromState);
        const fromBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, fromState);

        const targetFloatingLayers = applyOverrides(baseFloatingLayers, floatingOverrides, targetState);
        const targetBackgroundLayers = applyOverrides(baseBackgroundLayers, backgroundOverrides, targetState);

        const interpolatedFloating = interpolateLayers(fromFloatingLayers, targetFloatingLayers, currentInterpolation);
        const interpolatedBackground = interpolateLayers(fromBackgroundLayers, targetBackgroundLayers, currentInterpolation);


        setPreviewLayers([
            ...interpolatedBackground,
            ...interpolatedFloating,
          ]);

        if (progress < 1) {
          dragCompleteAnimationRef.current = requestAnimationFrame(animate);
        } else {
          setPhoneState(targetState);
          setIsAnimatingDragComplete(false);
          dragCompleteStartRef.current = null;
          dragCompleteFromProgressRef.current = 0;
        }
      };

      dragCompleteAnimationRef.current = requestAnimationFrame(animate);

      return () => {
        if (dragCompleteAnimationRef.current) {
          cancelAnimationFrame(dragCompleteAnimationRef.current);
        }
      };
    }
  }, [isAnimatingDragComplete, floating, background]);
  
  const handleSideButtonClick = () => {
    if (phoneState === PHONE_STATES.SLEEP) {
      setPhoneState(PHONE_STATES.LOCKED);
      setDragOffset(0);
    } else {
      setPhoneState(PHONE_STATES.SLEEP);
    }
  };

  const handleScreenClick = () => {
    if (!isAnimatingToSleep && !isAnimatingFromSleep && phoneState === PHONE_STATES.SLEEP) {
      setPhoneState(PHONE_STATES.LOCKED);
      setDragOffset(0);
    }
  };

  const onDragStart = (clientY: number, element: "home-bar" | "status-bar") => {
    if (phoneState === PHONE_STATES.LOCKED && element !== "home-bar") return;
    if (phoneState === PHONE_STATES.UNLOCK && element !== "status-bar") return;

    setIsDragging(true);
    dragStartYRef.current = clientY;
    dragStartElementRef.current = element;
    dragDirectionRef.current = null;
    
    if (dragCancelAnimationRef.current) cancelAnimationFrame(dragCancelAnimationRef.current);
    if (dragCompleteAnimationRef.current) cancelAnimationFrame(dragCompleteAnimationRef.current);
    setIsAnimatingDragCancel(false);
    setIsAnimatingDragComplete(false);
  };

  const onDragMove = (clientY: number) => {
    if (!isDragging || dragStartYRef.current == null || !phoneScreenRef.current) return;

    const screenHeight = phoneScreenRef.current.clientHeight;
    const delta = clientY - dragStartYRef.current;

    if (!dragDirectionRef.current && Math.abs(delta) > 5) {
      dragDirectionRef.current = delta < 0 ? "up" : "down";
    }

    if (dragDirectionRef.current === "up" && phoneState === PHONE_STATES.LOCKED) {
      const progress = Math.min(Math.abs(delta) / screenHeight, 1);
      setDragOffset(Math.max(delta, -screenHeight));
      updateLayersWithProgress(PHONE_STATES.UNLOCK, progress);
    } else if (dragDirectionRef.current === "down" && phoneState === PHONE_STATES.UNLOCK) {
      const progress = Math.min(Math.abs(delta) / screenHeight, 1);
      const currentProgress = 1 - progress;
      setDragOffset(-screenHeight + Math.min(delta, screenHeight));
      updateLayersWithProgress(PHONE_STATES.LOCKED, currentProgress);
    }
  };

  const onDragEnd = () => {
    if (!isDragging || !phoneScreenRef.current) return;

    const screenHeight = phoneScreenRef.current.clientHeight;
    let currentProgress = 0;
    let targetState = phoneState;
    let dragDistance = dragOffset;

    if (phoneState === PHONE_STATES.LOCKED && dragDirectionRef.current === "up") {
      currentProgress = Math.min(Math.abs(dragDistance) / screenHeight, 1);
      targetState = PHONE_STATES.UNLOCK;
    } else if (phoneState === PHONE_STATES.UNLOCK && dragDirectionRef.current === "down") {
      currentProgress = 1 - Math.min((screenHeight + dragDistance) / screenHeight, 1);
      targetState = PHONE_STATES.LOCKED;
    }

    const thresholdMet = currentProgress >= 0.5;

    if (thresholdMet) {
      dragCompleteFromProgressRef.current = currentProgress;
      dragCompleteTargetStateRef.current = targetState;
      setIsAnimatingDragComplete(true);
      setDragOffset(targetState === PHONE_STATES.UNLOCK ? -screenHeight : 0);
    } else if (currentProgress > 0) {
      dragCancelFromProgressRef.current = currentProgress;
      setIsAnimatingDragCancel(true);
      setDragOffset(phoneState === PHONE_STATES.UNLOCK ? -screenHeight : 0);
    }

    setIsDragging(false);
    dragStartYRef.current = null;
    dragDirectionRef.current = null;
  };

  const handleHomeBarMouseDown = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onDragStart(e.clientY, "home-bar"); };
  const handleHomeBarTouchStart = (e: React.TouchEvent) => { e.stopPropagation(); const touch = e.touches[0]; if (touch) onDragStart(touch.clientY, "home-bar"); };
  const handleStatusBarMouseDown = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onDragStart(e.clientY, "status-bar"); };
  const handleStatusBarTouchStart = (e: React.TouchEvent) => { e.stopPropagation(); const touch = e.touches[0]; if (touch) onDragStart(touch.clientY, "status-bar"); };
  const handleMouseMove = (e: React.MouseEvent) => { onDragMove(e.clientY); };
  const handleMouseUp = () => { onDragEnd(); };
  const handleTouchMove = (e: React.TouchEvent) => { const touch = e.touches[0]; if (touch) onDragMove(touch.clientY); };
  const handleTouchEnd = () => { onDragEnd(); };


  let homeBarTranslateY = 0;
  if (phoneState === PHONE_STATES.LOCKED) {
    homeBarTranslateY = dragOffset;
  } else if (phoneState === PHONE_STATES.UNLOCK) {
    homeBarTranslateY = dragOffset;
  }

  const isSleep = phoneState === PHONE_STATES.SLEEP;
  const isUnlocked = phoneState === PHONE_STATES.UNLOCK;


  if (!showPreview) return children;
  return (
    <div
      className={'flex flex-col items-center justify-center w-full h-full select-none'}
      style={{ background: 'radial-gradient(circle at top, #141415 0%, #000 60%)' }}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={isDragging ? handleMouseUp : undefined}
      onMouseLeave={isDragging ? handleMouseUp : undefined}
      onTouchMove={isDragging ? handleTouchMove : undefined}
      onTouchEnd={isDragging ? handleTouchEnd : undefined}
    >
      <div
        className="relative rounded-[56px] p-[6px] flex shrink-0 items-stretch justify-center shadow-[0_0_0_2px_#333,0_0_0_6px_#111,0_25px_50px_rgba(0,0,0,0.8)]"
        style={{
          background: 'linear-gradient(145deg, #2c2c2e, #141415)',
          width: `${canvasWidth + 12}px`,
          height: `${canvasHeight + 12}px`,
          boxSizing: 'content-box',
          transform: `scale(${scale})`,
        }}
      >
        <button
          className="absolute -right-3 top-[90px] w-3 h-[60px] rounded-[3px] bg-[#555] border border-[#333] cursor-pointer active:translate-x-px shadow-inner"
          onClick={handleSideButtonClick}
          disabled={isAnimatingDragCancel || isAnimatingDragComplete || isAnimatingToSleep || isAnimatingFromSleep}
        />
        <div className="absolute -left-3 top-[100px] w-3 h-[25px] rounded-[3px] bg-[#555] border border-[#333] shadow-inner" />
        <div className="absolute -left-3 top-[135px] w-3 h-[25px] rounded-[3px] bg-[#555] border border-[#333] shadow-inner" />

        <div
          ref={phoneScreenRef}
          className={`relative flex-1 rounded-[36px] overflow-hidden bg-black flex flex-col select-none ${
            isSleep ? 'brightness-[0.7]' : 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
          }`}
          onClick={handleScreenClick}
        >
          {!isSleep && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-center p-1 shadow-xl pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e] mr-1" />
              <div className="w-5 h-5 bg-[#1e1e1e] rounded-full" />
            </div>
          )}

          <div className="absolute inset-0 overflow-hidden">
            {children}
          </div>

          <LockScreen
            onHomeBarMouseDown={handleHomeBarMouseDown}
            onHomeBarTouchStart={handleHomeBarTouchStart}
            isDragging={isDragging}
            homeBarTranslateY={homeBarTranslateY}
            showTopBar={!isSleep}
            showBottomBar={!isSleep}
            showButtons={!isSleep}
          />

          <TopBar showTopBar={!isSleep} />

          {isUnlocked && (
            <div className="absolute inset-0 flex flex-col text-white pointer-events-none">
              <div
                className="w-full h-16 pt-5 cursor-grab select-none touch-none active:cursor-grabbing pointer-events-auto"
                onMouseDown={handleStatusBarMouseDown}
                onTouchStart={handleStatusBarTouchStart}
              >
              </div>
              <div className="flex-1 flex items-end justify-center pb-5 pointer-events-none">
                <div className="grid grid-cols-4 gap-5 p-5 rounded-[28px] bg-white/10 backdrop-blur-md shadow-xl pointer-events-auto">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-14 h-14 rounded-2xl bg-white/30 hover:bg-white/40 transition cursor-pointer" />
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
