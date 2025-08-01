import { loadStripe } from '@stripe/stripe-js'

const STRIPE_KEY = 'pk_test_51QvoPAK6dXtxJTH45GtPcOXgPp1OXThXJHGueGQsAjgsefOHMwVVvFq56qOg2caYogkq5voiWJ4pFa8IPKllsJxH008nbu3XrJ'
const BUY_BUTTON_ID = 'buy_btn_1Qvp84K6dXtxJTH4eLdZH7Lb'

// Load Stripe Buy Button script
const loadBuyButton = () => {
  const script = document.createElement('script')
  script.src = 'https://js.stripe.com/v3/buy-button.js'
  script.async = true
  document.body.appendChild(script)
}

export const processPayment = async () => {
  try {
    loadBuyButton()
    const buyButton = document.createElement('stripe-buy-button')
    buyButton.setAttribute('buy-button-id', BUY_BUTTON_ID)
    buyButton.setAttribute('publishable-key', STRIPE_KEY)
    
    // Add button to modal content
    const modalContent = document.querySelector('.payment-button-container')
    if (modalContent) {
      modalContent.innerHTML = ''
      modalContent.appendChild(buyButton)
    }
  } catch (error) {
    throw new Error('Failed to load Stripe Buy Button')
  }
} 