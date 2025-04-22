import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductFilterProps {
  categories: any[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export default function ProductFilter({ 
  categories, 
  selectedCategory,
  onCategoryChange
}: ProductFilterProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onCategoryChange(null)}
        >
          All Categories
        </Button>
        <Separator />
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-2">Availability</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <input type="checkbox" id="inStock" className="mr-2" />
            <label htmlFor="inStock" className="text-sm">In Stock Only</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="organic" className="mr-2" />
            <label htmlFor="organic" className="text-sm">Organic Only</label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            placeholder="Min" 
            className="w-full p-2 text-sm border rounded-md"
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            className="w-full p-2 text-sm border rounded-md"
          />
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2">
          Apply
        </Button>
      </div>
    </div>
  );
}
