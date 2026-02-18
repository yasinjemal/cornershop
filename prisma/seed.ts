// ============================================
// Prisma seed script — populates database with sample data
// Mens Corner — Premium Fashion Brand (South Africa)
// ============================================
// Run with: npx prisma db seed

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

enum Role {
  RETAIL = "RETAIL",
  WHOLESALE = "WHOLESALE",
  ADMIN = "ADMIN",
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.pricingTier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ─── Categories ─────────────────────────────────
  const catSuits = await prisma.category.create({
    data: {
      name: "Suits",
      slug: "suits",
      description: "Premium tailored suits for weddings, business, and formal occasions",
      imageUrl: "/images/cat-suits.jpg",
      sortOrder: 1,
    },
  });

  const catShirts = await prisma.category.create({
    data: {
      name: "Shirts & Tops",
      slug: "shirts-tops",
      description: "Dress shirts, smart casual shirts, and designer tops",
      imageUrl: "/images/cat-shirts.jpg",
      sortOrder: 2,
    },
  });

  const catTrousers = await prisma.category.create({
    data: {
      name: "Trousers",
      slug: "trousers",
      description: "Tailored trousers, chinos, and formal pants",
      imageUrl: "/images/cat-trousers.jpg",
      sortOrder: 3,
    },
  });

  const catShoes = await prisma.category.create({
    data: {
      name: "Shoes",
      slug: "shoes",
      description: "Leather shoes, loafers, brogues, and formal footwear",
      imageUrl: "/images/cat-shoes.jpg",
      sortOrder: 4,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Ties, belts, cufflinks, pocket squares, and watches",
      imageUrl: "/images/cat-accessories.jpg",
      sortOrder: 5,
    },
  });

  const catSmartCasual = await prisma.category.create({
    data: {
      name: "Smart Casual",
      slug: "smart-casual",
      description: "Blazers, polo shirts, knitwear, and weekend wear",
      imageUrl: "/images/cat-smart-casual.jpg",
      sortOrder: 6,
    },
  });

