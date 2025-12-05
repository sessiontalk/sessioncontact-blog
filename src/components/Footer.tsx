import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">SC</span>
              </div>
              <span className="text-xl font-bold">SessionContact</span>
            </Link>
            <p className="text-white/70 max-w-md">
              Insights and best practices for omnichannel contact centers, customer experience,
              and AI-powered communication solutions.
            </p>
          </div>

          {/* Blog Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=customer-experience" className="text-white/70 hover:text-white transition-colors">
                  Customer Experience
                </Link>
              </li>
              <li>
                <Link to="/?category=ai-automation" className="text-white/70 hover:text-white transition-colors">
                  AI & Automation
                </Link>
              </li>
              <li>
                <Link to="/?category=contact-center" className="text-white/70 hover:text-white transition-colors">
                  Contact Center
                </Link>
              </li>
              <li>
                <Link to="/?category=omnichannel" className="text-white/70 hover:text-white transition-colors">
                  Omnichannel
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://sessioncontact.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://sessioncontact.com/product" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  Product
                </a>
              </li>
              <li>
                <a href="https://sessioncontact.com/demo" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  Request Demo
                </a>
              </li>
              <li>
                <a href="https://sessioncontact.com/contact" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            &copy; {currentYear} SessionContact. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
