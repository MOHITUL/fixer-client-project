import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Instagram, ChevronRight, AlertCircle, FileText, Users, MessageSquare } from 'lucide-react';
import Logo from '../../components/logo/Logo';

export default function PublicInfrastructureFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: 'Report an Issue', icon: AlertCircle },
    { name: 'Track Report', icon: MapPin },
    { name: 'Issue Categories', icon: FileText },
    { name: 'FAQ', icon: MessageSquare },
  ];

  const resources = [
    { name: 'User Guide', href: '#' },
    { name: 'Admin Portal', href: '#' },
    { name: 'Statistics', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ];

  const contactInfo = [
    { icon: Phone, text: '+880123456789', label: 'Phone' },
    { icon: Mail, text: 'support@infrastructure.gov', label: 'Email' },
    { icon: Clock, text: 'Mon-Fri: 8AM-6PM', label: 'Hours' },
    { icon: MapPin, text: '123 Dhaka, Bangladesh', label: 'Address' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-white"><Logo/></h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A digital platform enabling citizens to report public infrastructure issues and helping government staff manage and resolve them efficiently.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="bg-slate-700 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
                    >
                      <Icon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    className="flex items-center text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform duration-200" />
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 mb-6">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <li key={index} className="flex items-start text-sm text-gray-400">
                    <Icon className="w-4 h-4 mr-2 mt-0.5 text-blue-400 shrink-0" />
                    <span>{contact.text}</span>
                  </li>
                );
              })}
            </ul>

            {/* Newsletter Subscription */}
            <div className="bg-slate-800 p-4 rounded-lg">
              <h5 className="text-sm font-semibold text-white mb-2">Stay Updated</h5>
              <p className="text-xs text-gray-400 mb-3">Get notifications about new features</p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-green-400 mt-2">✓ Successfully subscribed!</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Public Infrastructure Issue Reporting System. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}