import type React from 'react';
import { useState, useCallback } from 'react';
import { ImageIcon } from 'lucide-react';
import { ImageModal } from './ImageModal';

interface ImageGalleryProps {
  images: string[];
  propertyTitle: string;
}