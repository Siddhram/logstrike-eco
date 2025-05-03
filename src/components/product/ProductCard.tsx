import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext'; // Add this import

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
}

interface ProductCardProps extends Product {
  onClick: () => void;
}

export function ProductCard({ id, name, description, price, image, rating }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth(); // Add this to check user login status

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Navigating to product with ID:', id);
    router.push(`/product/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, price, image });
    
    // Only show toast if user is logged in
    if (user) {
      toast.success("Added to cart!");
    } else {
      // Optionally redirect to login page
      router.push(`/login?redirect=/product/${id}`);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-white">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate text-white">
            {name}
          </h3>
          {rating && (
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm">{rating}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-white line-clamp-2">{description}</p>
        <div className="mt-3 font-bold text-lg text-white">${price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="w-full text-white" 
          variant="default"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}