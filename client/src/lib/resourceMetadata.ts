// Resource metadata and categorization system
export type ResourceType = 'case-study' | 'blog-article' | 'testimonial';
export type Industry = 'SaaS' | 'FinTech' | 'E-commerce' | 'Healthcare' | 'Manufacturing' | 'DevOps';
export type UseCaseCategory = 'incident-response' | 'cost-optimization' | 'compliance' | 'performance' | 'security' | 'scalability';
export type Topic = 'AI' | 'Automation' | 'Best Practices' | 'Case Study' | 'Product Update' | 'Tutorial' | 'Observability' | 'Monitoring';

export interface ResourceMetadata {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  industries: Industry[];
  useCases: UseCaseCategory[];
  topics: Topic[];
  date: string;
  author: string;
  readTime?: number; // in minutes
  featured?: boolean;
}

// Case study metadata
export const caseStudyMetadata: ResourceMetadata[] = [
  {
    id: 'case-study-1',
    title: 'E-commerce Platform: Reducing MTTR by 85%',
    description: 'How ShopHub reduced mean time to resolution from 45 minutes to 7 minutes using OAAS AI-powered root cause analysis.',
    type: 'case-study',
    industries: ['E-commerce', 'SaaS'],
    useCases: ['incident-response', 'cost-optimization'],
    topics: ['Case Study', 'Observability', 'Automation'],
    date: 'May 2026',
    author: 'Priya Patel',
    readTime: 8,
    featured: true,
  },
  {
    id: 'case-study-2',
    title: 'FinTech Platform: Achieving 99.95% SLA',
    description: 'PaymentFlow implemented OAAS to maintain 99.95% uptime SLA while processing $50M+ daily transactions.',
    type: 'case-study',
    industries: ['FinTech'],
    useCases: ['compliance', 'performance', 'security'],
    topics: ['Case Study', 'Monitoring', 'Best Practices'],
    date: 'March 2026',
    author: 'Elena Rodriguez',
    readTime: 10,
    featured: true,
  },
];

// Blog article metadata
export const blogArticleMetadata: ResourceMetadata[] = [
  {
    id: 'blog-1',
    title: 'The Future of AI-Powered Observability',
    description: 'Explore how AI is transforming incident response, from anomaly detection to root cause analysis.',
    type: 'blog-article',
    industries: [],
    useCases: ['incident-response'],
    topics: ['AI', 'Observability', 'Product Update'],
    date: 'May 2026',
    author: 'Product Team',
    readTime: 6,
  },
  {
    id: 'blog-2',
    title: 'Best Practices: Setting Up Alert Rules for Maximum Signal',
    description: 'Master the art of alert configuration. Learn how to reduce noise and build rules that matter.',
    type: 'blog-article',
    industries: [],
    useCases: ['incident-response'],
    topics: ['Best Practices', 'Tutorial', 'Monitoring'],
    date: 'April 2026',
    author: 'Engineering',
    readTime: 5,
  },
];

// Testimonial metadata
export const testimonialMetadata: ResourceMetadata[] = [
  {
    id: 'testimonial-1',
    title: 'ShopHub Success Story',
    description: 'Reduced alert fatigue and improved MTTR with AI-powered observability.',
    type: 'testimonial',
    industries: ['E-commerce'],
    useCases: ['incident-response', 'cost-optimization'],
    topics: ['Case Study', 'Observability'],
    date: 'May 2026',
    author: 'Priya Patel',
  },
  {
    id: 'testimonial-2',
    title: 'PaymentFlow Success Story',
    description: 'Achieved 99.95% SLA with proactive anomaly detection and compliance monitoring.',
    type: 'testimonial',
    industries: ['FinTech'],
    useCases: ['compliance', 'performance'],
    topics: ['Case Study', 'Monitoring'],
    date: 'March 2026',
    author: 'Elena Rodriguez',
  },
];

// Combined resources
export const allResources: ResourceMetadata[] = [
  ...caseStudyMetadata,
  ...blogArticleMetadata,
  ...testimonialMetadata,
];

// Filter options
export const filterOptions = {
  industries: ['SaaS', 'FinTech', 'E-commerce', 'Healthcare', 'Manufacturing', 'DevOps'] as Industry[],
  useCases: ['incident-response', 'cost-optimization', 'compliance', 'performance', 'security', 'scalability'] as UseCaseCategory[],
  topics: ['AI', 'Automation', 'Best Practices', 'Case Study', 'Product Update', 'Tutorial', 'Observability', 'Monitoring'] as Topic[],
  types: ['case-study', 'blog-article', 'testimonial'] as ResourceType[],
};

// Search and filter utilities
export function searchResources(
  resources: ResourceMetadata[],
  query: string,
  filters: {
    types?: ResourceType[];
    industries?: Industry[];
    useCases?: UseCaseCategory[];
    topics?: Topic[];
  }
): ResourceMetadata[] {
  return resources.filter((resource) => {
    // Search query matching
    const queryLower = query.toLowerCase();
    const matchesQuery =
      !query ||
      resource.title.toLowerCase().includes(queryLower) ||
      resource.description.toLowerCase().includes(queryLower) ||
      resource.author.toLowerCase().includes(queryLower);

    if (!matchesQuery) return false;

    // Type filter
    if (filters.types && filters.types.length > 0 && !filters.types.includes(resource.type)) {
      return false;
    }

    // Industry filter
    if (filters.industries && filters.industries.length > 0) {
      const hasIndustry = filters.industries.some((ind) => resource.industries.includes(ind));
      if (!hasIndustry) return false;
    }

    // Use case filter
    if (filters.useCases && filters.useCases.length > 0) {
      const hasUseCase = filters.useCases.some((uc) => resource.useCases.includes(uc));
      if (!hasUseCase) return false;
    }

    // Topic filter
    if (filters.topics && filters.topics.length > 0) {
      const hasTopic = filters.topics.some((t) => resource.topics.includes(t));
      if (!hasTopic) return false;
    }

    return true;
  });
}

// Highlight search query in text
export function highlightSearchQuery(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Get featured resources
export function getFeaturedResources(): ResourceMetadata[] {
  return allResources.filter((r) => r.featured);
}
