import Logo from "../../components/logo/Logo";

const About = () => {
  return (
    <section className="min-h-screen bg-base-100 px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About <span className="text-5xl font-semibold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">CivicFix</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            CivicFix is a citizen-driven platform that helps report, track, and
            resolve public infrastructure issues efficiently.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* Text */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-gray-600">
              Our mission is to bridge the gap between citizens and authorities
              by providing a transparent, fast, and reliable issue reporting
              system.
            </p>

            
                <h2 className="text-2xl font-semibold">Why <span className="text-2xl font-semibold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">CivicFix</span></h2>
            
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Easy issue reporting with images & location</li>
              <li>Real-time issue tracking</li>
              <li>Priority handling for premium citizens</li>
              <li>Transparent workflow</li>
            </ul>
          </div>

          {/* Illustration / Card */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Platform Highlights</h3>
              <p>🚧 Report issues easily</p>
              <p>📍 Location-based tracking</p>
              <p>👍 Community upvotes</p>
              <p>🔔 Status notifications</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
