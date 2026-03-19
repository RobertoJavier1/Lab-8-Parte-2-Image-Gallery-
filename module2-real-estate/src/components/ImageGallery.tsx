import type React from 'react';
import { useState, useCallback } from 'react';
import { ImageIcon } from 'lucide-react';
import { ImageModal } from './ImageModal';

interface ImageGalleryProps {
  images: string[];
  propertyTitle: string;
}

export function ImageGallery({ images, propertyTitle }: ImageGalleryProps): React.ReactElement {
  //maneja si el modal esta abierto o cerrado y que imagen se muestra
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const totalImages = images.length;
  const isModalOpen = modalIndex !== null;

  const openModal = useCallback((index: number): void => {
    setModalIndex(index);
  }, []);

  const closeModal = useCallback((): void => {
    setModalIndex(null);
  }, []);

  const goToNext = useCallback((): void => {
    setModalIndex((prev) => {
      if (prev === null) return null;
      return prev < totalImages - 1 ? prev + 1 : prev;
    });
  }, [totalImages]);

  const goToPrev = useCallback((): void => {
    setModalIndex((prev) => {
      if (prev === null) return null;
      return prev > 0 ? prev - 1 : prev;
    });
  }, []);

  // =========================================================================
  // Sin imagenes
  // =========================================================================

  if (totalImages === 0) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <ImageIcon className="h-12 w-12" />
        <p>Sin imágenes disponibles</p>
      </div>
    );
  }

  // =========================================================================
  // HELPER
  // =========================================================================

  //Estilos base para las miniaturas
  const thumbnailClass =
    'absolute inset-0 w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity duration-200';

  // =========================================================================
  // 2 Imagen
  // =========================================================================

  if (totalImages === 1) {
    return (
      <>
        <div
          className="w-full h-[450px] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
          role="button"
          aria-label={`Ver imagen de ${propertyTitle}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openModal(0)}
        >
          <img src={images[0]} alt={propertyTitle} className={`${thumbnailClass} h-[450px]`} />
        </div>

        {isModalOpen && (
          <ImageModal
            images={images}
            currentIndex={modalIndex!}
            propertyTitle={propertyTitle}
            onClose={closeModal}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        )}
      </>
    );
  }

  // =========================================================================
  // 2-3 Imagenes
  // =========================================================================

  if (totalImages <= 3) {
    return (
      <>
        <div className="grid grid-cols-2 gap-2 h-[400px] rounded-lg overflow-hidden">
          <div
            className="relative overflow-hidden cursor-pointer h-full"
            onClick={() => openModal(0)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openModal(0)}
          >
            <img src={images[0]} alt={`${propertyTitle} - Principal`} className={thumbnailClass} />
          </div>

          <div className="flex flex-col gap-2 h-full">
            {images.slice(1).map((img, i) => (
              <div
                key={i}
                className="relative flex-1 overflow-hidden cursor-pointer"
                onClick={() => openModal(i + 1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openModal(i + 1)}
              >
                <img
                  src={img}
                  alt={`${propertyTitle} - Imagen ${i + 2}`}
                  className={thumbnailClass}
                />
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <ImageModal
            images={images}
            currentIndex={modalIndex!}
            propertyTitle={propertyTitle}
            onClose={closeModal}
            onNext={goToNext}
            onPrev={goToPrev}
          />
        )}
      </>
    );
  }

  // =========================================================================
  // 4+ Imagenees
  // =========================================================================

  const previewImages = images.slice(1, 5);
  const remainingCount = totalImages - 5;

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-lg overflow-hidden">
        {/* Imagen principal ocupa 2 columnas y 2 filas */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer"
          onClick={() => openModal(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openModal(0)}
        >
          <img src={images[0]} alt={`${propertyTitle} - Principal`} className={thumbnailClass} />
        </div>

        {/* 4 miniaturas */}
        {previewImages.map((img, i) => {
          const isLast = i === previewImages.length - 1 && remainingCount > 0;

          return (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer"
              onClick={() => openModal(i + 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openModal(i + 1)}
            >
              <img
                src={img}
                alt={`${propertyTitle} - Imagen ${i + 2}`}
                className={`${thumbnailClass} ${isLast ? 'brightness-50' : ''}`}
              />

              {/* +N en la ultima miniatura */}
              {isLast && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-semibold text-xl drop-shadow-lg">
                    +{remainingCount} más
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <ImageModal
          images={images}
          currentIndex={modalIndex!}
          propertyTitle={propertyTitle}
          onClose={closeModal}
          onNext={goToNext}
          onPrev={goToPrev}
        />
      )}
    </>
  );
}