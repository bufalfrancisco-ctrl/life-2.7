import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
}

const ComingSoonDialog = ({ open, onOpenChange, title, description }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="glass-card max-w-sm w-[90vw] p-6 border-0">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          {description}
        </DialogDescription>
      </DialogHeader>
      <p className="mt-3 text-xs text-muted-foreground">
        Coming in the next phase.
      </p>
    </DialogContent>
  </Dialog>
);

export default ComingSoonDialog;
