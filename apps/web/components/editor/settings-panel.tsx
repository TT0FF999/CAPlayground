import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const X = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
);

const Button = ({ children, className, variant = 'default', size = 'default', onClick, ...props }) => {
  let baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  if (variant === 'ghost') baseClasses += " bg-transparent hover:bg-gray-200/50 dark:hover:bg-gray-700/50";
  if (variant === 'outline') baseClasses += " border border-border bg-background/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700";
  if (variant === 'default') baseClasses += " bg-accent text-accent-foreground hover:bg-accent/90";

  if (size === 'icon') baseClasses += " h-10 w-10 p-0";
  if (size === 'sm') baseClasses += " h-8 px-3 text-sm";
  if (size === 'default') baseClasses += " h-10 px-4 py-2";

  return (
    <button className={cn(baseClasses, className)} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const Label = ({ children, htmlFor, className, ...props }) => (
  <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
    {children}
  </label>
);

const Switch = ({ checked, onCheckedChange, id, ...props }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", // Mise à jour: focus:ring-ring
      checked ? "bg-accent" : "bg-gray-300 dark:bg-gray-600"
    )}
    {...props}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

const Slider = ({ value, min, max, step, onValueChange, id }) => (
  <input
    id={id}
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([Number(e.target.value)])}
    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
  />
);


const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) ?? initialValue) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error("Error writing to localStorage key “" + key + "”:", error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};


export type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
  latestVersion: string | null;
  leftWidth?: number;
  rightWidth?: number;
  statesHeight?: number;
  setLeftWidth?: (n: number) => void;
  setRightWidth?: (n: number) => void;
  setStatesHeight?: (n: number) => void;
  showLeft?: boolean;
  showRight?: boolean;
};

