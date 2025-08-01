<template>
    <div v-if="show" class="payment-modal-overlay" @click.self="$emit('close')">
      <div class="payment-modal">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>
        
        <div class="modal-content">
          <div class="link-section">
            <p>{{ description }}</p>
            <span style="color:white;">{{ props.linkText  }}</span>
            <span style="color:white;">{{ props.link  }}</span>
            <button 
              class="copy-button"
              @click="copyToClipboard"
            >
              {{ copied ? t('copied') : linkText }}
            </button>
          </div>
  
          <div class="secure-info">
            <svg class="lock-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2-2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ secureNote }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n()
  
  const props = defineProps<{
    show: boolean
    title?: string
    description?: string
    link: string
    linkText?: string
    secureNote?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
  }>()
  
  // Default values
  const title = props.title || t('download_link')
  const description = props.description || t('click_to_access')
  const linkText = props.linkText || t('payment.copyLink')
  const secureNote = props.secureNote || t('payment.securePayment')
  
  const copied = ref(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.link)
      console.log('copied')
      copied.value = true
      setTimeout(() => copied.value = false, 2000) // reset après 2 sec
    } catch (err) {
      console.error('Erreur lors de la copie :', err)
    }
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
  
  .link-section {
    text-align: center;
    margin: 20px 0;
  }
  
  .link-section p {
    color: #cbd5e1;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  .copy-button {
    display: inline-block;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: #fff;
    padding: 10px 15px;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.3s, transform 0.2s;
    border: none;
    cursor: pointer;
  }
  
  .copy-button:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    transform: scale(1.03);
  }
  
  .secure-info {
    display: flex;
    align-items: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #94a3b8;
  }
  
  .lock-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
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
  }
  </style>
  