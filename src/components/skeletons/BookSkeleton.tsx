import { Card, CardContent } from "@/src/components/ui/card";

export function BookSkeleton() {
  return (
    <Card className="group relative bg-white/60 border-white/40 rounded-xl shadow-lg shadow-slate-900/5 animate-pulse overflow-hidden flex flex-col backdrop-blur-2xl h-[280px]">
      <CardContent className="p-3 flex-1 flex flex-col">

        <div className="flex items-center justify-between mb-3">
          <div className="h-2 w-8 bg-slate-200 rounded" />
          <div className="h-4 w-12 bg-slate-100 rounded" />
        </div>


        <div className="space-y-2 mb-3">
          <div className="h-3 w-full bg-slate-200 rounded" />
          <div className="h-3 w-2/3 bg-slate-200 rounded" />
        </div>


        <div className="h-2 w-1/2 bg-slate-100 rounded mb-4" />


        <div className="space-y-3 mb-4 mt-auto">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-slate-100 rounded" />
            <div className="h-2 w-24 bg-slate-100 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-slate-100 rounded" />
            <div className="h-2 w-20 bg-slate-100 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-slate-100 rounded" />
            <div className="h-2 w-16 bg-slate-100 rounded" />
          </div>
        </div>


        <div className="w-full h-8 bg-slate-200 rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function CategorySkeleton() {
  return (
    <div className="space-y-6">

      <div className="flex justify-center">
        <div className="h-10 w-64 bg-white/40 border border-white/60 rounded-full animate-pulse" />
      </div>
      

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
