import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Rating({ 
  value, 
  onChange, 
  readOnly = false,
  size = "md" 
}: RatingProps) {
  // Get star size based on size prop
  const getStarSize = () => {
    switch (size) {
      case "sm": return "w-3 h-3";
      case "md": return "w-5 h-5";
      case "lg": return "w-7 h-7";
      default: return "w-5 h-5";
    }
  };
  
  // Handle star click
  const handleStarClick = (rating: number) => {
    if (readOnly || !onChange) return;
    onChange(rating);
  };
  
  // Handle star hover
  const handleStarHover = (e: React.MouseEvent, rating: number) => {
    if (readOnly || !onChange) return;
    const stars = e.currentTarget.parentElement?.querySelectorAll(".rating-star");
    if (!stars) return;
    
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("text-gold");
        star.classList.remove("text-gray-300");
      } else {
        star.classList.remove("text-gold");
        star.classList.add("text-gray-300");
      }
    });
  };
  
  // Handle star hover leave
  const handleStarLeave = (e: React.MouseEvent) => {
    if (readOnly || !onChange) return;
    const stars = e.currentTarget.parentElement?.querySelectorAll(".rating-star");
    if (!stars) return;
    
    stars.forEach((star, index) => {
      if (index < value) {
        star.classList.add("text-gold");
        star.classList.remove("text-gray-300");
      } else {
        star.classList.remove("text-gold");
        star.classList.add("text-gray-300");
      }
    });
  };
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`rating-star ${getStarSize()} ${
            star <= value ? "text-gold fill-gold" : "text-gray-300"
          } ${!readOnly ? "cursor-pointer" : ""}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={!readOnly ? (e) => handleStarHover(e, star) : undefined}
          onMouseLeave={!readOnly ? (e) => handleStarLeave(e) : undefined}
        />
      ))}
    </div>
  );
}