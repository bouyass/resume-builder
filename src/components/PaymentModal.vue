<template>
  <div v-if="show" class="payment-modal-overlay" @click.self="$emit('close')">
    <div class="payment-modal">
      <div class="modal-header">
        <h2>{{ t('payment.title') }}</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <div class="price-section">
          <div class="price">{{ price }}</div>
          <span class="price-description">{{ t('payment.features.download_pdf') }}</span>
        </div>

        <div class="features">
          <div class="feature-item">
            <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ t('payment.features.download_pdf') }}</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ t('payment.features.extendDownload') }}</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ t('payment.features.emailSent') }}</span>
          </div>
        </div>

        <div class="email-section">
          <label for="email" class="email-label">{{ t('payment.emailAddress') }}</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="email-input"
            :placeholder="t('resume.sections.personal.placeholders.email')"
            @change="updateEmail"
            required
          />
        </div>

        <!-- Stripe Card Element -->
        <div class="card-section">
          <label class="card-label">{{ t('payment.paymentInformation') }}</label>
          <div id="card-element" class="card-element">
            <!-- Stripe Elements will mount here -->
          </div>
          <div id="card-errors" class="card-errors" v-if="cardError">
            {{ cardError }}
          </div>
        </div>

        <div class="payment-button-container">
          <button 
            class="payment-button" 
            @click="processPayment" 
            :disabled="processing || !email || !cardComplete"
          >
            <div v-if="processing" class="loading-spinner"></div>
            <span v-else>{{ t('payment.pay', { amount: price }) }}</span>
          </button>
        </div>

        <div class="secure-payment">
          <svg class="lock-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          <span>{{ t('payment.securePayment') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

// Déclaration des types pour Stripe
declare global {
  var Stripe: any
}

const { t, locale } = useI18n()


const BACKEND_URL = import.meta.env.VITE_DOWNLOAD_SERVER_URL || 'http://localhost:3000'
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Props
const props = defineProps<{
  show: boolean
  action?: 'download' | 'email'
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success', paymentId: Number): void
  (e: 'error', error: string): void
  (e: 'updateEmail', email: string): void
}>()

// Reactive data
const processing = ref(false)
const email = ref('')
const cardError = ref('')
const cardComplete = ref(false)
const paymentIntentId = ref('')

// Stripe variables
let stripe: any = null
let elements: any = null
let cardElement: any = null

// Price configuration
type PriceMap = {
  [key: string]: { display: string, amount: number, currency: string }
}

const priceConfig = computed(() => {
  const prices: PriceMap = {
    'en': { display: '$0.50', amount: 0.50, currency: 'usd' },
    'fr': { display: '0,50 €', amount: 0.50, currency: 'eur' },
    'es': { display: '0,50 €', amount: 0.50, currency: 'eur' },
    'de': { display: '0,50 €', amount: 0.50, currency: 'eur' },
    'default': { display: '$0.50', amount: 0.50, currency: 'usd' }
  }
  return prices[locale.value] || prices.default
})

const price = computed(() => priceConfig.value.display)

// Initialize Stripe
onMounted(async () => {
  await loadStripe()
})

// Watch for modal show/hide to setup/cleanup Stripe elements
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await nextTick()
    await setupStripeElements()
  } else {
    cleanupStripeElements()
  }
})

async function loadStripe() {
  try {
    // Load Stripe.js
    if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.async = true
      document.head.appendChild(script)
      
      await new Promise((resolve) => {
        script.onload = resolve
      })
    }
    
    // Initialize Stripe with your publishable key
    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY)
    
  } catch (error) {
    console.error('Erreur lors du chargement de Stripe:', error)
    cardError.value = 'Impossible de charger Stripe'
  }
}

async function setupStripeElements() {
  if (!stripe) return
  
  try {
    // Create elements instance
    elements = stripe.elements({
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#1e293b',
          colorText: '#e2e8f0',
          colorDanger: '#ef4444',
          fontFamily: '"Inter", system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px'
        }
      }
    })
    
    // Create card element
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#e2e8f0',
          '::placeholder': {
            color: '#94a3b8',
          },
        },
        invalid: {
          color: '#ef4444',
        },
      },
    })
    
    // Mount card element
    const cardElementContainer = document.getElementById('card-element')
    if (cardElementContainer) {
      cardElement.mount('#card-element')
      
      // Listen for card changes
      cardElement.on('change', (event: any) => {
        cardError.value = event.error ? event.error.message : ''
        cardComplete.value = event.complete
      })
    }
  } catch (error) {
    console.error('Erreur lors de la configuration des éléments Stripe:', error)
    cardError.value = 'Erreur de configuration du paiement'
  }
}

