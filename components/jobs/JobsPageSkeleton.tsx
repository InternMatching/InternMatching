"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function JobsPageSkeleton() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <div className="flex items-center gap-3 py-5 border-b border-border/40">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-28 rounded" />
                </div>
                <div className="flex">
                    <div className="w-[420px] shrink-0 border-r border-border/40 p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-3 p-3">
                                <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4 rounded" />
                                    <Skeleton className="h-3 w-1/2 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 p-8 space-y-4">
                        <Skeleton className="h-16 w-16 rounded-2xl" />
                        <Skeleton className="h-7 w-2/3 rounded" />
                        <Skeleton className="h-4 w-1/3 rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
}
