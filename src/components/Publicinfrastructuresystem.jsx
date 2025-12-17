import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, MapPin, Camera, Bell, CheckCircle, Clock, Users, TrendingDown, Award,
  Lightbulb, Droplet, Trash2, Construction, FileText, Search, BarChart3, Shield, Zap, Eye, MessageSquare
} from 'lucide-react';

const PublicInfrastructureSystem = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    features: false,
    'how-it-works': false,
    impact: false,
    'success-stories': false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          if (id && entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [id]: true }));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: <Camera className="w-7 h-7" />, title: "Photo Documentation", description: "Capture and upload images of infrastructure issues with GPS location tagging.", color: "from-blue-500 to-cyan-600", bgAccent: "bg-blue-50" },
    { icon: <MapPin className="w-7 h-7" />, title: "Real-Time Tracking", description: "Track your reported issues from submission to resolution with live updates.", color: "from-emerald-500 to-green-600", bgAccent: "bg-emerald-50" },
    { icon: <Bell className="w-7 h-7" />, title: "Smart Notifications", description: "Receive instant SMS and app notifications when your issue is verified or resolved.", color: "from-orange-500 to-amber-600", bgAccent: "bg-orange-50" },
    { icon: <BarChart3 className="w-7 h-7" />, title: "Analytics Dashboard", description: "Government admins can analyze patterns, allocate resources, and improve services.", color: "from-violet-500 to-purple-600", bgAccent: "bg-violet-50" },
    { icon: <Shield className="w-7 h-7" />, title: "Verified Reports", description: "Ensures authenticity and prevents spam, maintaining system credibility.", color: "from-red-500 to-rose-600", bgAccent: "bg-red-50" },
    { icon: <Users className="w-7 h-7" />, title: "Community Engagement", description: "Citizens can upvote issues, add evidence, and prioritize critical problems.", color: "from-teal-500 to-cyan-600", bgAccent: "bg-teal-50" }
  ];

  const steps = [
    { number: "01", icon: <Camera className="w-6 h-6" />, title: "Report Issue", description: "Citizens capture photos and submit reports.", detail: "Auto-location tagging • Multiple image upload • Issue categorization" },
    { number: "02", icon: <Eye className="w-6 h-6" />, title: "Verification", description: "Municipal staff verify authenticity and categorize issues.", detail: "Duplicate detection • Priority assignment • Department routing" },
    { number: "03", icon: <Users className="w-6 h-6" />, title: "Assignment", description: "Verified issues are assigned to the correct department.", detail: "Smart routing • Workload balancing • Timeline estimation" },
    { number: "04", icon: <CheckCircle className="w-6 h-6" />, title: "Resolution", description: "Field teams resolve issues and update status in real-time.", detail: "Before/after photos • Quality checks • Citizen feedback" }
  ];

  const issueTypes = [
    { icon: <Lightbulb className="w-5 h-5" />, name: "Street Lights", count: "1,234", color: "text-yellow-600" },
    { icon: <Construction className="w-5 h-5" />, name: "Potholes", count: "892", color: "text-orange-600" },
    { icon: <Droplet className="w-5 h-5" />, name: "Water Leakage", count: "567", color: "text-blue-600" },
    { icon: <Trash2 className="w-5 h-5" />, name: "Garbage Overflow", count: "743", color: "text-green-600" },
  ];

  const impactStats = [
    { value: "15,436", label: "Issues Reported", change: "+23% this month", icon: <FileText className="w-5 h-5" /> },
    { value: "12,891", label: "Issues Resolved", change: "83% resolution rate", icon: <CheckCircle className="w-5 h-5" /> },
    { value: "4.2 days", label: "Avg. Response Time", change: "-35% faster", icon: <Clock className="w-5 h-5" /> },
    { value: "47,250", label: "Active Citizens", change: "+156% growth", icon: <Users className="w-5 h-5" /> },
  ];

  const successStories = [
    { issue: "Broken streetlight causing safety concerns", location: "MG Road", reporter: "Priya ", beforeTime: "6:30 PM", resolvedTime: "8 hours", impact: "Improved safety for 500+ residents", category: "Street Lighting" },
    { issue: "Large pothole damaging vehicles", location: "Park Street Junction", reporter: "Raj", beforeTime: "9:00 AM", resolvedTime: "2 days", impact: "Prevented 200+ vehicle damages", category: "Road Maintenance" },
    { issue: "Water pipeline burst flooding street", location: "Lake View Avenue", reporter: "Anita ", beforeTime: "5:45 AM", resolvedTime: "6 hours", impact: "Restored water supply to 1,000+ homes", category: "Water Supply" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      

      {/* Features Section */}
      <section id="features" data-observe className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${visibleSections.features ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              <span>Platform Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">Everything You Need to Report & Track</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">A comprehensive platform designed for citizens and government staff to improve public infrastructure efficiently</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className={`feature-card ${feature.bgAccent} rounded-2xl p-8 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-200 ${visibleSections.features ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Issue Types */}
          <div className={`mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200 ${visibleSections.features ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <h3 className="text-2xl font-bold mb-6 text-slate-900 text-center">Most Reported Issue Types</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {issueTypes.map((type, i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className={`${type.color}`}>{type.icon}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{type.name}</div>
                    <div className="text-sm text-slate-600">{type.count} reports</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-observe className="py-20 px-6 lg:px-12 bg-linear-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${visibleSections['how-it-works'] ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <MessageSquare className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">How the System Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">From citizen report to resolution - a transparent, efficient workflow designed for accountability</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-1 bg-linear-to-b from-blue-300 via-cyan-300 to-blue-300"></div>
            <div className="space-y-12">
              {steps.map((step, i) => (
                <div key={i} className={`relative ${visibleSections['how-it-works'] ? 'animate-slide-in' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="flex gap-8 items-start">
                    <div className="relative z-10 shrink-0">
                      <div className="government-seal w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl shadow-xl">{step.number}</div>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-md">{step.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2 text-slate-900">{step.title}</h3>
                          <p className="text-lg text-slate-700 mb-4">{step.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {step.detail.split(' • ').map((detail, j) => (
                              <span key={j} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                <CheckCircle className="w-3 h-3" />
                                {detail}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" data-observe className="py-20 px-6 lg:px-12 bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 trust-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`text-center mb-16 ${visibleSections.impact ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <TrendingDown className="w-4 h-4" />
              <span>Real Impact</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Making a Measurable Difference</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">See how our platform is transforming municipal services and improving citizens' lives</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat,i) => (
              <div key={i} className={`${visibleSections.impact ? 'animate-scale' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white">{stat.icon}</div>
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-200 text-lg mb-2">{stat.label}</div>
                  <div className="text-green-300 text-sm font-semibold">{stat.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="success-stories" data-observe className="py-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${visibleSections['success-stories'] ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>Real Results</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">Recent Success Stories</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Real issues reported by citizens, resolved by dedicated government teams</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {successStories.map((story,i) => (
              <div key={i} className={`bg-linear-to-br from-slate-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 ${visibleSections['success-stories'] ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">{story.category}</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900">{story.issue}</h3>
                <p className="text-slate-600 mb-4">{story.location} • Reported by {story.reporter}</p>
                <p className="text-sm text-slate-500 mb-2">Reported: {story.beforeTime} • Resolved: {story.resolvedTime}</p>
                <p className="text-sm font-semibold text-slate-700">{story.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default PublicInfrastructureSystem;
