import m1Img from '@/assets/products/m1-bomber.jpg';
import m2Img from '@/assets/products/m2-cargo.jpg';
import m3Img from '@/assets/products/m3-sneakers.jpg';
import m4Img from '@/assets/products/m4-sling.jpg';
import m5Img from '@/assets/products/m5-denim.jpg';
import m6Img from '@/assets/products/m5-chinos.jpg';
import m7Img from '@/assets/products/m6-loafers.jpg';
import m8Img from '@/assets/products/m6-backpack.jpg';
import w1Img from '@/assets/products/w1-blazer.jpg';
import w2Img from '@/assets/products/w2-skirt.jpg';
import w3Img from '@/assets/products/w3-heels.jpg';
import w4Img from '@/assets/products/w4-minibag.jpg';
import w5Img from '@/assets/products/w5-dress.jpg';
import w6Img from '@/assets/products/w5-palazzo.jpg';
import w7Img from '@/assets/products/w6-sneakers.jpg';
import w8Img from '@/assets/products/w6-tote.jpg';
import m9Img from '@/assets/products/m9-hoodie.png';
import m10Img from '@/assets/products/m10-joggers.png';
import m11Img from '@/assets/products/m11-fieldjacket.png';
import m12Img from '@/assets/products/m12-hightops.png';
import w9Img from '@/assets/products/w9-knit.png';
import w10Img from '@/assets/products/w10-pleated.png';
import w11Img from '@/assets/products/w11-boots.png';
import w12Img from '@/assets/products/w12-quilted.png';
import m13Img from '@/assets/products/m13-kurta.png';
import m14Img from '@/assets/products/m14-dhaka.png';
import m15Img from '@/assets/products/m15-blazer.png';
import m16Img from '@/assets/products/m16-tennis.png';
import m17Img from '@/assets/products/m17-baggy.png';
import m18Img from '@/assets/products/m18-varsity.png';
import w13Img from '@/assets/products/w13-lehenga.png';
import w14Img from '@/assets/products/w14-kurti.png';
import w15Img from '@/assets/products/w15-trench.png';
import w16Img from '@/assets/products/w16-pearlblouse.png';
import w17Img from '@/assets/products/w17-babytee.png';
import w18Img from '@/assets/products/w18-microskirt.png';
import m19Img from '@/assets/products/m19-graphictee.png';
import m20Img from '@/assets/products/m20-overcoat.png';
import m21Img from '@/assets/products/m21-derby.png';
import w19Img from '@/assets/products/w19-slipdress.png';
import w20Img from '@/assets/products/w20-puffer.png';
import w21Img from '@/assets/products/w21-widetrouser.png';

