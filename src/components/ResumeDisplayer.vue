<template>
  <div class="">
    <div ref="cvContentDiv" class="cv-content-preview" :style="{ overflowY: isPreview ? 'hidden' : 'scroll' }">
      <div class="cv-content-inner"></div>
    </div>
  </div>

  <LinkDisplayerModal :show="showLinkDisplayerModal" link="" :linkText="linkText" :title="title" :description="description" :downloadLink="downloadLink" @close="closeLinkModal" />
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue';
import html2pdf from 'html2pdf.js';
import cvTemplate from '../templateHbs/cvTemplate.hbs?raw';
import LinkDisplayerModal from './LinkDisplayerModal.vue'
import axios from 'axios'
import { useResumeStore } from '../stores/resumeStore'
import router from '../router';
import { useToast } from 'vue-toastification';

const { getResume } = useResumeStore()
const toast = useToast()

// Add props for cvData and isPreview
const props = defineProps({
  isPreview: { type: Boolean, default: false },
  refreshKey: Number,
  email: String
})

const emit = defineEmits(['download']);

const cvIframe = ref(null);
let compiledTemplate = null;
const showEditor = ref(false);
const cvContentDiv = ref(null);
const showPuppeteerModal = ref(false)
const showLinkDisplayerModal = ref(false)
const downloadLink = ref('')
const linkText = ref('')
const description = ref('Description')
const title = ref('Line de téléchargement')

const numberOfPages = ref(0)
const A4_HEIGHT_PX = 1123;

const cvData = ref(getResume())

const closeLinkModal = () => {
  showLinkDisplayerModal.value = false
}

watch(() => props.refreshKey, () => {
  downloadPdfServer()
})

const copyCvHtml = () => {
  // Copy the current HTML in the preview div to clipboard
  const el = document.createElement('textarea');
  el.value = cvContentDiv.value.innerHTML;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert('HTML du CV copié dans le presse-papiers. Collez-le dans un fichier cv.html.');
}

onMounted(() => {
  renderCvInIframe();
  renderCvInDiv();
})
// Fonction pour compiler le template Handlebars
const compileHandlebarsTemplate = () => {
  if (!compiledTemplate) {
    compiledTemplate = Handlebars.compile(cvTemplate);
  }
};

const renderCvInDiv = () => {
  if (!cvContentDiv.value) return;

  // After rendering, set height to next multiple of A4
  nextTick(() => {
    const A4_HEIGHT = 1123;
    const contentHeight = inner.scrollHeight;
    const numPages = Math.ceil(contentHeight / A4_HEIGHT);
    inner.style.height = (numPages * A4_HEIGHT) + 'px';
    numberOfPages.value = numPages
  });


  compileHandlebarsTemplate();
  const htmlContent = compiledTemplate(cvData.value);

  // Find the inner container
  let inner = cvContentDiv.value.querySelector('.cv-content-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'cv-content-inner';
    cvContentDiv.value.appendChild(inner);
  }
  inner.innerHTML = htmlContent;

  
};

// Dans App.vue
const downloadPdf = async() => {
  const iframe = cvIframe.value;

  if (!iframe || !iframe.contentDocument) {
    alert('Le CV n\'est pas encore chargé dans l\'aperçu.');
    return;
  }

  const element = iframe.contentDocument.querySelector('.cv-container');

  if (element) {
    const originalShowEditor = showEditor.value;
    showEditor.value = false;
    await nextTick(); // Attend que Vue ait caché l'éditeur

    // Ajoute un court délai pour permettre au rendu de l'iframe de se stabiliser
    // C'est souvent crucial pour html2canvas
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms, ajustez si besoin

    const options = {
      margin: 10,
      filename: 'mon-cv.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // Augmente la résolution pour une meilleure qualité de texte
        logging: true, // Active le logging dans la console pour le débogage de html2canvas
        dpi: 192, // Double le DPI pour une meilleure clarté
        letterRendering: true, // Peut améliorer le rendu du texte
        useCORS: true, // Essaye de charger les images/polices cross-origin (Font Awesome, Google Fonts)
        // ignoreElements: (element) => { // Optionnel: ignorer certains éléments si vous savez qu'ils posent problème
        //   return element.classList.contains('do-not-print');
        // }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: {
  mode: ['css', 'legacy'],
  before: ['.section-title', '.page-break'],
  avoid: ['.avoid-break', '.section', '.timeline-item', '.project-item', '.award-item']
}
    };

    html2pdf().set(options).from(element).save().then(() => {
      showEditor.value = originalShowEditor;
    }).catch(error => {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF. Vérifiez la console pour plus de détails.");
      this.showEditor = originalShowEditor;
    });
  } else {
    alert('L\'élément .cv-container est introuvable dans l\'iframe. Impossible de générer le PDF.');
  }
}

