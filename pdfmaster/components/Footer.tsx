import Link from "next/link";

const footerLinks = {
  tools: [
    { name: "Merge PDF", href: "/tools/merge-pdf" },
    { name: "Split PDF", href: "/tools/split-pdf" },
    { name: "Compress PDF", href: "/tools/compress-pdf" },
    { name: "All Tools", href: "/tools" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/security" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                <i className="fas fa-file-pdf text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold text-[#1E1B4B]">PDF Master</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Free online PDF tools for everyone. Simple, secure, and fast.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#1E1B4B] mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#6366F1]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1E1B4B] mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#6366F1]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1E1B4B] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#6366F1]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2026 PDF Master. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-[#6366F1]">
              <i className="fab fa-twitter text-xl"></i>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#6366F1]">
              <i className="fab fa-github text-xl"></i>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#6366F1]">
              <i className="fab fa-linkedin text-xl"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
