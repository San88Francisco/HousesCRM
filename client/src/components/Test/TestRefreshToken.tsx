'use client';

import { Button } from '@/components/ui/button';
import cookies from 'js-cookie';
import { useState } from 'react';

export function TestRefreshToken() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRefresh = async () => {
    try {
      addLog('🧪 Починаємо тест...');

      // 1. Перевіряємо наявність токенів
      const accessToken = cookies.get('accessToken');
      addLog(`✅ Access token існує: ${!!accessToken}`);

      // 2. Видаляємо access token
      cookies.remove('accessToken');
      addLog('🗑️ Access token видалено');

      // 3. Робимо запит (має спрацювати refresh)
      addLog('📡 Робимо запит до API...');

      const response = await fetch(
        'https://troubled-paula-step-029fdb19.koyeb.app/api/apartments',
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      addLog(`📥 Відповідь: ${response.status} ${response.statusText}`);

      // 4. Перевіряємо чи з'явився новий access token
      const newAccessToken = cookies.get('accessToken');
      if (newAccessToken) {
        addLog('✅ Новий access token отримано!');
        addLog('🎉 Refresh token працює правильно!');
      } else {
        addLog('❌ Новий access token НЕ отримано');
        addLog('⚠️ Можливо refresh token також протермінований');
      }
    } catch (error: any) {
      addLog(`❌ Помилка: ${error.message}`);
    }
  };

  const testWithRTK = () => {
    addLog('🧪 Тестуємо через RTK Query...');

    // Псуємо access token
    cookies.set('accessToken', 'invalid_token_123', { path: '/' });
    addLog('🔧 Access token замінено на невалідний');
    addLog('📡 Тепер оновіть сторінку або зробіть API запит');
    addLog('💡 Відкрийте Console і Network в DevTools!');
  };

  const checkCookies = () => {
    const accessToken = cookies.get('accessToken');
    addLog('🍪 Перевірка cookies:');
    addLog(`  Access token: ${accessToken ? '✅ Існує' : '❌ Відсутній'}`);
    if (accessToken) {
      addLog(`  Значення: ${accessToken.substring(0, 20)}...`);
    }
  };

  const clearLog = () => setLog([]);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md border">
      <h3 className="font-bold mb-2">🧪 Тест Refresh Token</h3>

      <div className="flex gap-2 mb-3">
        <Button onClick={testRefresh} size="sm" variant="default">
          Тест Direct API
        </Button>
        <Button onClick={testWithRTK} size="sm" variant="secondary">
          Тест RTK Query
        </Button>
        <Button onClick={clearLog} size="sm" variant="outline">
          Очистити
        </Button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs max-h-64 overflow-y-auto font-mono">
        {log.length === 0 ? (
          <p className="text-gray-500">Натисніть кнопку для тесту...</p>
        ) : (
          log.map((item, i) => (
            <div key={i} className="mb-1">
              {item}
            </div>
          ))
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>💡 Підказка: Відкрийте DevTools → Network</p>
        <p>Ви побачите запит на /auth/refresh</p>
      </div>
    </div>
  );
}
