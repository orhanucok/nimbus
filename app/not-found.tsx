import Link from 'next/link';
import NimbusLogo from '@/components/NimbusLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <NimbusLogo className="w-14 h-14" />
        </div>

        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-2">
          Sayfa bulunamadÄ±
        </h2>
        <p className="text-muted-foreground mb-6">
          AradÄ±ÄŸÄ±nÄ±z sayfa mevcut deÄŸil ya da taÅŸÄ±nmÄ±ÅŸ olabilir.
        </p>

        <Link
          href="/"
          className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600
            hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
        >
          Ana sayfaya dÃ¶n
        </Link>

        <p className="text-xs text-muted-foreground/60 mt-8">
          Nimbus Â· MIT licensed Â· 100% unaffiliated with xAI
        </p>
      </div>
    </div>
  );
}
