// ═══════════════════════════════════════════════════════════════════════════
// SANITY GROQ QUERIES
// All queries that include tenant filtering for data isolation
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// AGENT SETTINGS QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get agent settings by domain
 * CRITICAL: This is the foundation of multi-tenancy
 */
export const AGENT_SETTINGS_BY_DOMAIN = `
  *[_type == "agentSettings" && domain == $currentDomain][0] {
    _id,
    domain,
    agentName,
    agentTitle,
    agentBio,
    agentImage,
    brokerageName,
    brokerageLogo,
    branding {
      primaryColor,
      secondaryColor,
      accentColor,
      fontHeading,
      fontBody,
      logoUrl,
      logoAlt,
      faviconUrl
    },
    contactInfo {
      email,
      phone,
      address,
      city,
      state,
      zip
    },
    socialLinks,
    legalFooter,
    aiSettings {
      maxDailyBudget,
      customSystemPromptAdditions,
      enabledFeatures
    },
    heroVideo {
      url,
      posterImage
    },
    heroImage,
    heroTagline,
    heroSubtagline,
    featuredPropertyIds,
    seoTitle,
    seoDescription
  }
`

/**
 * Get minimal agent settings for caching
 */
export const AGENT_SETTINGS_MINIMAL = `
  *[_type == "agentSettings" && domain == $currentDomain][0] {
    _id,
    domain,
    agentName,
    brokerageName,
    branding,
    contactInfo,
    heroTagline
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY QUERIES
// CRITICAL: All property queries MUST filter by belongs_to_agent
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all properties for a tenant
 */
export const PROPERTIES_BY_TENANT = `
  *[_type == "property" && belongsToAgent->domain == $currentDomain] | order(listDate desc) {
    _id,
    title,
    slug,
    status,
    price,
    address {
      street,
      city,
      state,
      zip,
      neighborhood
    },
    specs {
      bedrooms,
      bathrooms,
      squareFeet,
      propertyType
    },
    heroImage,
    shortDescription
  }
`

/**
 * Get active (listed) properties
 */
export const ACTIVE_PROPERTIES_BY_TENANT = `
  *[_type == "property" && belongsToAgent->domain == $currentDomain && status in ["active", "coming_soon"]] | order(listDate desc) {
    _id,
    title,
    slug,
    status,
    price,
    address {
      street,
      city,
      state,
      zip,
      neighborhood
    },
    specs {
      bedrooms,
      bathrooms,
      squareFeet,
      propertyType
    },
    heroImage,
    shortDescription
  }
`

/**
 * Get featured properties
 */
export const FEATURED_PROPERTIES_BY_TENANT = `
  *[_type == "property" && belongsToAgent->domain == $currentDomain && _id in $featuredIds] {
    _id,
    title,
    slug,
    status,
    price,
    address {
      street,
      city,
      state,
      zip,
      neighborhood
    },
    specs {
      bedrooms,
      bathrooms,
      squareFeet,
      propertyType
    },
    heroImage,
    shortDescription,
    highlights
  }
`

/**
 * Get single property by slug (with full details)
 * CRITICAL: Must verify tenant ownership
 */
export const PROPERTY_BY_SLUG = `
  *[_type == "property" && belongsToAgent->domain == $currentDomain && slug.current == $slug][0] {
    _id,
    title,
    slug,
    status,
    price,
    pricePerSqFt,
    address {
      street,
      unit,
      city,
      state,
      zip,
      neighborhood,
      county
    },
    specs {
      bedrooms,
      bathrooms,
      squareFeet,
      lotSize,
      lotSizeUnit,
      yearBuilt,
      parking,
      stories,
      propertyType
    },
    financials {
      hoaFees,
      hoaFrequency,
      taxAmount,
      taxYear
    },
    heroType,
    heroVideo {
      url,
      posterImage
    },
    heroImage,
    galleryImages,
    floorPlanImage,
    virtualTourUrl,
    headline,
    shortDescription,
    fullDescription,
    highlights,
    amenities,
    documentsPublic[] {
      _key,
      title,
      "fileUrl": file.asset->url,
      "fileType": file.asset->mimeType
    },
    listDate,
    soldDate,
    seoTitle,
    seoDescription,
    "agentName": belongsToAgent->agentName,
    "agentImage": belongsToAgent->agentImage,
    "agentPhone": belongsToAgent->contactInfo.phone,
    "agentEmail": belongsToAgent->contactInfo.email
  }
`

/**
 * Get property slugs for static generation
 */
export const ALL_PROPERTY_SLUGS = `
  *[_type == "property" && defined(slug.current)] {
    "slug": slug.current,
    "domain": belongsToAgent->domain
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE DEAL QUERIES (Private - Client Dashboard)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get deal for authenticated client
 * CRITICAL: Must verify both tenant AND client email
 */
export const DEAL_BY_CLIENT = `
  *[_type == "activeDeal" && 
    belongsToAgent->domain == $currentDomain && 
    clientEmail == $clientEmail][0] {
    _id,
    clientName,
    clientEmail,
    clientPhone,
    property-> {
      _id,
      title,
      address,
      price,
      heroImage
    },
    transactionStage,
    transactionType,
    offerPrice,
    contractPrice,
    earnestMoney,
    keyDates[] {
      _key,
      label,
      date,
      isCompleted,
      notes
    },
    dealDocumentsPrivate[] {
      _key,
      title,
      "fileUrl": file.asset->url,
      uploadedAt,
      category
    },
    notes,
    createdAt,
    updatedAt
  }
`

/**
 * Check if client has active deal
 */
export const HAS_ACTIVE_DEAL = `
  count(*[_type == "activeDeal" && 
    belongsToAgent->domain == $currentDomain && 
    clientEmail == $clientEmail]) > 0
`

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH & FILTER QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Search properties with filters
 */
export const SEARCH_PROPERTIES = `
  *[_type == "property" && 
    belongsToAgent->domain == $currentDomain &&
    status in $statuses &&
    price >= $minPrice && price <= $maxPrice &&
    specs.bedrooms >= $minBeds &&
    specs.bathrooms >= $minBaths
  ] | order(listDate desc) [$start...$end] {
    _id,
    title,
    slug,
    status,
    price,
    address {
      street,
      city,
      state,
      zip,
      neighborhood
    },
    specs {
      bedrooms,
      bathrooms,
      squareFeet,
      propertyType
    },
    heroImage,
    shortDescription
  }
`

/**
 * Get property count for pagination
 */
export const PROPERTY_COUNT = `
  count(*[_type == "property" && 
    belongsToAgent->domain == $currentDomain &&
    status in $statuses &&
    price >= $minPrice && price <= $maxPrice
  ])
`

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all domains for sitemap generation
 */
export const ALL_DOMAINS = `
  *[_type == "agentSettings"] {
    domain
  }
`

/**
 * Get all property URLs for sitemap
 */
export const SITEMAP_PROPERTIES = `
  *[_type == "property" && status in ["active", "pending", "sold"]] {
    "slug": slug.current,
    "domain": belongsToAgent->domain,
    "_updatedAt": _updatedAt
  }
`
