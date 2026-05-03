import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  image: string | null;
  open: boolean;
  initialPosition?: number;
  onClose: () => void;
  onConfirm: (position: number, isWide: boolean) => void;
}

const ImageCropDialog = ({ image, open, initialPosition = 50, onClose, onConfirm }: Props) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isWide, setIsWide] = useState(false); // Capisce se l'immagine è larga
  const startRef = useRef(0);
  const startPosRef = useRef(initialPosition);

  useEffect(() => {
    if (open && image) {
      setPosition(initialPosition);
      startPosRef.current = initialPosition;

      // Check se l'immagine è landscape o portrait
      const img = new Image();
      img.src = image;
      img.onload = () => {
        setIsWide(img.width > img.height);
      };
    }
  }, [open, initialPosition, image]);

  if (!image) return null;

  const handleStart = (clientCoord: number) => {
    setIsDragging(true);
    startRef.current = clientCoord;
    startPosRef.current = position;
  };

  const handleMove = (clientCoord: number) => {
    if (!isDragging) return;
    const delta = clientCoord - startRef.current;
    const sensitivity = 0.6; 
    
    // Se è larga, sottraiamo (movimento naturale trascinamento)
    // Se è alta, sottraiamo (movimento naturale trascinamento)
    let newPos = startPosRef.current - (delta * sensitivity);
    
    newPos = Math.max(0, Math.min(100, newPos));
    setPosition(newPos);
  };

  const handleEnd = () => setIsDragging(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 border-0 bg-[#121214] max-w-[400px] w-[90vw] rounded-[32px] overflow-hidden shadow-2xl">
        <DialogHeader className="py-5 border-b border-white/5">
          <DialogTitle className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            {isWide ? "Slide Left / Right" : "Slide Up / Down"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <div 
            className={`relative w-full aspect-[4/5] bg-zinc-950 rounded-[24px] overflow-hidden touch-none border border-white/10 ${isWide ? 'cursor-ew-resize' : 'cursor-ns-resize'}`}
            onMouseDown={(e) => handleStart(isWide ? e.clientX : e.clientY)}
            onMouseMove={(e) => handleMove(isWide ? e.clientX : e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(isWide ? e.touches[0].clientX : e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(isWide ? e.touches[0].clientX : e.touches[0].clientY)}
            onTouchEnd={handleEnd}
          >
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                // Se è larga muoviamo l'asse X, altrimenti l'asse Y
                backgroundPosition: isWide ? `${position}% center` : `center ${position}%`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
            
            <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                {isWide ? "Drag horizontally" : "Drag vertically"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 bg-[#121214]">
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1 h-12 rounded-2xl text-[11px] font-bold text-white/30 uppercase border border-white/5">
              Cancel
            </Button>
            <Button 
              onClick={() => onConfirm(position, isWide)} 
              className="flex-1 h-12 rounded-2xl text-[11px] font-bold bg-[#A855F7] text-white shadow-lg shadow-purple-500/20 uppercase"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;