  // ─── Users ──────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: { name: "Admin", email: "admin@menscorner.co.za", role: Role.ADMIN },
  });

  const retailUser = await prisma.user.create({
    data: { name: "Thabo Mokoena", email: "thabo@example.com", role: Role.RETAIL },
  });

  const wholesaleUser = await prisma.user.create({
    data: { name: "Elegant Menswear", email: "orders@elegantmenswear.co.za", role: Role.WHOLESALE },
  });

  const retailUser2 = await prisma.user.create({
    data: { name: "Sipho Ndlovu", email: "sipho@example.com", role: Role.RETAIL },
  });

  const wholesaleUser2 = await prisma.user.create({
    data: { name: "Cape Formal Wear", email: "info@capeformal.co.za", role: Role.WHOLESALE },
  });

  // ─── Products ───────────────────────────────────
  const products = await Promise.all([
    // ── Suits ──
    prisma.product.create({
      data: {
        name: "The Johannesburg Slim Fit Suit",
        slug: "johannesburg-slim-fit-suit",
        description: "A modern slim-fit two-piece suit in midnight navy. Italian wool blend, half-canvas construction with surgeon cuffs. Perfect for weddings, graduations, and business meetings.",
        basePrice: 3499.00,
        imageUrl: "/images/suit-navy.jpg",
        images: ["/images/suit-navy.jpg", "/images/suit-navy-2.jpg", "/images/suit-navy-3.jpg"],
        stock: 120,
        sku: "BS-SUIT-JHB-NV",
        featured: true,
        categoryId: catSuits.id,
        pricingTiers: {
          create: [
            { minQty: 5, pricePerUnit: 2999.00 },
            { minQty: 20, pricePerUnit: 2499.00 },
            { minQty: 50, pricePerUnit: 2199.00 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Classic Black Three-Piece Suit",
        slug: "classic-black-three-piece",
        description: "Timeless three-piece suit in jet black. Includes jacket, waistcoat, and trousers. Ideal for church events, matric dances, and formal ceremonies.",
        basePrice: 4299.00,
        imageUrl: "/images/suit-black.jpg",
        images: ["/images/suit-black.jpg", "/images/suit-black-2.jpg"],
        stock: 85,
        sku: "BS-SUIT-BLK-3P",
        featured: true,
        categoryId: catSuits.id,
        pricingTiers: {
          create: [
            { minQty: 5, pricePerUnit: 3699.00 },
            { minQty: 20, pricePerUnit: 3199.00 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Charcoal Grey Wedding Suit",
        slug: "charcoal-grey-wedding-suit",
        description: "Elegant charcoal grey suit with subtle pinstripe. Tailored fit with notch lapels. A sophisticated choice for grooms and wedding parties.",
        basePrice: 3899.00,
        imageUrl: "/images/suit-charcoal.jpg",
        images: ["/images/suit-charcoal.jpg"],
        stock: 65,
        sku: "BS-SUIT-CHR-WD",
        categoryId: catSuits.id,
        pricingTiers: {
          create: [
            { minQty: 5, pricePerUnit: 3399.00 },
            { minQty: 20, pricePerUnit: 2899.00 },
          ],
        },
      },
    }),

    // ── Shirts ──
    prisma.product.create({
      data: {
        name: "White Cotton Dress Shirt",
        slug: "white-cotton-dress-shirt",
        description: "Premium 100% Egyptian cotton dress shirt with spread collar. Wrinkle-resistant finish. Available in regular and slim fit.",
        basePrice: 699.00,
        imageUrl: "/images/shirt-white.jpg",
        images: ["/images/shirt-white.jpg", "/images/shirt-white-2.jpg"],
        stock: 300,
        sku: "BS-SHT-WHT-CT",
        featured: true,
        categoryId: catShirts.id,
        pricingTiers: {
          create: [
            { minQty: 10, pricePerUnit: 599.00 },
            { minQty: 50, pricePerUnit: 499.00 },
            { minQty: 100, pricePerUnit: 449.00 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Sky Blue French Cuff Shirt",
        slug: "sky-blue-french-cuff-shirt",
        description: "Refined sky blue shirt with French cuffs for cufflinks. Herringbone weave cotton. Pairs beautifully with navy or charcoal suits.",
        basePrice: 799.00,
        imageUrl: "/images/shirt-blue.jpg",
        images: ["/images/shirt-blue.jpg"],
        stock: 200,
        sku: "BS-SHT-BLU-FC",
        categoryId: catShirts.id,
        pricingTiers: {
          create: [
            { minQty: 10, pricePerUnit: 679.00 },
            { minQty: 50, pricePerUnit: 579.00 },
          ],
        },
      },
    }),

    // ── Trousers ──
    prisma.product.create({
      data: {
        name: "Navy Tailored Trousers",
        slug: "navy-tailored-trousers",
        description: "Slim fit wool blend trousers in navy. Flat front design with belt loops and adjustable waist. Can be worn as separates or with matching blazer.",
        basePrice: 1299.00,
        imageUrl: "/images/trousers-navy.jpg",
        images: ["/images/trousers-navy.jpg"],
        stock: 180,
        sku: "BS-TRS-NVY",
        categoryId: catTrousers.id,
        pricingTiers: {
          create: [
            { minQty: 10, pricePerUnit: 1099.00 },
            { minQty: 50, pricePerUnit: 949.00 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Stone Chinos",
        slug: "stone-chinos",
        description: "Smart casual stone chinos in stretch cotton. Comfortable fit for office and weekend wear. Features side and back pockets.",
        basePrice: 899.00,
        imageUrl: "/images/chinos-stone.jpg",
        images: ["/images/chinos-stone.jpg"],
        stock: 250,
        sku: "BS-CHN-STN",
        categoryId: catTrousers.id,
        pricingTiers: {
          create: [
            { minQty: 10, pricePerUnit: 749.00 },
            { minQty: 50, pricePerUnit: 649.00 },
          ],
        },
      },
    }),

    // ── Shoes ──
    prisma.product.create({
      data: {
        name: "Oxford Black Leather Shoes",
        slug: "oxford-black-leather",
        description: "Handcrafted black leather Oxford shoes with Goodyear welt construction. Classic cap-toe design. The essential shoe for every gentleman.",
        basePrice: 2199.00,
        imageUrl: "/images/shoes-oxford.jpg",
        images: ["/images/shoes-oxford.jpg", "/images/shoes-oxford-2.jpg"],
        stock: 100,
        sku: "BS-SHO-OXF-BLK",
        featured: true,
        categoryId: catShoes.id,
        pricingTiers: {
          create: [
            { minQty: 5, pricePerUnit: 1899.00 },
            { minQty: 20, pricePerUnit: 1699.00 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Tan Brogue Derby Shoes",
        slug: "tan-brogue-derby",
        description: "Full brogue derby shoes in burnished tan leather. Medallion toe detail with leather sole. Perfect for smart casual occasions.",
        basePrice: 1899.00,
        imageUrl: "/images/shoes-brogue.jpg",
        images: ["/images/shoes-brogue.jpg"],
        stock: 80,
        sku: "BS-SHO-BRG-TAN",
        categoryId: catShoes.id,
        pricingTiers: {
          create: [
            { minQty: 5, pricePerUnit: 1649.00 },
            { minQty: 20, pricePerUnit: 1499.00 },
          ],
        },
      },
    }),

    // ── Accessories ──
    prisma.product.create({
      data: {
        name: "Silk Tie — Burgundy",
        slug: "silk-tie-burgundy",
        description: "100% Italian silk tie in rich burgundy. Hand-finished with self-tipping. Width: 7.5cm. A timeless choice for formal occasions.",
        basePrice: 499.00,
        imageUrl: "/images/tie-burgundy.jpg",
        images: ["/images/tie-burgundy.jpg"],
        stock: 400,
        sku: "BS-TIE-BRG-SLK",
        featured: true,
        categoryId: catAccessories.id,
        pricingTiers: {
          create: [
            { minQty: 10, pricePerUnit: 399.00 },
            { minQty: 50, pricePerUnit: 329.00 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Genuine Leather Belt",
        slug: "genuine-leather-belt",
        description: "Full-grain leather belt with brushed gold buckle. 35mm width. Available in black and tan. The finishing touch for any suit.",
        basePrice: 599.00,
        imageUrl: "/images/belt-leather.jpg",
        images: ["/images/belt-leather.jpg"],
        stock: 350,
        sku: "BS-BLT-LTH-BLK",
        categoryId: catAccessories.id,
        pricingTiers: {
          create: [
            { minQty: 10, pricePerUnit: 499.00 },
            { minQty: 50, pricePerUnit: 399.00 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Silver Cufflinks Set",
        slug: "silver-cufflinks-set",
        description: "Rhodium-plated cufflinks with mother-of-pearl inlay. Presented in a luxury gift box. Ideal for groomsmen gifts.",
        basePrice: 449.00,
        imageUrl: "/images/cufflinks-silver.jpg",
        images: ["/images/cufflinks-silver.jpg"],
        stock: 200,
        sku: "BS-CFL-SLV",
        categoryId: catAccessories.id,
        pricingTiers: {
          create: [
            { minQty: 10, pricePerUnit: 379.00 },
            { minQty: 50, pricePerUnit: 319.00 },
          ],
        },
      },
    }),

    // ── Smart Casual ──
    prisma.product.create({
      data: {
        name: "Navy Blazer — Unstructured",
        slug: "navy-blazer-unstructured",
        description: "Relaxed unstructured blazer in navy cotton-linen blend. Patch pockets, natural shoulder. Dress it up or down — from boardroom to braai.",
        basePrice: 2499.00,
        imageUrl: "/images/blazer-navy.jpg",
        images: ["/images/blazer-navy.jpg", "/images/blazer-navy-2.jpg"],
        stock: 90,
        sku: "BS-BLZ-NVY-UN",
        featured: true,
        categoryId: catSmartCasual.id,
        pricingTiers: {
          create: [
            { minQty: 5, pricePerUnit: 2149.00 },
            { minQty: 20, pricePerUnit: 1899.00 },
          ],
        },
      },
    }),
  ]);

  // ─── Sample Orders ──────────────────────────────
  await prisma.order.create({
    data: {
      userId: wholesaleUser.id,
      totalAmount: 62475.00,
      status: "PROCESSING",
      items: {
        create: [
          { productId: products[0].id, quantity: 15, priceAtPurchase: 2999.00 },  // Suits
          { productId: products[3].id, quantity: 15, priceAtPurchase: 599.00 },   // Shirts
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: retailUser.id,
      totalAmount: 6197.00,
      status: "DELIVERED",
      items: {
        create: [
          { productId: products[0].id, quantity: 1, priceAtPurchase: 3499.00 },
          { productId: products[3].id, quantity: 1, priceAtPurchase: 699.00 },
          { productId: products[7].id, quantity: 1, priceAtPurchase: 2199.00 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: wholesaleUser2.id,
      totalAmount: 89950.00,
      status: "CONFIRMED",
      items: {
        create: [
          { productId: products[1].id, quantity: 20, priceAtPurchase: 3199.00 },  // Black suits
          { productId: products[9].id, quantity: 50, priceAtPurchase: 329.00 },   // Ties
        ],
      },
    },
  });

  console.log("✅ Seed completed:", {
    categories: 6,
    users: 5,
    products: products.length,
    orders: 3,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
