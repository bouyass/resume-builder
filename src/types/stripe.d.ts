// types/stripe.d.ts
declare global {
    interface Window {
      Stripe: (publishableKey: string) => any;
    }
  }
  
  export {};