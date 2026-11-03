import React, { useState } from "react";
import { Landmark, Mountain, Sparkles, Flame } from "lucide-react";

export default function ArtDirectedImage({
  src,
  alt,
  className = "",
  destinationName = "Sacred Destination",
  badge = "Pilgrimage",
  category = ""
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source provided or failed to load, render an art-directed neutral placeholder
  if (!src || hasError) {
    return (
      <div className={`ty-neutral-placeholder ${className}`}>
        <div className="ty-placeholder-pattern" />
        <div className="ty-placeholder-content">
          <div className="ty-placeholder-icon-wrap">
            <Landmark size={22} className="text-amber-500" />
          </div>
          <span className="ty-placeholder-name">{destinationName}</span>
          <span className="ty-placeholder-badge">{badge}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`ty-image-wrapper ${className}`}>
      {!isLoaded && <div className="ty-image-skeleton" />}
      <img
        src={src}
        alt={alt || destinationName}
        className={`ty-verified-img ${isLoaded ? "loaded" : "loading"}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}
