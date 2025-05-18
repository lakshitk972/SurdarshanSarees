import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { StarRating } from "./star-rating";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ThumbsUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: { 
      productId: string; 
      rating: number; 
      comment: string 
    }) => {
      const res = await apiRequest(
        "POST", 
        "/api/reviews", 
        reviewData
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setRating(5);
      setComment("");
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      toast({
        title: "Review too short",
        description: "Please write a more detailed review",
        variant: "destructive",
      });
      return;
    }
    
    createReviewMutation.mutate({
      productId,
      rating,
      comment,
    });
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-600">Please log in to leave a review</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Your Rating</label>
        <StarRating value={rating} onChange={setRating} editable />
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-1">
          Your Review
        </label>
        <Textarea
          id="comment"
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          className="w-full"
        />
      </div>
      
      <Button 
        type="submit" 
        className="bg-maroon hover:bg-maroon-dark text-white"
        disabled={createReviewMutation.isPending}
      >
        {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

interface ReviewCardProps {
  review: {
    _id: string;
    rating: number;
    comment: string;
    username: string;
    helpfulCount: number;
    createdAt: string;
  };
  onMarkHelpful: (id: string) => void;
}

function ReviewCard({ review, onMarkHelpful }: ReviewCardProps) {
  const date = new Date(review.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold">{review.username}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </CardDescription>
          </div>
          <StarRating value={review.rating} readOnly className="ml-2" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-3">
        <p className="text-gray-700">{review.comment}</p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500 hover:text-maroon"
          onClick={() => onMarkHelpful(review._id)}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Helpful ({review.helpfulCount})
        </Button>
      </CardFooter>
    </Card>
  );
}

interface CustomerReviewsProps {
  productId: string;
}

export function CustomerReviews({ productId }: CustomerReviewsProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId,
  });

  const markHelpfulMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await apiRequest(
        "POST", 
        `/api/reviews/${reviewId}/helpful`, 
        {}
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      toast({
        title: "Thank you",
        description: "You've marked this review as helpful",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-playfair font-semibold text-gray-800">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-maroon hover:bg-maroon-dark text-white"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-white">
          <h3 className="text-lg font-medium mb-4">Share Your Thoughts</h3>
          <ReviewForm 
            productId={productId} 
            onSuccess={() => setShowForm(false)} 
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onMarkHelpful={(id) => markHelpfulMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}