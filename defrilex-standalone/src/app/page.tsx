import { APP_CONFIG, SERVICE_CATEGORIES } from '@defrilex/config';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-display font-bold text-primary-950">
                {APP_CONFIG.NAME}
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-600 hover:text-primary-950 transition-colors">
                Services
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-950 transition-colors">
                How it Works
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary-950 transition-colors">
                About
              </a>
              <a href="/auth/signin" className="btn-outline-primary">
                Sign In
              </a>
              <a href="/auth/signup" className="btn-primary">
                Get Started
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
              Connect with{' '}
              <span className="text-gradient">Elite Professionals</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {APP_CONFIG.DESCRIPTION}. Experience premium quality, verified expertise, and seamless collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary btn-lg">
                Find Talent
              </button>
              <button className="btn-outline-primary btn-lg">
                Offer Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              Six Specialized Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover top-tier professionals across our carefully curated service categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(SERVICE_CATEGORIES).map((category) => (
              <div key={category.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.label}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <span key={sub} className="badge-primary">
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="badge bg-gray-100 text-gray-600">
                        +{category.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              How Defrilex Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and efficient process from discovery to completion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-950">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discover & Connect
              </h3>
              <p className="text-gray-600">
                Browse verified professionals, review portfolios, and connect with the perfect match for your project.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-950">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaborate Securely
              </h3>
              <p className="text-gray-600">
                Work together using our integrated tools, milestone tracking, and secure payment escrow system.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-success-950">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Deliver Excellence
              </h3>
              <p className="text-gray-600">
                Receive high-quality deliverables, provide feedback, and build lasting professional relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              Trusted by Professionals Worldwide
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-950 mb-2">10K+</div>
              <div className="text-gray-600">Verified Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-950 mb-2">50K+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-950 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-950 mb-2">99%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-950 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and clients who trust Defrilex for their most important projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-primary-950 hover:bg-gray-100 btn-lg">
              Start Your Project
            </button>
            <button className="btn border-2 border-white text-white hover:bg-white hover:text-primary-950 btn-lg">
              Join as Professional
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4">{APP_CONFIG.NAME}</h3>
              <p className="text-gray-400 mb-4">
                Premium marketplace connecting clients with elite professionals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Talent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Post a Project</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Join as Professional</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Work</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Build Your Profile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {APP_CONFIG.NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
