const MENU = {
    currency: 'L.L',
    footer: 'Prices in 1000 L.L',
    sections: [
        {
            id: 'sandwiches',
            title: 'Sandwiches & More',
            icon: 'sandwiches',
            items: [
                {
                    name: 'Classic Tawouk',
                    description:
                        'chicken, toum, coleslaw, fries, pickles, ketchup, mustard',
                    price: 450
                },
                {
                    name: 'Z-Tawouk',
                    description:
                        'chicken, toum, coleslaw, fries, pickles, ketchup, zaatar',
                    price: 450
                },
                {
                    name: 'Homemade Fajita',
                    description:
                        'chicken, mozzarella, bell peppers, corn, mushroom, onion, avocado, mayo, mustard, ketchup',
                    price: 500
                },
                {
                    name: 'Old School Burger',
                    description:
                        'hamburger, coleslaw, cocktail sauce + fries on the side',
                    price: 450
                },
                {
                    name: 'Sereno Burger',
                    description:
                        'hamburger, fried egg, coleslaw, cocktail sauce + fries on the side',
                    price: 550
                },
                {
                    name: 'Batata',
                    description: 'fries, coleslaw, toum, pickles, ketchup',
                    price: 300
                },
                {
                    name: 'Mortadella & Cheese',
                    description: 'turkey, mozzarella, pickles',
                    price: 300
                },
                {
                    name: 'Tabbouleh',
                    price: 350
                },
                {
                    name: 'Hummus',
                    price: 350
                },
                {
                    name: 'Kebbeh (2 pcs)',
                    price: 300
                },
                {
                    name: 'French Fries (for 4 people)',
                    price: 450
                }
            ]
        },
        {
            id: 'cold-drinks',
            title: 'Cold Drinks',
            icon: 'cold-drinks',
            items: [
                {
                    name: 'Pepsi 250ml (recyclable)',
                    tags: ['soft', 'drink'],
                    price: 40
                },
                {
                    name: 'Pepsi 330ml',
                    tags: ['soft', 'drink'],
                    price: 90
                },
                {
                    name: 'Pepsi 1.25L',
                    tags: ['soft', 'drink'],
                    price: 140
                },
                {
                    name: 'Iced Coffee',
                    price: 100
                },
                {
                    name: 'Dark Blue',
                    tags: ['energy', 'drink'],
                    price: 90
                },
                {
                    name: 'Maccaw Juice 250ml',
                    tags: ['juice'],
                    price: 50
                },
                {
                    name: 'Water 250ml',
                    price: 30
                },
                {
                    name: 'Water 2L',
                    price: 90
                }
            ]
        },
        {
            id: 'hot-drinks',
            title: 'Hot Drinks',
            icon: 'hot-drinks',
            items: [
                {
                    name: 'Nescafé',
                    price: 100
                },
                {
                    name: 'Instant Cappuccino',
                    price: 150
                },
                {
                    name: 'Tea',
                    price: 100
                },
                {
                    name: 'Maté Set & Popcorn',
                    price: 350
                },
                {
                    name: 'Lebanese Coffee (for 4 people)',
                    price: 300
                }
            ]
        },
        {
            id: 'snacks',
            title: 'Snacks',
            icon: 'snacks',
            items: [
                {
                    name: 'Master Chips',
                    price: 100
                },
                {
                    name: 'Dolsi Chips',
                    price: 90
                },
                {
                    name: 'Popcorn',
                    price: 150
                }
            ]
        },
        {
            id: 'services',
            title: 'Services',
            icon: 'services',
            items: [
                {
                    name: 'Park (from 10 AM until 7 PM)',
                    description:
                        'includes swimming pool access for kids under 12 yrs',
                    tags: ['entrance', 'charge'],
                    price: 250
                },
                {
                    name: 'Park (from 6 PM until 11:30 PM)',
                    tags: ['entrance', 'charge'],
                    price: 350
                },
                {
                    name: 'Pool (from 10 AM until 7 PM)',
                    description: 'food from outside not allowed',
                    tags: ['entrance', 'charge'],
                    price: 720
                },
                {
                    name: 'Park & Pool (from 10 AM until 7 PM)',
                    tags: ['entrance', 'charge'],
                    price: 900
                },
                {
                    name: 'Argileh',
                    tags: ['shisha', 'hookah'],
                    price: 630
                },
                {
                    name: 'BBQ kit',
                    description: 'grill, lighter, fan',
                    tags: ['picnic'],
                    price: 250
                },
                {
                    name: 'Charcoal bag',
                    price: 320
                },
                {
                    name: 'Ice bag',
                    price: 100
                },
                {
                    name: 'Frying service',
                    price: 250
                }
            ]
        }
    ]
};
