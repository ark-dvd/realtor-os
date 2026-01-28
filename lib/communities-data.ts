// ═══════════════════════════════════════════════════════════════════════════
// GREATER AUSTIN COMMUNITIES - COMPREHENSIVE DATA
// ═══════════════════════════════════════════════════════════════════════════

export interface School {
  name: string
  type: 'Elementary' | 'Middle' | 'High School'
  rating: number
  note?: string
}

export interface City {
  name: string
  slug: string
  description?: string
  order: number
}

export interface Community {
  name: string
  slug: string
  citySlug: string // Reference to city
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

// ═══════════════════════════════════════════════════════════════════════════
// CITIES
// ═══════════════════════════════════════════════════════════════════════════

export const cities: City[] = [
  { name: 'Austin', slug: 'austin', description: 'The vibrant capital of Texas, known for live music, tech innovation, and unique culture.', order: 1 },
  { name: 'Bee Cave', slug: 'bee-cave', description: 'An upscale Hill Country community with excellent schools and resort-style amenities.', order: 2 },
  { name: 'Cedar Park', slug: 'cedar-park', description: 'A fast-growing suburb offering family-friendly neighborhoods and excellent value.', order: 3 },
  { name: 'Georgetown', slug: 'georgetown', description: 'A charming historic town with a beautiful square and award-winning quality of life.', order: 4 },
  { name: 'Lakeway', slug: 'lakeway', description: 'A scenic lakeside community with golf courses and Hill Country views.', order: 5 },
  { name: 'Leander', slug: 'leander', description: 'A rapidly expanding city with new master-planned communities and great schools.', order: 6 },
  { name: 'Pflugerville', slug: 'pflugerville', description: 'A diverse, welcoming community with strong schools and easy access to Austin.', order: 7 },
  { name: 'Round Rock', slug: 'round-rock', description: 'Home to Dell Technologies, excellent schools, and a thriving sports scene.', order: 8 },
]

// ═══════════════════════════════════════════════════════════════════════════
// COMMUNITIES
// ═══════════════════════════════════════════════════════════════════════════

export const communities: Community[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // AUSTIN
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Downtown Austin',
    slug: 'downtown-austin',
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
    citySlug: 'austin',
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
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BEE CAVE
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Falconhead',
    slug: 'falconhead',
    citySlug: 'bee-cave',
    tagline: 'Golf course luxury with Hill Country charm.',
    vibe: 'Upscale golf community with resort-style amenities and stunning views.',
    description: 'Falconhead is a premier golf course community offering custom homes on large lots with Hill Country views. The community features excellent amenities including pools, tennis courts, and direct access to world-class golf.',
    population: '~2,500',
    commute: {
      toDowntown: '25–35 mins',
      toDomain: '30–40 mins'
    },
    schoolDistrict: 'Lake Travis ISD',
    schools: [
      { name: 'Bee Cave Elementary', type: 'Elementary', rating: 9 },
      { name: 'Bee Cave Middle School', type: 'Middle', rating: 8 },
      { name: 'Lake Travis High School', type: 'High School', rating: 9, note: 'Known for strong academics and athletics' }
    ],
    whyPeopleLove: [
      'Golf Lifestyle: Live on or near the Falconhead Golf Club course with beautiful fairway views.',
      'Family Amenities: Resort-style pools, tennis courts, and miles of trails keep families active.',
      'Lake Travis ISD: Access to one of the most highly-rated school districts in the Austin area.'
    ],
    highlights: [
      { name: 'Falconhead Golf Club', description: 'Championship course designed for all skill levels.' },
      { name: 'Hill Country Galleria', description: 'Upscale shopping and dining minutes away.' }
    ],
    avgPrice: '$950,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
  },
  {
    name: 'Spanish Oaks',
    slug: 'spanish-oaks',
    citySlug: 'bee-cave',
    tagline: 'Exclusive gated luxury with private golf.',
    vibe: 'Ultra-private and prestigious. Gated enclave with multi-million dollar estates.',
    description: 'Spanish Oaks is Bee Cave\'s most exclusive address, a gated community featuring custom estate homes, a private Bobby Jones-designed golf course, and spectacular Hill Country views. This is where Austin\'s elite retreat.',
    population: '~400 homesites',
    commute: {
      toDowntown: '30–40 mins',
      toDomain: '35–45 mins'
    },
    schoolDistrict: 'Lake Travis ISD',
    schools: [
      { name: 'Bee Cave Elementary', type: 'Elementary', rating: 9 },
      { name: 'Lake Travis High School', type: 'High School', rating: 9 }
    ],
    whyPeopleLove: [
      'Ultimate Privacy: Gated entry with 24/7 security provides unmatched exclusivity.',
      'Private Golf: The Bobby Jones-designed course is limited to residents and members only.',
      'Trophy Homes: Custom estates on 1-3 acre lots with panoramic Hill Country views.'
    ],
    highlights: [
      { name: 'Spanish Oaks Golf Club', description: 'Private Bobby Jones-designed championship course.' },
      { name: 'Members Clubhouse', description: 'Resort-style amenities including fine dining.' }
    ],
    avgPrice: '$2,500,000',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CEDAR PARK
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Twin Creeks',
    slug: 'twin-creeks',
    citySlug: 'cedar-park',
    tagline: 'Family-focused living with excellent schools and modern amenities.',
    vibe: 'Established suburban community with tree-lined streets and active families.',
    description: 'Twin Creeks is one of Cedar Park\'s most sought-after neighborhoods, offering quality homes, excellent Leander ISD schools, and a strong sense of community. The neighborhood features multiple pools, parks, and easy access to shopping and dining.',
    population: '~4,000',
    commute: {
      toDowntown: '25–35 mins',
      toDomain: '15–20 mins'
    },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Whitestone Elementary', type: 'Elementary', rating: 8 },
      { name: 'Running Brushy Middle School', type: 'Middle', rating: 7 },
      { name: 'Cedar Park High School', type: 'High School', rating: 8, note: 'Strong academics and championship sports programs' }
    ],
    whyPeopleLove: [
      'Value: Get more home for your money compared to central Austin while maintaining quality.',
      'Schools: Leander ISD consistently ranks among the best in the Austin metro.',
      'Community: Active HOA hosts events year-round; neighbors genuinely know each other.'
    ],
    highlights: [
      { name: '1890 Ranch', description: 'Major shopping center with retail, dining, and entertainment.' },
      { name: 'H-E-B Center', description: 'Home of the Texas Stars hockey team.' }
    ],
    avgPrice: '$550,000',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'
  },
  {
    name: 'Buttercup Creek',
    slug: 'buttercup-creek',
    citySlug: 'cedar-park',
    tagline: 'Mature trees and established charm in prime Cedar Park.',
    vibe: 'Well-established with mature landscaping and strong neighborhood identity.',
    description: 'Buttercup Creek offers the charm of mature trees and established landscaping that newer developments can\'t match. This neighborhood provides excellent value, strong schools, and a true community atmosphere.',
    population: '~5,500',
    commute: {
      toDowntown: '25–35 mins',
      toDomain: '12–18 mins'
    },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Deer Creek Elementary', type: 'Elementary', rating: 7 },
      { name: 'Cedar Park Middle School', type: 'Middle', rating: 7 },
      { name: 'Cedar Park High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Mature Landscaping: Decades-old trees provide shade and character that new builds lack.',
      'Location: Easy access to 183A makes commuting to Domain employers seamless.',
      'Affordability: Entry-level pricing for the quality of schools and community.'
    ],
    highlights: [
      { name: 'Buttercup Creek Park', description: 'Community park with trails, playground, and sports fields.' },
      { name: 'Lakeline Mall', description: 'Major shopping and entertainment hub nearby.' }
    ],
    avgPrice: '$475,000',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GEORGETOWN
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Sun City',
    slug: 'sun-city',
    citySlug: 'georgetown',
    tagline: 'Premier 55+ active adult community with resort living.',
    vibe: 'Active retirement paradise with endless amenities and social activities.',
    description: 'Sun City Texas is the premier 55+ active adult community in the Austin area, offering resort-style living with three golf courses, multiple pools, fitness centers, and over 50 clubs and groups. It\'s where active adults come to thrive.',
    population: '~15,000 residents',
    commute: {
      toDowntown: '35–45 mins',
      toDomain: '25–35 mins'
    },
    schoolDistrict: 'Georgetown ISD (N/A for 55+)',
    schools: [],
    whyPeopleLove: [
      'Lifestyle: Over 50 clubs and groups mean you\'ll never run out of ways to stay active and social.',
      'Amenities: Three golf courses, multiple pools, tennis, pickleball, and fitness centers included.',
      'Maintenance-Free: Yard care and exterior maintenance handled so you can enjoy retirement.'
    ],
    highlights: [
      { name: 'Cowan Creek Golf Course', description: 'One of three championship courses in the community.' },
      { name: 'Village Center', description: 'The social hub with dining, shops, and community events.' }
    ],
    avgPrice: '$425,000',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'
  },
  {
    name: 'Berry Creek',
    slug: 'berry-creek',
    citySlug: 'georgetown',
    tagline: 'Golf course community with family appeal and natural beauty.',
    vibe: 'Established golf community surrounded by nature with homes for all stages of life.',
    description: 'Berry Creek Country Club community offers beautiful homes along a championship golf course, with the added bonus of excellent Georgetown ISD schools. Natural creeks and wooded areas provide a peaceful setting for families and golf enthusiasts alike.',
    population: '~3,500',
    commute: {
      toDowntown: '35–45 mins',
      toDomain: '25–35 mins'
    },
    schoolDistrict: 'Georgetown ISD',
    schools: [
      { name: 'Carver Elementary', type: 'Elementary', rating: 7 },
      { name: 'Forbes Middle School', type: 'Middle', rating: 7 },
      { name: 'Georgetown High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Natural Setting: Berry Creek runs through the community providing scenic beauty and wildlife.',
      'Golf Access: Championship course with country club membership available.',
      'Family-Friendly: Unlike age-restricted communities, Berry Creek welcomes all ages.'
    ],
    highlights: [
      { name: 'Berry Creek Country Club', description: 'Championship golf course and clubhouse with dining.' },
      { name: 'Georgetown Square', description: 'Historic downtown square with shops, restaurants, and events.' }
    ],
    avgPrice: '$550,000',
    image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LAKEWAY
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Lakeway Proper',
    slug: 'lakeway-proper',
    citySlug: 'lakeway',
    tagline: 'Lakeside luxury with world-class golf and resort amenities.',
    vibe: 'Upscale resort community with Lake Travis access and country club living.',
    description: 'Lakeway offers the ultimate Hill Country lakeside lifestyle with access to Lake Travis, multiple golf courses, and the Lakeway Resort & Spa. Custom homes range from waterfront estates to golf course villas.',
    population: '~18,000 (City of Lakeway)',
    commute: {
      toDowntown: '30–40 mins',
      toDomain: '35–45 mins'
    },
    schoolDistrict: 'Lake Travis ISD',
    schools: [
      { name: 'Lakeway Elementary', type: 'Elementary', rating: 9 },
      { name: 'Hudson Bend Middle School', type: 'Middle', rating: 8 },
      { name: 'Lake Travis High School', type: 'High School', rating: 9, note: 'Among the top high schools in Texas' }
    ],
    whyPeopleLove: [
      'Lake Access: Multiple community boat ramps and marinas provide Lake Travis recreation.',
      'Golf: World-class courses including the Hills of Lakeway and Live Oak Golf Club.',
      'Resort Living: Access to Lakeway Resort & Spa amenities including spa, pools, and dining.'
    ],
    highlights: [
      { name: 'Lake Travis', description: 'Boating, swimming, and watersports at your doorstep.' },
      { name: 'Lakeway Resort & Spa', description: 'Full-service resort with golf, spa, and fine dining.' }
    ],
    avgPrice: '$850,000',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
  },
  {
    name: 'Rough Hollow',
    slug: 'rough-hollow',
    citySlug: 'lakeway',
    tagline: 'Modern lakeside master-plan with yacht club and trails.',
    vibe: 'Contemporary luxury community with marina, trails, and Hill Country beauty.',
    description: 'Rough Hollow is Lakeway\'s premier master-planned community featuring a private yacht club, marina, extensive trails, and stunning Hill Country architecture. This newer development offers modern amenities while preserving natural beauty.',
    population: '~2,000 homes at buildout',
    commute: {
      toDowntown: '30–40 mins',
      toDomain: '35–45 mins'
    },
    schoolDistrict: 'Lake Travis ISD',
    schools: [
      { name: 'Rough Hollow Elementary', type: 'Elementary', rating: 8 },
      { name: 'Lake Travis Middle School', type: 'Middle', rating: 8 },
      { name: 'Lake Travis High School', type: 'High School', rating: 9 }
    ],
    whyPeopleLove: [
      'Yacht Club: Private marina with boat slips, lakeside dining, and events.',
      'Trail System: Over 30 miles of trails connecting throughout the community.',
      'New Construction: Modern floor plans with Hill Country contemporary architecture.'
    ],
    highlights: [
      { name: 'Rough Hollow Yacht Club', description: 'Private marina with dining, events, and lake access.' },
      { name: 'The Overlook', description: 'Community pool complex with stunning lake views.' }
    ],
    avgPrice: '$750,000',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEANDER
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Crystal Falls',
    slug: 'crystal-falls',
    citySlug: 'leander',
    tagline: 'Golf course master-plan with resort amenities and family focus.',
    vibe: 'Active family community with golf, pools, and excellent schools.',
    description: 'Crystal Falls is a master-planned community centered around the Crystal Falls Golf Club. With excellent Leander ISD schools, multiple amenity centers, and a true neighborhood feel, it\'s become one of the most popular destinations for growing families.',
    population: '~8,000',
    commute: {
      toDowntown: '30–40 mins',
      toDomain: '20–30 mins'
    },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Cox Elementary', type: 'Elementary', rating: 8 },
      { name: 'Henry Middle School', type: 'Middle', rating: 7 },
      { name: 'Leander High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Value: Large, newer homes at prices well below comparable central Austin properties.',
      'Amenities: Multiple pools, splash pads, playgrounds, and the Crystal Falls Golf Club.',
      'Schools: Leander ISD\'s reputation attracts families from across the metro.'
    ],
    highlights: [
      { name: 'Crystal Falls Golf Club', description: 'Semi-private course open to residents and public.' },
      { name: 'Crystal Falls Amenity Center', description: 'Resort-style pool, sports courts, and event space.' }
    ],
    avgPrice: '$525,000',
    image: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800&q=80'
  },
  {
    name: 'Travisso',
    slug: 'travisso',
    citySlug: 'leander',
    tagline: 'Hill Country views with Italian-inspired design.',
    vibe: 'Tuscan-inspired community with dramatic views and upscale amenities.',
    description: 'Travisso brings Tuscan elegance to the Texas Hill Country with Italian-inspired architecture, dramatic hilltop views, and exceptional amenities. This master-planned community offers a resort lifestyle with excellent Leander ISD schools.',
    population: '~3,500',
    commute: {
      toDowntown: '35–45 mins',
      toDomain: '25–35 mins'
    },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Reagan Elementary', type: 'Elementary', rating: 8 },
      { name: 'Running Brushy Middle School', type: 'Middle', rating: 7 },
      { name: 'Vista Ridge High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Views: Hilltop homesites with panoramic Hill Country vistas.',
      'Design: Italian-inspired architecture creates a unique, cohesive aesthetic.',
      'Amenities: Tuscan-style clubhouse, resort pools, and extensive trail system.'
    ],
    highlights: [
      { name: 'The Grotto', description: 'Italian-inspired pool complex with cabanas and grotto.' },
      { name: 'Hill Country Views', description: 'Some of the most dramatic views in Leander.' }
    ],
    avgPrice: '$650,000',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PFLUGERVILLE
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Blackhawk',
    slug: 'blackhawk',
    citySlug: 'pflugerville',
    tagline: 'Golf course community with family values and diverse charm.',
    vibe: 'Welcoming and diverse community centered around championship golf.',
    description: 'Blackhawk is Pflugerville\'s premier golf course community, offering homes along the Blackhawk Golf Club with excellent Pflugerville ISD schools. The neighborhood is known for its diversity, friendliness, and family-oriented atmosphere.',
    population: '~4,500',
    commute: {
      toDowntown: '20–30 mins',
      toDomain: '15–25 mins'
    },
    schoolDistrict: 'Pflugerville ISD',
    schools: [
      { name: 'Windermere Elementary', type: 'Elementary', rating: 7 },
      { name: 'Dessau Middle School', type: 'Middle', rating: 6 },
      { name: 'Hendrickson High School', type: 'High School', rating: 7 }
    ],
    whyPeopleLove: [
      'Diversity: One of the most welcoming, culturally diverse communities in the Austin metro.',
      'Golf Access: Homes along Blackhawk Golf Club with membership options available.',
      'Value: Quality homes at prices that make homeownership accessible.'
    ],
    highlights: [
      { name: 'Blackhawk Golf Club', description: 'Championship course with pro shop and grill.' },
      { name: 'Lake Pflugerville', description: 'Nearby 180-acre lake with trails and recreation.' }
    ],
    avgPrice: '$450,000',
    image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80'
  },
  {
    name: 'Falcon Pointe',
    slug: 'falcon-pointe',
    citySlug: 'pflugerville',
    tagline: 'Master-planned family community with top-rated schools.',
    vibe: 'Active, family-focused community with excellent amenities and strong schools.',
    description: 'Falcon Pointe is a master-planned community that has become synonymous with family living in Pflugerville. With multiple pools, playgrounds, sports facilities, and access to top-rated schools, it\'s where growing families thrive.',
    population: '~3,000',
    commute: {
      toDowntown: '25–35 mins',
      toDomain: '20–30 mins'
    },
    schoolDistrict: 'Pflugerville ISD',
    schools: [
      { name: 'Caldwell Elementary', type: 'Elementary', rating: 8 },
      { name: 'Kelly Lane Middle School', type: 'Middle', rating: 7 },
      { name: 'Hendrickson High School', type: 'High School', rating: 7 }
    ],
    whyPeopleLove: [
      'Family Focus: Everything from the amenities to events is designed for families with children.',
      'Amenities: Multiple pools, splash pads, sports courts, and miles of trails.',
      'Community Spirit: Active HOA organizes events that bring neighbors together.'
    ],
    highlights: [
      { name: 'Falcon Pointe Amenity Center', description: 'Resort-style pool with splash pad and pavilion.' },
      { name: 'Community Events', description: 'Regular movie nights, holiday events, and festivals.' }
    ],
    avgPrice: '$475,000',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ROUND ROCK
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Brushy Creek',
    slug: 'brushy-creek',
    citySlug: 'round-rock',
    tagline: 'Established charm with parks, trails, and strong schools.',
    vibe: 'Mature, tree-lined community with exceptional outdoor amenities.',
    description: 'Brushy Creek is one of Round Rock\'s most established and desirable neighborhoods, known for its mature trees, extensive hike-and-bike trails, and access to excellent Round Rock ISD schools. The community offers various price points across its multiple sections.',
    population: '~15,000',
    commute: {
      toDowntown: '25–35 mins',
      toDomain: '10–15 mins'
    },
    schoolDistrict: 'Round Rock ISD',
    schools: [
      { name: 'Brushy Creek Elementary', type: 'Elementary', rating: 8 },
      { name: 'Walsh Middle School', type: 'Middle', rating: 7 },
      { name: 'Round Rock High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Trail System: Miles of hike-and-bike trails along Brushy Creek for walking, running, and biking.',
      'Mature Landscaping: Decades-old trees provide shade and character throughout.',
      'Location: Easy access to Domain employers, shopping, and entertainment.'
    ],
    highlights: [
      { name: 'Brushy Creek Lake Park', description: 'Sports complex with fields, courts, and playground.' },
      { name: 'Brushy Creek Trail', description: 'Extensive trail system perfect for outdoor activities.' }
    ],
    avgPrice: '$500,000',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'
  },
  {
    name: 'Teravista',
    slug: 'teravista',
    citySlug: 'round-rock',
    tagline: 'Master-planned golf community with resort living.',
    vibe: 'Modern master-plan with golf course, pools, and family amenities.',
    description: 'Teravista is Round Rock\'s premier master-planned community featuring the Teravista Golf Club, multiple amenity centers, and excellent Round Rock ISD schools. With diverse home options and resort-style amenities, it appeals to families at all stages.',
    population: '~8,000',
    commute: {
      toDowntown: '30–40 mins',
      toDomain: '15–20 mins'
    },
    schoolDistrict: 'Round Rock ISD',
    schools: [
      { name: 'Teravista Elementary', type: 'Elementary', rating: 8 },
      { name: 'Hopewell Middle School', type: 'Middle', rating: 7 },
      { name: 'Round Rock High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Golf Access: Teravista Golf Club is a championship course open to residents and public.',
      'Amenities: Multiple pools, fitness center, sports courts, and extensive trails.',
      'New Construction: Mix of established and new sections with modern floor plans.'
    ],
    highlights: [
      { name: 'Teravista Golf Club', description: 'Championship golf course with pro shop and dining.' },
      { name: 'The Club at Teravista', description: 'Amenity center with resort pool and fitness.' }
    ],
    avgPrice: '$550,000',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80'
  },
  {
    name: 'Walsh Ranch',
    slug: 'walsh-ranch',
    citySlug: 'round-rock',
    tagline: 'Upscale living with top schools and resort amenities.',
    vibe: 'Executive-level homes with country club atmosphere and premium schools.',
    description: 'Walsh Ranch represents upscale suburban living at its finest, with larger executive homes, premium amenities, and access to the highly-rated Walsh Elementary cluster. This established community attracts families seeking the best of Round Rock.',
    population: '~3,500',
    commute: {
      toDowntown: '25–35 mins',
      toDomain: '10–15 mins'
    },
    schoolDistrict: 'Round Rock ISD',
    schools: [
      { name: 'Walsh Elementary', type: 'Elementary', rating: 9, note: 'One of the top-rated elementaries in RRISD' },
      { name: 'Walsh Middle School', type: 'Middle', rating: 8 },
      { name: 'Westwood High School', type: 'High School', rating: 9, note: 'Nationally recognized academics' }
    ],
    whyPeopleLove: [
      'Schools: The Walsh Elementary to Westwood High School pipeline is among the best in Texas.',
      'Executive Homes: Larger lots and premium finishes attract discerning buyers.',
      'Amenities: Pool, playground, and trails within a well-maintained community.'
    ],
    highlights: [
      { name: 'Walsh Ranch Amenity Center', description: 'Community pool, playground, and gathering space.' },
      { name: 'Dell Diamond', description: 'Nearby home of the Round Rock Express baseball team.' }
    ],
    avgPrice: '$700,000',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug)
}

export function getCommunityBySlug(slug: string): Community | undefined {
  return communities.find(c => c.slug === slug)
}

export function getCommunitiesByCity(citySlug: string): Community[] {
  return communities.filter(c => c.citySlug === citySlug)
}

export function getCommunitiesGroupedByCity(): Map<City, Community[]> {
  const grouped = new Map<City, Community[]>()

  for (const city of cities) {
    const cityComms = communities.filter(c => c.citySlug === city.slug)
    if (cityComms.length > 0) {
      grouped.set(city, cityComms)
    }
  }

  return grouped
}

// Keep backward compatibility - alias neighborhoods to communities
export const neighborhoods = communities
export type Neighborhood = Community
export function getNeighborhoodBySlug(slug: string): Community | undefined {
  return getCommunityBySlug(slug)
}
