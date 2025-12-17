import React, { useState, useEffect } from 'react';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const slides = [
        {
            id: 1,
            title: "Report Issues",
            subtitle: "Your Voice Matters",
            description: "Help improve your community by reporting streetlights, potholes, water leaks, and more",
            cta: "Report Now",
            icon: "🚨",
            theme: "blue",
            stats: { label: "Active Reports", value: "2.4K+" }
        },
        {
            id: 2,
            title: "Track Progress",
            subtitle: "Real-Time Updates",
            description: "Monitor your reported issues and get instant notifications on resolution progress",
            cta: "Track Issues",
            icon: "📊",
            theme: "green",
            stats: { label: "Resolved Issues", value: "15K+" }
        },
        {
            id: 3,
            title: "Build Better Cities",
            subtitle: "Together We Can",
            description: "Join thousands of citizens making our infrastructure safer and more efficient",
            cta: "Join Now",
            icon: "🏙️",
            theme: "orange",
            stats: { label: "Active Citizens", value: "50K+" }
        }
    ];

    const issueTypes = [
        { icon: "💡", label: "Streetlights", color: "from-yellow-400 to-orange-500" },
        { icon: "🕳️", label: "Potholes", color: "from-gray-400 to-gray-600" },
        { icon: "💧", label: "Water Leaks", color: "from-blue-400 to-cyan-500" },
        { icon: "🗑️", label: "Garbage", color: "from-green-400 to-emerald-600" },
        { icon: "🚶", label: "Footpaths", color: "from-purple-400 to-pink-500" },
        { icon: "🚧", label: "Road Damage", color: "from-red-400 to-rose-600" }
    ];

    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const getThemeColors = (theme) => {
        const themes = {
            blue: {
                gradient: 'from-blue-900 via-blue-700 to-indigo-800',
                accentGradient: 'from-blue-500 to-cyan-400',
                particles: 'bg-blue-400'
            },
            green: {
                gradient: 'from-emerald-900 via-green-700 to-teal-800',
                accentGradient: 'from-emerald-500 to-teal-400',
                particles: 'bg-emerald-400'
            },
            orange: {
                gradient: 'from-orange-900 via-amber-700 to-yellow-800',
                accentGradient: 'from-orange-500 to-amber-400',
                particles: 'bg-orange-400'
            }
        };
        return themes[theme] || themes.blue;
    };

    const currentTheme = getThemeColors(slides[currentSlide].theme);

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-slate-950">
            {/* Animated City Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'grid-move 20s linear infinite'
                }}></div>
            </div>

            {/* Dynamic Gradient Overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${currentTheme.gradient} transition-all duration-1000`}></div>

            {/* Floating City Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => {
                    const randomX = Math.random() * 200 - 100;
                    const randomY = Math.random() * -100;
                    return (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 ${currentTheme.particles} rounded-full animate-float-random`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${10 + Math.random() * 10}s`,
                                '--tx': `${randomX}px`,
                                '--ty': `${randomY}vh`
                            }}
                        ></div>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-7xl w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-white space-y-6 z-10">
                            {/* Badge */}
                            <div 
                                key={`badge-${currentSlide}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-slide-up"
                            >
                                <span className="text-2xl">{slides[currentSlide].icon}</span>
                                <span className="text-sm font-semibold tracking-wide uppercase">
                                    {slides[currentSlide].subtitle}
                                </span>
                            </div>

                            {/* Main Title */}
                            <div className="overflow-hidden">
                                <h1 
                                    key={`title-${currentSlide}`}
                                    className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight animate-slide-up"
                                    style={{ 
                                        animationDelay: '0.1s',
                                        fontFamily: "'Outfit', sans-serif"
                                    }}
                                >
                                    {slides[currentSlide].title}
                                </h1>
                            </div>

                            {/* Description */}
                            <div className="overflow-hidden">
                                <p 
                                    key={`desc-${currentSlide}`}
                                    className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed animate-slide-up"
                                    style={{ animationDelay: '0.2s' }}
                                >
                                    {slides[currentSlide].description}
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div 
                                key={`cta-${currentSlide}`}
                                className="flex flex-wrap gap-4 pt-4 animate-slide-up"
                                style={{ animationDelay: '0.3s' }}
                            >
                                <button className={`group relative px-8 py-4 bg-linear-to-r ${currentTheme.accentGradient} text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg`}>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {slides[currentSlide].cta}
                                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </button>
                                <button className="px-8 py-4 border-2 border-white/30 backdrop-blur-sm text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                                    Learn More
                                </button>
                            </div>

                            {/* Stats */}
                            <div 
                                key={`stats-${currentSlide}`}
                                className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-slide-up"
                                style={{ animationDelay: '0.4s' }}
                            >
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <div className="text-3xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                                        {slides[currentSlide].stats.value}
                                    </div>
                                    <div className="text-xs text-white/60 mt-1">{slides[currentSlide].stats.label}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <div className="text-3xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">24/7</div>
                                    <div className="text-xs text-white/60 mt-1">Support</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <div className="text-3xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">98%</div>
                                    <div className="text-xs text-white/60 mt-1">Response Rate</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <div className="text-3xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">&lt;48h</div>
                                    <div className="text-xs text-white/60 mt-1">Avg. Resolution</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Issue Types Grid */}
                        <div className="relative">
                            <div 
                                key={`visual-${currentSlide}`}
                                className="relative animate-fade-in"
                            >
                                {/* Main Card - Mock Report Interface */}
                                <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900">Quick Report</h3>
                                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                                            📍
                                        </div>
                                    </div>

                                    {/* Issue Type Selection */}
                                    <div className="space-y-3 mb-6">
                                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Select Issue Type</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {issueTypes.map((issue, idx) => (
                                                <div
                                                    key={idx}
                                                    className="group relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-500"
                                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                                >
                                                    <div className="text-center">
                                                        <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">
                                                            {issue.icon}
                                                        </div>
                                                        <div className="text-xs font-medium text-gray-700">{issue.label}</div>
                                                    </div>
                                                    <div className={`absolute inset-0 bg-linear-to-br ${issue.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mock Location Input */}
                                    <div className="space-y-3 mb-6">
                                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Location</label>
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-400 text-sm">Use current location</span>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                        <span>Submit Report</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Floating Achievement Badges */}
                                <div className="absolute -top-6 -right-6 bg-linear-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-2xl animate-bounce-slow transform rotate-12">
                                    <div className="text-3xl">🏆</div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl p-4 shadow-2xl animate-bounce-slow transform -rotate-12" style={{ animationDelay: '1s' }}>
                                    <div className="text-3xl">✅</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Categories Marquee */}
                    <div 
                        className="mt-16 animate-slide-up"
                        style={{ animationDelay: '0.5s' }}
                    >
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden">
                            <div className="flex items-center gap-8 animate-marquee">
                                {[...issueTypes, ...issueTypes].map((issue, idx) => (
                                    <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
                                        <span className="text-2xl">{issue.icon}</span>
                                        <span className="text-white font-semibold">{issue.label}</span>
                                        {idx < issueTypes.length * 2 - 1 && (
                                            <span className="text-white/30 mx-4">•</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
                <button 
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                    aria-label="Previous slide"
                >
                    <svg className="w-6 h-6 text-white transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-500 rounded-full ${
                                currentSlide === index 
                                    ? 'w-12 h-3 bg-white shadow-lg' 
                                    : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button 
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                    aria-label="Next slide"
                >
                    <svg className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-white/60 text-xs font-medium">Scroll</span>
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9) rotate(-5deg);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }

                @keyframes float-random {
                    0%, 100% {
                        transform: translate(0, 0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx, 100px), var(--ty, -100vh));
                        opacity: 0;
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0) rotate(var(--rotation, 12deg));
                    }
                    50% {
                        transform: translateY(-20px) rotate(var(--rotation, 12deg));
                    }
                }

                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                @keyframes grid-move {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(50px);
                    }
                }

                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                    opacity: 0;
                }

                .animate-fade-in {
                    animation: fade-in 1.2s ease-out forwards;
                }

                .animate-float-random {
                    animation: float-random linear infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Banner;