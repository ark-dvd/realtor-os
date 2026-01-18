// ═══════════════════════════════════════════════════════════════════════════
// AUSTIN NEIGHBORHOODS - COMPREHENSIVE DATA
// ═══════════════════════════════════════════════════════════════════════════

export interface School {
  name: string
  type: 'Elementary' | 'Middle' | 'High School'
  rating: number
  note?: string
}

export interface Neighborhood {
  name: string
  slug: string
  tagline: string
  vibe: string
  description: string
  population: string
  commute: {
    toDowntown: string
    toDomain: string
  }
  schoolDistrict: string
  schools: School[]
  whyPeopleLove: string[]
  highlights: { name: string; description: string }[]
  avgPrice: string
  image: string
}

export const neighborhoods: Neighborhood[] = [
  {
    name: 'Downtown Austin',
    slug: 'downtown-austin',
    tagline: 'The heartbeat of the city. Luxury high-rise living with culture at your doorstep.',
    vibe: 'Electric, sophisticated, and vertical. Dominated by luxury condos, historic lofts, and a skyline that never sleeps.',
    description: 'Downtown Austin is the vibrant core of the city, offering an unparalleled urban lifestyle. With world-class dining, entertainment, and cultural venues steps away, residents enjoy the ultimate "lock-and-leave" convenience.',
    population: 'Approx. 13,000 residents (rapidly growing)',
    commute: {
      toDowntown: '0 mins (Walkable)',
      toDomain: '20–30 mins driving'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Mathews Elementary', type: 'Elementary', rating: 7, note: 'Highly regarded for a downtown school, diverse and historic' },
      { name: 'O. Henry Middle School', type: 'Middle', rating: 6 },
      { name: 'Austin High School', type: 'High School', rating: 6, note: 'College Readiness: 9/10 – The oldest public high school in Texas with a strong legacy' }
    ],
    whyPeopleLove: [
      'The "Lock-and-Leave" Lifestyle: Perfect for busy professionals and frequent travelers who want luxury amenities without yard maintenance.',
      'Walkability: You can genuinely live car-free here, walking to Whole Foods, work, and happy hour.',
      'Cultural Access: Living steps away from the Moody Theater (ACL Live) and the Zach Theatre.'
    ],
    highlights: [
      { name: 'Seaholm District', description: 'A hub for modern dining, Trader Joe\'s, and the stunning Central Library.' },
      { name: 'Lady Bird Lake Trail', description: 'Your "backyard" is 10 miles of scenic waterfront trails.' }
    ],
    avgPrice: '$850,000',
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80'
  },
  {
    name: 'Westlake',
    slug: 'westlake',
    tagline: 'Prestigious, private, and scenic. The gold standard for luxury family living.',
    vibe: 'Affluent and serene. Winding roads, rolling hills, and panoramic views of the skyline and Hill Country.',
    description: 'West Lake Hills represents the pinnacle of Austin luxury living. Known for its exceptional Eanes ISD schools, large private lots, and stunning natural beauty, Westlake attracts families seeking the very best.',
    population: '~3,400 (City of West Lake Hills)',
    commute: {
      toDowntown: '15–20 mins',
      toDomain: '20–30 mins'
    },
    schoolDistrict: 'Eanes ISD (Top 1% in Texas)',
    schools: [
      { name: 'Eanes Elementary', type: 'Elementary', rating: 9 },
      { name: 'West Ridge Middle School', type: 'Middle', rating: 9 },
      { name: 'Westlake High School', type: 'High School', rating: 10, note: 'Nationally recognized for elite academics and championship athletics' }
    ],
    whyPeopleLove: [
      'Elite Education: Families move here specifically to guarantee entry into Eanes ISD.',
      'Privacy & Nature: Large lots (often 1+ acres) and heavy tree coverage provide a secluded, country feel just minutes from the city.',
      'Investment Value: Real estate here is considered a "blue-chip" asset that holds value incredibly well.'
    ],
    highlights: [
      { name: 'Wild Basin Wilderness Preserve', description: '227 acres of native trails.' },
      { name: 'The Village at Westlake', description: 'Upscale conveniences and HEB without the city crowds.' }
    ],
    avgPrice: '$1,500,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
  },
  {
    name: 'Tarrytown',
    slug: 'tarrytown',
    tagline: 'Old Austin elegance. Historic charm, tree-lined streets, and deep roots.',
    vibe: 'Quiet, established wealth. A mix of 1940s cottages and grand modern renovations.',
    description: 'Tarrytown embodies classic Austin elegance with its tree-lined streets, historic architecture, and tight-knit community. This established neighborhood offers timeless appeal and proximity to both downtown and Lake Austin.',
    population: '~10,500',
    commute: {
      toDowntown: '5–10 mins',
      toDomain: '20 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Casis Elementary', type: 'Elementary', rating: 9, note: 'Widely considered the "jewel" of AISD elementary schools' },
      { name: 'O. Henry Middle School', type: 'Middle', rating: 6 },
      { name: 'Austin High School', type: 'High School', rating: 6, note: 'College Readiness: 9/10' }
    ],
    whyPeopleLove: [
      'Community Atmosphere: Neighbors know each other; it has a very traditional, tight-knit "American Dream" feel.',
      'Water Access: Many homes have views of Lake Austin, and there are private boat docks available.',
      'Timeless Appeal: It avoids the "trendy" chaos of other areas, offering stability and quiet luxury.'
    ],
    highlights: [
      { name: 'Mayfield Park', description: 'Famous for its roaming peacocks and cottage gardens.' },
      { name: 'Mozart\'s Coffee Roasters', description: 'An iconic lakeside spot for coffee, sunsets, and holiday light shows.' }
    ],
    avgPrice: '$1,200,000',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  },
  {
    name: 'Zilker',
    slug: 'zilker',
    tagline: 'The active soul of Austin. Festivals, food, and fun.',
    vibe: 'Energetic and outdoorsy. Highly walkable with a mix of modern builds and renovated bungalows.',
    description: 'Zilker is where Austin\'s active lifestyle truly comes alive. Home to the famous Zilker Park, Barton Springs Pool, and the ACL Festival grounds, this neighborhood attracts those who want to live at the heart of Austin\'s outdoor culture.',
    population: '~9,800',
    commute: {
      toDowntown: '5–10 mins',
      toDomain: '25 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Zilker Elementary', type: 'Elementary', rating: 8, note: 'Very strong parental involvement and community support' },
      { name: 'O. Henry Middle School', type: 'Middle', rating: 6 },
      { name: 'Austin High School', type: 'High School', rating: 6, note: 'College Readiness: 9/10' }
    ],
    whyPeopleLove: [
      'The "Austin" Lifestyle: You are walking distance to ACL Festival, the Kite Festival, and the Trail of Lights.',
      'Foodie Paradise: South Lamar Blvd runs through the neighborhood, offering some of the city\'s most awarded restaurants (Uchi, Loro).',
      'Active Living: It\'s impossible not to be active here with the park and pool as your gym.'
    ],
    highlights: [
      { name: 'Barton Springs Pool', description: 'A natural spring-fed pool that stays 68°F year-round.' },
      { name: 'Alamo Drafthouse', description: 'The original location of the famous cinema chain.' }
    ],
    avgPrice: '$950,000',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
  },
  {
    name: 'Travis Heights',
    slug: 'travis-heights',
    tagline: 'Bohemian beauty. Winding streets, grand oaks, and eclectic character.',
    vibe: 'Artsy but upscale. Known for "fairytale" homes, rolling hills, and a unique lack of sidewalks that integrates homes into nature.',
    description: 'Travis Heights offers a storybook setting with its winding streets, mature oaks, and eclectic architecture. This neighborhood perfectly balances residential tranquility with proximity to South Congress\'s vibrant energy.',
    population: '~6,500',
    commute: {
      toDowntown: '5–10 mins',
      toDomain: '30 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Travis Heights Elementary', type: 'Elementary', rating: 5, note: 'Innovation School with a strong Dual Language program and high community demand' },
      { name: 'Lively Middle School', type: 'Middle', rating: 5 },
      { name: 'Travis Early College High School', type: 'High School', rating: 3, note: 'Vertical Team is rapidly improving' }
    ],
    whyPeopleLove: [
      'Character: No two houses look alike. It feels like a storybook village inside a major city.',
      'Best of Both Worlds: It is quiet and residential, yet you can walk two blocks and be in the middle of the South Congress action.',
      'The Neighbors: A mix of old hippies, tech executives, and artists creates a very friendly, unpretentious vibe.'
    ],
    highlights: [
      { name: 'Big Stacy Park', description: 'Features a heated, spring-fed swimming pool free to the public.' },
      { name: 'The Boardwalk', description: 'Direct access to the Lady Bird Lake trail over the water.' }
    ],
    avgPrice: '$875,000',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'
  },
  {
    name: 'East Austin',
    slug: 'east-austin',
    tagline: 'Culturally rich, hip, and rapidly evolving. The creative center of the city.',
    vibe: 'Trendy and diverse. A fusion of historic bungalows and modern condos, filled with street art, food trucks, and cocktail bars.',
    description: 'East Austin has emerged as the city\'s creative epicenter, blending rich cultural heritage with cutting-edge dining, nightlife, and art scenes. This rapidly evolving neighborhood offers proximity to downtown at more accessible price points.',
    population: '~35,000+ (Central East)',
    commute: {
      toDowntown: '5–10 mins',
      toDomain: '20 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Sanchez Elementary', type: 'Elementary', rating: 5, note: 'Recently modernized campus' },
      { name: 'Eastside Early College High School', type: 'High School', rating: 3, note: 'Focuses on career pathways and college credits' }
    ],
    whyPeopleLove: [
      'Nightlife & Dining: It is currently the "coolest" part of town. The density of top-tier bars and restaurants is unmatched.',
      'History & Culture: A strong sense of heritage, with the Tejano Walking Trail and historic landmarks preserved alongside new developments.',
      'Proximity: You are effectively living in Downtown\'s backyard, often at a slightly better price point than the West side.'
    ],
    highlights: [
      { name: 'Franklin Barbecue', description: 'World-famous BBQ.' },
      { name: 'Comal Street', description: 'A hub for local businesses, breweries, and urban farms.' }
    ],
    avgPrice: '$650,000',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'
  },
  {
    name: 'Clarksville',
    slug: 'clarksville',
    tagline: 'Historic and walkable. A small-town feel within the downtown shadow.',
    vibe: 'Historic preservation district. Very walkable, quaint, and filled with some of the city\'s oldest homes.',
    description: 'Clarksville is a legally protected Historic District offering charming bungalows and Victorian homes in one of Austin\'s most walkable settings. Its exclusivity and central location make inventory exceptionally rare.',
    population: 'Small, exclusive enclave',
    commute: {
      toDowntown: '2 min drive / Walkable',
      toDomain: '20 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Mathews Elementary', type: 'Elementary', rating: 7 },
      { name: 'Austin High School', type: 'High School', rating: 6 }
    ],
    whyPeopleLove: [
      'Charm: It is legally a Historic District, meaning the bungalows and Victorian homes are protected, preserving the atmosphere.',
      'Walkability: Walk to the grocery store (Fresh Plus), pharmacy, and fine dining without crossing a highway.',
      'Exclusivity: It is one of the smallest and most sought-after neighborhoods; inventory is rare.'
    ],
    highlights: [
      { name: 'Jeffrey\'s', description: 'One of Austin\'s finest French-American dining institutions.' },
      { name: 'West Austin Park', description: 'A hidden gem dog park and pool known only to locals.' }
    ],
    avgPrice: '$1,100,000',
    image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80'
  },
  {
    name: 'Rollingwood',
    slug: 'rollingwood',
    tagline: 'The "Mayberry" of Austin. A small municipality with huge value and top-tier schools.',
    vibe: 'Independent city. Extremely safe, family-oriented, and strictly residential with its own police force.',
    description: 'Rollingwood operates as its own independent city, offering exceptional municipal services, strict zoning, and access to the elite Eanes ISD schools. It provides the closest Eanes ISD access to downtown Austin.',
    population: '~1,400',
    commute: {
      toDowntown: '7 mins',
      toDomain: '20 mins'
    },
    schoolDistrict: 'Eanes ISD',
    schools: [
      { name: 'Eanes Elementary', type: 'Elementary', rating: 9 },
      { name: 'Westlake High School', type: 'High School', rating: 10 }
    ],
    whyPeopleLove: [
      'Autonomy: As its own city, Rollingwood has excellent municipal services, strict zoning, and a very responsive police department.',
      'Proximity to Zilker: It borders the park/MoPac, making it the closest Eanes ISD neighborhood to Downtown.',
      'Community: The "Rollingwood Women\'s Club" and local events make it feel like a small town from the 1950s.'
    ],
    highlights: [
      { name: 'Rollingwood Park', description: 'The community hub with playgrounds and ball fields ("Hatley Fields").' },
      { name: 'Western Hills Athletic Club', description: 'A private swim/tennis club that is the social center of the area.' }
    ],
    avgPrice: '$1,300,000',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80'
  },
  {
    name: 'Barton Hills',
    slug: 'barton-hills',
    tagline: 'Nature lover\'s paradise. Quiet streets backing up to the Greenbelt.',
    vibe: 'Peaceful and established. Famous for mid-century modern architecture and steep hills.',
    description: 'Barton Hills is a haven for nature lovers and architecture enthusiasts alike. With direct access to the Barton Creek Greenbelt and a wealth of mid-century modern homes, this tranquil neighborhood offers an escape from city noise while remaining close to South Lamar.',
    population: '~8,000',
    commute: {
      toDowntown: '10–15 mins',
      toDomain: '25 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Barton Hills Elementary', type: 'Elementary', rating: 8, note: 'Surrounded by nature, known for a strong "Green" curriculum' },
      { name: 'Austin High School', type: 'High School', rating: 6 }
    ],
    whyPeopleLove: [
      'Greenbelt Access: Many streets have "secret" entrances to the Barton Creek Greenbelt for hiking and climbing.',
      'Mid-Century Style: If you love 1950s/60s architecture and renovations, this is the hotspot.',
      'Tranquility: Despite being close to South Lamar, the hills insulate the neighborhood from city noise.'
    ],
    highlights: [
      { name: 'Gus Fruh Trailhead', description: 'A favorite swimming hole entrance.' },
      { name: 'Broken Spoke', description: 'Legendary honky-tonk dance hall on the neighborhood\'s edge.' }
    ],
    avgPrice: '$825,000',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'
  },
  {
    name: 'SoCo',
    slug: 'soco',
    tagline: 'Iconic Austin. The tourist and cultural epicenter.',
    vibe: 'Vibrant, busy, and seen-and-be-seen.',
    description: 'South Congress (SoCo) is Austin\'s most iconic corridor, famous for its eclectic shops, world-class restaurants, and live music venues. Living here means being at the center of Austin\'s cultural identity.',
    population: '~19,000 (78704 Zip Code)',
    commute: {
      toDowntown: '5–10 mins',
      toDomain: '25 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Travis Heights Elementary', type: 'Elementary', rating: 5 },
      { name: 'Travis Early College High School', type: 'High School', rating: 3 }
    ],
    whyPeopleLove: [
      'Energy: You wake up to the sound of music and the smell of coffee. It is exciting and dynamic.',
      'Shopping: Home to Hermes, Nike, and boutique local shops like Allen\'s Boots right down the street.',
      'Walk Score: High. You can walk to breakfast, lunch, dinner, and a concert without getting in a car.'
    ],
    highlights: [
      { name: 'Perla\'s & June\'s', description: 'Some of the best patio dining in the city.' },
      { name: 'The Continental Club', description: 'Historic live music venue that hosts legends.' }
    ],
    avgPrice: '$775,000',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
  },
  {
    name: 'Northwest Hills',
    slug: 'northwest-hills',
    tagline: 'Scenic suburban feel with hills, deer, and incredible views.',
    vibe: 'Established residential. Wider streets, larger lots, and a "Hill Country" feel without leaving the city limits.',
    description: 'Northwest Hills offers a Hill Country atmosphere within Austin city limits. Known for its scenic views, wildlife, and excellent Anderson High School cluster, it\'s ideally positioned for tech workers near The Domain.',
    population: '~20,500',
    commute: {
      toDowntown: '15–20 mins',
      toDomain: '7–10 mins (Prime location for Tech workers)'
    },
    schoolDistrict: 'Austin ISD - The "Anderson Cluster"',
    schools: [
      { name: 'Doss Elementary', type: 'Elementary', rating: 9, note: 'Recently rebuilt, state-of-the-art campus' },
      { name: 'Murchison Middle School', type: 'Middle', rating: 5, note: 'IB World School' },
      { name: 'Anderson High School', type: 'High School', rating: 7, note: 'College Readiness: 9/10 – Offers the International Baccalaureate (IB) program' }
    ],
    whyPeopleLove: [
      'The Views: Many homes sit on ridges overlooking canyons; the sunsets are spectacular.',
      'Wildlife: It is famous for the deer that roam the streets freely.',
      'Family Convenience: Great grocery stores, easy highway access, and a very suburban safety feel inside the city.'
    ],
    highlights: [
      { name: 'Bull Creek District Park', description: 'Expansive hiking and swimming area.' },
      { name: 'Chinatown Center', description: 'Nearby access to some of the best Asian cuisine in Austin.' }
    ],
    avgPrice: '$700,000',
    image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80'
  },
  {
    name: 'Bouldin Creek',
    slug: 'bouldin-creek',
    tagline: 'Eclectic cool. A perfect blend of old Austin charm and modern flair.',
    vibe: 'Unique and walkable. Known for its quirky character, peacocks, and very active neighborhood association.',
    description: 'Bouldin Creek embodies the "Keep Austin Weird" spirit with its eclectic homes, free-roaming peacocks, and fiercely independent local businesses. Sandwiched between South 1st and South Congress, residents enjoy double the dining options.',
    population: '~6,000',
    commute: {
      toDowntown: '5 mins',
      toDomain: '25 mins'
    },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Becker Elementary', type: 'Elementary', rating: 6, note: 'Famous for its Dual Language program and chicken coop/gardening focus' },
      { name: 'Travis Early College High School', type: 'High School', rating: 3 }
    ],
    whyPeopleLove: [
      'Keep Austin Weird: This neighborhood fights to keep its local, artistic roots alive.',
      'Location: Sandwiched between South 1st and South Congress, you have double the dining options.',
      'Auditorium Shores: Direct access to the major park where the city watches fireworks and concerts.'
    ],
    highlights: [
      { name: 'The Long Center', description: 'Performing arts venue with the best skyline view in the city.' },
      { name: 'Bouldin Creek Cafe', description: 'Famous vegetarian spot beloved even by meat-eaters.' }
    ],
    avgPrice: '$750,000',
    image: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800&q=80'
  }
]

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return neighborhoods.find(n => n.slug === slug)
}
