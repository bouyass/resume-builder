<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>AI Resume Builder</h4>
        <p>Creating professional resumes with artificial intelligence</p>
      </div>
      <div class="footer-section">
        <h4>Quick Links</h4>
        <router-link to="/resume">Create Resume</router-link>
        <a href="#features">Features</a>
      </div>
      <div class="footer-section">
        <h4>Resources</h4>
        <a href="https://www.indeed.com/career-advice/resumes-cover-letters" target="_blank">Resume Tips</a>
        <a href="https://www.linkedin.com/jobs" target="_blank">Job Search</a>
        <a href="https://www.coursera.org/courses?query=career%20development" target="_blank">Career Courses</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 AI Resume Builder. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  height: 4rem;
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