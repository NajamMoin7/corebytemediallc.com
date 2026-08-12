import Button from '@/components/ui/Button';
import Logo from '@/components/Logo';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-8 py-24 text-center">
      <Logo variant="mark" height={64} href={null} />

      <div className="space-y-4">
        <p className="eyebrow">Error 404</p>
        <h1 className="text-4xl text-cream sm:text-5xl">This page doesn&apos;t exist</h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          The link may be out of date, or the product may have been renamed. Everything currently in
          the catalogue is one click away.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/products">Shop Products</Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
