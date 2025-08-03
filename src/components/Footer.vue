<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>AI Resume Builder</h4>
        <p>{{  t('footer.description') }}</p>
      </div>
      <div class="footer-section">
        <h4> {{  t('footer.quickLinks') }}</h4>
        <router-link to="/resume">{{  t('landing.create_resume') }} </router-link>
      </div>
      <div class="footer-section">
        <h4> {{  t('footer.resources') }} </h4>
        <a href="https://www.indeed.com/career-advice/resumes-cover-letters" target="_blank"> {{  t('footer.resumeTips') }} </a>
        <a href="https://www.linkedin.com/jobs" target="_blank"> {{  t('footer.jobSearch') }} </a>
        <a href="https://www.coursera.org/courses?query=career%20development" target="_blank"> {{  t('footer.careerAdvice') }} </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p> {{  t('footer.copyright', { year: new Date().getFullYear() }  ) }} </p>
    </div>
  </footer>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped>
.footer {
  position: relative;
  height:10rem;
  width: 100%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  margin-top: auto;
  padding: 1rem 0 0.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 0 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-section h4 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.footer-section p, .footer-section a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #fff;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
}

.footer-bottom {
  text-align: center;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: #94a3b8;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style> 