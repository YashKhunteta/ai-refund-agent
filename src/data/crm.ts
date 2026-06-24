import { CustomerProfile } from '../types';

export const CRM_DATA: CustomerProfile[] = [
  {
    id: "CUST-001",
    name: "Sarah Jenkins",
    email: "sarah.j@gmail.com",
    tier: "Regular",
    joinDate: "2024-03-12",
    lifetimeValue: 420.50,
    fraudRiskScore: 12,
    refundHistoryCount: 1,
    totalRefundAmountThisYear: 35.00,
    notes: "Polite customer, rarely returns items. Prefers email updates.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    orders: [
      {
        id: "ORD-9821",
        purchaseDate: "2026-06-05",
        deliveryDate: "2026-06-08",
        status: "Delivered",
        total: 125.00,
        shippingPaid: 5.99,
        items: [
          {
            id: "ITEM-101",
            name: "Floral Summer Dress",
            price: 85.00,
            category: "Apparel",
            refundable: true,
            condition: "Unused"
          },
          {
            id: "ITEM-102",
            name: "Leather Sandals",
            price: 40.00,
            category: "Footwear",
            refundable: true,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-002",
    name: "John Doe",
    email: "john.doe@yahoo.com",
    tier: "Regular",
    joinDate: "2023-08-22",
    lifetimeValue: 150.00,
    fraudRiskScore: 8,
    refundHistoryCount: 0,
    totalRefundAmountThisYear: 0.00,
    notes: "Infrequent buyer. Mostly buys tech accessories.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    orders: [
      {
        id: "ORD-7634",
        purchaseDate: "2026-04-20",
        deliveryDate: "2026-04-23", // ~57 days ago from 2026-06-19
        status: "Delivered",
        total: 45.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-201",
            name: "Rugged Phone Case",
            price: 45.00,
            category: "Electronics",
            refundable: true,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-003",
    name: "Alice Vance",
    email: "alice.vance@vancecorp.com",
    tier: "VIP",
    joinDate: "2021-11-05",
    lifetimeValue: 2450.00,
    fraudRiskScore: 5,
    refundHistoryCount: 2,
    totalRefundAmountThisYear: 180.00,
    notes: "High-value VIP client. Orders frequent designer apparel.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    orders: [
      {
        id: "ORD-9901",
        purchaseDate: "2026-06-16",
        deliveryDate: "2026-06-18", // 1 day ago
        status: "Delivered",
        total: 320.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-301",
            name: "Strap Leather Heels",
            price: 320.00,
            category: "Footwear",
            refundable: true,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-004",
    name: "Bob Miller",
    email: "bob.miller@outlook.com",
    tier: "VIP",
    joinDate: "2022-02-14",
    lifetimeValue: 1890.00,
    fraudRiskScore: 15,
    refundHistoryCount: 1,
    totalRefundAmountThisYear: 60.00,
    notes: "VIP customer who buys fitness equipment. Tolerates delay but gets annoyed.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    orders: [
      {
        id: "ORD-8941",
        purchaseDate: "2026-05-15",
        deliveryDate: "2026-05-17", // 33 days ago - just outside 30 days standard window, inside 45-day VIP window
        status: "Delivered",
        total: 75.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-401",
            name: "Performance Joggers",
            price: 75.00,
            category: "Apparel",
            refundable: true,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-005",
    name: "Marcus Vance",
    email: "marcus.v@protonmail.com",
    tier: "Regular",
    joinDate: "2025-09-01",
    lifetimeValue: 750.00,
    fraudRiskScore: 85, // High Risk!
    refundHistoryCount: 4, // Abuse threshold triggered! (>3 approved refunds)
    totalRefundAmountThisYear: 580.00,
    notes: "High return rate. Flagged by fraud system for wardrobing suspicions.",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    orders: [
      {
        id: "ORD-5541",
        purchaseDate: "2026-06-12",
        deliveryDate: "2026-06-14", // 5 days ago
        status: "Delivered",
        total: 250.00,
        shippingPaid: 15.00,
        items: [
          {
            id: "ITEM-501",
            name: "Premium Noise-Cancelling Headphones",
            price: 250.00,
            category: "Electronics",
            refundable: true,
            condition: "Damaged" // Claims damaged, but risk triggers escalation
          }
        ]
      }
    ]
  },
  {
    id: "CUST-006",
    name: "Elena Rostova",
    email: "elena.r@yandex.ru",
    tier: "Regular",
    joinDate: "2024-07-30",
    lifetimeValue: 340.00,
    fraudRiskScore: 18,
    refundHistoryCount: 1,
    totalRefundAmountThisYear: 45.00,
    notes: "Speaks Russian & English. Prefers buying during major discount sales.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    orders: [
      {
        id: "ORD-4122",
        purchaseDate: "2026-06-10",
        deliveryDate: "2026-06-12", // 7 days ago
        status: "Delivered",
        total: 90.00,
        shippingPaid: 8.99,
        items: [
          {
            id: "ITEM-601",
            name: "Winter Suede Boots (Clearance)",
            price: 90.00,
            category: "Clearance", // Clearance items are non-refundable (Final Sale)
            refundable: false,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-007",
    name: "David Kim",
    email: "david.kim@gmail.com",
    tier: "New",
    joinDate: "2026-06-10", // Registered very recently
    lifetimeValue: 30.00,
    fraudRiskScore: 25,
    refundHistoryCount: 0,
    totalRefundAmountThisYear: 0.00,
    notes: "New customer. Made first purchase last week.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    orders: [
      {
        id: "ORD-1234",
        purchaseDate: "2026-06-14",
        deliveryDate: "2026-06-16", // 3 days ago
        status: "Delivered",
        total: 30.00,
        shippingPaid: 4.99,
        items: [
          {
            id: "ITEM-701",
            name: "Men's Athletic Swim Trunks",
            price: 30.00,
            category: "Underwear", // Non-refundable category due to hygiene
            refundable: false,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-008",
    name: "Chloe Bennett",
    email: "chloe.b@marvel.com",
    tier: "Regular",
    joinDate: "2023-11-12",
    lifetimeValue: 880.00,
    fraudRiskScore: 10,
    refundHistoryCount: 2,
    totalRefundAmountThisYear: 110.00,
    notes: "Frequently contacts chat support for parcel status updates.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    orders: [
      {
        id: "ORD-6003",
        purchaseDate: "2026-06-12",
        deliveryDate: "2026-06-12", // Delivered instantly (digital)
        status: "Delivered",
        total: 50.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-801",
            name: "Digital e-Gift Card $50",
            price: 50.00,
            category: "Digital", // Non-refundable product category
            refundable: false,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-009",
    name: "Arthur Pendragon",
    email: "king.arthur@camelot.org",
    tier: "VIP",
    joinDate: "2020-01-01",
    lifetimeValue: 5600.00,
    fraudRiskScore: 2,
    refundHistoryCount: 1,
    totalRefundAmountThisYear: 120.00,
    notes: "Extremely loyal buyer. Standard gold tier member.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    orders: [
      {
        id: "ORD-2022",
        purchaseDate: "2026-06-01",
        deliveryDate: "2026-06-03", // 16 days ago
        status: "Delivered",
        total: 250.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-901",
            name: "Mechanical Ergonomic Keyboard",
            price: 250.00,
            category: "Electronics",
            refundable: true,
            condition: "Defective" // Defective items get approved return/refund policy-wise
          }
        ]
      }
    ]
  },
  {
    id: "CUST-010",
    name: "Zoe Saldana",
    email: "zoe.saldana@avatar.com",
    tier: "Regular",
    joinDate: "2024-05-18",
    lifetimeValue: 690.00,
    fraudRiskScore: 30,
    refundHistoryCount: 3, // Right at limit
    totalRefundAmountThisYear: 210.00,
    notes: "Occasionally asks for discount codes. Tends to return apparel items.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    orders: [
      {
        id: "ORD-7301",
        purchaseDate: "2026-06-12",
        deliveryDate: "2026-06-14", // 5 days ago
        status: "Delivered",
        total: 180.00,
        shippingPaid: 8.50,
        items: [
          {
            id: "ITEM-1001",
            name: "Designer Denim Jacket",
            price: 180.00,
            category: "Apparel",
            refundable: true,
            condition: "Worn" // Worn condition = Denied refund under strict policy
          }
        ]
      }
    ]
  },
  {
    id: "CUST-011",
    name: "Liam Neeson",
    email: "liam.taken@gmail.com",
    tier: "New",
    joinDate: "2026-05-20",
    lifetimeValue: 300.00,
    fraudRiskScore: 5,
    refundHistoryCount: 0,
    totalRefundAmountThisYear: 0.00,
    notes: "Customer with new account, bought a high-value item.",
    avatar: "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?w=150",
    orders: [
      {
        id: "ORD-4591",
        purchaseDate: "2026-06-15",
        deliveryDate: "2026-06-17", // 2 days ago
        status: "Delivered",
        total: 300.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-1101",
            name: "Premium Biker Leather Jacket",
            price: 300.00,
            category: "Apparel",
            refundable: true,
            condition: "Damaged" // Damaged during shipping (carrier mistake) -> Approved
          }
        ]
      }
    ]
  },
  {
    id: "CUST-012",
    name: "Sophia Loren",
    email: "sophia.loren@cine.it",
    tier: "Regular",
    joinDate: "2023-03-10",
    lifetimeValue: 980.50,
    fraudRiskScore: 42,
    refundHistoryCount: 2,
    totalRefundAmountThisYear: 140.00,
    notes: "Loves luxury items. Requests fast-tracked shipping and occasionally complains.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    orders: [
      {
        id: "ORD-3091",
        purchaseDate: "2026-06-12",
        deliveryDate: "2026-06-14", // 5 days ago
        status: "Delivered",
        total: 95.00,
        shippingPaid: 6.99,
        items: [
          {
            id: "ITEM-1201",
            name: "Hydrating Beauty Serum & Lipstick Set",
            price: 95.00,
            category: "Home", // Cosmetics category
            refundable: false, // Hygiene/Safety non-refundable when used
            condition: "Worn" // Opened/Used -> Denied
          }
        ]
      }
    ]
  },
  {
    id: "CUST-013",
    name: "Emma Watson",
    email: "emma.watson@hegemony.co.uk",
    tier: "VIP",
    joinDate: "2022-09-09",
    lifetimeValue: 3100.00,
    fraudRiskScore: 4,
    refundHistoryCount: 1,
    totalRefundAmountThisYear: 45.00,
    notes: "Eco-friendly product buyer. Very reasonable, high status customer.",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150",
    orders: [
      {
        id: "ORD-8711",
        purchaseDate: "2026-04-01",
        deliveryDate: "2026-04-03", // 77 days ago -> Even for VIPs, the max courtesy extension is 45 days. Denied!
        status: "Delivered",
        total: 120.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-1301",
            name: "Eco-Friendly Cork Sneakers",
            price: 120.00,
            category: "Footwear",
            refundable: true,
            condition: "Unused"
          }
        ]
      }
    ]
  },
  {
    id: "CUST-014",
    name: "Bruce Wayne",
    email: "bruce@wayneenterprises.com",
    tier: "VIP",
    joinDate: "2019-05-15",
    lifetimeValue: 12500.00,
    fraudRiskScore: 1,
    refundHistoryCount: 0,
    totalRefundAmountThisYear: 0.00,
    notes: "Buys gadgets in bulk. Extremely VIP. Never returns anything usually.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    orders: [
      {
        id: "ORD-0007",
        purchaseDate: "2026-06-11",
        deliveryDate: "2026-06-13", // 6 days ago
        status: "Delivered",
        total: 80.00,
        shippingPaid: 0.00,
        items: [
          {
            id: "ITEM-1401",
            name: "Ultra-bright LED Tactical Flashlight",
            price: 80.00,
            category: "Electronics",
            refundable: true,
            condition: "Defective" // Defective -> Approved
          }
        ]
      }
    ]
  },
  {
    id: "CUST-015",
    name: "Peter Parker",
    email: "peter.parker@dailybugle.com",
    tier: "Regular",
    joinDate: "2025-01-20",
    lifetimeValue: 620.00,
    fraudRiskScore: 15,
    refundHistoryCount: 2,
    totalRefundAmountThisYear: 140.00,
    notes: "Camera enthusiast. Often asks about trade-in promotions.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    orders: [
      {
        id: "ORD-5431",
        purchaseDate: "2026-06-01",
        deliveryDate: "2026-06-03", // 16 days ago -> Inside 30 days window!
        status: "Delivered",
        total: 195.00,
        shippingPaid: 10.00,
        items: [
          {
            id: "ITEM-1501",
            name: "Vintage Camera Lens Filter",
            price: 185.00,
            category: "Electronics",
            refundable: true,
            condition: "Unused" // Approved!
          }
        ]
      }
    ]
  }
];
