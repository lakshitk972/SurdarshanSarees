import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImagePreviewModalProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImagePreviewModal({
  images,
  initialIndex,
  open,
  onOpenChange,
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevImage();
    } else if (e.key === "ArrowRight") {
      handleNextImage();
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-7xl w-screen h-[90vh] p-0 border-none bg-black/95 flex items-center justify-center"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <button
          onClick={handlePrevImage}
          className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNextImage}
          className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center p-10">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Product preview ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain"
            />
          </AnimatePresence>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 p-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}