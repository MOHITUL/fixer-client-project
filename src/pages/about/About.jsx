
const About = () => {
  return (
    <section className="min-h-screen bg-linear-to-b from-white to-gray-50 px-4 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
            About{" "}
            <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              CivicFix
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A citizen-driven platform that helps report, track, and resolve 
            public infrastructure issues efficiently.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission is to bridge the gap between citizens and authorities
              by providing a transparent, fast, and reliable issue reporting
              system that empowers communities and drives positive change.
            </p>
          </div>
        </div>

        {/* Why CivicFix & Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          {/* Why CivicFix */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Why{" "}
              <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CivicFix
              </span>
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl mt-0.5">✓</span>
                <span className="text-gray-700">Easy issue reporting with images & location</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl mt-0.5">✓</span>
                <span className="text-gray-700">Real-time issue tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl mt-0.5">✓</span>
                <span className="text-gray-700">Priority handling for premium citizens</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-xl mt-0.5">✓</span>
                <span className="text-gray-700">Transparent workflow</span>
              </li>
            </ul>
          </div>

          {/* Platform Highlights */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-lg text-white">
            <h3 className="text-2xl font-bold mb-6">Platform Highlights</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚧</span>
                <span className="text-blue-50">Report issues easily</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <span className="text-blue-50">Location-based tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">👍</span>
                <span className="text-blue-50">Community upvotes</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <span className="text-blue-50">Status notifications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">5K+</div>
            <div className="text-sm text-gray-600">Issues Reported</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3K+</div>
            <div className="text-sm text-gray-600">Issues Resolved</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;