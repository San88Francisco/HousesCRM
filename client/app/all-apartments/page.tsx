'use client';

import { TestRefreshToken } from '@/components/Test/TestRefreshToken';

const Page = () => {
  const refresh = async () => {
    try {
      const res = await fetch('https://troubled-paula-step-029fdb19.koyeb.app/api/auth/refresh', {
        method: 'GET', // 🔹 зазвичай refresh роблять POST-запитом
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json', // 🔹 додаємо
        },
        credentials: 'include', // 🔹 дозволяє надсилати cookies
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Refresh success:', data);
    } catch (error) {
      console.error('❌ Refresh error:', error);
    }
  };

  return (
    <div>
      <button onClick={refresh}>click</button>
    </div>
  );
};

export default Page;
