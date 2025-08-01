import { ref } from 'vue'
import type { Resume } from '../models/resume'

const STORAGE_KEY = 'AiResumeBuilder_ResumeData'

const defaultResume: Resume = {
  personal: {
    fullName: '',
    title: '',
    age: 0,
    photo: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    website: '',
    linkedin: '',
    github: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  awards: [],
  hobbies: []
}

const loadFromLocalStorage = (): Resume => {
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (storedData) {
    try {
      return JSON.parse(storedData)
    } catch (error) {
      console.error('Error parsing resume data from localStorage:', error)
    }
  }
  return defaultResume
}

const resumeRef = ref<Resume>(loadFromLocalStorage())


function saveToLocalStorage(data: Resume) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useResumeStore() {

  const getResume = () => {
    return resumeRef.value
  }

  const setResume = (newResume: Resume) => {
    resumeRef.value = newResume
    saveToLocalStorage(newResume)
  }

  const updatePartialResume = (partial: Partial<Resume>) => {
    resumeRef.value = {
      ...resumeRef.value,
      ...partial
    }
    saveToLocalStorage(resumeRef.value)
    console.log('Partial resume updated:', resumeRef.value)
  }

  const resetResume = () => {
    resumeRef.value = defaultResume
    saveToLocalStorage(defaultResume)
  }

  const removeResumeFromLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    setResume,
    getResume,
    removeResumeFromLocalStorage,
    updatePartialResume,
    resetResume
  }

}