import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceFilter } from "./price-filter";
import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

interface ProductFilterProps {
  selectedCategory?: string;
  onFilterChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    fabric?: string;
    workDetails?: string;
  }) => void;
  onReset: () => void;
}

export function ProductFilter({ 
  selectedCategory,
  onFilterChange,
  onReset
}: ProductFilterProps) {
  const [filters, setFilters] = useState({
    category: selectedCategory || '',
    minPrice: 5000,
    maxPrice: 50000,
    fabric: '',
    workDetails: ''
  });
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  useEffect(() => {
    if (selectedCategory) {
      setFilters(prev => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);
  
  const handleCategoryChange = (slug: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      category: checked ? slug : ''
    }));
    
    onFilterChange({
      ...filters,
      category: checked ? slug : undefined
    });
  };
  
  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
    
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max
    });
  };
  
  const handleFabricChange = (fabric: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      fabric: checked ? fabric : ''
    }));
    
    onFilterChange({
      ...filters,
      fabric: checked ? fabric : undefined
    });
  };
  
  const handleWorkDetailsChange = (workDetails: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      workDetails: checked ? workDetails : ''
    }));
    
    onFilterChange({
      ...filters,
      workDetails: checked ? workDetails : undefined
    });
  };
  
  const handleReset = () => {
    setFilters({
      category: '',
      minPrice: 5000,
      maxPrice: 50000,
      fabric: '',
      workDetails: ''
    });
    
    onReset();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="h-8 text-xs"
        >
          <FilterX className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>
      
      <Accordion type="multiple" defaultValue={["categories", "price", "fabric", "work"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.slug}`}
                    checked={filters.category === category.slug}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.slug, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`category-${category.slug}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <PriceFilter 
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={handlePriceChange}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="fabric">
          <AccordionTrigger>Fabric Material</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Ghazi Silk", "Sifon", "Banarasi Silk", "Kanchipuram Silk", "Georgette"].map((fabric) => (
                <div key={fabric} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`fabric-${fabric}`}
                    checked={filters.fabric === fabric}
                    onCheckedChange={(checked) => 
                      handleFabricChange(fabric, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`fabric-${fabric}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {fabric}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="work">
          <AccordionTrigger>Work Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Bandani", "Jadoji", "Gotapatti", "Zari", "Embroidery", "Sequins"].map((work) => (
                <div key={work} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`work-${work}`}
                    checked={filters.workDetails === work}
                    onCheckedChange={(checked) => 
                      handleWorkDetailsChange(work, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`work-${work}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {work}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
