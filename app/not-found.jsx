'use client'

// ═══════════════════════════════════════════════════════════════
// 404 Page - Page Not Found
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  const isAr = pathname?.startsWith('/ar')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[200px] md:text-[280px] font-bold text-white/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl md:text-9xl animate-bounce">😢</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
          {isAr ? 'عذراً! الصفحة غير موجودة' : 'Oops! Page Not Found'}
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/90 mb-12 animate-fade-in" style={{animationDelay: '0.1s'}}>
          {isAr 
            ? 'الصفحة التي تبحث عنها قد تكون محذوفة أو غير متاحة حالياً'
            : 'The page you are looking for might have been removed or is temporarily unavailable'}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.2s'}}>
          <Link
            href="/"
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl inline-flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>

          <Link
            href="/tours"
            className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            <span>✈️</span>
            <span>{isAr ? 'تصفح الرحلات' : 'Browse Tours'}</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <p className="text-white/80 mb-4">
            {isAr ? 'أو انتقل إلى:' : 'Or go to:'}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { href: '/about', label: { ar: 'عن سقطرى', en: 'About' } },
              { href: '/gallery', label: { ar: 'المعرض', en: 'Gallery' } },
              { href: '/blog', label: { ar: 'المدونة', en: 'Blog' } },
              { href: '/contact', label: { ar: 'اتصل بنا', en: 'Contact' } }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all text-sm"
              >
                {link.label[isAr ? 'ar' : 'en']}
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-12 text-white/70 text-sm">
          {isAr ? 'هل تحتاج مساعدة؟' : 'Need help?'}{' '}
          <Link href="/contact" className="text-white underline hover:text-white/90 font-semibold">
            {isAr ? 'اتصل بنا' : 'Contact us'}
          </Link>
        </p>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}