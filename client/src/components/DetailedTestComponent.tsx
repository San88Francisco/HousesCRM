'use client';

import { Button } from '@/components/ui/button';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/auth/refreshToken';
import { useGetAllContractsQuery } from '@/store/contracts';
import { useState } from 'react';
import { ContractPeriod } from '@/types/services/contracts';

export function DetailedTestComponent() {
  const [logs, setLogs] = useState<string[]>([]);
  const { refetch } = useGetAllContractsQuery({
    period: ContractPeriod.OneMonth,
    renter_id: '00000000-0000-0000-0000-000000000001',
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  const testDirectCookies = () => {
    addLog('🍪 Тестуємо прямі cookies...');

    // Прямо встановлюємо через document.cookie
    const testToken = 'direct_test_token_' + Date.now();
    document.cookie = `accessToken=${testToken}; path=/; max-age=86400`;

    addLog(`🍪 Встановили через document.cookie: ${testToken.substring(0, 30)}...`);

    // Перевіряємо через js-cookie
    const retrieved = getAccessToken();
    addLog(`🍪 Отримали через js-cookie: ${retrieved?.substring(0, 30)}...`);

    if (retrieved === testToken) {
      addLog('✅ js-cookie працює правильно');
    } else {
      addLog('❌ Проблема з js-cookie!');
    }
  };
  const clearAllTokens = () => {
    clearTokens();
    addLog('🧹 Всі токени очищено');
  };

  const showTokens = () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    addLog(`📋 Access Token: ${accessToken ? `${accessToken.substring(0, 30)}...` : 'ВІДСУТНІЙ'}`);
    addLog(
      `📋 Refresh Token: ${refreshToken ? `${refreshToken.substring(0, 30)}...` : 'ВІДСУТНІЙ'}`,
    );

    // Додаткова перевірка cookies
    if (typeof document !== 'undefined') {
      const allCookies = document.cookie;
      addLog(`🍪 Всі cookies: ${allCookies}`);
    }
  };

  const invalidateToken = () => {
    const currentRefreshToken = getRefreshToken();
    const currentAccessToken = getAccessToken();

    addLog(`📋 До зміни - Access: ${currentAccessToken?.substring(0, 30)}...`);
    addLog(`📋 До зміни - Refresh: ${currentRefreshToken?.substring(0, 30)}...`);

    if (currentRefreshToken) {
      // Робимо токен недійсним, але залишаємо refresh token
      const invalidToken = 'invalid_token_' + Date.now();
      setTokens(invalidToken, currentRefreshToken);

      addLog('✅ Access токен зроблено недійсним');

      // Перевіряємо що токен дійсно змінився
      const newAccessToken = getAccessToken();
      addLog(`📋 Після зміни - Access: ${newAccessToken?.substring(0, 30)}...`);

      if (newAccessToken === currentAccessToken) {
        addLog('❌ УВАГА: Access токен НЕ змінився!');
      } else {
        addLog('✅ Access токен успішно змінено');
      }
    } else {
      addLog('❌ Немає refresh токену для тестування');
    }
  };

  const testRefresh = async () => {
    addLog('🚀 Тестуємо refresh token...');
    addLog('📡 Робимо запит через RTK Query...');

    try {
      const result = await refetch();
      addLog(`✅ Запит успішний: ${result.isSuccess ? 'ТАК' : 'НІ'}`);
      if (result.error) {
        addLog(`❌ Помилка: ${JSON.stringify(result.error)}`);
      }
    } catch (error) {
      addLog(`💥 Виняток: ${error}`);
    }
  };

  const testDirectRefresh = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      addLog('❌ Немає refresh токену');
      return;
    }

    addLog('🔄 Тестуємо прямий виклик refresh API...');

    try {
      const response = await fetch('http://localhost:5000/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      addLog(`📥 Статус відповіді: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        addLog('✅ Refresh API працює!');
        addLog(`🔑 Отримали новий access token: ${data.accessToken?.substring(0, 30)}...`);
        setTokens(data.accessToken, data.refreshToken);
      } else {
        const errorText = await response.text();
        addLog(`❌ Refresh API не працює: ${errorText}`);
      }
    } catch (error) {
      addLog(`💥 Помилка при виклику refresh API: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const loginAndGetFreshTokens = async () => {
    addLog('🔐 Отримуємо нові токени через логін...');

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin', // Замініть на ваші тестові дані
          password: '#1234567890', // Замініть на ваші тестові дані
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens(data.accessToken, data.refreshToken);
        addLog('✅ Отримано нові валідні токени!');
      } else {
        const errorText = await response.text();
        addLog(`❌ Помилка логіну: ${errorText}`);
      }
    } catch (error) {
      addLog(`💥 Помилка при логіні: ${error}`);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 bg-white p-4 border rounded shadow-lg max-w-md max-h-96 overflow-hidden flex flex-col">
        <h3 className="font-bold mb-2">🔧 Детальний тест Refresh Token</h3>

        <div className="space-y-2 mb-4">
          <Button onClick={showTokens} variant="outline" size="sm" className="w-full">
            1. 📋 Показати поточні токени
          </Button>
          <Button onClick={loginAndGetFreshTokens} variant="outline" size="sm" className="w-full">
            0. 🔐 Отримати нові токени (логін)
          </Button>
          <Button onClick={invalidateToken} variant="outline" size="sm" className="w-full">
            2. ⚠️ Зробити access токен недійсним
          </Button>
          <Button onClick={testDirectRefresh} variant="outline" size="sm" className="w-full">
            3. 🔄 Тест прямого refresh API
          </Button>
          <Button onClick={testDirectCookies} variant="outline" size="sm" className="w-full">
            🍪 Тест прямих cookies
          </Button>
          <Button onClick={testRefresh} variant="outline" size="sm" className="w-full">
            4. 🚀 Тест через RTK Query
          </Button>
          <Button onClick={clearLogs} variant="outline" size="sm" className="flex-1">
            🧹 Очистити логи
          </Button>
          <Button onClick={clearAllTokens} variant="destructive" size="sm" className="flex-1">
            ❌ Очистити токени
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
        <div className="font-bold mb-1">Логи:</div>
        {logs.length === 0 ? (
          <div className="text-gray-500">Немає логів...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1 break-words">
              {log}
            </div>
          ))
        )}
      </div>
    </>
  );
}