const downloadPdf_div = async() => {
      // Accédez à la div via la ref du composant CvViewer
      // `cvViewerRef` est la ref sur le composant CvViewer
      // `cvContentDiv` est la propriété exposée par CvViewer
      const contentDiv = cvContentDiv.value;

      if (!contentDiv) {
        alert('Le contenu du CV n\'est pas encore chargé dans l\'aperçu.');
        return;
      }

      // La cible de html2pdf.js est maintenant directement la div
      // Assurez-vous que .cv-container est toujours la classe racine dans votre template HBS
      const element = contentDiv.querySelector('.cv-container');

      if (element) {
        const options = {
          margin: 0,
          filename: 'mon-cv.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            logging: true,
            dpi: 192,
            letterRendering: true,
            useCORS: true, // Gardez useCORS, même si moins critique ici, ça ne fait pas de mal
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const originalShowEditor = showEditor.value;
        showEditor.value = false;
        await nextTick(); 

        await new Promise(resolve => setTimeout(resolve, 300));

        html2pdf().set(options).from(element).save().then(() => {
          showEditor.value  = originalShowEditor;
        }).catch(error => {
          console.error("Erreur lors de la génération du PDF:", error);
          alert("Une erreur est survenue lors de la génération du PDF. Vérifiez la console pour plus de détails.");
          showEditor.value = originalShowEditor;
        });
      } else {
        alert('L\'élément .cv-container est introuvable dans la div d\'aperçu. Impossible de générer le PDF.');
      }
    }

const downloadPdfServer = async () => {

  cvData.value = { ...cvData.value, cvPageHeight: `${numberOfPages.value * A4_HEIGHT_PX}px` }

  // Use the compiled Handlebars template output (full HTML document)
  compileHandlebarsTemplate();
  const html = compiledTemplate(cvData.value); // This should be a full HTML doc
  try {
    const response = await fetch('http://localhost:3001/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'text/html' },
      body: html
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la génération du PDF côté serveur.');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);

    const formData = new FormData();
    formData.append('cv', blob, 'cv.pdf');
    formData.append('email', props.email);

    try {
      const res = await axios.post('http://localhost:3001/send-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      downloadLink.value = res.data.downloadUrl;
      linkText.value = res.data.downloadUrl;
      toast.info(downloadLink.value, {
        position: POSITION.BOTTOM_RIGHT,
      }).then(() => {
        showLinkDisplayerModal.value = true;
      });

      router.push('/')
    } catch (err) {
      console.error('Error uploading CV:', err);
    }
    
  } catch (err) {
    alert('Erreur lors de la génération du PDF côté serveur: ' + err.message);
  }
}
// Fonction pour rendre le CV dans l'iframe
const renderCvInIframe = () => {
  if (!cvIframe.value) return; // S'assurer que l'iframe est montée

  compileHandlebarsTemplate(); // Compile le template si ce n'est pas déjà fait

  const iframeDoc = cvIframe.value.contentDocument || cvIframe.value.contentWindow.document;

  // Nettoyer le contenu existant de l'iframe
  iframeDoc.open();
  iframeDoc.write('');
  iframeDoc.close();

  // Rendre le template Handlebars avec les données du CV
  const htmlContent = compiledTemplate(cvData.value);

  // Écrire le HTML généré dans l'iframe
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

};

// Surveiller les changements de cvData et rendre le CV à nouveau
watch(
  () => cvData.value,
  () => {
    renderCvInIframe();
  },
  { deep: true, immediate: true } // immediate: true pour le rendu initial
);

watch(
  () => cvData.value,
  (newCvData) => {
    renderCvInDiv();
  },
  { deep: true } // Ne pas mettre immediate ici car onMounted le gère déjà, sauf si vous voulez re-rendre sur le premier chargement après une modification
);


defineExpose({
  cvIframe, // Expose la référence de l'iframe
  renderCvInIframe, // Expose la fonction de rendu si nécessaire pour des re-rendus manuels
   renderCvInDiv
});
</script>

<style scoped>
.cv-viewer-iframe-wrapper {
  width: 100%;
  height: 100%;
}


.cv-viewer-container-wrapper {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
}

.cv-content-preview {
  width: 794px; /* A4 width @ 96 dpi */
  height: 1123px; /* A4 height @ 96 dpi */
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  padding: 0;
  margin: 0;
  overflow-y: auto; /* Permet le défilement vertical si le contenu dépasse */
  overflow-x: hidden; /* Empêche le défilement horizontal */
}

/* Optional: Add responsiveness for smaller screens */
@media (max-width: 900px) {
  .cv-content-preview {
    width: 95%; /* Make it take more width on smaller screens */
    border-radius: 0; /* Remove rounded corners if it takes full width */
  }
}

.download-button.puppeteer-btn {
  margin-left: 1rem;
  background: #222;
  color: #fff;
}
.puppeteer-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.puppeteer-modal-content {
  background: #fff;
  color: #222;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 600px;
  width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.puppeteer-modal pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.95em;
}
.puppeteer-modal button {
  margin-top: 1rem;
  margin-right: 1rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  background: #3498db;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
.puppeteer-modal button:last-child {
  background: #aaa;
  color: #222;
}
.download-button.server-btn {
  margin-left: 1rem;
  background: #1e90ff;
  color: #fff;
}
</style>