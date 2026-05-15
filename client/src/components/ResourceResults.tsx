import { ResourceMetadata, ResourceType } from '@/lib/resourceMetadata';
import { Calendar, User, Tag, BookOpen } from 'lucide-react';
import { recordClickedResource } from '@/lib/recommendationEngine';
import { trackResourceClicked } from '@/lib/searchAnalytics';

interface ResourceResultsProps {
  resources: ResourceMetadata[];
  isLoading?: boolean;
}

export function ResourceResults({ resources, isLoading = false }: ResourceResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-card/50 rounded-lg animate-pulse">
            <div className="h-6 bg-accent/20 rounded w-3/4 mb-3" />
            <div className="h-4 bg-accent/10 rounded w-full mb-2" />
            <div className="h-4 bg-accent/10 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'case-study':
        return '📊';
      case 'blog-article':
        return '📝';
      case 'testimonial':
        return '⭐';
      default:
        return '📄';
    }
  };

  const getResourceTypeLabel = (type: ResourceType) => {
    switch (type) {
      case 'case-study':
        return 'Case Study';
      case 'blog-article':
        return 'Blog Article';
      case 'testimonial':
        return 'Testimonial';
      default:
        return 'Resource';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Found {resources.length} resource{resources.length !== 1 ? 's' : ''}
      </div>

      {resources.map((resource) => (
        <article
          key={resource.id}
          className="group p-6 bg-card/50 border border-accent/10 rounded-lg hover:border-accent/30 hover:bg-card/80 transition-all cursor-pointer"
          onClick={() => {
            recordClickedResource(resource.id);
            trackResourceClicked(resource.id, resource.type);
          }}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">{getResourceIcon(resource.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                  {getResourceTypeLabel(resource.type)}
                </span>
                {resource.featured && (
                  <span className="inline-block px-2 py-1 bg-yellow-500/10 text-yellow-600 text-xs font-medium rounded">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                {resource.title}
              </h3>

              <p className="text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{resource.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{resource.author}</span>
                </div>
                {resource.readTime && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{resource.readTime} min read</span>
                  </div>
                )}
              </div>

              {(resource.industries.length > 0 || resource.topics.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {resource.industries.map((industry) => (
                    <span
                      key={`ind-${industry}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-accent/5 text-accent text-xs rounded"
                    >
                      <Tag className="w-3 h-3" />
                      {industry}
                    </span>
                  ))}
                  {resource.topics.map((topic) => (
                    <span
                      key={`topic-${topic}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-accent/5 text-accent text-xs rounded"
                    >
                      <Tag className="w-3 h-3" />
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
