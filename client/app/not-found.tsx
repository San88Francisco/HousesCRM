import { Suspense } from 'react';

export default function NotFoundPage() {
  return (
    <Suspense fallback={null}>
      <div>404</div>
    </Suspense>
  );
}
