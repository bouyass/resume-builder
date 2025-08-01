<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2 class="modal-title">Upload & Crop Photo</h2>
      <div v-if="!imageSelected" class="upload-section">
        <input type="file" accept="image/*" @change="onFileChange" ref="fileInput" class="hidden" />
        <button class="upload-btn" @click="$refs.fileInput.click()">Choose Photo</button>
      </div>
      <div v-else class="crop-section">
        <vue-cropper
          ref="cropper"
          :src="imageUrl"
          :aspect-ratio="1"
          :view-mode="1"
          :auto-crop-area="1"
          :background="false"
          :responsive="true"
          :check-cross-origin="false"
          class="cropper"
        />
        <div class="crop-actions">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="confirm-btn" @click="cropImage">Crop & Use</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import VueCropper from 'vue-cropperjs'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['close', 'confirm'])

const imageUrl = ref<string>('')
const imageSelected = ref(false)
const cropper = ref<any>(null)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      imageUrl.value = ev.target?.result as string
      imageSelected.value = true
    }
    reader.readAsDataURL(file)
  }
}

const cropImage = () => {
  if (cropper.value) {
    const canvas = cropper.value.getCroppedCanvas({
      width: 300,
      height: 300,
      imageSmoothingQuality: 'high'
    })
    if (canvas) {
      emit('confirm', canvas.toDataURL('image/png'))
      resetModal()
    }
  }
}

const closeModal = () => {
  emit('close')
  resetModal()
}

const resetModal = () => {
  imageUrl.value = ''
  imageSelected.value = false
  if (cropper.value) cropper.value.replace('')
}

watch(() => props.visible, (val) => {
  if (!val) resetModal()
})
</script>

<script lang="ts">
export default {
  name: 'PhotoCropModal'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #1e293b;
  border-radius: 1rem;
  padding: 2rem;
  min-width: 350px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1.5rem;
}
.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-btn {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.upload-btn:hover {
  background: linear-gradient(to right, #2563eb, #7c3aed);
}
.crop-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cropper {
  width: 300px;
  height: 300px;
  background: #111827;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}
.crop-actions {
  display: flex;
  gap: 1rem;
}
.cancel-btn, .confirm-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
}
.cancel-btn {
  background: #374151;
  color: #fff;
}
.confirm-btn {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: #fff;
}
.confirm-btn:hover {
  background: linear-gradient(to right, #2563eb, #7c3aed);
}
.hidden {
  display: none;
}
</style>
