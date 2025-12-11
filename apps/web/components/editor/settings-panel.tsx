import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const cn = (...classes) => classes.filter(Boolean).join(' ');

const X = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
);

const Button = ({ children, className, variant = 'default', size = 'default', onClick, ...props }) => {
  let baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
   
  if (variant === 'ghost') {
    baseClasses += " bg-transparent hover:bg-white/10 dark:hover:bg-gray-700/50";
  }
  if (variant === 'outline') {
    baseClasses += " liquid-button bg-white/5 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/20 shadow-lg shadow-black/30 hover:bg-white/15 dark:hover:bg-white/15 text-foreground dark:text-white";
  }
  if (variant === 'default') {
    baseClasses += " liquid-button bg-accent hover:bg-accent/90 text-white font-semibold shadow-xl shadow-accent/30 hover:shadow-accent/40";
  }

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
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-white/20 dark:border-white/10 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      checked ? "bg-blue-600" : "bg-white/10 dark:bg-gray-700"
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
    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20 dark:bg-white/10
      /* Styles de la piste */
      [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-white/20 dark:[&::-webkit-slider-runnable-track]:bg-white/10
      [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:bg-white/20 dark:[&::-moz-range-track]:bg-white/10
      
      /* Styles du curseur (Thumb) - Ajout de bg-blue-500 pour visibilité */
      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
      [&::-webkit-slider-thumb]:mt-[-6px] 
      [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/50
      
      /* Styles du curseur (Thumb) pour Firefox */
      [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-xl
      "
  />
);


const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  return [storedValue, setStoredValue];
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
}) {
  const [mounted, setMounted] = useState(false);
  const [entering, setEntering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
   
  const [snapEdgesEnabled, setSnapEdgesEnabled] = useState(true);
  const [snapLayersEnabled, setSnapLayersEnabled] = useState(true);
  const [snapResizeEnabled, setSnapResizeEnabled] = useState(true);
  const [snapRotationEnabled, setSnapRotationEnabled] = useState(true);
  const [SNAP_THRESHOLD, setSnapThreshold] = useState(12);
  const [showAnchorPoint, setShowAnchorPoint] = useState(false);
  const [autoClosePanels, setAutoClosePanels] = useState(true);
  const [pinchZoomSensitivity, setPinchZoomSensitivity] = useState(1);
  const [showGeometryResize, setShowGeometryResize] = useState(false); 
  const [showAlignButtons, setShowAlignButtons] = useState(false); 

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
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-[1000] bg-black/70 transition-opacity duration-300 ease-in-out", 
          entering && !isClosing ? "opacity-100 backdrop-blur-sm" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      <div
        className={cn(
          "fixed top-0 right-0 h-full z-[1001] shadow-2xl",
          "bg-white/5 backdrop-blur-3xl border-l border-white/20", 
          "dark:bg-gray-900/10 dark:border-white/20",
          "rounded-l-3xl", 
          "w-full md:w-[500px] lg:w-[600px]",
          "transform transition-transform duration-300 ease-out",
          entering ? "translate-x-0" : "translate-x-full",
          "flex flex-col text-gray-900 dark:text-white"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="flex items-center justify-between gap-2 p-4 border-b border-gray-300/30 dark:border-gray-700/30">
          <h2 className="text-xl font-bold">Réglages de l'Éditeur</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-black/70 dark:text-white/80" aria-label="Fermer les réglages" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          
          {}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accrochage (Snapping)</h3>
            
            <div className="space-y-4 p-4 rounded-xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="snap-edges" className="text-base">Accrocher aux bords du canevas</Label>
                <Switch id="snap-edges" checked={!!snapEdgesEnabled} onCheckedChange={(c) => setSnapEdgesEnabled(!!c)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="snap-layers" className="text-base">Accrocher aux autres calques</Label>
                <Switch id="snap-layers" checked={!!snapLayersEnabled} onCheckedChange={(c) => setSnapLayersEnabled(!!c)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="snap-resize" className="text-base">Accrocher lors du redimensionnement</Label>
                <Switch id="snap-resize" checked={!!snapResizeEnabled} onCheckedChange={(c) => setSnapResizeEnabled(!!c)} />
              </div>
              
              {}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <Label htmlFor="snap-rotation" className="text-base">Accrocher la rotation</Label>
                  <span className="text-xs text-gray-400 dark:text-gray-500 pt-0.5">Angles: 0°, 90°, 180°, 270°</span>
                </div>
                <Switch id="snap-rotation" checked={!!snapRotationEnabled} onCheckedChange={(c) => setSnapRotationEnabled(!!c)} />
              </div>
              
              {}
              <div className="space-y-2 pt-4 border-t border-white/10 dark:border-gray-700/50"> 
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="snap-threshold" className="text-base">Sensibilité d'accrochage (px)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono w-6 text-right text-accent">{SNAP_THRESHOLD}</span>
                    <Button variant="outline" size="sm" onClick={()=>{setSnapThreshold(12)}}>Réinitialiser</Button>
                  </div>
                </div>
                {}
                <Slider id="snap-threshold" value={[SNAP_THRESHOLD]} min={3} max={25} step={1} onValueChange={([c]) => setSnapThreshold(c)} />
              </div>
            </div>
          </div>
          
          {}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contrôles des Calques</h3>
            
            <div className="space-y-4 p-4 rounded-xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-geometry-resize" className="text-base">Afficher les boutons de redimensionnement de géométrie</Label>
                <Switch id="show-geometry-resize" checked={!!showGeometryResize} onCheckedChange={(c) => setShowGeometryResize(!!c)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-align-buttons" className="text-base">Afficher les boutons d'alignement</Label>
                <Switch id="show-align-buttons" checked={!!showAlignButtons} onCheckedChange={(c) => setShowAlignButtons(!!c)} />
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aperçu (Preview)</h3>
            
            <div className="space-y-4 p-4 rounded-xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="show-anchor-point" className="text-base">Afficher le point d'ancrage</Label>
                <Switch id="show-anchor-point" checked={!!showAnchorPoint} onCheckedChange={(c) => setShowAnchorPoint(!!c)} />
              </div>
              <div className="space-y-2 pt-4 border-t border-white/10 dark:border-gray-700/50">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="pinch-zoom-sensitivity" className="text-base">Sensibilité du pincement pour zoomer</Label>
                  <div className="flex items-center gap-2">
                    {/* Utilisation de toFixed(1) pour l'affichage, même pour le 1.0 */}
                    <span className="text-sm font-mono w-6 text-right text-accent">{pinchZoomSensitivity.toFixed(1)}</span>
                    <Button variant="outline" size="sm" onClick={()=>{setPinchZoomSensitivity(1)}}>Réinitialiser</Button>
                  </div>
                </div>
                <Slider id="pinch-zoom-sensitivity" value={[pinchZoomSensitivity]} min={0.5} max={2} step={0.1} onValueChange={([c]) => setPinchZoomSensitivity(c)} />
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Raccourcis Clavier</h3>
            <div className="space-y-2 text-sm bg-white/5 dark:bg-gray-900/10 p-4 rounded-xl border border-white/20 dark:border-white/10 shadow-inner">
              
              {}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                
                {}
                <span className="text-gray-200 col-span-1">Annuler</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Z</span>
                
                <span className="text-gray-200 col-span-1">Rétablir</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + Z</span>
                
                <span className="text-gray-200 col-span-1">Zoom Avant</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + +</span>
                
                <span className="text-gray-200 col-span-1">Zoom Arrière</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + -</span>
                
                <span className="text-gray-200 col-span-1">Réinitialiser Zoom</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + 0</span>
                
                <span className="text-gray-200 col-span-1">Exporter</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + E</span>
                
                <span className="text-gray-200 col-span-1">Panoramique</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">Shift + Glisser ou Clic Molette</span>
                
                <span className="text-gray-200 col-span-1">Basculer Panneau Gauche</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + L</span>
                
                <span className="text-gray-200 col-span-1">Basculer Panneau Droite</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + I</span>
                
                <span className="text-gray-200 col-span-1">Avancer</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + ]</span>
                
                <span className="text-gray-200 col-span-1">Reculer</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + [</span>
                
                <span className="text-gray-200 col-span-1">Mettre au Premier Plan</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + ]</span>
                
                <span className="text-gray-200 col-span-1">Mettre à l'Arrière-Plan</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Shift + [</span>
                
                <span className="text-gray-200 col-span-1">Supprimer Calque</span>
                <span className="font-mono text-gray-400 text-xs text-right col-span-1">Supprimer</span>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Panneaux</h3>
            
            <div className="space-y-3 text-sm p-4 rounded-xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-inner">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="auto-close-panels" className="text-base">Fermeture automatique du panneau de droite sur écrans étroits</Label>
                <Switch id="auto-close-panels" checked={!!autoClosePanels} onCheckedChange={(c) => setAutoClosePanels(!!c)} />
              </div>
              
              {}
              <div className="grid grid-cols-2 gap-y-2 pt-2 border-t border-white/10 dark:border-gray-700/50">
                <span className="text-base col-span-1">Largeur du panneau gauche</span>
                <span className="font-mono text-accent text-sm text-right col-span-1">{leftWidth ?? '—'} px</span>
                
                <span className="text-base col-span-1">Largeur du panneau de droite</span>
                <span className="font-mono text-accent text-sm text-right col-span-1">{rightWidth ?? '—'} px</span>
                
                <span className="text-base col-span-1">Hauteur du panneau d'états</span>
                <span className="font-mono text-accent text-sm text-right col-span-1">{statesHeight ?? '—'} px</span>
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
                  Réinitialiser les valeurs par défaut
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
                  console.log('Dispatching caplay:start-onboarding event');
                }
                onClose();
              }}
              disabled={!showLeft || !showRight}
            >
              Afficher l'accueil
            </Button>
          </div>

          {}
          <div className="py-6 border-t border-gray-300/30 dark:border-gray-700/30">
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
    const accentColor = '#0585FE'; 
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;


    return (
        <div className={isDark ? "dark" : ""}>
            <script src="https://cdn.tailwindcss.com"></script>
            <style jsx global>{`
                :root {
                    --accent: ${accentColor};
                    --foreground: ${isDark ? '#ffffff' : '#1f2937'};
                }
                .bg-accent { background-color: var(--accent); }
                .text-accent { color: var(--accent); }
                .shadow-accent\\/30 { box-shadow: 0 10px 15px -3px rgba(5, 133, 254, 0.3), 0 4px 6px -4px rgba(5, 133, 254, 0.3); }
                .hover\\:shadow-accent\\/40:hover { box-shadow: 0 10px 15px -3px rgba(5, 133, 254, 0.4), 0 4px 6px -4px rgba(5, 133, 254, 0.4); }
                .liquid-button {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s;
                }
                .liquid-button:before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: 0.5s;
                }
                .liquid-button:hover:before {
                    left: 100%;
                }
            `}</style>
            
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                <Button 
                    onClick={() => setIsOpen(true)}
                    className="z-50"
                >
                    Ouvrir le Panneau de Réglages
                </Button>
                
                {}
                <div className="fixed bottom-4 left-4 p-4 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur text-sm text-gray-800 dark:text-white border border-white/20 dark:border-white/10 shadow-lg z-50">
                    <p>Largeur Gauche: <span className="font-semibold text-accent">{leftWidth}px</span></p>
                    <p>Largeur Droite: <span className="font-semibold text-accent">{rightWidth}px</span></p>
                    <p>Hauteur États: <span className="font-semibold text-accent">{statesHeight}px</span></p>
                </div>

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
        </div>
    );
}
