import { useCart } from "@/context/CartContext";
// ...existing code...
const { addToCart } = useCart();
// ...existing code...
<Button
  onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 })}
  className="bg-[#8B5CF6] text-white"
>
  Add to Cart
</Button>