function cleanupStripeElements() {
  if (cardElement) {
    cardElement.unmount()
    cardElement = null
  }
  if (elements) {
    elements = null
  }
  cardError.value = ''
  cardComplete.value = false
  paymentIntentId.value = ''
}

async function processPayment() {
  if (!email.value || !cardComplete.value || !stripe || !cardElement) return
  debugger;
  processing.value = true
  cardError.value = ''
  
  try {
    // Étape 1: Créer le Payment Intent via le backend
    const { data: paymentIntentData } = await api.post('/create-payment-intent', {
      amount: priceConfig.value.amount,
      currency: priceConfig.value.currency,
      description: 'CV Professional PDF Generation'
    })
    
    const { clientSecret, paymentIntentId: newPaymentIntentId } = paymentIntentData
    paymentIntentId.value = newPaymentIntentId
    
    // Étape 2: Confirmer le paiement avec Stripe
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email.value,
          },
        }
      }
    )
    
    if (confirmError) {
      emit('error', confirmError.message)
    }
    
    // Étape 3: Vérifier le statut du paiement
    if (paymentIntent.status === 'succeeded') {
      const { data: verificationResult } = await api.post('/verify-payment', {
        paymentIntentId: paymentIntent.id
      })
      
      if (verificationResult.success) {
        
        // Émettre l'événement de succès
        emit('success', paymentIntent.id)
        
        // Fermer la modal après un court délai
        setTimeout(() => {
          emit('close')
        }, 2000)
      } else {
        emit('error', t('payment.errors.paymentNonValidated'))
        return
      }
    } else {
      emit('error', t('payment.errors.paymentFailed'))
      return
    }
    
  } catch (error: any) {
    emit('error', t('payment.errors.paymentError'))
    
    
    // Gestion des erreurs Axios
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message
      cardError.value = errorMessage
      emit('error', t('payment.errors.paymentFailed'))
    } else {
      cardError.value = error.message || 'Une erreur est survenue lors du paiement'
      emit('error', t('payment.errors.paymentFailed'))
    }
  } finally {
    processing.value = false
  }
}

// Fonction utilitaire pour afficher les cartes de test Stripe
function showTestCards() {
  console.log('🔧 Cartes de test Stripe:')
  console.log('✅ Succès: 4242424242424242')
  console.log('❌ Déclinée: 4000000000000002')
  console.log('💰 Fonds insuffisants: 4000000000009995')
  console.log('📅 Expiration: n\'importe quelle date future')
  console.log('🔐 CVC: n\'importe quel code à 3 chiffres')
}


const updateEmail = (): void => {
  emit('updateEmail', email.value)
}
</script>

<style scoped>
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.payment-modal {
  background: rgba(30, 41, 59, 0.95);
  border-radius: 1rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.modal-header h2 {
  color: #e2e8f0;
  font-size: 1.5rem;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.1);
}

.modal-content {
  padding: 2rem;
}

.price-section {
  text-align: center;
  margin-bottom: 2rem;
}

.price {
  font-size: 3rem;
  font-weight: bold;
  color: #e2e8f0;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-description {
  display: block;
  color: #94a3b8;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.features {
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
}

.email-section {
  margin-bottom: 1.5rem;
}

.email-label {
  display: block;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.email-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

.email-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.email-input::placeholder {
  color: #94a3b8;
}

.card-section {
  margin-bottom: 1.5rem;
}

.card-label {
  display: block;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-element {
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.card-element:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.card-errors {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.payment-button-container {
  margin-bottom: 1rem;
}

.payment-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.payment-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  opacity: 0;
  transition: opacity 0.2s;
}

.payment-button:hover::before {
  opacity: 1;
}

.payment-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.payment-button:disabled::before {
  opacity: 0;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.8rem;
}

.lock-icon {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 480px) {
  .payment-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .price {
    font-size: 2.5rem;
  }
}
</style>