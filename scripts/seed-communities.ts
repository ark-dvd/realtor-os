/**
 * Seed Communities Script
 * Run with: npx ts-node scripts/seed-communities.ts
 * Or: npx tsx scripts/seed-communities.ts
 *
 * Requires: SANITY_API_TOKEN environment variable
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6hdpy5q3'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('ERROR: SANITY_API_TOKEN environment variable is required')
  console.error('Get your token from: https://www.sanity.io/manage/project/' + projectId + '/api#tokens')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ═══════════════════════════════════════════════════════════════════════════
// CITIES DATA
// ═══════════════════════════════════════════════════════════════════════════

const cities = [
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
// NEW COMMUNITIES DATA (38 communities)
// ═══════════════════════════════════════════════════════════════════════════

const newCommunities = [
  // ─────────────────────────────────────────────────────────────────────────
  // AUSTIN (4 new)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Circle C Ranch',
    slug: 'circle-c-ranch',
    citySlug: 'austin',
    tagline: 'Southwest Austin\'s premier master-planned community with resort amenities.',
    vibe: 'Family-oriented and active. A self-contained community with pools, parks, and excellent schools in a Hill Country setting.',
    description: 'Circle C Ranch is one of Southwest Austin\'s most established master-planned communities, featuring miles of trails, multiple pools, a swim center, and the renowned Circle C Metro Park. With access to excellent Austin ISD schools and proximity to shopping at Escarpment Village, it offers suburban convenience with natural beauty.',
    population: '~12,000',
    commute: { toDowntown: '20-30 mins', toDomain: '30-40 mins' },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Kiker Elementary', type: 'Elementary', rating: 9, note: 'One of the highest-rated AISD elementary schools' },
      { name: 'Small Middle School', type: 'Middle', rating: 7 },
      { name: 'Bowie High School', type: 'High School', rating: 8, note: 'Strong academics and athletics' }
    ],
    whyPeopleLove: [
      'Resort-Style Amenities: Multiple pools, the Swim Center, and miles of greenbelt trails.',
      'Top Schools: Kiker Elementary is among the best in AISD, drawing families specifically for the school.',
      'Community Events: Active HOA hosts seasonal events, movie nights, and holiday celebrations.'
    ],
    highlights: [
      { name: 'Circle C Metro Park', description: '40+ acres with sports fields, playground, and splash pad.' },
      { name: 'Lady Bird Johnson Wildflower Center', description: 'World-class botanical garden just minutes away.' }
    ],
    avgPrice: '$650,000'
  },
  {
    name: 'Far West',
    slug: 'far-west',
    citySlug: 'austin',
    tagline: 'Classic Northwest Austin living with mature trees and central convenience.',
    vibe: 'Established and convenient. A mix of mid-century homes and newer construction with easy access to everything.',
    description: 'Far West is a well-established Northwest Austin neighborhood known for its mature landscaping, convenient location, and strong sense of community. Residents enjoy quick access to The Domain, MoPac, and downtown, along with excellent neighborhood schools and local shopping.',
    population: '~8,000',
    commute: { toDowntown: '15-20 mins', toDomain: '5-10 mins' },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Hill Elementary', type: 'Elementary', rating: 7 },
      { name: 'Murchison Middle School', type: 'Middle', rating: 5, note: 'IB World School' },
      { name: 'Anderson High School', type: 'High School', rating: 7, note: 'Strong IB program' }
    ],
    whyPeopleLove: [
      'Central Location: Minutes from The Domain, downtown, and UT Austin.',
      'Mature Trees: Established landscaping provides shade and character.',
      'Neighborhood Feel: Local shops, restaurants, and a true community atmosphere.'
    ],
    highlights: [
      { name: 'Far West Blvd Shopping', description: 'Local restaurants, grocery stores, and services.' },
      { name: 'Northwest Recreation Center', description: 'City pool, gym, and community programs.' }
    ],
    avgPrice: '$550,000'
  },
  {
    name: 'Great Hills',
    slug: 'great-hills',
    citySlug: 'austin',
    tagline: 'Arboretum-area living with tech convenience and natural beauty.',
    vibe: 'Professional and polished. Popular with tech workers for its proximity to major employers and upscale amenities.',
    description: 'Great Hills offers an ideal location near the Arboretum shopping district and major tech employers. The neighborhood features a mix of single-family homes and condos, with easy access to dining, entertainment, and the Domain. Its central northwest location makes commuting simple in any direction.',
    population: '~6,500',
    commute: { toDowntown: '15-20 mins', toDomain: '5 mins' },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Great Hills Elementary', type: 'Elementary', rating: 6 },
      { name: 'Murchison Middle School', type: 'Middle', rating: 5 },
      { name: 'Anderson High School', type: 'High School', rating: 7 }
    ],
    whyPeopleLove: [
      'Tech Hub Location: Walking distance to major employers and The Domain.',
      'Shopping & Dining: The Arboretum offers upscale retail and restaurants.',
      'Easy Commute: Central location with quick access to all parts of Austin.'
    ],
    highlights: [
      { name: 'The Arboretum', description: 'Outdoor shopping center with upscale retailers and restaurants.' },
      { name: 'Great Hills Country Club', description: 'Private golf course and social club.' }
    ],
    avgPrice: '$600,000'
  },
  {
    name: 'Mueller',
    slug: 'mueller',
    citySlug: 'austin',
    tagline: 'Austin\'s award-winning urban village on the former airport site.',
    vibe: 'Modern and walkable. A nationally-recognized new urbanist development with diverse housing and community focus.',
    description: 'Mueller is a 700-acre master-planned community built on Austin\'s former municipal airport. This award-winning development features diverse housing options, extensive parks, local retail, and excellent walkability. It\'s become one of Austin\'s most sought-after neighborhoods for its urban village atmosphere.',
    population: '~10,000 at buildout',
    commute: { toDowntown: '10-15 mins', toDomain: '15-20 mins' },
    schoolDistrict: 'Austin ISD',
    schools: [
      { name: 'Blanton Elementary', type: 'Elementary', rating: 6 },
      { name: 'Webb Middle School', type: 'Middle', rating: 4 },
      { name: 'LBJ Early College High School', type: 'High School', rating: 5 }
    ],
    whyPeopleLove: [
      'Walkability: Live, work, shop, and dine all within walking distance.',
      'Parks & Trails: Lake Park, Southwest Greenway, and miles of trails.',
      'Community Design: Front porches, alley-loaded garages, and neighborhood gathering spaces.'
    ],
    highlights: [
      { name: 'Thinkery Children\'s Museum', description: 'Interactive science museum for kids.' },
      { name: 'Mueller Lake Park', description: '30-acre park with lake, amphitheater, and playground.' }
    ],
    avgPrice: '$700,000'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BEE CAVE (4)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Falconhead',
    slug: 'falconhead',
    citySlug: 'bee-cave',
    tagline: 'Golf course luxury with Hill Country charm.',
    vibe: 'Upscale golf community with resort-style amenities and stunning views.',
    description: 'Falconhead is a premier golf course community offering custom homes on large lots with Hill Country views. The community features excellent amenities including pools, tennis courts, and direct access to world-class golf.',
    population: '~2,500',
    commute: { toDowntown: '25-35 mins', toDomain: '30-40 mins' },
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
    avgPrice: '$950,000'
  },
  {
    name: 'Hills of Lakeway',
    slug: 'hills-of-lakeway',
    citySlug: 'bee-cave',
    tagline: 'Private golf club living with spectacular Hill Country views.',
    vibe: 'Exclusive and serene. Gated sections with custom estates and championship golf.',
    description: 'The Hills of Lakeway offers prestigious living centered around The Hills Country Club. With multiple golf courses, tennis facilities, and stunning Hill Country views, this established community attracts those seeking privacy, recreation, and natural beauty.',
    population: '~3,000',
    commute: { toDowntown: '30-40 mins', toDomain: '35-45 mins' },
    schoolDistrict: 'Lake Travis ISD',
    schools: [
      { name: 'Lake Travis Elementary', type: 'Elementary', rating: 8 },
      { name: 'Lake Travis Middle School', type: 'Middle', rating: 8 },
      { name: 'Lake Travis High School', type: 'High School', rating: 9 }
    ],
    whyPeopleLove: [
      'Championship Golf: Two 18-hole courses designed by Jack Nicklaus and Arnold Palmer.',
      'Privacy: Gated sections and large wooded lots provide seclusion.',
      'Club Amenities: Tennis, fitness, dining, and social events at the country club.'
    ],
    highlights: [
      { name: 'The Hills Country Club', description: 'Private club with world-class golf and tennis.' },
      { name: 'Flintrock Falls Course', description: 'Dramatic Hill Country golf with waterfall features.' }
    ],
    avgPrice: '$1,100,000'
  },
  {
    name: 'Lake Pointe',
    slug: 'lake-pointe',
    citySlug: 'bee-cave',
    tagline: 'Family-friendly Bee Cave living with top schools and convenience.',
    vibe: 'Suburban comfort with excellent schools and easy access to shopping and nature.',
    description: 'Lake Pointe offers the best of Bee Cave living with established homes, mature landscaping, and access to Lake Travis ISD\'s acclaimed schools. The community provides a quieter alternative to larger developments while maintaining proximity to Hill Country Galleria shopping and dining.',
    population: '~2,000',
    commute: { toDowntown: '25-35 mins', toDomain: '30-40 mins' },
    schoolDistrict: 'Lake Travis ISD',
    schools: [
      { name: 'Lake Pointe Elementary', type: 'Elementary', rating: 8 },
      { name: 'Bee Cave Middle School', type: 'Middle', rating: 8 },
      { name: 'Lake Travis High School', type: 'High School', rating: 9 }
    ],
    whyPeopleLove: [
      'Neighborhood Elementary: Lake Pointe has its own well-rated elementary school.',
      'Mature Community: Established landscaping and known neighbors create stability.',
      'Convenient Location: Close to Galleria shopping while maintaining residential quiet.'
    ],
    highlights: [
      { name: 'Lake Pointe Park', description: 'Community park with playground and sports facilities.' },
      { name: 'Bee Cave Central Park', description: 'Nearby splash pad, trails, and amphitheater.' }
    ],
    avgPrice: '$750,000'
  },
  {
    name: 'Spanish Oaks',
    slug: 'spanish-oaks',
    citySlug: 'bee-cave',
    tagline: 'Exclusive gated luxury with private golf.',
    vibe: 'Ultra-private and prestigious. Gated enclave with multi-million dollar estates.',
    description: 'Spanish Oaks is Bee Cave\'s most exclusive address, a gated community featuring custom estate homes, a private Bobby Jones-designed golf course, and spectacular Hill Country views. This is where Austin\'s elite retreat.',
    population: '~400 homesites',
    commute: { toDowntown: '30-40 mins', toDomain: '35-45 mins' },
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
    avgPrice: '$2,500,000'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CEDAR PARK (6)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Buttercup Creek',
    slug: 'buttercup-creek',
    citySlug: 'cedar-park',
    tagline: 'Mature trees and established charm in prime Cedar Park.',
    vibe: 'Well-established with mature landscaping and strong neighborhood identity.',
    description: 'Buttercup Creek offers the charm of mature trees and established landscaping that newer developments can\'t match. This neighborhood provides excellent value, strong schools, and a true community atmosphere.',
    population: '~5,500',
    commute: { toDowntown: '25-35 mins', toDomain: '12-18 mins' },
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
    avgPrice: '$475,000'
  },
  {
    name: 'Cypress Canyon',
    slug: 'cypress-canyon',
    citySlug: 'cedar-park',
    tagline: 'Hill Country beauty with family-focused amenities.',
    vibe: 'Natural and active. Built around preserved green spaces with extensive trails.',
    description: 'Cypress Canyon offers Hill Country living within Cedar Park city limits. The community is built around natural cypress groves and features an extensive trail system, community pools, and access to excellent Leander ISD schools.',
    population: '~4,000',
    commute: { toDowntown: '30-40 mins', toDomain: '15-20 mins' },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Cypress Elementary', type: 'Elementary', rating: 8 },
      { name: 'Running Brushy Middle School', type: 'Middle', rating: 7 },
      { name: 'Vista Ridge High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Natural Beauty: Preserved cypress groves and Hill Country topography.',
      'Trail System: Miles of greenbelt trails connect throughout the community.',
      'Family Amenities: Multiple pools, playgrounds, and community gathering spaces.'
    ],
    highlights: [
      { name: 'Cypress Canyon Trail System', description: 'Extensive trails through natural areas.' },
      { name: 'Community Pool Complex', description: 'Resort-style pool with splash features.' }
    ],
    avgPrice: '$550,000'
  },
  {
    name: 'Deer Creek',
    slug: 'deer-creek',
    citySlug: 'cedar-park',
    tagline: 'Established Cedar Park neighborhood with proven value.',
    vibe: 'Comfortable and convenient. A reliable choice for families seeking quality without premium pricing.',
    description: 'Deer Creek is an established Cedar Park neighborhood known for its family-friendly atmosphere and excellent location. With easy access to toll roads, shopping, and highly-rated Leander ISD schools, it offers proven value for homebuyers.',
    population: '~3,500',
    commute: { toDowntown: '25-35 mins', toDomain: '12-15 mins' },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Deer Creek Elementary', type: 'Elementary', rating: 7 },
      { name: 'Cedar Park Middle School', type: 'Middle', rating: 7 },
      { name: 'Cedar Park High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Established Community: Known neighbors and predictable home values.',
      'School Quality: Deer Creek Elementary feeds into strong middle and high schools.',
      'Access: Quick toll road access to major employers.'
    ],
    highlights: [
      { name: 'Deer Creek Park', description: 'Neighborhood park with playground and picnic areas.' },
      { name: '1890 Ranch', description: 'Nearby shopping center with restaurants and retail.' }
    ],
    avgPrice: '$450,000'
  },
  {
    name: 'Ranch at Brushy Creek',
    slug: 'ranch-at-brushy-creek',
    citySlug: 'cedar-park',
    tagline: 'Master-planned community with award-winning amenities.',
    vibe: 'Resort-style living with extensive amenities and strong community programming.',
    description: 'Ranch at Brushy Creek is a premier master-planned community featuring extensive trails, multiple pools, sports courts, and community gathering spaces. The neighborhood is known for its active HOA and family-focused events.',
    population: '~6,000',
    commute: { toDowntown: '25-35 mins', toDomain: '10-15 mins' },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Whitestone Elementary', type: 'Elementary', rating: 8 },
      { name: 'Running Brushy Middle School', type: 'Middle', rating: 7 },
      { name: 'Cedar Park High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Trail System: Miles of hike-and-bike trails connect to Brushy Creek Regional Trail.',
      'Community Events: Active HOA organizes seasonal events and activities.',
      'Amenity Centers: Multiple pools, sports courts, and gathering spaces.'
    ],
    highlights: [
      { name: 'The Ranch House', description: 'Community center with pool, gym, and event space.' },
      { name: 'Brushy Creek Regional Trail', description: 'Connection to miles of regional trails.' }
    ],
    avgPrice: '$525,000'
  },
  {
    name: 'Silverado West',
    slug: 'silverado-west',
    citySlug: 'cedar-park',
    tagline: 'Golf course community with upscale homes and country club access.',
    vibe: 'Refined and recreational. Custom homes along the Silverado Golf Course.',
    description: 'Silverado West offers upscale living in Cedar Park with homes overlooking the Silverado Golf Course. Residents enjoy country club access, beautiful views, and a prestigious address while maintaining proximity to Cedar Park amenities.',
    population: '~2,000',
    commute: { toDowntown: '25-35 mins', toDomain: '15-20 mins' },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Whitestone Elementary', type: 'Elementary', rating: 8 },
      { name: 'Cedar Park Middle School', type: 'Middle', rating: 7 },
      { name: 'Cedar Park High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Golf Course Views: Many homes overlook the fairways of Silverado Golf Course.',
      'Country Club Access: Golf, tennis, and dining available to residents.',
      'Upscale Homes: Larger lots and premium finishes attract discerning buyers.'
    ],
    highlights: [
      { name: 'Silverado Golf Course', description: 'Semi-private course with clubhouse and dining.' },
      { name: 'Silverado Community Pool', description: 'Resort-style pool for residents.' }
    ],
    avgPrice: '$650,000'
  },
  {
    name: 'Twin Creeks',
    slug: 'twin-creeks',
    citySlug: 'cedar-park',
    tagline: 'Family-focused living with excellent schools and modern amenities.',
    vibe: 'Established suburban community with tree-lined streets and active families.',
    description: 'Twin Creeks is one of Cedar Park\'s most sought-after neighborhoods, offering quality homes, excellent Leander ISD schools, and a strong sense of community. The neighborhood features multiple pools, parks, and easy access to shopping and dining.',
    population: '~4,000',
    commute: { toDowntown: '25-35 mins', toDomain: '15-20 mins' },
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
    avgPrice: '$550,000'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GEORGETOWN (4)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Berry Creek',
    slug: 'berry-creek',
    citySlug: 'georgetown',
    tagline: 'Golf course community with family appeal and natural beauty.',
    vibe: 'Established golf community surrounded by nature with homes for all stages of life.',
    description: 'Berry Creek Country Club community offers beautiful homes along a championship golf course, with the added bonus of excellent Georgetown ISD schools. Natural creeks and wooded areas provide a peaceful setting for families and golf enthusiasts alike.',
    population: '~3,500',
    commute: { toDowntown: '35-45 mins', toDomain: '25-35 mins' },
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
    avgPrice: '$550,000'
  },
  {
    name: 'Cimarron Hills',
    slug: 'cimarron-hills',
    citySlug: 'georgetown',
    tagline: 'Exclusive Hill Country estates with private golf.',
    vibe: 'Ultra-luxury and private. Custom estates on large lots with world-class golf.',
    description: 'Cimarron Hills is Georgetown\'s most exclusive address, featuring custom estate homes on 1-5 acre lots surrounding a private Jack Nicklaus Signature golf course. This gated community offers the ultimate in Hill Country luxury living.',
    population: '~300 homesites',
    commute: { toDowntown: '35-45 mins', toDomain: '30-40 mins' },
    schoolDistrict: 'Georgetown ISD',
    schools: [
      { name: 'Carver Elementary', type: 'Elementary', rating: 7 },
      { name: 'Georgetown High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Private Golf: Jack Nicklaus Signature course exclusively for members.',
      'Estate Living: Custom homes on 1-5 acre lots with panoramic views.',
      'Privacy: Gated community with limited homesites ensures exclusivity.'
    ],
    highlights: [
      { name: 'Cimarron Hills Golf Club', description: 'Private Jack Nicklaus Signature course.' },
      { name: 'Hill Country Views', description: 'Dramatic vistas of the Texas Hill Country.' }
    ],
    avgPrice: '$1,500,000'
  },
  {
    name: 'Sun City',
    slug: 'sun-city',
    citySlug: 'georgetown',
    tagline: 'Premier 55+ active adult community with resort living.',
    vibe: 'Active retirement paradise with endless amenities and social activities.',
    description: 'Sun City Texas is the premier 55+ active adult community in the Austin area, offering resort-style living with three golf courses, multiple pools, fitness centers, and over 50 clubs and groups. It\'s where active adults come to thrive.',
    population: '~15,000 residents',
    commute: { toDowntown: '35-45 mins', toDomain: '25-35 mins' },
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
    avgPrice: '$425,000'
  },
  {
    name: 'Wolf Ranch',
    slug: 'wolf-ranch',
    citySlug: 'georgetown',
    tagline: 'Modern master-planned community with urban conveniences.',
    vibe: 'New and vibrant. Mixed-use development with homes, retail, and entertainment.',
    description: 'Wolf Ranch is Georgetown\'s newest master-planned community, combining residential living with the Wolf Ranch Town Center. Residents enjoy walkable access to shopping, dining, and entertainment while living in modern, well-designed homes.',
    population: '~5,000 at buildout',
    commute: { toDowntown: '35-45 mins', toDomain: '25-30 mins' },
    schoolDistrict: 'Georgetown ISD',
    schools: [
      { name: 'Wolf Ranch Elementary', type: 'Elementary', rating: 8 },
      { name: 'Forbes Middle School', type: 'Middle', rating: 7 },
      { name: 'East View High School', type: 'High School', rating: 7 }
    ],
    whyPeopleLove: [
      'Walkability: Walk to restaurants, shopping, and entertainment at Wolf Ranch Town Center.',
      'New Construction: Modern floor plans with latest home technology.',
      'Convenience: Full amenities within the community reduce the need to travel.'
    ],
    highlights: [
      { name: 'Wolf Ranch Town Center', description: 'Mixed-use development with retail, dining, and services.' },
      { name: 'Community Amenity Center', description: 'Pool, fitness center, and gathering spaces.' }
    ],
    avgPrice: '$500,000'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LAKEWAY (3)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Lakeway Proper',
    slug: 'lakeway-proper',
    citySlug: 'lakeway',
    tagline: 'Lakeside luxury with world-class golf and resort amenities.',
    vibe: 'Upscale resort community with Lake Travis access and country club living.',
    description: 'Lakeway offers the ultimate Hill Country lakeside lifestyle with access to Lake Travis, multiple golf courses, and the Lakeway Resort & Spa. Custom homes range from waterfront estates to golf course villas.',
    population: '~18,000 (City of Lakeway)',
    commute: { toDowntown: '30-40 mins', toDomain: '35-45 mins' },
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
    avgPrice: '$850,000'
  },
  {
    name: 'Rough Hollow',
    slug: 'rough-hollow',
    citySlug: 'lakeway',
    tagline: 'Modern lakeside master-plan with yacht club and trails.',
    vibe: 'Contemporary luxury community with marina, trails, and Hill Country beauty.',
    description: 'Rough Hollow is Lakeway\'s premier master-planned community featuring a private yacht club, marina, extensive trails, and stunning Hill Country architecture. This newer development offers modern amenities while preserving natural beauty.',
    population: '~2,000 homes at buildout',
    commute: { toDowntown: '30-40 mins', toDomain: '35-45 mins' },
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
    avgPrice: '$750,000'
  },
  {
    name: 'The Hills Lakeway',
    slug: 'the-hills-lakeway',
    citySlug: 'lakeway',
    tagline: 'Prestigious golf community with Hill Country elegance.',
    vibe: 'Established luxury with championship golf and panoramic views.',
    description: 'The Hills Lakeway is an established golf course community offering custom homes, spectacular views, and access to The Hills Country Club. With mature landscaping and proven home values, it represents Lakeway living at its finest.',
    population: '~2,500',
    commute: { toDowntown: '30-40 mins', toDomain: '35-45 mins' },
    schoolDistrict: 'Lake Travis ISD',
    schools: [
      { name: 'Lake Travis Elementary', type: 'Elementary', rating: 8 },
      { name: 'Hudson Bend Middle School', type: 'Middle', rating: 8 },
      { name: 'Lake Travis High School', type: 'High School', rating: 9 }
    ],
    whyPeopleLove: [
      'Championship Golf: Multiple courses designed by golf legends.',
      'Established Community: Mature trees and known neighbors provide stability.',
      'Views: Hill Country and lake views from many homesites.'
    ],
    highlights: [
      { name: 'The Hills Country Club', description: 'Private club with golf, tennis, and dining.' },
      { name: 'Lakeway City Park', description: 'Nearby park with sports facilities and trails.' }
    ],
    avgPrice: '$900,000'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LEANDER (5)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Bryson',
    slug: 'bryson',
    citySlug: 'leander',
    tagline: 'New master-plan with resort amenities and modern design.',
    vibe: 'Fresh and family-focused. New homes with community amenities and excellent schools.',
    description: 'Bryson is one of Leander\'s newest master-planned communities, featuring modern homes, resort-style amenities, and access to top-rated Leander ISD schools. The community offers excellent value for families seeking new construction.',
    population: '~3,000 at buildout',
    commute: { toDowntown: '35-45 mins', toDomain: '25-35 mins' },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Rutledge Elementary', type: 'Elementary', rating: 7 },
      { name: 'Leander Middle School', type: 'Middle', rating: 7 },
      { name: 'Leander High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'New Construction: Modern floor plans with energy-efficient features.',
      'Value: Excellent pricing for quality homes and amenities.',
      'Amenities: Resort-style pool, splash pad, and community gathering spaces.'
    ],
    highlights: [
      { name: 'Bryson Amenity Center', description: 'Pool, playground, and community gathering space.' },
      { name: 'Capital Metro Rail', description: 'Nearby access to commuter rail into Austin.' }
    ],
    avgPrice: '$450,000'
  },
  {
    name: 'Cold Springs',
    slug: 'cold-springs',
    citySlug: 'leander',
    tagline: 'Master-planned community with springs-fed amenities.',
    vibe: 'Natural and refreshing. Built around natural springs with extensive green spaces.',
    description: 'Cold Springs is named for the natural springs that flow through the community. This master-planned neighborhood features unique water features, extensive trails, and access to highly-rated Leander ISD schools.',
    population: '~4,000',
    commute: { toDowntown: '35-45 mins', toDomain: '25-35 mins' },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Cold Springs Elementary', type: 'Elementary', rating: 8 },
      { name: 'Running Brushy Middle School', type: 'Middle', rating: 7 },
      { name: 'Vista Ridge High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Natural Springs: Unique water features throughout the community.',
      'Trail System: Extensive trails connect homes to schools and amenities.',
      'Newer Homes: Mix of established sections and new construction.'
    ],
    highlights: [
      { name: 'Spring Creek', description: 'Natural spring-fed creek running through the community.' },
      { name: 'Cold Springs Amenity Center', description: 'Pool, playgrounds, and sports courts.' }
    ],
    avgPrice: '$500,000'
  },
  {
    name: 'Crystal Falls',
    slug: 'crystal-falls',
    citySlug: 'leander',
    tagline: 'Golf course master-plan with resort amenities and family focus.',
    vibe: 'Active family community with golf, pools, and excellent schools.',
    description: 'Crystal Falls is a master-planned community centered around the Crystal Falls Golf Club. With excellent Leander ISD schools, multiple amenity centers, and a true neighborhood feel, it\'s become one of the most popular destinations for growing families.',
    population: '~8,000',
    commute: { toDowntown: '30-40 mins', toDomain: '20-30 mins' },
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
    avgPrice: '$525,000'
  },
  {
    name: 'Mason Hills',
    slug: 'mason-hills',
    citySlug: 'leander',
    tagline: 'Hill Country living with nature preserve and trails.',
    vibe: 'Natural and scenic. Built around preserved open spaces with wildlife.',
    description: 'Mason Hills offers Hill Country living in Leander with homes built around preserved natural areas. The community features extensive trails, scenic views, and a focus on outdoor living while providing excellent school access.',
    population: '~3,000',
    commute: { toDowntown: '35-45 mins', toDomain: '25-35 mins' },
    schoolDistrict: 'Leander ISD',
    schools: [
      { name: 'Mason Elementary', type: 'Elementary', rating: 8 },
      { name: 'Running Brushy Middle School', type: 'Middle', rating: 7 },
      { name: 'Vista Ridge High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Nature Preserve: Protected green spaces provide wildlife habitat and scenic beauty.',
      'Trail System: Miles of trails for walking, running, and biking.',
      'Hill Country Views: Elevated homesites offer panoramic vistas.'
    ],
    highlights: [
      { name: 'Mason Hills Nature Preserve', description: 'Protected natural areas with wildlife.' },
      { name: 'Community Trails', description: 'Connected trail system throughout the neighborhood.' }
    ],
    avgPrice: '$550,000'
  },
  {
    name: 'Travisso',
    slug: 'travisso',
    citySlug: 'leander',
    tagline: 'Hill Country views with Italian-inspired design.',
    vibe: 'Tuscan-inspired community with dramatic views and upscale amenities.',
    description: 'Travisso brings Tuscan elegance to the Texas Hill Country with Italian-inspired architecture, dramatic hilltop views, and exceptional amenities. This master-planned community offers a resort lifestyle with excellent Leander ISD schools.',
    population: '~3,500',
    commute: { toDowntown: '35-45 mins', toDomain: '25-35 mins' },
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
    avgPrice: '$650,000'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PFLUGERVILLE (5)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Avalon',
    slug: 'avalon',
    citySlug: 'pflugerville',
    tagline: 'Master-planned community with resort-style amenities.',
    vibe: 'Modern and active. Newer homes with extensive community features.',
    description: 'Avalon is a master-planned community in Pflugerville offering modern homes with resort-style amenities. The community features multiple pools, trails, and gathering spaces while providing access to Pflugerville ISD schools.',
    population: '~4,500',
    commute: { toDowntown: '25-35 mins', toDomain: '20-30 mins' },
    schoolDistrict: 'Pflugerville ISD',
    schools: [
      { name: 'Windermere Elementary', type: 'Elementary', rating: 7 },
      { name: 'Westview Middle School', type: 'Middle', rating: 6 },
      { name: 'Weiss High School', type: 'High School', rating: 7 }
    ],
    whyPeopleLove: [
      'Amenities: Resort-style pools, splash pads, and community gathering spaces.',
      'New Homes: Modern floor plans with current design features.',
      'Value: Quality amenities at accessible price points.'
    ],
    highlights: [
      { name: 'Avalon Amenity Center', description: 'Pool, fitness center, and event space.' },
      { name: 'Trail System', description: 'Connected trails throughout the community.' }
    ],
    avgPrice: '$425,000'
  },
  {
    name: 'Blackhawk',
    slug: 'blackhawk',
    citySlug: 'pflugerville',
    tagline: 'Golf course community with family values and diverse charm.',
    vibe: 'Welcoming and diverse community centered around championship golf.',
    description: 'Blackhawk is Pflugerville\'s premier golf course community, offering homes along the Blackhawk Golf Club with excellent Pflugerville ISD schools. The neighborhood is known for its diversity, friendliness, and family-oriented atmosphere.',
    population: '~4,500',
    commute: { toDowntown: '20-30 mins', toDomain: '15-25 mins' },
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
    avgPrice: '$450,000'
  },
  {
    name: 'Falcon Pointe',
    slug: 'falcon-pointe',
    citySlug: 'pflugerville',
    tagline: 'Master-planned family community with top-rated schools.',
    vibe: 'Active, family-focused community with excellent amenities and strong schools.',
    description: 'Falcon Pointe is a master-planned community that has become synonymous with family living in Pflugerville. With multiple pools, playgrounds, sports facilities, and access to top-rated schools, it\'s where growing families thrive.',
    population: '~3,000',
    commute: { toDowntown: '25-35 mins', toDomain: '20-30 mins' },
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
    avgPrice: '$475,000'
  },
  {
    name: 'Springbrook',
    slug: 'springbrook',
    citySlug: 'pflugerville',
    tagline: 'Established Pflugerville neighborhood with proven value.',
    vibe: 'Comfortable and convenient. A reliable choice with mature landscaping.',
    description: 'Springbrook is an established Pflugerville neighborhood offering mature trees, known home values, and convenient access to I-35 and SH-130. The community provides affordable homeownership with proximity to employment centers.',
    population: '~3,500',
    commute: { toDowntown: '20-30 mins', toDomain: '15-25 mins' },
    schoolDistrict: 'Pflugerville ISD',
    schools: [
      { name: 'Springhill Elementary', type: 'Elementary', rating: 6 },
      { name: 'Park Crest Middle School', type: 'Middle', rating: 6 },
      { name: 'Pflugerville High School', type: 'High School', rating: 7 }
    ],
    whyPeopleLove: [
      'Affordability: Entry-level pricing for Pflugerville living.',
      'Location: Quick access to major highways and employers.',
      'Established: Mature trees and known neighbors.'
    ],
    highlights: [
      { name: 'Springbrook Park', description: 'Neighborhood park with playground and sports fields.' },
      { name: 'Stone Hill Town Center', description: 'Nearby shopping with H-E-B and retail.' }
    ],
    avgPrice: '$375,000'
  },
  {
    name: 'Villages of Hidden Lake',
    slug: 'villages-of-hidden-lake',
    citySlug: 'pflugerville',
    tagline: 'Lakefront living in Pflugerville with natural beauty.',
    vibe: 'Serene and scenic. Homes around a natural lake with trails and wildlife.',
    description: 'Villages of Hidden Lake offers unique lakefront living in Pflugerville. The community is built around a natural lake, providing scenic water views, fishing, kayaking, and an extensive trail system.',
    population: '~2,500',
    commute: { toDowntown: '25-35 mins', toDomain: '20-30 mins' },
    schoolDistrict: 'Pflugerville ISD',
    schools: [
      { name: 'Highland Park Elementary', type: 'Elementary', rating: 7 },
      { name: 'Kelly Lane Middle School', type: 'Middle', rating: 7 },
      { name: 'Hendrickson High School', type: 'High School', rating: 7 }
    ],
    whyPeopleLove: [
      'Lake Living: Natural lake provides water views and recreational opportunities.',
      'Trails: Extensive trail system connects around the lake and throughout the community.',
      'Wildlife: Natural setting attracts birds, fish, and other wildlife.'
    ],
    highlights: [
      { name: 'Hidden Lake', description: 'Natural lake with fishing, kayaking, and waterfront trails.' },
      { name: 'Lakefront Park', description: 'Community park with pavilion and lake access.' }
    ],
    avgPrice: '$500,000'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ROUND ROCK (5)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Brushy Creek',
    slug: 'brushy-creek',
    citySlug: 'round-rock',
    tagline: 'Established charm with parks, trails, and strong schools.',
    vibe: 'Mature, tree-lined community with exceptional outdoor amenities.',
    description: 'Brushy Creek is one of Round Rock\'s most established and desirable neighborhoods, known for its mature trees, extensive hike-and-bike trails, and access to excellent Round Rock ISD schools. The community offers various price points across its multiple sections.',
    population: '~15,000',
    commute: { toDowntown: '25-35 mins', toDomain: '10-15 mins' },
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
    avgPrice: '$500,000'
  },
  {
    name: 'Forest Creek',
    slug: 'forest-creek',
    citySlug: 'round-rock',
    tagline: 'Golf course community with family appeal and strong schools.',
    vibe: 'Active and friendly. Championship golf with family-focused amenities.',
    description: 'Forest Creek is a premier golf course community in Round Rock offering homes along the Forest Creek Golf Club. With excellent Round Rock ISD schools and an active community atmosphere, it appeals to golfers and families alike.',
    population: '~6,000',
    commute: { toDowntown: '30-40 mins', toDomain: '15-20 mins' },
    schoolDistrict: 'Round Rock ISD',
    schools: [
      { name: 'Forest Creek Elementary', type: 'Elementary', rating: 8 },
      { name: 'Ridgeview Middle School', type: 'Middle', rating: 7 },
      { name: 'Round Rock High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Golf: Forest Creek Golf Club offers championship golf open to residents.',
      'Schools: Forest Creek Elementary is highly rated and feeds into strong secondary schools.',
      'Community: Active HOA and regular neighborhood events create connections.'
    ],
    highlights: [
      { name: 'Forest Creek Golf Club', description: 'Championship course with clubhouse and pro shop.' },
      { name: 'Forest Creek Amenity Center', description: 'Pool, playground, and community gathering space.' }
    ],
    avgPrice: '$550,000'
  },
  {
    name: 'Paloma Lake',
    slug: 'paloma-lake',
    citySlug: 'round-rock',
    tagline: 'Master-planned community with lake amenities and modern homes.',
    vibe: 'Contemporary and active. New homes with waterfront recreation.',
    description: 'Paloma Lake is a master-planned community featuring homes around a 65-acre lake. With kayaking, fishing, resort-style pools, and access to Round Rock ISD schools, it offers modern living with outdoor recreation.',
    population: '~4,000 at buildout',
    commute: { toDowntown: '30-40 mins', toDomain: '15-20 mins' },
    schoolDistrict: 'Round Rock ISD',
    schools: [
      { name: 'Cactus Ranch Elementary', type: 'Elementary', rating: 7 },
      { name: 'Cedar Valley Middle School', type: 'Middle', rating: 7 },
      { name: 'Stony Point High School', type: 'High School', rating: 8 }
    ],
    whyPeopleLove: [
      'Lake Amenities: 65-acre lake with kayaking, fishing, and lakefront trails.',
      'New Construction: Modern floor plans with contemporary design.',
      'Amenities: Resort-style pools, splash pads, and community events.'
    ],
    highlights: [
      { name: 'Paloma Lake', description: '65-acre lake with water activities and lakefront trails.' },
      { name: 'The Landing', description: 'Lakefront amenity center with pool and event space.' }
    ],
    avgPrice: '$525,000'
  },
  {
    name: 'Teravista',
    slug: 'teravista',
    citySlug: 'round-rock',
    tagline: 'Master-planned golf community with resort living.',
    vibe: 'Modern master-plan with golf course, pools, and family amenities.',
    description: 'Teravista is Round Rock\'s premier master-planned community featuring the Teravista Golf Club, multiple amenity centers, and excellent Round Rock ISD schools. With diverse home options and resort-style amenities, it appeals to families at all stages.',
    population: '~8,000',
    commute: { toDowntown: '30-40 mins', toDomain: '15-20 mins' },
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
    avgPrice: '$550,000'
  },
  {
    name: 'Walsh Ranch',
    slug: 'walsh-ranch',
    citySlug: 'round-rock',
    tagline: 'Upscale living with top schools and resort amenities.',
    vibe: 'Executive-level homes with country club atmosphere and premium schools.',
    description: 'Walsh Ranch represents upscale suburban living at its finest, with larger executive homes, premium amenities, and access to the highly-rated Walsh Elementary cluster. This established community attracts families seeking the best of Round Rock.',
    population: '~3,500',
    commute: { toDowntown: '25-35 mins', toDomain: '10-15 mins' },
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
    avgPrice: '$700,000'
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// SEED FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

async function seedCities(): Promise<Record<string, string>> {
  console.log('\n📍 Seeding cities...')
  const cityIdMap: Record<string, string> = {}

  // Check for existing cities
  const existingCities = await client.fetch(`*[_type == "city"]{ _id, "slug": slug.current }`)
  for (const c of existingCities) {
    cityIdMap[c.slug] = c._id
    console.log(`  ✓ Found existing: ${c.slug}`)
  }

  // Create missing cities
  for (const city of cities) {
    if (!cityIdMap[city.slug]) {
      const created = await client.create({
        _type: 'city',
        name: city.name,
        slug: { _type: 'slug', current: city.slug },
        description: city.description,
        order: city.order,
      })
      cityIdMap[city.slug] = created._id
      console.log(`  + Created: ${city.name}`)
    }
  }

  console.log(`  Total cities: ${Object.keys(cityIdMap).length}`)
  return cityIdMap
}

async function linkExistingCommunities(cityIdMap: Record<string, string>): Promise<number> {
  console.log('\n🔗 Linking existing communities to Austin...')
  const austinId = cityIdMap['austin']
  if (!austinId) {
    console.log('  ⚠ Austin city not found, skipping')
    return 0
  }

  const communitiesWithoutCity = await client.fetch(
    `*[_type == "neighborhood" && !defined(city)]{ _id, name }`
  )

  let linkedCount = 0
  for (const c of communitiesWithoutCity) {
    await client.patch(c._id).set({ city: { _type: 'reference', _ref: austinId } }).commit()
    console.log(`  → Linked: ${c.name}`)
    linkedCount++
  }

  console.log(`  Total linked: ${linkedCount}`)
  return linkedCount
}

async function seedNewCommunities(cityIdMap: Record<string, string>): Promise<number> {
  console.log('\n🏘️ Seeding new communities...')

  // Get existing community slugs
  const existingSlugs = await client.fetch(`*[_type == "neighborhood"]{ "slug": slug.current }`)
  const existingSet = new Set(existingSlugs.map((c: { slug: string }) => c.slug))

  let createdCount = 0
  for (const comm of newCommunities) {
    if (existingSet.has(comm.slug)) {
      console.log(`  ✓ Exists: ${comm.name}`)
      continue
    }

    const cityId = cityIdMap[comm.citySlug]
    if (!cityId) {
      console.log(`  ⚠ Skipping ${comm.name}: city ${comm.citySlug} not found`)
      continue
    }

    await client.create({
      _type: 'neighborhood',
      name: comm.name,
      slug: { _type: 'slug', current: comm.slug },
      city: { _type: 'reference', _ref: cityId },
      tagline: comm.tagline,
      vibe: comm.vibe,
      description: comm.description,
      population: comm.population,
      commute: comm.commute,
      schoolDistrict: comm.schoolDistrict,
      schools: comm.schools?.map((s, idx) => ({ _key: `s-${idx}`, ...s })) || [],
      whyPeopleLove: comm.whyPeopleLove,
      highlights: comm.highlights?.map((h, idx) => ({ _key: `h-${idx}`, ...h })) || [],
      avgPrice: comm.avgPrice,
      order: createdCount + 1,
      isActive: true,
    })
    console.log(`  + Created: ${comm.name} (${comm.citySlug})`)
    createdCount++
  }

  console.log(`  Total created: ${createdCount}`)
  return createdCount
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('  SEED COMMUNITIES SCRIPT')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)

  try {
    // Step 1: Seed cities
    const cityIdMap = await seedCities()

    // Step 2: Link existing communities to Austin
    const linkedCount = await linkExistingCommunities(cityIdMap)

    // Step 3: Create new communities
    const createdCount = await seedNewCommunities(cityIdMap)

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('  COMPLETE!')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`  Cities: ${Object.keys(cityIdMap).length}`)
    console.log(`  Existing communities linked: ${linkedCount}`)
    console.log(`  New communities created: ${createdCount}`)

    // Final count
    const totalCommunities = await client.fetch(`count(*[_type == "neighborhood"])`)
    console.log(`  Total communities in Sanity: ${totalCommunities}`)

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
