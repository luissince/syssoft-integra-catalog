import { cn } from "@/lib/utils"
import Container from "../Container";

const SkeletonProducts = () => {
  return (
    <div className="flex-1 flex">
      <Container>
        <div className="flex gap-6 animate-pulse">
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
              <div>
                <div className="h-9 w-64 bg-muted rounded-md" />
                <div className="h-6 w-32 bg-muted rounded-full mt-2" />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-10 w-32 bg-muted rounded-md" />
                <div className="h-10 w-36 bg-muted rounded-md" />
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full mb-6">
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 pb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-card overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-square w-full bg-muted" />

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />

                    <div className="flex items-center justify-between pt-2">
                      <div className="h-6 w-20 bg-muted rounded" />
                      <div className="h-9 w-24 bg-muted rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more */}
            <div className="h-10 w-full bg-muted rounded-md mt-4" />
          </div>

          {/* Cart */}
          <div className="w-full max-w-sm hidden lg:block">
            <div className="rounded-lg border bg-card p-4 space-y-5">
              {/* Cart header */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-6 w-8 bg-muted rounded-full" />
              </div>

              {/* Cart items */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-3 border-b pb-4"
                >
                  <div className="w-16 h-16 bg-muted rounded-md shrink-0" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />

                    <div className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-muted rounded" />
                      <div className="h-8 w-20 bg-muted rounded-md" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>

                <div className="flex justify-between">
                  <div className="h-6 w-24 bg-muted rounded" />
                  <div className="h-6 w-24 bg-muted rounded" />
                </div>

                <div className="h-10 w-full bg-muted rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export {
  Skeleton,
  SkeletonProducts
}
