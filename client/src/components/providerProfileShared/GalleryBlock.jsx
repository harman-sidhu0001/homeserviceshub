import CustomButton from "../common/Button";
import { useState, useCallback, useEffect } from "react";

const GalleryBlock = ({ media, onAddImage, onDeleteImage, uploading }) => {
  const [fullscreenIdx, setFullscreenIdx] = useState(null);

  // Keyboard navigation for fullscreen
  const handleKeyDown = useCallback(
    (e) => {
      if (fullscreenIdx === null) return;
      if (e.key === "ArrowLeft") {
        setFullscreenIdx((idx) => (idx > 0 ? idx - 1 : idx));
      } else if (e.key === "ArrowRight") {
        setFullscreenIdx((idx) => (idx < media.length - 1 ? idx + 1 : idx));
      } else if (e.key === "Escape") {
        setFullscreenIdx(null);
      }
    },
    [fullscreenIdx, media.length]
  );
  useEffect(() => {
    if (fullscreenIdx !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [fullscreenIdx, handleKeyDown]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      {/* Uploading overlay */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="text-white text-2xl font-bold">Uploading...</div>
        </div>
      )}
      <div className="text-xl font-semibold mb-4">Gallery</div>
      {media && media.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {media.map((image, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center relative"
            >
              <img
                src={image.src?.path || image}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-60 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => setFullscreenIdx(idx)}
              />
              {/* Only show delete button if onDeleteImage is provided */}
              {onDeleteImage && (
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-700"
                  onClick={() => onDeleteImage(image)}
                  title="Delete image"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-10 text-lg">
          Sorry, no images to display.
        </div>
      )}
      {/* Only show upload option if onAddImage is provided */}
      {onAddImage && (
        <div className="mt-4 flex flex-col items-center">
          <CustomButton
            text={uploading ? "Uploading..." : "Add Image to Gallery"}
            onClick={onAddImage}
            disabled={media.length >= 5 || uploading}
          />
          <div className="text-xs text-gray-500 mt-1">
            {media.length < 5
              ? `You can upload ${5 - media.length} more image${
                  5 - media.length === 1 ? "" : "s"
                }.`
              : "You have reached the maximum of 5 images."}
          </div>
        </div>
      )}
      {fullscreenIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setFullscreenIdx(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-8 z-60 bg-white/80 hover:bg-white text-black rounded-full p-2 text-xl shadow"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIdx(null);
            }}
            aria-label="Close"
          >
            &times;
          </button>
          {/* Left arrow */}
          {fullscreenIdx > 0 && (
            <button
              className="absolute left-8 top-1/2 -translate-y-1/2 z-60 bg-white/80 hover:bg-white text-black rounded-full p-2 text-2xl shadow"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIdx((idx) => idx - 1);
              }}
              aria-label="Previous image"
            >
              &#8592;
            </button>
          )}
          {/* Image */}
          <img
            src={media[fullscreenIdx].src?.path || media[fullscreenIdx]}
            alt="Full screen"
            className="max-w-full max-h-full rounded shadow-lg border-4 border-white"
            style={{ objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
          />
          {/* Right arrow */}
          {fullscreenIdx < media.length - 1 && (
            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 z-60 bg-white/80 hover:bg-white text-black rounded-full p-2 text-2xl shadow"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIdx((idx) => idx + 1);
              }}
              aria-label="Next image"
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryBlock;