export function SettingsPanel({
  open,
  onClose,
  latestVersion,
  leftWidth,
  rightWidth,
  statesHeight,
  setLeftWidth,
  setRightWidth,
  setStatesHeight,
  showLeft,
  showRight,
}: SettingsPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [entering, setEntering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const [snapEdgesEnabled, setSnapEdgesEnabled] = useLocalStorage("caplay_settings_snap_edges", true);
  const [snapLayersEnabled, setSnapLayersEnabled] = useLocalStorage("caplay_settings_snap_layers", true);
  const [snapResizeEnabled, setSnapResizeEnabled] = useLocalStorage("caplay_settings_snap_resize", true);
  const [snapRotationEnabled, setSnapRotationEnabled] = useLocalStorage("caplay_settings_snap_rotation", true);
  const [SNAP_THRESHOLD, setSnapThreshold] = useLocalStorage("caplay_settings_snap_threshold", 12);
  const [showAnchorPoint, setShowAnchorPoint] = useLocalStorage("caplay_preview_anchor_point", false);
  const [autoClosePanels, setAutoClosePanels] = useLocalStorage("caplay_settings_auto_close_panels", true);
  const [pinchZoomSensitivity, setPinchZoomSensitivity] = useLocalStorage("caplay_settings_pinch_zoom_sensitivity", 1);
  const [showGeometryResize, setShowGeometryResize] = useLocalStorage("caplay_settings_show_geometry_resize", false); // NOUVEAU
  const [showAlignButtons, setShowAlignButtons] = useLocalStorage("caplay_settings_show_align_buttons", false); // NOUVEAU

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsClosing(false);
      setEntering(false);
      const id = requestAnimationFrame(() => setEntering(true));
      return () => cancelAnimationFrame(id);
    } else if (shouldRender) {
      setEntering(false);
      setIsClosing(true);
      const timeout = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); 
      return () => clearTimeout(timeout);
    }
  }, [open, shouldRender]);

  useEffect(() => {
    if (!mounted) return;
    if (!shouldRender) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [shouldRender, mounted]);

  useEffect(() => {
    if (!shouldRender) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shouldRender, onClose]);

  if (!mounted || !shouldRender || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {}
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-[1000] bg-black/70 transition-opacity duration-300 ease-in-out", 
          entering && !isClosing ? "opacity-100 backdrop-blur-sm" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {}
      <div
        className={cn(
          "fixed top-0 right-0 h-full z-[1001] shadow-2xl",
          // MODIFICATION: Augmentation de la transparence de l'arrière-plan (Light: /90 -> /60 | Dark: /80 -> /50)
          "bg-white/60 backdrop-blur-3xl border-l border-white/50", 
          "dark:bg-gray-900/50 dark:border-gray-800/50",
          "rounded-l-3xl", 
          "w-full md:w-[500px] lg:w-[600px]",
          "transform transition-transform duration-300 ease-out",
          entering ? "translate-x-0" : "translate-x-full",
          "flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        {}
        <div className="flex items-center justify-between gap-2 p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold">Editor Settings</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-black/70 dark:text-white/80 hover:bg-white/50 dark:hover:bg-gray-700/50" aria-label="Close settings" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          
          {}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Snapping</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="snap-edges" className="text-base">Snap to canvas edges</Label>
                <Switch id="snap-edges" checked={!!snapEdgesEnabled} onCheckedChange={(c) => setSnapEdgesEnabled(!!c)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="snap-layers" className="text-base">Snap to other layers</Label>
                <Switch id="snap-layers" checked={!!snapLayersEnabled} onCheckedChange={(c) => setSnapLayersEnabled(!!c)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="snap-resize" className="text-base">Snap when resizing</Label>
                <Switch id="snap-resize" checked={!!snapResizeEnabled} onCheckedChange={(c) => setSnapResizeEnabled(!!c)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="snap-rotation" className="text-base">Snap rotation (0°, 90°, 180°, 270°)</Label>
                <Switch id="snap-rotation" checked={!!snapRotationEnabled} onCheckedChange={(c) => setSnapRotationEnabled(!!c)} />
              </div>
              
              {}
              <div className="space-y-2 pt-4"> 
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="snap-threshold" className="text-base">Sensitivity (px)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6 text-right">{SNAP_THRESHOLD}</span>
                    <Button variant="outline" size="sm" onClick={()=>{setSnapThreshold(12)}}>Reset</Button>
                  </div>
                </div>
                <Slider id="snap-threshold" value={[SNAP_THRESHOLD]} min={3} max={25} onValueChange={([c]) => setSnapThreshold(c)} />
              </div>
              
            </div>
          </div>
          
          {}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layer Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-geometry-resize" className="text-base">Show geometry resize buttons</Label>
                <Switch id="show-geometry-resize" checked={!!showGeometryResize} onCheckedChange={(c) => setShowGeometryResize(!!c)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-align-buttons" className="text-base">Show align buttons</Label>
                <Switch id="show-align-buttons" checked={!!showAlignButtons} onCheckedChange={(c) => setShowAlignButtons(!!c)} />
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-anchor-point" className="text-base">Show anchor point</Label>
                <Switch id="show-anchor-point" checked={!!showAnchorPoint} onCheckedChange={(c) => setShowAnchorPoint(!!c)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="pinch-zoom-sensitivity" className="text-base">Pinch to zoom sensitivity</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6 text-right">{pinchZoomSensitivity.toFixed(1)}</span>
                    <Button variant="outline" size="sm" onClick={()=>{setPinchZoomSensitivity(1)}}>Reset</Button>
                  </div>
                </div>
                <Slider id="pinch-zoom-sensitivity" value={[pinchZoomSensitivity]} min={0.5} max={2} step={0.1} onValueChange={([c]) => setPinchZoomSensitivity(c)} />
              </div>
            </div> 
          </div>

          {}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keyboard Shortcuts</h3>
            {/* MODIFICATION: Augmentation de la transparence de l'arrière-plan du bloc de raccourcis */}
            <div className="space-y-2 text-sm bg-gray-100/30 dark:bg-gray-800/30 p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between"><span>Undo</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Z</span></div>
              <div className="flex items-center justify-between"><span>Redo</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + Z</span></div>
              <div className="flex items-center justify-between"><span>Zoom In</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + +</span></div>
              <div className="flex items-center justify-between"><span>Zoom Out</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + -</span></div>
              <div className="flex items-center justify-between"><span>Reset Zoom</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + 0</span></div>
              <div className="flex items-center justify-between"><span>Export</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + E</span></div>
              <div className="flex items-center justify-between"><span>Pan</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">Shift + Drag or Middle Click</span></div>
              <div className="flex items-center justify-between"><span>Toggle Left Panel</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + L</span></div>
              <div className="flex items-center justify-between"><span>Toggle Right Panel</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + I</span></div>
              <div className="flex items-center justify-between"><span>Bring Forward</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + ]</span></div>
              <div className="flex items-center justify-between"><span>Send Backward</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + [</span></div>
              <div className="flex items-center justify-between"><span>Bring to Front</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + ]</span></div>
              <div className="flex items-center justify-between"><span>Send to Back</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + [</span></div>
              <div className="flex items-center justify-between"><span>Delete Layer</span><span className="font-mono text-gray-600 dark:text-gray-400 text-xs">Delete</span></div>
            </div>
          </div>

          {}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Panels</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="auto-close-panels" className="text-base">Auto-close right panel on narrow screens</Label>
                <Switch id="auto-close-panels" checked={!!autoClosePanels} onCheckedChange={(c) => setAutoClosePanels(!!c)} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-base">Left panel width</span>
                <span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{leftWidth ?? '—'} px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base">Right panel width</span>
                <span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{rightWidth ?? '—'} px</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base">States panel height</span>
                <span className="font-mono text-gray-600 dark:text-gray-400 text-xs">{statesHeight ?? '—'} px</span>
              </div>
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full"
                  onClick={() => {
                    setLeftWidth?.(320);
                    setRightWidth?.(400);
                    setStatesHeight?.(350);
                  }}
                >
                  Reset to defaults
                </Button>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('caplay:start-onboarding'));
                }
                onClose();
              }}
              disabled={!showLeft || !showRight}
            >
              Show onboarding
            </Button>
          </div>

          {}
          <div className="py-6 border-t border-gray-300 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Version: {latestVersion ?? '...'}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export default function App() {
    const [isOpen, setIsOpen] = useState(true);
    const [leftWidth, setLeftWidth] = useState(320);
    const [rightWidth, setRightWidth] = useState(400);
    const [statesHeight, setStatesHeight] = useState(350);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <Button onClick={() => setIsOpen(true)}>Open Settings Panel</Button>
            <SettingsPanel
                open={isOpen}
                onClose={() => setIsOpen(false)}
                latestVersion="1.2.0"
                leftWidth={leftWidth}
                rightWidth={rightWidth}
                statesHeight={statesHeight}
                setLeftWidth={setLeftWidth}
                setRightWidth={setRightWidth}
                setStatesHeight={setStatesHeight}
                showLeft={true}
                showRight={true}
            />
        </div>
    );
}
