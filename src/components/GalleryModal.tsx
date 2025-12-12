// components/GalleryModal.tsx
'use client';

import { useState } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';
import Image from 'next/image';

interface GalleryModalProps {
  onClose: () => void;
  images?: string[];
}

export default function GalleryModal({ onClose, images }: GalleryModalProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Mock processed drone images (these would come from your API in production)
  const mockImages = images || [
    '/uploads/drone/proc-img1.jpg',
    '/uploads/drone/proc-img2.jpg',
    '/uploads/drone/proc-img3.jpg',
    '/uploads/drone/proc-img4.jpg',
    '/uploads/drone/proc-img5.jpg',
  ];

  const handleImageClick = (img: string, index: number) => {
    setSelectedImg(img);
    setSelectedIndex(index);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % mockImages.length;
    setSelectedIndex(nextIndex);
    setSelectedImg(mockImages[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = selectedIndex === 0 ? mockImages.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    setSelectedImg(mockImages[prevIndex]);
  };

  const handleDownload = (img: string) => {
    // In production, this would trigger actual download
    console.log('Downloading:', img);
    alert('Download functionality - Connect to actual file system');
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-7xl max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm p-4 z-10 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Drone Image Gallery</h2>
              <p className="text-sm text-slate-400">
                {mockImages.length} processed images from reconnaissance mission
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full h-full pt-20 p-4">
          {selectedImg ? (
            /* Full Screen View */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Image */}
              <div className="relative max-w-5xl max-h-full">
                <Image
                  src={selectedImg}
                  alt={`Drone Image ${selectedIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[calc(90vh-8rem)] object-contain rounded-lg"
                  priority
                />
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-white text-sm font-semibold">
                    Image {selectedIndex + 1} of {mockImages.length}
                  </p>
                  <p className="text-slate-400 text-xs">
                    GPS: 33.7490°N, 84.3880°W • Altitude: 120m
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-800/90 hover:bg-slate-700 text-white p-3 rounded-full transition-colors"
                title="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800/90 hover:bg-slate-700 text-white p-3 rounded-full transition-colors"
                title="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleDownload(selectedImg)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImg(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Back to Gallery
                </button>
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="w-full h-full overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {mockImages.map((img, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer group"
                    onClick={() => handleImageClick(img, index)}
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={img}
                        alt={`Drone Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-slate-300 font-semibold">Image {index + 1}</p>
                      <p className="text-xs text-slate-500">Processed • Ready</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}