export interface ColorVariant {
  name: string;
  value: string;
  priceDelta?: number;
}

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
  sizes?: string[];
  colors?: ColorVariant[];
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
    id: "m5", name: "Classic Denim Jacket", brand: "Muse Man", audience: "Men",
    category: "Top", price: 2199, originalPrice: 3499, rating: 4.7,
    color: "#3b5998", background: "linear-gradient(145deg, #c5d0e6 0%, #3b5998 100%)",
    shape: "top", description: "Timeless dark wash denim jacket for versatile layering.", badge: "Classic",
    image: m5Img
  },
  {
    id: "m6", name: "Sand Chino Shorts", brand: "Urban Axis", audience: "Men",
    category: "Bottom", price: 1299, originalPrice: 1999, rating: 4.5,
    color: "#c2a87d", background: "linear-gradient(145deg, #f0e6d3 0%, #c2a87d 100%)",
    shape: "bottom", description: "Clean-cut khaki shorts for warm-weather ease.", badge: "Summer Pick",
    image: m6Img
  },
  {
    id: "m7", name: "Ivory Leather Loafers", brand: "Kickline", audience: "Men",
    category: "Shoes", price: 3199, originalPrice: 4799, rating: 4.8,
    color: "#f5f0e8", background: "linear-gradient(145deg, #faf8f4 0%, #d4c9b8 100%)",
    shape: "shoes", description: "Polished white leather loafers for smart-casual styling.", badge: "Premium",
    image: m7Img
  },
  {
    id: "m8", name: "Heritage Leather Backpack", brand: "Carry Muse", audience: "Men",
    category: "Bag", price: 2899, originalPrice: 4499, rating: 4.7,
    color: "#5c3a21", background: "linear-gradient(145deg, #c9a882 0%, #5c3a21 100%)",
    shape: "bag", description: "Full-grain leather backpack with vintage appeal.", badge: "Artisan",
    image: m8Img
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
  {
    id: "w5", name: "Emerald Wrap Dress", brand: "Muse Edit", audience: "Women",
    category: "Top", price: 2699, originalPrice: 4199, rating: 4.9,
    color: "#2e8b57", background: "linear-gradient(145deg, #b2dfcc 0%, #2e8b57 100%)",
    shape: "top", description: "Elegant wrap dress in rich emerald for day-to-evening wear.", badge: "Trending",
    image: w5Img
  },
  {
    id: "w6", name: "Navy Palazzo Pants", brand: "Petal Theory", audience: "Women",
    category: "Bottom", price: 1699, originalPrice: 2699, rating: 4.4,
    color: "#2c3e6b", background: "linear-gradient(145deg, #b8c4db 0%, #2c3e6b 100%)",
    shape: "bottom", description: "Flowing wide-leg palazzo pants with effortless drape.", badge: "Comfy Chic",
    image: w6Img
  },
  {
    id: "w7", name: "Cloud Platform Sneakers", brand: "Step Story", audience: "Women",
    category: "Shoes", price: 2499, originalPrice: 3799, rating: 4.6,
    color: "#f0f0f0", background: "linear-gradient(145deg, #ffffff 0%, #e0e0e0 100%)",
    shape: "shoes", description: "White chunky platform sneakers for bold casual outfits.", badge: "Street Style",
    image: w7Img
  },
  {
    id: "w8", name: "Caramel Tote Bag", brand: "Carry Muse", audience: "Women",
    category: "Bag", price: 2299, originalPrice: 3599, rating: 4.8,
    color: "#d48a3c", background: "linear-gradient(145deg, #f5d5a8 0%, #d48a3c 100%)",
    shape: "bag", description: "Spacious tan leather tote for work and weekend.", badge: "Versatile",
    image: w8Img
  },
  {
    id: "m9", name: "Crimson Pulse Hoodie", brand: "Urban Axis", audience: "Men",
    category: "Top", price: 1799, originalPrice: 2799, rating: 4.7,
    color: "#dc2626", background: "linear-gradient(145deg, #ffd5d5 0%, #dc2626 100%)",
    shape: "top", description: "Oversized fleece hoodie with bold crimson energy.", badge: "Fan Favorite",
    image: m9Img
  },
  {
    id: "m10", name: "Onyx Track Joggers", brand: "Kickline", audience: "Men",
    category: "Bottom", price: 1599, originalPrice: 2499, rating: 4.6,
    color: "#111111", background: "linear-gradient(145deg, #cccccc 0%, #111111 100%)",
    shape: "bottom", description: "Tapered athleisure joggers with sleek side stripes.", badge: "Active",
    image: m10Img
  },
  {
    id: "m11", name: "Field Olive Jacket", brand: "Muse Man", audience: "Men",
    category: "Top", price: 3299, originalPrice: 4999, rating: 4.8,
    color: "#6b7d3a", background: "linear-gradient(145deg, #d8dcb8 0%, #6b7d3a 100%)",
    shape: "top", description: "Heritage utility jacket with multi-pocket field styling.", badge: "Heritage",
    image: m11Img
  },
  {
    id: "m12", name: "Court High-Top Sneakers", brand: "Kickline", audience: "Men",
    category: "Shoes", price: 2299, originalPrice: 3499, rating: 4.5,
    color: "#f4f4f4", background: "linear-gradient(145deg, #ffffff 0%, #d4d4d4 100%)",
    shape: "shoes", description: "Classic canvas high-tops for everyday street style.", badge: "Iconic",
    image: m12Img
  },
  {
    id: "w9", name: "Blush Cloud Knit", brand: "Petal Theory", audience: "Women",
    category: "Top", price: 2099, originalPrice: 3299, rating: 4.7,
    color: "#f5b8c8", background: "linear-gradient(145deg, #ffe5ec 0%, #f5b8c8 100%)",
    shape: "top", description: "Chunky cable-knit sweater in soft blush tones.", badge: "Cozy",
    image: w9Img
  },
  {
    id: "w10", name: "Crimson Pleated Midi", brand: "Muse Edit", audience: "Women",
    category: "Bottom", price: 1999, originalPrice: 3099, rating: 4.6,
    color: "#b91c4a", background: "linear-gradient(145deg, #f4c2d2 0%, #b91c4a 100%)",
    shape: "bottom", description: "Flowing pleated midi skirt in rich crimson satin.", badge: "Statement",
    image: w10Img
  },
  {
    id: "w11", name: "Noir Block Boots", brand: "Step Story", audience: "Women",
    category: "Shoes", price: 3499, originalPrice: 5299, rating: 4.9,
    color: "#0d0d0d", background: "linear-gradient(145deg, #bfbfbf 0%, #0d0d0d 100%)",
    shape: "shoes", description: "Sleek leather ankle boots with sculpted block heel.", badge: "Premium",
    image: w11Img
  },
  {
    id: "w12", name: "Onyx Quilted Crossbody", brand: "Carry Muse", audience: "Women",
    category: "Bag", price: 2799, originalPrice: 4399, rating: 4.8,
    color: "#1a1a1a", background: "linear-gradient(145deg, #d4d4d4 0%, #1a1a1a 100%)",
    shape: "bag", description: "Quilted leather crossbody with elegant chain strap.", badge: "Luxe",
    image: w12Img
  },
  {
    id: "m13", name: "Ivory Zari Long Kurta", brand: "Heritage Loom", audience: "Men",
    category: "Top", price: 3499, originalPrice: 5499, rating: 4.8,
    color: "#f3e7c8", background: "linear-gradient(145deg, #fff7e0 0%, #d4b87a 100%)",
    shape: "top", description: "Hand-embroidered long kurta with golden thread detailing.", badge: "Festive",
    image: m13Img
  },
  {
    id: "m14", name: "Sunset Weave Waistcoat", brand: "Heritage Loom", audience: "Men",
    category: "Top", price: 2599, originalPrice: 3999, rating: 4.7,
    color: "#c2552d", background: "linear-gradient(145deg, #f4d2b8 0%, #c2552d 100%)",
    shape: "top", description: "Handwoven patterned waistcoat with rich earthy motifs.", badge: "Artisan",
    image: m14Img
  },
  {
    id: "m15", name: "Regatta Gold-Button Blazer", brand: "Atelier Park", audience: "Men",
    category: "Top", price: 5499, originalPrice: 7999, rating: 4.9,
    color: "#1a2b56", background: "linear-gradient(145deg, #c6cee5 0%, #1a2b56 100%)",
    shape: "top", description: "Double-breasted navy wool blazer with polished gold buttons.", badge: "Timeless",
    image: m15Img
  },
  {
    id: "m16", name: "Court Cable V-Neck", brand: "Atelier Park", audience: "Men",
    category: "Top", price: 2899, originalPrice: 4299, rating: 4.7,
    color: "#efe6cf", background: "linear-gradient(145deg, #f7f0d8 0%, #c9b88a 100%)",
    shape: "top", description: "Cream cable-knit V-neck with classic varsity striping.", badge: "Heritage",
    image: m16Img
  },
  {
    id: "m17", name: "Slouch Cargo Denim", brand: "Loop State", audience: "Men",
    category: "Bottom", price: 2299, originalPrice: 3499, rating: 4.6,
    color: "#6a7a90", background: "linear-gradient(145deg, #cdd5e0 0%, #4a5670 100%)",
    shape: "bottom", description: "Relaxed wide-leg cargo denim with multi-pocket utility.", badge: "Trending",
    image: m17Img
  },
  {
    id: "m18", name: "Lilac Patch Varsity", brand: "Loop State", audience: "Men",
    category: "Top", price: 3199, originalPrice: 4799, rating: 4.5,
    color: "#d8b5e8", background: "linear-gradient(145deg, #f3e5fa 0%, #c9a2dc 100%)",
    shape: "top", description: "Oversized pastel varsity jacket with chenille patches.", badge: "Drop Pick",
    image: m18Img
  },
  {
    id: "w13", name: "Rose Mirror Lehenga Set", brand: "Heritage Loom", audience: "Women",
    category: "Top", price: 6499, originalPrice: 9999, rating: 4.9,
    color: "#e6308e", background: "linear-gradient(145deg, #ffd4ea 0%, #e6308e 100%)",
    shape: "top", description: "Vibrant embroidered blouse and skirt set with delicate mirror work.", badge: "Festive",
    image: w13Img
  },
  {
    id: "w14", name: "Garden Bloom Kurti", brand: "Heritage Loom", audience: "Women",
    category: "Top", price: 2199, originalPrice: 3399, rating: 4.7,
    color: "#2f8a4e", background: "linear-gradient(145deg, #c5e6cf 0%, #2f8a4e 100%)",
    shape: "top", description: "Flowy emerald kurti with floral motifs and tasselled tie.", badge: "Everyday",
    image: w14Img
  },
  {
    id: "w15", name: "Camel Belted Trench", brand: "Atelier Park", audience: "Women",
    category: "Top", price: 4999, originalPrice: 7499, rating: 4.9,
    color: "#c08a52", background: "linear-gradient(145deg, #f4dcc0 0%, #c08a52 100%)",
    shape: "top", description: "Tailored camel trench coat with sculpted belted waist.", badge: "Timeless",
    image: w15Img
  },
  {
    id: "w16", name: "Ivory Ruffle Silk Blouse", brand: "Atelier Park", audience: "Women",
    category: "Top", price: 2799, originalPrice: 4199, rating: 4.7,
    color: "#f8f1e4", background: "linear-gradient(145deg, #fff9ef 0%, #e3d9c4 100%)",
    shape: "top", description: "Soft silk blouse with romantic ruffled collar.", badge: "Editor's Pick",
    image: w16Img
  },
  {
    id: "w17", name: "Butter Crop Baby Tee", brand: "Loop State", audience: "Women",
    category: "Top", price: 1199, originalPrice: 1899, rating: 4.6,
    color: "#fbe89a", background: "linear-gradient(145deg, #fff6cf 0%, #f5d96a 100%)",
    shape: "top", description: "Ribbed cropped baby tee in soft buttercream yellow.", badge: "Drop Pick",
    image: w17Img
  },
  {
    id: "w18", name: "Frayed Denim Mini", brand: "Loop State", audience: "Women",
    category: "Bottom", price: 1599, originalPrice: 2499, rating: 4.5,
    color: "#6a8db5", background: "linear-gradient(145deg, #cdddee 0%, #5a7da5 100%)",
    shape: "bottom", description: "Low-rise denim mini with raw frayed hem.", badge: "Trending",
    image: w18Img
  },
  {
    id: "m19", name: "Static Print Oversized Tee", brand: "Loop State", audience: "Men",
    category: "Top", price: 1299, originalPrice: 1999, rating: 4.6,
    color: "#1a1a1a", background: "linear-gradient(145deg, #d4d4d4 0%, #1a1a1a 100%)",
    shape: "top", description: "Washed black oversized tee with bold abstract graphic.", badge: "Drop Pick",
    image: m19Img
  },
  {
    id: "m20", name: "Charcoal Long Overcoat", brand: "Atelier Park", audience: "Men",
    category: "Top", price: 6499, originalPrice: 9499, rating: 4.9,
    color: "#3a3a3a", background: "linear-gradient(145deg, #c4c4c4 0%, #2a2a2a 100%)",
    shape: "top", description: "Tailored wool overcoat with minimal luxury detailing.", badge: "Premium",
    image: m20Img
  },
  {
    id: "m21", name: "Cognac Derby Shoes", brand: "Kickline", audience: "Men",
    category: "Shoes", price: 3599, originalPrice: 5299, rating: 4.8,
    color: "#8b3e1f", background: "linear-gradient(145deg, #e6c4a8 0%, #8b3e1f 100%)",
    shape: "shoes", description: "Polished cognac leather derbies for smart tailoring.", badge: "Classic",
    image: m21Img
  },
  {
    id: "w19", name: "Champagne Satin Slip Dress", brand: "Muse Edit", audience: "Women",
    category: "Top", price: 2999, originalPrice: 4599, rating: 4.8,
    color: "#e8b56a", background: "linear-gradient(145deg, #fbe6bf 0%, #d49a44 100%)",
    shape: "top", description: "Bias-cut satin midi slip in soft champagne gold.", badge: "Evening",
    image: w19Img
  },
  {
    id: "w20", name: "Chrome Cropped Puffer", brand: "Loop State", audience: "Women",
    category: "Top", price: 3499, originalPrice: 5299, rating: 4.7,
    color: "#c9ccd1", background: "linear-gradient(145deg, #f0f2f5 0%, #a8adb5 100%)",
    shape: "top", description: "High-shine metallic silver cropped puffer.", badge: "Trending",
    image: w20Img
  },
  {
    id: "w21", name: "Ivory Wide-Leg Trousers", brand: "Atelier Park", audience: "Women",
    category: "Bottom", price: 2399, originalPrice: 3699, rating: 4.7,
    color: "#f0e8d5", background: "linear-gradient(145deg, #faf5e6 0%, #d8ccb0 100%)",
    shape: "bottom", description: "Fluid pleated wide-leg trousers in cream ivory.", badge: "Editor's Pick",
    image: w21Img
  },
];

