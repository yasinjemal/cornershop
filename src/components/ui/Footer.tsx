// ============================================
// Footer — premium fashion brand
// 3-column layout, minimal, serif logo
// ============================================

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand + Contact */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight font-display">
              <span className="text-white">BLACK</span>
              <span className="text-secondary">STEEL</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Premium men&apos;s fashion for the modern South African man.
              Suits, formal wear, and accessories crafted for distinction.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@blacksteel.co.za
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Johannesburg, South Africa
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-secondary transition-colors">Collection</Link></li>
              <li><Link href="/categories" className="hover:text-secondary transition-colors">Categories</Link></li>
              <li><Link href="/products?sort=newest" className="hover:text-secondary transition-colors">New Arrivals</Link></li>
              <li><Link href="/track-order" className="hover:text-secondary transition-colors">Track Your Order</Link></li>
              <li><Link href="/wishlist" className="hover:text-secondary transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Social + Legal */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              Connect
            </h3>
            <div className="flex gap-3">
              {[
                { label: "Instagram", path: "M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.25-2a.75.75 0 110 1.5.75.75 0 010-1.5z" },
                { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "Twitter", path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" },
              ].map((social) => (
                <a key={social.label} href="#" className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group" aria-label={social.label}>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Premium Men&apos;s Fashion — South Africa</p>
        </div>
      </div>
    </footer>
  );
}
