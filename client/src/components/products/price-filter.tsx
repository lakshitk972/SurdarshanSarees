import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

export function PriceFilter({ minPrice, maxPrice, onChange }: PriceFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  
  // Set initial values when props change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);
  
  const handlePriceChange = (value: number[]) => {
    const [min, max] = value;
    setPriceRange([min, max]);
  };
  
  const handlePriceChangeComplete = (value: number[]) => {
    const [min, max] = value;
    onChange(min, max);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Price Range</h3>
      
      <div className="pt-4">
        <Slider 
          min={5000}
          max={50000}
          step={1000}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceChangeComplete}
          className="price-range-slider"
        />
      </div>
      
      <div className="flex justify-between text-sm">
        <span>{formatPrice(priceRange[0])}</span>
        <span>{formatPrice(priceRange[1])}</span>
      </div>
    </div>
  );
}
