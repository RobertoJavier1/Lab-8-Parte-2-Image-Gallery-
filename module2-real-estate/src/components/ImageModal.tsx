import type React from 'react';
import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  //todas las imagenes de la propiedad
  images: string[];        
  //cual esta activa
  currentIndex: number; 
  propertyTitle: string;   
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}


export function ImageModal({
  images,
  currentIndex,
  propertyTitle,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps): React.ReactElement {
  const totalImages = images.length;
  const currentImage = images[currentIndex];

  //navegacion usando el teclado
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'Escape')     onClose();
  }, [onNext, onPrev, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  //bloquear el scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  //cerrar al clickear el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    //solo cierra si el click fue en el fondo, no en la imagen o botones
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {/* Botón cerrar */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 hover:text-white"
        onClick={onClose}
        aria-label="Cerrar galería"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Contador */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full">
        {currentIndex + 1} de {totalImages}
      </div>

      {/* Flecha anterior */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 text-white hover:bg-white/20 hover:text-white h-12 w-12"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {/* Imagen */}
      <div
        className="max-w-5xl max-h-[85vh] mx-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={currentImage}
          src={currentImage}
          alt={`${propertyTitle} - Imagen ${currentIndex + 1} de ${totalImages}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Flecha siguiente */}
      {currentIndex < totalImages - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 text-white hover:bg-white/20 hover:text-white h-12 w-12"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
}