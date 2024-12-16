import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Mail, Zap, Shield, Users, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        <nav className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FeedbackFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Sign in
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative pb-32 pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Transform Your Email Signatures
                <span className="block text-blue-600">Into Powerful Feedback Tools</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500">
                Collect real-time customer feedback directly through your email signatures. Simple,
                seamless, and incredibly effective.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button size="lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need for effective feedback collection
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'One-Click Feedback',
                description:
                  'Customers can provide instant feedback with a single click right from their inbox.',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                description:
                  'Track response rates, sentiment trends, and customer satisfaction in real-time.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description:
                  'Bank-grade encryption and GDPR compliance to keep your data safe and secure.',
              },
              {
                icon: Users,
                title: 'Team Management',
                description:
                  'Organize teams by departments, locations, or custom groups for targeted feedback.',
              },
              {
                icon: Mail,
                title: 'Email Client Support',
                description:
                  'Works seamlessly with Gmail, Outlook, Apple Mail, and other major email clients.',
              },
              {
                icon: Star,
                title: 'Custom Branding',
                description:
                  'Match your brand with customizable colors, logos, and signature layouts.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative rounded-xl bg-gray-50 p-8 transition-colors hover:bg-gray-100"
              >
                <div className="absolute right-8 top-8 text-blue-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Trusted by industry leaders</h2>
              <div className="space-y-4">
                {[
                  'Increased response rates by 312%',
                  'Cut feedback collection time by 89%',
                  'Improved customer satisfaction scores by 42%',
                  '99.9% system uptime',
                ].map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{stat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {[
                'https://images.unsplash.com/photo-1496200186974-4293800e2c20?w=800&q=80',
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
                'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=800&q=80',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
              ].map((image, index) => (
                <img key={index} src={image} alt="Client" className="rounded-lg shadow-md" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-white">
            Ready to transform your customer feedback process?
          </h2>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-blue-700"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GDPR
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    CCPA
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 FeedbackFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
