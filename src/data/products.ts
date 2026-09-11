// Real product database for Crochet Shop — all images from /public/products/
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  showColorOption?: boolean;
  showSizeOption?: boolean;
  colors?: string[];
  sizes?: string[];
}


export const products: Product[] = [
  {
    "id": "p1",
    "name": "Chunky Bohemian Sweater",
    "category": "Sweaters & Cardigans",
    "price": 799,
    "description": "A relaxed-fit handcrafted crochet sweater in a soft earth tone. Made with premium wool-blend yarn for cozy all-day comfort. Each piece is unique and made to order.",
    "image": "/products/whatsapp_image_2026_05_12_at_09.06.25.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_12_at_09.06.25.jpg"
    ]
  },
  {
    "id": "p2",
    "name": "Classic Slouchy Beanie",
    "category": "Beanies & Hats",
    "price": 349,
    "description": "Handcrafted with premium wool-blended yarn, this beanie offers a stylish slouchy fit and cozy thermal protection for chilly days. Available in custom colors.",
    "image": "/products/whatsapp_image_2026_05_12_at_09.06.38.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_12_at_09.06.38.jpg",
      "/products/whatsapp_image_2026_05_12_at_09.06.38_1.jpg"
    ]
  },
  {
    "id": "p3",
    "name": "Boho Market Tote Bag",
    "category": "Bags & Purses",
    "price": 549,
    "description": "A durable and spacious hand-woven crochet bag. Features double-reinforced straps and an elegant open weave texture, perfect for beach days or market trips.",
    "image": "/products/whatsapp_image_2026_05_12_at_09.06.39.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_12_at_09.06.39.jpg",
      "/products/whatsapp_image_2026_05_12_at_09.06.39_1.jpg",
      "/products/whatsapp_image_2026_05_12_at_09.06.39_2.jpg",
      "/products/whatsapp_image_2026_05_12_at_09.06.39_3.jpg"
    ]
  },
  {
    "id": "p4",
    "name": "Earthy Coaster Set (6 pcs)",
    "category": "Home Decor",
    "price": 299,
    "description": "A set of 6 handcrafted crochet coasters in warm earthy tones. Made of absorbent organic cotton — adds artisan charm to your dining table or coffee nook.",
    "image": "/products/whatsapp_image_2026_05_12_at_09.45.51.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_12_at_09.45.51.jpg",
      "/products/whatsapp_image_2026_05_12_at_09.45.51_1.jpg"
    ]
  },
  {
    "id": "p5",
    "name": "Fluffy Bunny Amigurumi",
    "category": "Amigurumi Toys",
    "price": 449,
    "description": "Lovingly stitched plush bunny made from baby-safe organic cotton yarn. Soft, washable, and perfect as a nursery decoration or a heartfelt handmade gift.",
    "image": "/products/whatsapp_image_2026_05_12_at_09.45.52.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_12_at_09.45.52.jpg",
      "/products/whatsapp_image_2026_05_12_at_09.45.52_1.jpg"
    ]
  },
  {
    "id": "p6",
    "name": "Ribbed Cropped Cardigan",
    "category": "Sweaters & Cardigans",
    "price": 899,
    "description": "A trendy ribbed crochet cardigan with a relaxed cropped silhouette. Crafted from high-quality cotton blend yarn with custom button closures.",
    "image": "/products/whatsapp_image_2026_05_14_at_09.26.20_1.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_14_at_09.26.20_1.jpg"
    ]
  },
  {
    "id": "p7",
    "name": "Textured Winter Pom Beanie",
    "category": "Beanies & Hats",
    "price": 399,
    "description": "A cozy winter beanie with a signature pom-pom accent. Hand-knitted in a rich textured stitch pattern for extra warmth and a fun, playful look.",
    "image": "/products/whatsapp_image_2026_05_14_at_09.26.21.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_14_at_09.26.21.jpg",
      "/products/whatsapp_image_2026_05_14_at_09.26.21_1.jpg",
      "/products/whatsapp_image_2026_05_14_at_09.26.21_2.jpg"
    ]
  },
  {
    "id": "p8",
    "name": "Structured Crossbody Bag",
    "category": "Bags & Purses",
    "price": 649,
    "description": "A compact handcrafted crossbody bag with an adjustable strap. Features a sturdy base and intricate woven exterior — great for daily errands or evening outings.",
    "image": "/products/whatsapp_image_2026_05_14_at_22.38.23.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_14_at_22.38.23.jpg",
      "/products/whatsapp_image_2026_05_14_at_22.38.23_1.jpg"
    ]
  },
  {
    "id": "p9",
    "name": "Mandala Table Runner",
    "category": "Home Decor",
    "price": 499,
    "description": "A beautiful mandala-patterned crochet table runner that adds bohemian elegance to any surface. Handmade using premium cotton yarn in natural hues.",
    "image": "/products/whatsapp_image_2026_05_14_at_22.38.24.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_14_at_22.38.24.jpg",
      "/products/whatsapp_image_2026_05_14_at_22.38.24_1.jpg",
      "/products/whatsapp_image_2026_05_14_at_22.38.24_2.jpg"
    ]
  },
  {
    "id": "p10",
    "name": "Sleepy Bear Amigurumi",
    "category": "Amigurumi Toys",
    "price": 399,
    "description": "An adorable sleepy bear plush crafted from baby-safe organic cotton. Hypoallergenic and washable — the perfect cuddly companion for little ones.",
    "image": "/products/whatsapp_image_2026_05_14_at_22.38.25.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_14_at_22.38.25.jpg",
      "/products/whatsapp_image_2026_05_14_at_22.38.25_1.jpg"
    ]
  },
  {
    "id": "p11",
    "name": "Open-Weave Beach Cardigan",
    "category": "Sweaters & Cardigans",
    "price": 749,
    "description": "A breezy, open-weave crochet cardigan perfect for summer evenings or beach cover-ups. Lightweight, airy, and handcrafted in stunning seasonal colors.",
    "image": "/products/whatsapp_image_2026_05_16_at_09.01.46.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_16_at_09.01.46.jpg",
      "/products/whatsapp_image_2026_05_16_at_09.01.46_1.jpg"
    ]
  },
  {
    "id": "p12",
    "name": "Braided Headband",
    "category": "Beanies & Hats",
    "price": 199,
    "description": "A chic handcrafted crochet headband with a braided knot detail. Soft, stretchy, and comfortable — a perfect accessory for any hairstyle or outfit.",
    "image": "/products/whatsapp_image_2026_05_16_at_09.01.47.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_16_at_09.01.47.jpg",
      "/products/whatsapp_image_2026_05_16_at_09.01.47_1.jpg"
    ]
  },
  {
    "id": "p13",
    "name": "Woven Bucket Bag",
    "category": "Bags & Purses",
    "price": 599,
    "description": "A classic bucket-style crochet bag with a drawstring closure. Handmade from durable jute-cotton blend yarn — spacious enough for daily essentials.",
    "image": "/products/whatsapp_image_2026_05_16_at_09.01.48.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_16_at_09.01.48.jpg",
      "/products/whatsapp_image_2026_05_16_at_09.01.48_1.jpg"
    ]
  },
  {
    "id": "p14",
    "name": "Flower Motif Wall Hanging",
    "category": "Home Decor",
    "price": 649,
    "description": "A stunning handcrafted crochet wall hanging featuring intricate flower motifs. Adds warmth and texture to any living space as a one-of-a-kind art piece.",
    "image": "/products/whatsapp_image_2026_05_16_at_09.01.49.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_16_at_09.01.49.jpg"
    ]
  },
  {
    "id": "p15",
    "name": "Rainbow Elephant Amigurumi",
    "category": "Amigurumi Toys",
    "price": 499,
    "description": "A vibrant, colorful elephant amigurumi stitched with baby-safe cotton yarns. This joyful plush makes a wonderful gift or a cheerful nursery decoration.",
    "image": "/products/whatsapp_image_2026_05_17_at_09.23.10.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_17_at_09.23.10.jpg",
      "/products/whatsapp_image_2026_05_17_at_09.23.10_1.jpg",
      "/products/whatsapp_image_2026_05_17_at_09.23.10_2.jpg"
    ]
  },
  {
    "id": "p16",
    "name": "Oversized Granny Square Sweater",
    "category": "Sweaters & Cardigans",
    "price": 1099,
    "description": "A bold, oversized sweater featuring the timeless granny square crochet pattern. Made to order in your preferred color palette with premium soft acrylic yarn.",
    "image": "/products/whatsapp_image_2026_05_17_at_09.23.11.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_17_at_09.23.11.jpg"
    ]
  },
  {
    "id": "p17",
    "name": "Cuffed Fisherman Beanie",
    "category": "Beanies & Hats",
    "price": 329,
    "description": "A classic fisherman-style crochet beanie with a wide ribbed cuff for a snug fit. Knitted in a chunky wool-blend yarn for maximum winter warmth.",
    "image": "/products/whatsapp_image_2026_05_17_at_09.23.12.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_17_at_09.23.12.jpg",
      "/products/whatsapp_image_2026_05_17_at_09.23.12_1.jpg"
    ]
  },
  {
    "id": "p18",
    "name": "Pastel Mini Shoulder Bag",
    "category": "Bags & Purses",
    "price": 449,
    "description": "A cute, compact crochet shoulder bag in soft pastel shades. Features a zip closure and an adjustable strap — perfect for keeping your essentials close.",
    "image": "/products/whatsapp_image_2026_05_18_at_09.25.53.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_18_at_09.25.53.jpg"
    ]
  },
  {
    "id": "p19",
    "name": "Round Braided Placemat Set",
    "category": "Home Decor",
    "price": 349,
    "description": "A set of 4 round crochet placemats in a braided weave design. Made from absorbent, heat-resistant cotton — functional art for your dining experience.",
    "image": "/products/whatsapp_image_2026_05_18_at_09.25.54.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_18_at_09.25.54.jpg",
      "/products/whatsapp_image_2026_05_18_at_09.25.54_1.jpg"
    ]
  },
  {
    "id": "p20",
    "name": "Baby Octopus Amigurumi",
    "category": "Amigurumi Toys",
    "price": 379,
    "description": "A whimsical baby octopus plush with dangling tentacles and embroidered eyes. Made from certified baby-safe yarn — cheerful, cuddly, and totally unique.",
    "image": "/products/whatsapp_image_2026_05_18_at_09.25.55.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_18_at_09.25.55.jpg",
      "/products/whatsapp_image_2026_05_18_at_09.25.55_1.jpg"
    ]
  },
  {
    "id": "p21",
    "name": "Floral Crop Top",
    "category": "Sweaters & Cardigans",
    "price": 699,
    "description": "A delicate handcrafted crochet crop top with a floral stitch detail. Lightweight and breathable — perfect for summer festivals, beach days, or casual outings.",
    "image": "/products/whatsapp_image_2026_05_18_at_09.25.56.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_18_at_09.25.56.jpg"
    ]
  },
  {
    "id": "p22",
    "name": "Autumn Leaf Bucket Hat",
    "category": "Beanies & Hats",
    "price": 449,
    "description": "A handcrafted crochet bucket hat with a beautiful autumn leaf pattern. Made from soft cotton yarn — provides sun protection in style.",
    "image": "/products/whatsapp_image_2026_05_20_at_22.38.10.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_20_at_22.38.10.jpg",
      "/products/whatsapp_image_2026_05_20_at_22.38.10_1.jpg",
      "/products/whatsapp_image_2026_05_20_at_22.38.10_2.jpg"
    ]
  },
  {
    "id": "p23",
    "name": "Fringe Boho Tote",
    "category": "Bags & Purses",
    "price": 699,
    "description": "A statement boho tote bag featuring decorative fringe trim and a woven body. Hand-stitched in natural cotton — spacious, sturdy, and effortlessly stylish.",
    "image": "/products/whatsapp_image_2026_05_20_at_22.38.11.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_20_at_22.38.11.jpg",
      "/products/whatsapp_image_2026_05_20_at_22.38.11_1.jpg",
      "/products/whatsapp_image_2026_05_20_at_22.38.11_2.jpg"
    ]
  },
  {
    "id": "p24",
    "name": "Pastel Dream Coaster Set (4 pcs)",
    "category": "Home Decor",
    "price": 249,
    "description": "A cheerful set of 4 crochet coasters in soft pastel hues. Made from thick absorbent cotton — perfect housewarming gift or a pop of color for your table.",
    "image": "/products/whatsapp_image_2026_05_31_at_09.33.11.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_31_at_09.33.11.jpg",
      "/products/whatsapp_image_2026_05_31_at_09.33.11_1.jpg"
    ]
  },
  {
    "id": "p25",
    "name": "Cuddle Koala Amigurumi",
    "category": "Amigurumi Toys",
    "price": 429,
    "description": "A precious handcrafted koala bear plush with a gentle expression and fluffy ears. Stitched in soft baby-safe cotton yarn — a perfect gift for all ages.",
    "image": "/products/whatsapp_image_2026_05_31_at_09.33.12.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_31_at_09.33.12.jpg",
      "/products/whatsapp_image_2026_05_31_at_09.33.12_1.jpg"
    ]
  },
  {
    "id": "p26",
    "name": "Lace Panel Long Cardigan",
    "category": "Sweaters & Cardigans",
    "price": 1199,
    "description": "An elegant full-length crochet cardigan with intricate lace panel detailing. Handcrafted from a premium cotton-modal blend for a luxuriously soft feel.",
    "image": "/products/whatsapp_image_2026_05_31_at_09.33.13.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_31_at_09.33.13.jpg"
    ]
  },
  {
    "id": "p27",
    "name": "Retro Beret",
    "category": "Beanies & Hats",
    "price": 299,
    "description": "A chic handcrafted crochet beret with a classic French-inspired silhouette. Made from soft merino wool blend — pairs beautifully with any outfit.",
    "image": "/products/whatsapp_image_2026_05_31_at_09.33.14.jpg",
    "images": [
      "/products/whatsapp_image_2026_05_31_at_09.33.14.jpg"
    ]
  }
];
