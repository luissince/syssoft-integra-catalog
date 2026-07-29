"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Banner {
    id: string;
    url: string;
}

interface Company {
    name: string;
    information: string;
}

interface Props {
    company: Company;
    banners: Banner[];
    setCurrentBannerIndex: (index: number) => void;
    currentBannerIndex: number;
    className?: string;
}

export default function HeroBanner({
    company,
    banners,
    setCurrentBannerIndex,
    currentBannerIndex,
    className,
}: Props) {

    return (
        <section className={cn(
            "relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-20 border-b border-border",
            className
        )}>
            {banners.length > 0 && (
                <div className="absolute inset-0">
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-70' : 'opacity-0'
                                }`}
                            style={{
                                backgroundImage: `url(${banner.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-background/40" />
                </div>
            )}

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl md:text-4xl font-bold font-display">
                            <span className="text-primary drop-shadow-sm">{company.name}</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed drop-shadow-sm">
                            {company.information}
                        </p>
                    </div>
                </div>
            </div>

            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentBannerIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentBannerIndex
                                ? 'bg-primary scale-125'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}