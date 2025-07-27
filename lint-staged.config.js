export default {
  '**/*.{ts,tsx,js,jsx}': (files) => {
    const filtered = files.filter((file) =>
      (file.startsWith('client/src/') ||
        file.startsWith('server/src/') ||
        file.startsWith('client/app/')) &&
      !file.startsWith('client/src/components/ui/') &&
      !file.startsWith('client/src/components/RHF/') &&
      !file.startsWith('server/src/swagger/') &&
      !file.includes('.next')
    );

    if (filtered.length === 0) return [];

    return [
      `eslint --fix --color ${filtered.join(' ')}`,
      `prettier --write ${filtered.join(' ')}`
    ];
  },
  '*.{json,md,css,scss}': ['prettier --write']
};
