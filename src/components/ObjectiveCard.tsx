import { useState, useRef, useEffect } from "react";
import {
  Check,
  Trash2,
  Link as LinkIcon,
  Plus,
  X,
  Pin,
  HelpCircle,
  Brain,
  Hourglass,
  PencilLine,
  Archive,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Objective, ObjectiveUpdate } from "@/hooks/useObjectives";
import CategoryPickerDialog from "@/components/CategoryPickerDialog";
import MotivationDialog from "@/components/MotivationDialog";
import SubTasksDialog from "@/components/SubTasksDialog";
import DeadlineDialog from "@/components/DeadlineDialog";
import ImageCropDialog from "@/components/ImageCropDialog";

interface Props {
  objective: Objective;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onUpdate: (id: string, updates: ObjectiveUpdate) => void;
  onArchive?: (id: string) => void;
}

const ObjectiveCard = ({
  objective: obj,
  onToggle,
  onDelete,
  onTogglePin,
  onUpdate,
  onArchive,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(obj.text);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [motivationOpen, setMotivationOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [subtasksOpen, setSubtasksOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // --- STATI PER IL CROP ---
  const [cropOpen, setCropOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  // --- LOGICA TRASCINAMENTO BACKGROUND ---
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState(obj.backgroundPos ?? 50);
  const startCoordRef = useRef(0);
  const startPosRef = useRef(50);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const coverImage = obj.images.length > 0 ? obj.images[0] : null;

  useEffect(() => {
    if (obj.backgroundPos !== undefined) setLocalPos(obj.backgroundPos);
  }, [obj.backgroundPos]);

  useEffect(() => {
    setTitleDraft(obj.text);
  }, [obj.text]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus();
  }, [editingTitle]);

  // Gestione Drag manuale sulla card (Sincronizzata con orientamento)
  const handleDragStart = (clientCoord: number) => {
    if (!coverImage) return;
    setIsDragging(true);
    startCoordRef.current = clientCoord;
    startPosRef.current = localPos;
  };

  const handleDragMove = (clientCoord: number) => {
    if (!isDragging) return;
    const delta = clientCoord - startCoordRef.current;
    const sensitivity = 0.4;
    const newPos = Math.max(0, Math.min(100, startPosRef.current - delta * sensitivity));
    setLocalPos(newPos);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    onUpdate(obj.id, { backgroundPos: localPos });
  };

  const commitTitle = () => {
    const next = titleDraft.trim();
    if (next && next !== obj.text) {
      onUpdate(obj.id, { text: next });
    } else {
      setTitleDraft(obj.text);
    }
    setEditingTitle(false);
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setTempImage(reader.result); 
        setCropOpen(true); 
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // RICEVE SIA POSIZIONE CHE ORIENTAMENTO DAL DIALOG
  const handleCropConfirm = (position: number, isWide: boolean) => {
    const updates: ObjectiveUpdate = {
      backgroundPos: position,
      isBackgroundWide: isWide
    };
    
    if (tempImage) {
      updates.images = [tempImage];
    }

    onUpdate(obj.id, updates);
    setCropOpen(false);
    setTempImage(null);
  };

  const removeImage = () => onUpdate(obj.id, { images: [], backgroundPos: 50, isBackgroundWide: false });

  const handleArchive = () => {
    setOpen(false);
    setArchiving(true);
    setTimeout(() => onArchive?.(obj.id), 480);
  };

  const captionFontSize = (() => {
    const len = obj.motivation.length;
    if (len < 30) return "text-2xl";
    if (len < 70) return "text-xl";
    if (len < 140) return "text-base";
    return "text-sm";
  })();

  return (
    <>
      <div
        className={`group relative rounded-2xl overflow-hidden glass-card transition-all duration-500 cursor-pointer ${
          obj.completed ? "objective-done" : ""
        } ${obj.pinned ? "ring-1 ring-primary/40" : ""} ${
          archiving ? "animate-slide-archive" : ""
        }`}
        onClick={() => setOpen(true)}
      >
        <div className="relative z-10 flex items-center gap-3 px-5 py-4">
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(obj.id); }}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              obj.completed ? "bg-primary border-primary" : "border-muted-foreground/40 hover:border-primary"
            }`}
          >
            {obj.completed && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
          </button>

          <div className="flex-1 min-w-0">
            <span className="block font-medium text-foreground truncate">{obj.text}</span>
            {obj.motivation && (
              <span className="block text-xs italic truncate mt-0.5" style={{ color: obj.motivationColor }}>
                {obj.motivation}
              </span>
            )}
          </div>

          {obj.categoryEmoji && <span className="text-lg leading-none">{obj.categoryEmoji}</span>}

          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(obj.id); }}
            className={`p-1.5 rounded-lg transition-colors ${
              obj.pinned ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Pin className="w-4 h-4" style={{ fill: obj.pinned ? "currentColor" : "transparent" }} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(obj.id); }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-3xl max-w-lg w-[90vw] border-0 glass-card">
          <div className="relative min-h-[660px] flex flex-col">
            
            {coverImage && (
              <div 
                className={`absolute inset-0 w-full h-full select-none touch-none ${isDragging ? 'cursor-grabbing' : (obj.isBackgroundWide ? 'cursor-ew-resize' : 'cursor-ns-resize')}`}
                onMouseDown={(e) => handleDragStart(obj.isBackgroundWide ? e.clientX : e.clientY)}
                onMouseMove={(e) => handleDragMove(obj.isBackgroundWide ? e.clientX : e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => handleDragStart(obj.isBackgroundWide ? e.touches[0].clientX : e.touches[0].clientY)}
                onTouchMove={(e) => handleDragMove(obj.isBackgroundWide ? e.touches[0].clientX : e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
              >
                <div 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    backgroundImage: `url(${coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: obj.isBackgroundWide ? `${localPos}% center` : `center ${localPos}%`,
                    transition: isDragging ? 'none' : 'background-position 0.4s ease-out',
                  }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(var(--background) / 1) 0%, hsl(var(--background) / 0.8) 45%, hsl(var(--background) / 0) 100%)" }} />
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between gap-2 px-6 pt-6 pointer-events-none">
              <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
                <IconButton label="Category" onClick={() => setCategoryOpen(true)} active={!!obj.category}>
                  {obj.categoryEmoji ? <span className="text-base">{obj.categoryEmoji}</span> : <HelpCircle className="w-4 h-4" />}
                </IconButton>
                <IconButton label="Motivation" onClick={() => setMotivationOpen(true)} active={!!obj.motivation}>
                  <Brain className="w-4 h-4" />
                </IconButton>
                <IconButton label="Deadline" onClick={() => setTimeOpen(true)} active={!!obj.deadline || !!obj.checkInTime}>
                  <Hourglass className="w-4 h-4" />
                </IconButton>
                <IconButton label="Sub-tasks" onClick={() => setSubtasksOpen(true)} active={obj.subtasks.length > 0}>
                  <PencilLine className="w-4 h-4" />
                </IconButton>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <IconButton label={coverImage ? "Remove BG" : "Add BG"} onClick={() => coverImage ? removeImage() : fileInputRef.current?.click()} active={!!coverImage}>
                  {coverImage ? <X className="w-4 h-4 text-destructive" /> : <Plus className="w-4 h-4" />}
                </IconButton>
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageAdd} className="hidden" />

            <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-10 text-center pointer-events-none">
              {obj.motivation && (
                <p className={`italic font-semibold drop-shadow-2xl ${captionFontSize}`} style={{ color: obj.motivationColor }}>
                  “{obj.motivation}”
                </p>
              )}
            </div>

            <div className="relative z-10 flex flex-col px-6 pb-8 pt-4">
              <div className="mb-6 pointer-events-auto">
                {editingTitle ? (
                  <input
                    ref={titleInputRef}
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={commitTitle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitTitle();
                      if (e.key === "Escape") { setTitleDraft(obj.text); setEditingTitle(false); }
                    }}
                    className="glass-input w-full text-2xl font-bold p-3"
                  />
                ) : (
                  <button type="button" onClick={() => setEditingTitle(true)} className="group/title text-left w-full">
                    <h2 className="text-2xl font-bold text-foreground drop-shadow-sm flex items-center gap-2">
                      <span className="truncate">{obj.text}</span>
                      <PencilLine className="w-4 h-4 text-muted-foreground opacity-0 group-hover/title:opacity-100 transition-opacity" />
                    </h2>
                  </button>
                )}
              </div>

              <div className="mb-5 pointer-events-auto">
                <label className="text-xs font-semibold text-muted-foreground/80 uppercase mb-2 block">Description</label>
                <textarea
                  value={obj.description}
                  onChange={(e) => onUpdate(obj.id, { description: e.target.value })}
                  placeholder="Notes and steps..."
                  rows={4}
                  className="glass-input w-full resize-none p-3"
                />
              </div>

              <div className="mb-6 pointer-events-auto">
  <label className="text-xs font-semibold text-muted-foreground/80 uppercase mb-2 flex items-center justify-between gap-1.5">
    <div className="flex items-center gap-1.5">
      <LinkIcon className="w-3 h-3" /> Link
    </div>
    
    {/* --- AGGIUNTO: Tasto OPEN LINK --- */}
    {obj.link && (
      <a
        href={obj.link.startsWith("http") ? obj.link : `https://${obj.link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
      >
        OPEN LINK
        <Plus className="w-3 h-3 rotate-45" /> {/* Iconcina per indicare uscita */}
      </a>
    )}
  </label>
  
  <input
    type="url"
    value={obj.link}
    onChange={(e) => onUpdate(obj.id, { link: e.target.value })}
    placeholder="https://..."
    className="glass-input w-full p-3"
  />
</div>

              {onArchive && obj.completed && (
                <div className="mt-2 pointer-events-auto">
                  <button onClick={handleArchive} className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all border border-primary/20">
                    <Archive className="w-4 h-4" /> Archive to Hall of Fame
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CategoryPickerDialog 
        open={categoryOpen} 
        onOpenChange={setCategoryOpen} 
        selected={obj.category} 
        onSelect={(name, emoji) => onUpdate(obj.id, { category: name, categoryEmoji: emoji })} 
      />
      
      <MotivationDialog 
        open={motivationOpen} 
        onOpenChange={setMotivationOpen} 
        motivation={obj.motivation} 
        color={obj.motivationColor} 
        onChange={(motivation, color) => onUpdate(obj.id, { motivation, motivationColor: color })} 
      />
      
      <DeadlineDialog 
        open={timeOpen} 
        onOpenChange={setTimeOpen} 
        deadline={obj.deadline} 
        checkInTime={obj.checkInTime}
        onChange={(newDeadline, newTime) => onUpdate(obj.id, { deadline: newDeadline, checkInTime: newTime })} 
      />

      <SubTasksDialog 
        open={subtasksOpen} 
        onOpenChange={setSubtasksOpen} 
        subtasks={obj.subtasks} 
        onChange={(s) => onUpdate(obj.id, { subtasks: s })} 
      />

      <ImageCropDialog 
        open={cropOpen}
        image={tempImage || coverImage}
        initialPosition={obj.backgroundPos ?? 50}
        onClose={() => { setCropOpen(false); setTempImage(null); }}
        onConfirm={handleCropConfirm}
      />
    </>
  );
};

const IconButton = ({ active, onClick, children }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
      active ? "bg-primary/20 text-primary border-primary/30" : "bg-white/10 text-foreground border-white/10"
    } border backdrop-blur-md shadow-sm`}
  >
    {children}
  </button>
);

export default ObjectiveCard;