export const arrivalIds = ["w19", "m20", "w20", "m19", "w21", "m21", "w13", "m13"];

export const skinTones = ["#f5cdb3", "#d8ab8f", "#b77b57", "#7d4d36"];

export const backdrops = [
  { id: "sunrise", label: "Sunrise Pop", style: "linear-gradient(180deg, rgba(255, 199, 95, 0.36), rgba(255, 255, 255, 0.78))" },
  { id: "studio", label: "Studio Neutral", style: "linear-gradient(180deg, rgba(241, 236, 231, 0.95), rgba(255, 255, 255, 0.88))" },
  { id: "teal", label: "Teal Haze", style: "linear-gradient(180deg, rgba(132, 220, 198, 0.38), rgba(20, 108, 127, 0.16))" },
  { id: "lavender", label: "Lavender Dream", style: "linear-gradient(180deg, rgba(200, 162, 255, 0.35), rgba(239, 226, 255, 0.6))" },
  { id: "rosegold", label: "Rose Gold", style: "linear-gradient(180deg, rgba(247, 111, 94, 0.2), rgba(255, 214, 207, 0.5))" },
  { id: "midnight", label: "Midnight Cool", style: "linear-gradient(180deg, rgba(51, 65, 92, 0.5), rgba(30, 30, 50, 0.7))" },
  { id: "forest", label: "Forest Glow", style: "linear-gradient(180deg, rgba(46, 139, 87, 0.25), rgba(178, 223, 204, 0.5))" },
  { id: "peach", label: "Peach Blush", style: "linear-gradient(180deg, rgba(255, 183, 145, 0.4), rgba(255, 240, 230, 0.7))" },
];

export const heroSlides = [
  { title: "Studio-ready looks", detail: "Switch from casual to statement styling in one smooth flow.", accent: "Try-On Spotlight" },
  { title: "Color-forward layers", detail: "Build outfits with warm gradients, cool textures, and modern silhouettes.", accent: "New Season Energy" },
  { title: "Quick bag interactions", detail: "Preview products, add them instantly, and open the shopping bag sidebar.", accent: "Fast Fashion UX" },
];
