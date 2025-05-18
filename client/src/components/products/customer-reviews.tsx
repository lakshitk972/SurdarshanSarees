import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Rating } from "./rating";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

// Define review schema
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
  productId: z.number(),
  userId: z.number().optional(),
});

export type ReviewData = z.infer<typeof reviewSchema>;

// Define review type
interface Review {
  id: number;
  productId: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
}

interface CustomerReviewsProps {
  productId: number;
}

export function CustomerReviews({ productId }: CustomerReviewsProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch reviews for the product
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId,
  });
  
  // Calculate average rating
  const averageRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";
  
  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async (data: ReviewData) => {
      const res = await apiRequest("POST", `/api/products/${productId}/reviews`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setComment("");
      setRating(5);
      setShowReviewForm(false);
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mark review as helpful mutation
  const markHelpfulMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("POST", `/api/reviews/${reviewId}/helpful`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to mark review as helpful",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const validatedData = reviewSchema.parse({
        rating,
        comment,
        productId,
        userId: user.id,
      });
      
      addReviewMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid review",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };
  
  const handleMarkHelpful = (reviewId: number) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to mark reviews as helpful",
        variant: "destructive",
      });
      return;
    }
    
    markHelpfulMutation.mutate(reviewId);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-playfair font-bold text-charcoal mb-4">
        Customer Reviews
      </h2>
      
      {/* Reviews summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-6 bg-offwhite rounded-md">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-charcoal mr-2">{averageRating}</span>
            <span className="text-gray-500">out of 5</span>
          </div>
          <div className="flex mt-2">
            <Rating value={parseFloat(averageRating)} readOnly size="md" />
          </div>
          <p className="text-gray-500 mt-1">Based on {reviews.length} reviews</p>
        </div>
        
        {user && !showReviewForm && (
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="bg-maroon hover:bg-maroon-dark text-white"
          >
            Write a Review
          </Button>
        )}
      </div>
      
      {/* Review form */}
      {showReviewForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Rating</label>
              <Rating 
                value={rating} 
                onChange={setRating} 
                size="lg" 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="review-comment" className="block text-gray-700 mb-2">
                Your Review
              </label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-maroon hover:bg-maroon-dark text-white"
                disabled={addReviewMutation.isPending}
              >
                {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Reviews list */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Avatar className="mr-3 h-10 w-10">
                    <AvatarFallback>{review.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.username}</p>
                    <div className="flex items-center">
                      <Rating value={review.rating} readOnly size="sm" />
                      <span className="ml-2 text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkHelpful(review.id)}
                  className="text-gray-500 hover:text-maroon text-sm"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpfulCount})
                </Button>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-gray-200 rounded-md">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          {user && !showReviewForm && (
            <Button 
              onClick={() => setShowReviewForm(true)}
              variant="outline"
              className="mt-4 border-maroon text-maroon hover:bg-maroon hover:text-white"
            >
              Write a Review
            </Button>
          )}
        </div>
      )}
    </div>
  );
}