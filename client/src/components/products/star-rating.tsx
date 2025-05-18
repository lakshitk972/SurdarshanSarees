import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  editable?: boolean;
  readOnly?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  value,
  onChange,
  editable = false,
  readOnly = false,
  className,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(value);

  // Determine the star size based on the size prop
  const starSizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const starSize = starSizes[size];

  // Handle mouse enter on a star
  const handleMouseEnter = (rating: number) => {
    if (readOnly || !editable) return;
    setHoverRating(rating);
  };

  // Handle mouse leave from rating component
  const handleMouseLeave = () => {
    if (readOnly || !editable) return;
    setHoverRating(null);
  };

  // Handle star click
  const handleClick = (rating: number) => {
    if (readOnly || !editable) return;
    setSelectedRating(rating);
    onChange && onChange(rating);
  };

  // Render stars
  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating !== null ? hoverRating : selectedRating;

    for (let i = 1; i <= 5; i++) {
      const filled = i <= displayRating;
      
      stars.push(
        <button
          key={i}
          type="button"
          className={cn(
            "focus:outline-none transition-transform",
            editable && !readOnly && "hover:scale-110",
            filled ? "text-amber-500" : "text-gray-300"
          )}
          onMouseEnter={() => handleMouseEnter(i)}
          onClick={() => handleClick(i)}
          disabled={readOnly || !editable}
          aria-label={`${i} star${i === 1 ? "" : "s"}`}
        >
          <Star
            className={cn(starSize, "fill-current")}
            strokeWidth={1}
          />
        </button>
      );
    }

    return stars;
  };

  return (
    <div 
      className={cn("flex", className)}
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Rating"
    >
      {renderStars()}
    </div>
  );
}