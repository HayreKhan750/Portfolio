import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  );
};

export const ProjectCardSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="w-full h-40 mb-4 rounded-xl" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);

export const SkillCardSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="h-6 w-24 mb-4" />
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const ExperienceCardSkeleton = () => (
  <div className="glass-card p-6">
    <Skeleton className="h-6 w-48 mb-2" />
    <Skeleton className="h-5 w-32 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
