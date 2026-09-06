import { useState } from "react";

export default function UpcomingEvent() {
  // Path where the user should put their custom image:
  // Place your image at: client/public/upcoming-event.jpg
  const customImagePath = "/upcoming-event.webp";
  
  // High-quality fallback banner image from Unsplash (athletic track start line)
  const fallbackImagePath = "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=1200&q=80";

  const [imageSrc, setImageSrc] = useState(customImagePath);

  const handleImageError = () => {
    // If the user hasn't added upcoming-event.jpg yet, fall back to the Unsplash image
    if (imageSrc !== fallbackImagePath) {
      setImageSrc(fallbackImagePath);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        Upcoming Event
      </h2>
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950 group">
        <img
          src={imageSrc}
          onError={handleImageError}
          alt="Upcoming Event Banner"
          className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.01]"
        />
      </div>
    </div>
  );
}
