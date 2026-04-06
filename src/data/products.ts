import m1Img from '@/assets/products/m1-bomber.jpg';
import m2Img from '@/assets/products/m2-cargo.jpg';
import m3Img from '@/assets/products/m3-sneakers.jpg';
import m4Img from '@/assets/products/m4-sling.jpg';
import w1Img from '@/assets/products/w1-blazer.jpg';
import w2Img from '@/assets/products/w2-skirt.jpg';
import w3Img from '@/assets/products/w3-heels.jpg';
import w4Img from '@/assets/products/w4-minibag.jpg';

export interface Product {
  id: string;
  name: string;
  brand: string;
  audience: "Men" | "Women";
  category: "Top" | "Bottom" | "Shoes" | "Bag";
  price: number;
  originalPrice: number;
  rating: number;
  color: string;
  background: string;
  shape: string;
  description: string;
  badge: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "m1", name: "Orbit Bomber Jacket", brand: "Muse Man", audience: "Men",
    category: "Top", price: 2499, originalPrice: 3899, rating: 4.8,
    color: "#5468ff", background: "linear-gradient(145deg, #dfe7ff 0%, #5468ff 100%)",
    shape: "top", description: "Sharp bomber silhouette with clean street detailing.", badge: "Best Seller",
    image: m1Img
  },
  {
    id: "m2", name: "Slate Cargo Trousers", brand: "Urban Axis", audience: "Men",
    category: "Bottom", price: 1899, originalPrice: 2999, rating: 4.6,
    color: "#33415c", background: "linear-gradient(145deg, #a9b6d1 0%, #33415c 100%)",
    shape: "bottom", description: "Relaxed cargo trousers built for modern everyday layering.", badge: "Street Pick",
    image: m2Img
  },
  {
    id: "m3", name: "Pulse Runner Sneakers", brand: "Kickline", audience: "Men",
    category: "Shoes", price: 2799, originalPrice: 4299, rating: 4.9,
    color: "#84dcc6", background: "linear-gradient(145deg, #e0fff4 0%, #84dcc6 100%)",
    shape: "shoes", description: "Chunky comfort sole with energetic sport styling.", badge: "Top Rated",
    image: m3Img
  },
  {
    id: "m4", name: "Metro Sling Bag", brand: "Carry Muse", audience: "Men",
    category: "Bag", price: 1499, originalPrice: 2199, rating: 4.4,
    color: "#ffc75f", background: "linear-gradient(145deg, #fff0bc 0%, #ffc75f 100%)",
    shape: "bag", description: "Compact crossbody utility bag for city-ready looks.", badge: "Travel Lite",
    image: m4Img
  },
  {
    id: "w1", name: "Rose Motion Blazer", brand: "Muse Edit", audience: "Women",
    category: "Top", price: 2399, originalPrice: 3799, rating: 4.8,
    color: "#f76f5e", background: "linear-gradient(145deg, #ffd6cf 0%, #f76f5e 100%)",
    shape: "top", description: "Soft tailored blazer with a lively statement color.", badge: "Editor's Pick",
    image: w1Img
  },
  {
    id: "w2", name: "Bloom Mesh Skirt", brand: "Petal Theory", audience: "Women",
    category: "Bottom", price: 1799, originalPrice: 2899, rating: 4.5,
    color: "#e789b4", background: "linear-gradient(145deg, #fde0ec 0%, #e789b4 100%)",
    shape: "bottom", description: "Layered mesh skirt with movement and subtle shine.", badge: "New Drop",
    image: w2Img
  },
  {
    id: "w3", name: "Halo Heels", brand: "Step Story", audience: "Women",
    category: "Shoes", price: 2199, originalPrice: 3299, rating: 4.7,
    color: "#ff9f6e", background: "linear-gradient(145deg, #ffe1d1 0%, #ff9f6e 100%)",
    shape: "shoes", description: "Minimal heeled silhouette with event-ready polish.", badge: "Party Ready",
    image: w3Img
  },
  {
    id: "w4", name: "Luna Mini Bag", brand: "Carry Muse", audience: "Women",
    category: "Bag", price: 1599, originalPrice: 2499, rating: 4.6,
    color: "#c8a2ff", background: "linear-gradient(145deg, #efe2ff 0%, #c8a2ff 100%)",
    shape: "bag", description: "Curved mini bag with glossy finish and premium feel.", badge: "Hot Pick",
    image: w4Img
  },
];

export const arrivalIds = ["w1", "m1", "w2", "m3", "w3", "m4"];

export const skinTones = ["#f5cdb3", "#d8ab8f", "#b77b57", "#7d4d36"];

export const backdrops = [
  { id: "sunrise", label: "Sunrise Pop", style: "linear-gradient(180deg, rgba(255, 199, 95, 0.36), rgba(255, 255, 255, 0.78))" },
  { id: "studio", label: "Studio Neutral", style: "linear-gradient(180deg, rgba(241, 236, 231, 0.95), rgba(255, 255, 255, 0.88))" },
  { id: "teal", label: "Teal Haze", style: "linear-gradient(180deg, rgba(132, 220, 198, 0.38), rgba(20, 108, 127, 0.16))" },
];

export const heroSlides = [
  { title: "Studio-ready looks", detail: "Switch from casual to statement styling in one smooth flow.", accent: "Try-On Spotlight" },
  { title: "Color-forward layers", detail: "Build outfits with warm gradients, cool textures, and modern silhouettes.", accent: "New Season Energy" },
  { title: "Quick bag interactions", detail: "Preview products, add them instantly, and open the shopping bag sidebar.", accent: "Fast Fashion UX" },
];
