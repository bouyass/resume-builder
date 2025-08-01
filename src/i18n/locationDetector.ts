interface LocationInfo {
    country_code: string;
    country: string;
  }
  
  const languageByCountry: { [key: string]: string } = {
    'GB': 'en',
    'US': 'en',
    'FR': 'fr',
    'ES': 'es',
    'SA': 'ar',
    // Add more country-to-language mappings
  }
  
  export async function detectUserLanguage(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data: LocationInfo = await response.json();
      return languageByCountry[data.country_code] || 'en';
    } catch (error) {
      console.warn('Failed to detect user language:', error);
      return 'en';
    }
  }