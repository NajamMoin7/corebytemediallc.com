import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { Spinner } from '@/components/ui/LoadingSpinner';

export const metadata = {
  title: 'Search',
  description:
    'Search the Core Byte Media LLC catalogue by product name, category, description or tag.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Search' }]} />

      <PageHeader
        eyebrow="Find it fast"
        title="Search Products"
        description="Search across product names, categories, descriptions and tags."
        className="mt-6"
      />

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="flex min-h-[30vh] items-center justify-center">
              <Spinner size={36} />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
