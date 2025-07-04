const GalleryBlock = ({ media }) => (
  <div className="bg-white rounded-xl shadow p-6 mt-6">
    <div className="text-xl font-semibold mb-4">Gallery</div>
    {media && media.length ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {media.map((image, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center"
          >
            <img
              src={image.src?.path || image}
              alt={image.title || `Gallery ${idx + 1}`}
              className="w-full h-60 object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
            />
            <div className="p-2 w-full text-center text-sm text-gray-700">
              {image.title || "Untitled"}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-400 text-center py-10 text-lg">
        Sorry, no images to display.
      </div>
    )}
  </div>
);
export default GalleryBlock;
