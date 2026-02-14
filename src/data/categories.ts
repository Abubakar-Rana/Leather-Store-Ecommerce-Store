import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Leather Products',
    slug: 'leather-products',
    description: 'Premium leather goods and accessories',
    subcategories: [
      {
        id: '1-1',
        name: 'Leather Bags',
        slug: 'leather-bags',
        description: 'Handbags, shoulder bags, totes, and more',
      },
      {
        id: '1-2',
        name: 'Leather Jackets',
        slug: 'leather-jackets',
        description: 'Men and women leather jackets',
      },
      {
        id: '1-3',
        name: 'Leather Accessories',
        slug: 'leather-accessories',
        description: 'Belts, gloves, keychains, and more',
      },
      {
        id: '1-4',
        name: 'Leather Footwear',
        slug: 'leather-footwear',
        description: 'Men and women leather shoes and boots',
      },
      {
        id: '1-5',
        name: 'Travel & Utility Leather',
        slug: 'travel-utility-leather',
        description: 'Luggage, toiletry bags, and document holders',
      },
    ],
  },
  {
    id: '2',
    name: 'Sports Products',
    slug: 'sports-products',
    description: 'Sports equipment, apparel, and accessories',
    subcategories: [
      {
        id: '2-1',
        name: 'Sportswear',
        slug: 'sportswear',
        description: 'Men, women, and kids sportswear',
      },
      {
        id: '2-2',
        name: 'Fitness Equipment',
        slug: 'fitness-equipment',
        description: 'Dumbbells, yoga mats, resistance bands, and more',
      },
      {
        id: '2-3',
        name: 'Outdoor Sports',
        slug: 'outdoor-sports',
        description: 'Football, cricket, basketball, and other sports equipment',
      },
      {
        id: '2-4',
        name: 'Gym Accessories',
        slug: 'gym-accessories',
        description: 'Gloves, belts, supports, and gym gear',
      },
      {
        id: '2-5',
        name: 'Sports Footwear',
        slug: 'sports-footwear',
        description: 'Running shoes, training shoes, and more',
      },
      {
        id: '2-6',
        name: 'Bags & Carriers',
        slug: 'bags-carriers',
        description: 'Gym bags, sports backpacks, and kit bags',
      },
    ],
  },
];