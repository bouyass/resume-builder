<template>
  <div class="resume-builder" @click="closeDropdown">
    <!-- Modern Side Navigation -->
    <nav class="side-nav"> 
      <div class="nav-header">
        <h1 class="nav-title"> AI Resume builder </h1>
        <div class="progress-indicator">
          {{ t('resume.navigation.progress', { completed: completedSections, total: sections.length }) }}
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(completedSections/sections.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div class="nav-sections">
        <button 
          v-for="section in sections" 
          :key="section.id"
          :class="[
            'nav-button',
            { 
              'active': currentSection === section.id,
              'completed': isSectionCompleted(section.id)
            }
          ]"
          @click="setCurrentSection(section.id)"
        >
          <div class="nav-button-content">
            <span class="nav-icon" v-html="section.icon"></span>
            <span class="nav-text">{{ t(`resume.navigation.sections.${section.id}`) }}</span>
          </div>
          <div class="nav-indicators">
            <span 
              v-if="sectionErrors[section.id] > 0" 
              class="error-badge"
            >
              {{ sectionErrors[section.id] }}
            </span>
            <span v-else-if="isSectionCompleted(section.id)" class="check-icon" v-html="CheckCircleIcon"></span>
            <span v-else class="chevron-icon" v-html="ChevronRightIcon"></span>
          </div>
        </button>
      </div>

      <div class="nav-actions">
        <button 
        class="preview-button"
        @click="() => router.push('/templateList')"
        :disabled="false"
      >
        <span class="button-icon" v-html="EyeIcon"></span>
        {{ t('resume.buttons.preview') }}
      </button>
      </div>
    </nav>

    <!-- Main Form Container -->
    <div class="main-container">
      <div class="language-selector">
        <div class="custom-select" @click.stop="toggleDropdown">
          <div class="selected-option">
            <img 
              :src="`https://flagsapi.com/${getCurrentFlag()}/flat/24.png`"
              :alt="`${getCurrentLanguage()} flag`"
              class="flag-icon"
            />
            {{ getCurrentLanguage() }}
            <span class="select-arrow"></span>
          </div>
          <div class="select-options" v-if="showDropdown">
            <div 
              v-for="lang in availableLocales" 
              :key="lang.code"
              class="select-option"
              @click="selectLanguage(lang.code)"
            >
              <img 
                :src="`https://flagsapi.com/${lang.flag}/flat/24.png`"
                :alt="`${lang.name} flag`"
                class="flag-icon"
              />
              {{ lang.name }}
            </div>
          </div>
        </div>
      </div>
      <TransitionGroup 
        name="fade" 
      >
        <!-- Personal Information Section -->
        <div 
          v-show="currentSection === 'personal'" 
          class="form-section animate__animated animate__fadeIn"
          key="personal"
        >
          <div class="section-header">
            <h2 :class="{ completed: isSectionCompleted('personal') }">
              {{ t('resume.sections.personal.title') }}
            </h2>
            <p class="section-description">
              {{ t('resume.sections.personal.description') }}
            </p>
          </div>

          <div class="form-grid">
            <!-- Photo Upload Section -->
            <div class="photo-upload-container col-span-4">
              <div class="photo-preview">
                <img 
                  v-if="formData.personal.photo" 
                  :src="formData.personal.photo" 
                  alt="Profile photo"
                  class="preview-image"
                >
                <div v-else class="photo-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div class="photo-controls">
                <button 
                  @click="openPhotoModal"
                  class="upload-button"
                >
                  <span class="button-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </span>
                  {{ formData.personal.photo ? t('resume.sections.personal.fields.photo.change') : t('resume.sections.personal.fields.photo.upload') }}
                </button>
                <button 
                  v-if="formData.personal.photo"
                  @click="removePhoto"
                  class="remove-photo-button"
                >
                  {{t('resume.sections.personal.fields.photo.remove')}}
                </button>
              </div>
            </div>

            <div class="input-group col-span-2">
              <label>{{ t('resume.sections.personal.fields.fullName') }}</label>
              <input 
                v-model="formData.personal.fullName" 
                type="text" 
                :placeholder="t('resume.sections.personal.placeholders.fullName')"
                :class="{ 'input-error': personalErrors.fullName }"
                @blur="validatePersonal"
                @change="() => updatePartialResume({ personal: formData.personal })"
              >
              <span v-if="personalErrors.fullName" class="error-message">
                {{ personalErrors.fullName }}
              </span>
            </div>

            <div class="input-group">
              <label>{{ t('resume.sections.personal.fields.title') }}</label>
              <input 
                v-model="formData.personal.title"
                type="text" 
                :placeholder="t('resume.sections.personal.placeholders.title')"
                :class="{ 'input-error': personalErrors.title }"
                @blur="validatePersonal"
                @change="() => updatePartialResume({ personal: formData.personal })"
              >
              <span v-if="personalErrors.title" class="error-message">
                {{ personalErrors.title }}
              </span>
            </div>

            <div class="input-group">
              <label>{{ t('resume.sections.personal.fields.age') }}</label>
              <input 
                v-model="formData.personal.age" 
                type="number"
                min="16"
                max="100" 
                :placeholder="t('resume.sections.personal.placeholders.age')"
                :class="{ 'input-error': personalErrors.age }"
                @blur="validatePersonal"
                @change="() => updatePartialResume({ personal: formData.personal })"
              >
              <span v-if="personalErrors.age" class="error-message">
                {{ personalErrors.age }}
              </span>
            </div>

            <div class="input-group">
              <label>{{ t('resume.sections.personal.fields.email') }}</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input 
                  v-model="formData.personal.email" 
                  type="email" 
                  placeholder="Jhon@gmail.com"
                  :class="{ 'input-error': personalErrors.email }"
                  @blur="validatePersonal"
                  @change="() => updatePartialResume({ personal: formData.personal })"
                >
              </div>
              <span v-if="personalErrors.email" class="error-message">
                {{ personalErrors.email }}
              </span>
            </div>

            <div class="input-group">
              <label>{{ t('resume.sections.personal.fields.phone') }}</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input 
                  v-model="formData.personal.phone" 
                  type="tel" 
                  placeholder="+1 234 567 890"
                  :class="{ 'input-error': personalErrors.phone }"
                  @change="() => updatePartialResume({ personal: formData.personal })"
                >
              </div>
            </div>

            <div class="input-group col-span-2">
              <label>{{ t('resume.sections.personal.fields.location') }}</label>
              <div class="input-with-icon">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input 
                  v-model="formData.personal.location" 
                  type="text" 
                  placeholder="City, Country"
                  @change="() => updatePartialResume({ personal: formData.personal })"
                >
              </div>
            </div>

            <div class="input-group col-span-4">
              <label>{{ t('resume.sections.personal.fields.about') }}</label>
              <textarea 
                v-model="formData.personal.about" 
                :placeholder="t('resume.sections.personal.placeholders.about')"
                rows="2"
                maxlength="250"
                class="resize-none"
                :class="{ 'input-error': personalErrors.about }"
                @change="() => updatePartialResume({ personal: formData.personal })"
              ></textarea>
              <div class="input-helper">
                {{ t('resume.sections.personal.fields.about_helper') }}
              </div>
            </div>

            <!-- Social Links -->
            <div class="social-links-section col-span-4">
              <h3>{{ t('resume.sections.personal.fields.social.title') }}</h3>
              <div class="social-links-grid">
                <div class="input-group">
                  <div class="input-with-icon">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </span>
                    <input 
                      v-model="formData.personal.website" 
                      type="url" 
                      :placeholder="t('resume.sections.personal.placeholders.website')"
                      :class="{ 'input-error': personalErrors.website }"
                      @change="() => updatePartialResume({ personal: formData.personal })"
                    >
                  </div>
                </div>

                <div class="input-group">
                  <div class="input-with-icon">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </span>
                    <input 
                      v-model="formData.personal.linkedin" 
                      type="url" 
                      :placeholder="t('resume.sections.personal.placeholders.linkedin')"
                      :class="{ 'input-error': personalErrors.linkedin }"
                      @change="() => updatePartialResume({ personal: formData.personal })"
                    >
                  </div>
                </div>

                <div class="input-group">
                  <div class="input-with-icon">
                    <span class="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </span>
                    <input 
                      v-model="formData.personal.github" 
                      type="url" 
                      :placeholder="t('resume.sections.personal.placeholders.github')"
                      :class="{ 'input-error': personalErrors.github }"
                      @change="() => updatePartialResume({ personal: formData.personal })"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Experience Section -->
        <div v-show="currentSection === 'experience'" class="form-section" key="experience">
          <div class="section-header">
            <h2 :class="{ completed: isSectionCompleted('experience') }">
              {{ t('resume.sections.experience.title')  }}
            </h2>
            <p class="section-description"> {{ t('resume.sections.experience.description') }} </p>
          </div>
          <div class="entries-container">
            <div 
              v-for="(exp, index) in formData.experience" 
              :key="index" 
              class="experience-entry"
            >
              <div class="entry-header">
                <h3>{{ t('resume.navigation.sections.experience') }} #{{ index + 1 }}</h3>
                <button @click="removeExperience(index)" class="remove-button">
                  🗑️
                </button>
              </div>
              <div class="input-grid">
                <div class="input-group">
                  <label> {{ t('resume.sections.experience.fields.company') }} </label>
                  <input 
                    v-model="exp.company" 
                    type="text" 
                    placeholder="Company name"
                  >
                </div>
                <div class="input-group">
                  <label>Position</label>
                  <input 
                    v-model="exp.title" 
                    type="text" 
                    :placeholder="t('resume.sections.experience.placeholders.position')"
                    :class="{ 'input-error': experienceErrors[index]?.position }"
                  >
                  <span v-if="experienceErrors[index]?.position" class="error-message">
                    {{ experienceErrors[index].position }}
                  </span>
                </div>
                <div class="input-group">
                  <label>Start Date</label>
                  <input 
                    v-model="exp.startDate" 
                    type="date"
                    :class="{ 'input-error': experienceErrors[index]?.startDate }"
                  >
                  <span v-if="experienceErrors[index]?.startDate" class="error-message">
                    {{ experienceErrors[index].startDate }}
                  </span>
                </div>
                <div class="input-group">
                  <label>End Date</label>
                  <input 
                    v-model="exp.endDate" 
                    type="date"
                    :class="{ 'input-error': experienceErrors[index]?.endDate }"
                    :disabled="exp.current"
                  >
                  <span v-if="experienceErrors[index]?.endDate" class="error-message">
                    {{ experienceErrors[index].endDate }}
                  </span>
                </div>
                <div class="input-group">
                  <label> {{ t('resume.sections.experience.fields.location') }} </label>
                  <input 
                    v-model="exp.company" 
                    type="text" 
                    placeholder="Location (City, Country)"
                  >
                </div>
                <div class="input-group col-span-4">
                  <label> {{ t('resume.sections.experience.fields.description') }} </label>
                  <textarea 
                    v-model="exp.description" 
                    :placeholder="t('resume.sections.experience.placeholders.description')"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="add-button-container">
            <button @click="addExperience" class="add-button">
              + {{ t('resume.sections.experience.fields.addExperience') }}
            </button>
          </div>
        </div>

        <!-- Education Section -->
        <div v-show="currentSection === 'education'" class="form-section" key="education">
          <div class="section-header">
            <h2 :class="{ completed: isSectionCompleted('education') }">
              {{ t('resume.sections.education.title') }}
            </h2>
            <p class="section-description"> {{ t('resume.sections.education.description') }}</p>
          </div>
          <div class="entries-container">
            <div v-for="(edu, index) in formData.education" :key="index" class="education-entry">
              <div class="entry-header">
                <h3>{{ t('resume.sections.education.title') }} #{{ index + 1 }}</h3>
                <button @click="removeEducation(index)" class="remove-button">🗑️</button>
              </div>
              <div class="input-grid">
                <div class="input-group col-span-2">
                  <label> {{ t('resume.sections.education.fields.institution') }} </label>
                  <input 
                    v-model="edu.institution" 
                    type="text" 
                    placeholder="University/School name"
                    :class="{ 'input-error': educationErrors[index]?.institution }"
                  >
                  <span v-if="educationErrors[index]?.institution" class="error-message">
                    {{ educationErrors[index].institution }}
                  </span>
                </div>
                <div class="input-group col-span">
                  <label> {{ t('resume.sections.education.fields.degree') }} </label>
                  <input 
                    v-model="edu.degree" 
                    type="text" 
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    :class="{ 'input-error': educationErrors[index]?.degree }"
                  >
                  <span v-if="educationErrors[index]?.degree" class="error-message">
                    {{ educationErrors[index].degree }}
                  </span>
                </div>
                <div class="input-group col-span">
                  <label> {{ t('resume.sections.education.fields.location') }} </label>
                  <input 
                    v-model="edu.degree" 
                    type="text" 
                    placeholder="Location (City, Country)"
                    :class="{ 'input-error': educationErrors[index]?.degree }"
                  >
                  <span v-if="educationErrors[index]?.degree" class="error-message">
                    {{ educationErrors[index].degree }}
                  </span>
                </div>
                <div class="input-group">
                  <label> {{ t('resume.sections.education.fields.startDate') }} </label>
                  <input 
                    v-model="edu.startDate" 
                    type="date"
                    :class="{ 'input-error': educationErrors[index]?.startDate }"
                  >
                  <span v-if="educationErrors[index]?.startDate" class="error-message">
                    {{ educationErrors[index].startDate }}
                  </span>
                </div>
                <div class="input-group">
                  <label> {{ t('resume.sections.education.fields.endDate') }} </label>
                  <input 
                    v-model="edu.endDate" 
                    type="date"
                    :class="{ 'input-error': educationErrors[index]?.endDate }"
                  >
                  <span v-if="educationErrors[index]?.endDate" class="error-message">
                    {{ educationErrors[index].endDate }}
                  </span>
                </div>
                <div class="input-group col-span-4">
                  <label> {{ t('resume.sections.education.fields.description') }} </label>
                  <textarea 
                    v-model="edu.description" 
                    :placeholder="t('resume.sections.education.placeholders.description')"
                    rows="2"
                    maxlength="150"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="add-button-container">
            <button @click="addEducation" class="add-button">+ Add Education</button>
          </div>
        </div>

        <!-- Skills Section -->
        <div v-show="currentSection === 'skills'" class="form-section" key="skills">
          <div class="section-header">
            <h2> {{ t('resume.sections.skills.title') }} </h2>
            <p class="section-description"> {{ t('resume.sections.skills.description') }}</p>
          </div>

          <div class="skills-container">
            <div class="skill-category" v-for="(category, index) in formData.skills" :key="index">
              <div class="category-header">
                <div class="category-title">
                  <input 
                    v-model="category.name" 
                    type="text" 
                    :placeholder="t('resume.sections.skills.placeholders.category')"
                    class="category-name"
                  >
                  <div class="category-controls">
                    <label class="toggle-label">
                      <input 
                        type="checkbox" 
                        v-model="category.withLevel"
                        class="toggle-input"
                      >
                      <span class="toggle-text"> {{ t('resume.sections.skills.show_levels') }} </span>
                    </label>
                    <button @click="removeSkillCategory(index)" class="remove-button">🗑️</button>
                  </div>
                </div>
              </div>
              
              <div class="skills-list">
                <div v-for="(skill, skillIndex) in category.skills" :key="skillIndex" class="skill-item">
                  <div class="input-group skill-input">
                    <input 
                      v-model="skill.name" 
                      type="text" 
                      :placeholder="t('resume.sections.skills.placeholders.name')"
                    >
                  </div>
                  <div v-if="category.withLevel" class="input-group level-select">
                    <select v-model="skill.level">
                      <option value="beginner">{{ t('resume.sections.skills.levels.beginner') }}</option>
                      <option value="intermediate"> {{ t('resume.sections.skills.levels.intermediate') }} </option>
                      <option value="advanced"> {{ t('resume.sections.skills.levels.advanced') }} </option>
                      <option value="expert"> {{ t('resume.sections.skills.levels.expert') }} </option>
                    </select>
                  </div>
                  <button @click="removeSkill(index, skillIndex)" class="remove-skill">×</button>
                </div>
                <button @click="addSkill(index)" class="add-skill">+ {{ t('resume.sections.skills.add_skill') }} </button>
              </div>
            </div>
            <button @click="addSkillCategory" class="add-button">+ {{ t('resume.sections.skills.add_skill_category') }}</button>
          </div>
        </div>

        <!-- Projects Section -->
        <div v-show="currentSection === 'projects'" class="form-section" key="projects">
          <div class="section-header">
            <h2 :class="{ completed: isSectionCompleted('projects') }">
              {{ t('resume.sections.projects.title') }}
            </h2>
            <p class="section-description"> {{ t('resume.sections.projects.description') }} </p>
          </div>
          <div class="entries-container">
            <div v-for="(project, index) in formData.projects" :key="index" class="project-entry">
              <div class="entry-header">
                <h3> {{ t('resume.sections.projects.project') }}  #{{ index + 1 }}</h3>
                <button @click="removeProject(index)" class="remove-button">🗑️</button>
              </div>
              
              <div class="input-grid">
                <div class="input-group col-span-2">
                  <label> {{ t('resume.sections.projects.fields.name') }} </label>
                  <input 
                    v-model="project.title" 
                    type="text" 
                    placeholder="Project title"
                    :class="{ 'input-error': projectErrors[index]?.name }"
                  >
                  <span v-if="projectErrors[index]?.name" class="error-message">
                    {{ projectErrors[index].name }}
                  </span>
                </div>
                
                <div class="input-group col-span-2">
                  <label> {{ t('resume.sections.projects.fields.role') }} </label>
                  <input 
                    v-model="project.role" 
                    type="text" 
                    placeholder="Your role in the project"
                    :class="{ 'input-error': projectErrors[index]?.role }"
                  >
                  <span v-if="projectErrors[index]?.role" class="error-message">
                    {{ projectErrors[index].role }}
                  </span>
                </div>
                
                <div class="input-group col-span-2">
                  <label> {{ t('resume.sections.projects.fields.url') }} </label>
                  <input v-model="project.url" type="url" placeholder="Link to project/repository">
                </div>
                
                <div class="input-group col-span-2">
                  <label> {{ t('resume.sections.projects.fields.technologies') }} </label>
                  <input 
                    v-model="project.technologies" 
                    type="text" 
                    placeholder="e.g., React, Node.js, MongoDB"
                  >
                </div>
                
                <div class="input-group col-span-4">
                  <label> {{ t('resume.sections.projects.fields.description') }} </label>
                  <textarea 
                    v-model="project.description" 
                    :placeholder="t('resume.sections.projects.placeholders.description')"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="add-button-container">
            <button @click="addProject" class="add-button">+ {{ t('resume.sections.projects.addProject') }}  </button>
          </div>
        </div>

        <!-- Awards Section -->
        <div v-show="currentSection === 'awards'" class="form-section" key="awards">
          <div class="section-header">
            <h2 :class="{ completed: isSectionCompleted('awards') }">
              {{ t('resume.sections.awards.title') }}
            </h2>
            <p class="section-description"> {{ t('resume.sections.awards.description') }} </p>
          </div>
          
          <div v-for="(award, index) in formData.awards" :key="index" class="award-entry">
            <div class="entry-header">
              <h3> {{ t('resume.sections.awards.award') }} #{{ index + 1 }}</h3>
              <button @click="removeAward(index)" class="remove-button">🗑️</button>
            </div>
            
            <div class="input-grid">
              <div class="input-group col-span-2">
                <label> {{ t('resume.sections.awards.fields.title') }} </label>
                <input 
                  v-model="award.title" 
                  type="text" 
                  placeholder="Award/Certification name"
                  :class="{ 'input-error': awardErrors[index]?.title }"
                >
                <span v-if="awardErrors[index]?.title" class="error-message">
                  {{ awardErrors[index].title }}
                </span>
              </div>
              
              <div class="input-group col-span-2">
                <label>  {{ t('resume.sections.awards.fields.issuer') }} </label>
                <input 
                  v-model="award.issuer" 
                  type="text" 
                  placeholder="Organization name"
                  :class="{ 'input-error': awardErrors[index]?.issuer }"
                >
                <span v-if="awardErrors[index]?.issuer" class="error-message">
                  {{ awardErrors[index].issuer }}
                </span>
              </div>
              
              <div class="input-group">
                <label> {{ t('resume.sections.awards.fields.date') }} </label>
                <input 
                  v-model="award.date" 
                  type="date"
                  :class="{ 'input-error': awardErrors[index]?.date }"
                >
                <span v-if="awardErrors[index]?.date" class="error-message">
                  {{ awardErrors[index].date }}
                </span>
              </div>
              
              <div class="input-group">
                <label> {{ t('resume.sections.awards.fields.expiryDate') }} </label>
                <input v-model="award.expiryDate" type="date">
              </div>
              
              <div class="input-group col-span-4">
                <label> {{ t('resume.sections.awards.fields.description') }} </label>
                <textarea 
                  v-model="award.description" 
                  :placeholder="t('resume.sections.awards.placeholders.description')"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          <button @click="addAward" class="add-button">+ {{ t('resume.sections.awards.addAwardCertification') }}</button>
        </div>

        <!-- Hobbies Section -->
        <div v-show="currentSection === 'hobbies'" class="form-section" key="hobbies">
          <div class="section-header">
            <h2> {{ t('resume.sections.hobbies.title') }} </h2>
            <p class="section-description"> {{ t('resume.sections.hobbies.description') }} </p>
          </div>
          
          <div class="hobbies-container">
            <div class="hobby-tags">
              <div 
                v-for="(hobby, index) in formData.hobbies" 
                :key="index" 
                class="hobby-tag"
              >
                <span>{{ hobby }}</span>
                <button @click="removeHobby(index)" class="remove-tag">×</button>
              </div>
            </div>
            
            <div class="add-hobby-form">
              <div class="input-group">
                <input 
                  v-model="newHobby" 
                  type="text" 
                  :placeholder="t('resume.sections.hobbies.placeholders.input')"
                  @keyup.enter="addHobby"
                >
              </div>
            </div>
          </div>
        </div>

      </TransitionGroup>
      <!-- Photo Crop Modal -->
      <PhotoCropModal
        :visible="showPhotoModal"
        @close="closePhotoModal"
        @confirm="handlePhotoCropped"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import type { Award, Education, Experience, Project, Resume, SkillCategory } from '../models/resume'
import PhotoCropModal from './PhotoCropModal.vue'
import { useResumeStore } from '../stores/resumeStore'

//initialze resume store
const { getResume, updatePartialResume, setIsResumeDownloadable } = useResumeStore()



// SVG icons as components
const CheckCircleIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`

const ChevronRightIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
</svg>`

const EyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
</svg>`

const DocumentCheckIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
</svg>`

const sections: { id: SectionId; name: string; icon: string }[] = [
  { id: 'personal', name: 'Personal Info', icon: '👤' },
  { id: 'experience', name: 'Experience', icon: '💼' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'skills', name: 'Skills', icon: '⚡' },
  { id: 'projects', name: 'Projects', icon: '🚀' },
  { id: 'awards', name: 'Awards', icon: '🏆' },
  { id: 'hobbies', name: 'Hobbies', icon: '🎨' }
]

const currentSection = ref('personal')

const formData = ref<Resume>({
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
})

const newHobby = ref('')

const { t, locale } = useI18n()
const router = useRouter()
const toast = useToast()

const availableLocales = [
  { code: 'en', name: 'English', dir: 'ltr', flag: 'GB' },
  { code: 'fr', name: 'Français', dir: 'ltr', flag: 'FR' },
  { code: 'es', name: 'Español', dir: 'ltr', flag: 'ES' },
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: 'SA' }
]

const showDropdown = ref(false)

const closeDropdown = () => {
  showDropdown.value = false
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const getCurrentLanguage = () => {
  return availableLocales.find(lang => lang.code === locale.value)?.name || 'English'
}

const getCurrentFlag = () => {
  return availableLocales.find(lang => lang.code === locale.value)?.flag || 'GB'
}

const selectLanguage = (code: string) => {
  locale.value = code
  document.documentElement.dir = availableLocales.find(l => l.code === code)?.dir || 'ltr'
}

const setCurrentSection = (sectionId: string) => {
  if (currentSection.value === 'personal') {
    validatePersonal()
  } else if (currentSection.value === 'experience') {
    validateExperience()
  } else if (currentSection.value === 'education') {
    validateEducation()
  } else if (currentSection.value === 'projects') {
    validateProjects()
  } else if (currentSection.value === 'awards') {
    validateAwards()
  }
  currentSection.value = sectionId
}

const addExperience = () => {
  formData.value.experience.push({
    company: '',
    title: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: ''
  })
  experienceErrors.value.push({
    position: '',
    startDate: '',
    endDate: ''
  })
  validateExperience()
}

const removeExperience = (index: number) => {
  formData.value.experience.splice(index, 1)
  experienceErrors.value.splice(index, 1)
  validateExperience()

  updatePartialResume({
    experience: formData.value.experience
  })
}

const addEducation = () => {
  formData.value.education.push({
    institution: '',
    degree: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: ''
  })
  educationErrors.value.push({
    institution: '',
    degree: '',
    startDate: '',
    endDate: ''
  })
  validateEducation()

  updatePartialResume({
    education: formData.value.education
  })
}

const removeEducation = (index: number) => {
  formData.value.education.splice(index, 1)
  educationErrors.value.splice(index, 1)
  validateEducation()
  updatePartialResume({
    education: formData.value.education
  })
}

const addSkillCategory = () => {
  formData.value.skills.push({
    name: '',
    withLevel: false,
    skills: []
  })
  updatePartialResume({
    skills: formData.value.skills
  })
}


/**
 * Removes the skill category at the given index from the formData.value.skills array.
 * @param {number} index The index of the skill category to remove.
 */
const removeSkillCategory = (index: number) => {
  formData.value.skills.splice(index, 1)
  updatePartialResume({
    skills: formData.value.skills
  })
}

const addSkill = (index: number) => {
  formData.value.skills[index].skills.push({
    name: '',
    level: 'beginner'
  })
}

const removeSkill = (categoryIndex: number, skillIndex: number) => {
  formData.value.skills[categoryIndex].skills.splice(skillIndex, 1)
  updatePartialResume({
    skills: formData.value.skills
  })
}

const addProject = () => {
  formData.value.projects.push({
    title: '',
    role: '',
    url: '',
    technologies: [],
    description: '',
    link: ''
  })
  projectErrors.value.push({
    name: '',
    role: ''
  })
  validateProjects()
  updatePartialResume({
    projects: formData.value.projects
  })
}

const removeProject = (index: number) => {
  formData.value.projects.splice(index, 1)
  projectErrors.value.splice(index, 1)
  validateProjects()
  updatePartialResume({
    projects: formData.value.projects
  })
}

const addAward = () => {
  formData.value.awards.push({
    title: '',
    issuer: '',
    date: '',
    expiryDate: '',
    description: ''
  })
  awardErrors.value.push({
    title: '',
    issuer: '',
    date: ''
  })
  validateAwards()
  updatePartialResume
}

const removeAward = (index: number) => {
  formData.value.awards.splice(index, 1)
  awardErrors.value.splice(index, 1)
  validateAwards()
}

const addHobby = () => {
  if (newHobby.value.trim()) {
    formData.value.hobbies.push(newHobby.value.trim())
    newHobby.value = ''
    updatePartialResume({
      hobbies: formData.value.hobbies
    })
  }
}

const removeHobby = (index: number) => {
  formData.value.hobbies.splice(index, 1)
  updatePartialResume({
    hobbies: formData.value.hobbies
  })
}

const completedSections = computed(() => {
  let completed = 0;
  
  // Personal section is completed if it has no errors and required fields are filled
  if (sectionErrors.personal === 0 && formData.value.personal.fullName && formData.value.personal.email) {
    completed++;
  }

  // Experience section is completed only if there is at least one valid experience
  if (formData.value.experience.length > 0 && sectionErrors.experience === 0) {
    completed++;
  }

  // Education section is completed only if there is at least one valid education entry
  if (formData.value.education.length > 0 && sectionErrors.education === 0) {
    completed++;
  }

  // Skills section is completed if at least one skill exists in any category
  if (formData.value.skills.some((cat: SkillCategory) => cat.name && cat.skills.some(skill => skill.name))) {
    completed++;
  }

  // Projects section is completed if at least one valid project exists
  if (formData.value.projects.length > 0 && sectionErrors.projects === 0) {
    completed++;
  }

  // Awards section is completed if at least one valid award exists
  if (formData.value.awards.length > 0 && sectionErrors.awards === 0) {
    completed++;
  }

  // Hobbies section is completed if at least one hobby exists
  if (formData.value.hobbies.length > 0) {
    completed++;
  }

  return completed;
})

const isSectionCompleted = (sectionId: string): boolean => {
  switch (sectionId) {
    case 'personal':
      return !!formData.value.personal.fullName && !!formData.value.personal.email && sectionErrors.personal === 0;
    case 'experience':
      return formData.value.experience.length > 0 && sectionErrors.experience === 0;
    case 'education':
      return formData.value.education.length > 0 && sectionErrors.education === 0;
    case 'skills':
      // Section is complete if there's at least one skill in any category
      return formData.value.skills.some((cat: SkillCategory) => cat.name && cat.skills.some(skill => skill.name));
    case 'projects':
      return formData.value.projects.length > 0 && sectionErrors.projects === 0;
    case 'awards':
      return formData.value.awards.length > 0 && sectionErrors.awards === 0;
    case 'hobbies':
      // Section is complete if there's at least one hobby
      return formData.value.hobbies.length > 0;
    default:
      return false;
  }
}

const saveResume = () => {
  // Implement logic to save the resume
}

interface PersonalErrors {
  fullName: string;
  title: string;
  age: string;
  email: string;
  phone: string;
  about: string;
  website: string;
  linkedin: string;
  github: string;
}

const personalErrors = reactive<PersonalErrors>({
  fullName: '',
  title: '',
  age: '',
  email: '',
  phone: '',
  about: '',
  website: '',
  linkedin: '',
  github: ''
})

const validatePersonal = () => {
  let isValid = true;
  
  // Reset errors
  Object.keys(personalErrors).forEach(key => {
    personalErrors[key as keyof PersonalErrors] = ''
  })

  // Required fields validation
  if (!formData.value.personal.fullName.trim()) {
    personalErrors.fullName = t('resume.errors.required_field')
    isValid = false
  } else if (formData.value.personal.fullName.length < 2) {
    personalErrors.fullName = t('resume.errors.name_too_short')
    isValid = false
  }

  if (!formData.value.personal.title.trim()) {
    personalErrors.title = t('resume.errors.required_field')
    isValid = false
  }

  // Email validation (required)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.personal.email.trim()) {
    personalErrors.email = t('resume.errors.required_field')
    isValid = false
  } else if (!emailRegex.test(formData.value.personal.email)) {
    personalErrors.email = t('resume.errors.invalid_email')
    isValid = false
  }

  // Age validation (not required, but validate if provided)
  if (formData.value.personal.age && formData.value.personal.age > 0) {
    const age = formData.value.personal.age
    if (isNaN(age) || age < 16 || age > 100) {
      personalErrors.age = t('resume.errors.invalid_age')
      isValid = false
    }
  }

  // Phone validation (optional but must be valid if provided)
  if (formData.value.personal.phone) {
    const phoneRegex = /^\+?[\d\s-]{8,}$/
    if (!phoneRegex.test(formData.value.personal.phone)) {
      personalErrors.phone = t('resume.errors.invalid_phone')
      isValid = false
    }
  }

  // URL validations (optional but must be valid if provided)
  const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/
  if (formData.value.personal.website && !urlRegex.test(formData.value.personal.website)) {
    personalErrors.website = t('resume.errors.invalid_url')
    isValid = false
  }
  if (formData.value.personal.linkedin && !urlRegex.test(formData.value.personal.linkedin)) {
    personalErrors.linkedin = t('resume.errors.invalid_url')
    isValid = false
  }
  if (formData.value.personal.github && !urlRegex.test(formData.value.personal.github)) {
    personalErrors.github = t('resume.errors.invalid_url')
    isValid = false
  }

  // About validation (optional but with max length)
  if (formData.value.personal.about && formData.value.personal.about.length > 500) {
    personalErrors.about = t('resume.errors.about_too_long')
    isValid = false
  }

  // Update error count
  updatePersonalErrorCount()
  return isValid
}

// Watch for form data changes and validate
watch(() => formData.value.personal, () => {
  validatePersonal()
}, { deep: true })


interface ExperienceErrors {
  position: string;
  startDate: string;
  endDate: string;
}

const experienceErrors = ref<ExperienceErrors[]>([])

const validateExperience = () => {
  let totalErrors = 0;
  
  // If no experiences, don't count any errors but don't mark as complete either
  if (formData.value.experience.length === 0) {
    sectionErrors.experience = 0;
    return false;
  }
  
  // Reset errors array to match current experiences length
  experienceErrors.value = formData.value.experience.map(() => ({
    position: '',
    startDate: '',
    endDate: ''
  }));
  
  // Validate each experience entry
  formData.value.experience.forEach((exp: Experience, index: number) => {
    // Required fields validation
    if (!exp.title.trim()) {
      experienceErrors.value[index].position = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!exp.startDate) {
      experienceErrors.value[index].startDate = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!exp.current && !exp.endDate) {
      experienceErrors.value[index].endDate = t('resume.errors.required_field');
      totalErrors++;
    }
  });
  
  sectionErrors.experience = totalErrors;
  return totalErrors === 0;
}

// Watch for experience changes
watch(() => formData.value.experience, () => {
  validateExperience()
}, { deep: true })

interface EducationErrors {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

const educationErrors = ref<EducationErrors[]>([]);

const validateEducation = () => {
  let totalErrors = 0;
  
  // If no education entries, don't count any errors but don't mark as complete
  if (formData.value.education.length === 0) {
    sectionErrors.education = 0;
    return false;
  }
  
  // Reset errors array to match current education entries length
  educationErrors.value = formData.value.education.map(() => ({
    institution: '',
    degree: '',
    startDate: '',
    endDate: ''
  }));
  
  // Validate each education entry
  formData.value.education.forEach((edu: Education, index: number) => {
    // Required fields validation
    if (!edu.institution.trim()) {
      educationErrors.value[index].institution = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!edu.degree.trim()) {
      educationErrors.value[index].degree = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!edu.startDate) {
      educationErrors.value[index].startDate = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!edu.endDate) {
      educationErrors.value[index].endDate = t('resume.errors.required_field');
      totalErrors++;
    }
  });
  
  sectionErrors.education = totalErrors;
  return totalErrors === 0;
}

// Watch for education changes
watch(() => formData.value.education, () => {
  validateEducation()
}, { deep: true })

interface ProjectErrors {
  name: string;
  role: string;
}

const projectErrors = ref<ProjectErrors[]>([]);

interface AwardErrors {
  title: string;
  issuer: string;
  date: string;
}

const awardErrors = ref<AwardErrors[]>([]);

const validateProjects = () => {
  let totalErrors = 0;
  
  // If no projects, don't count any errors but don't mark as complete
  if (formData.value.projects.length === 0) {
    sectionErrors.projects = 0;
    return false;
  }
  
  // Reset errors array to match current projects length
  projectErrors.value = formData.value.projects.map(() => ({
    name: '',
    role: ''
  }));
  
  // Validate each project entry
  formData.value.projects.forEach((proj: Project, index: number) => {
    if (!proj.title.trim()) {
      projectErrors.value[index].name = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!proj.role.trim()) {
      projectErrors.value[index].role = t('resume.errors.required_field');
      totalErrors++;
    }
  });
  
  sectionErrors.projects = totalErrors;
  return totalErrors === 0;
}

const validateAwards = () => {
  let totalErrors = 0;
  
  // If no awards, don't count any errors but don't mark as complete
  if (formData.value.awards.length === 0) {
    sectionErrors.awards = 0;
    return false;
  }
  
  // Reset errors array to match current awards length
  awardErrors.value = formData.value.awards.map(() => ({
    title: '',
    issuer: '',
    date: ''
  }));
  
  // Validate each award entry
  formData.value.awards.forEach((award: Award, index: number) => {
    if (!award.title.trim()) {
      awardErrors.value[index].title = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!award.issuer.trim()) {
      awardErrors.value[index].issuer = t('resume.errors.required_field');
      totalErrors++;
    }
    
    if (!award.date) {
      awardErrors.value[index].date = t('resume.errors.required_field');
      totalErrors++;
    }
  });
  
  sectionErrors.awards = totalErrors;
  return totalErrors === 0;
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  validatePersonal()
  validateExperience()
  validateEducation()
  validateProjects()
  validateAwards()

  formData.value = getResume()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// Define type for section IDs
type SectionId = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'awards' | 'hobbies';

// Update sectionErrors type
const sectionErrors = reactive<Record<SectionId, number>>({
  personal: 0,
  experience: 0,
  education: 0,
  skills: 0,
  projects: 0,
  awards: 0,
  hobbies: 0
});

// Update error count when validating personal section
const updatePersonalErrorCount = () => {
  sectionErrors.personal = Object.values(personalErrors).filter(error => error !== '').length
}

// Add modal state
const showPhotoModal = ref(false)

// New handler for cropped photo
const handlePhotoCropped = (croppedDataUrl: string) => {
  formData.value.personal.photo = croppedDataUrl
  updatePartialResume({
    personal: formData.value.personal
  })
  showPhotoModal.value = false
}

const openPhotoModal = () => {
  showPhotoModal.value = true
}

const removePhoto = () => {
  formData.value.personal.photo = ''
  updatePartialResume({
    personal: formData.value.personal
  })
  showPhotoModal.value = false
}

const closePhotoModal = () => {
  showPhotoModal.value = false
}

// Function to check if there are any errors
const hasErrors = computed(() => {
  return Object.values(sectionErrors).some(errors => errors > 0)
})

watch(hasErrors, () => {
  setIsResumeDownloadable(hasErrors.value)
})

// Handle preview button click
const handlePreview = () => {
  console.log('fdsqgf')
  router.push('/templateList')
}
</script>

<style scoped>
.resume-builder {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  color: #fff;
}

.side-nav {
  width: 320px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
}

.nav-header {
  margin-bottom: 2rem;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.progress-indicator {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  transition: all 0.3s;
}

.nav-sections {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  text-align: left;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-button.active {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
}

.nav-button.completed:not(.active) {
  color: #059669;
}

.nav-button.completed.active {
  color: #60a5fa;
}

.nav-button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-icon {
  width: 1rem;
  height: 1rem;
  display: inline-flex;
  align-items: center;
}

.check-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #10b981;
}

.chevron-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: #94a3b8;
}

.nav-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
}

.preview-button, .save-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.preview-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.preview-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.save-button {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  border: none;
}

.save-button:hover {
  background: linear-gradient(to right, #2563eb, #7c3aed);
}

.button-icon {
  width: 1rem;
  height: 1rem;
}

.main-container {
  flex: 1;
  margin-left: 320px;
  padding: 2rem;
}

.form-section {
  max-width: 56rem;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem;
  max-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.section-header {
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.section-header h2 {
  font-size: 1.875rem;
  font-weight: bold;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #6b7280;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.col-span-2 {
  grid-column: span 2;
}

.col-span-4 {
  grid-column: span 4;
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
}

input, textarea {
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

textarea {
  resize: vertical;
  min-height: 100px;
  max-height: 300px;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.875rem;
  height: 0.875rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-with-icon input {
  padding-left: 2.25rem;
}

.input-helper {
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.input-error {
  border-color: #ef4444 !important;
}

.input-error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

/* Social Links Section */
.social-links-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.social-links-section h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 1rem;
}

.social-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Add these animations from landing page */
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Add glowing background elements like in landing page */
.resume-builder::before,
.resume-builder::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, #60a5fa, #a78bfa);
  filter: blur(100px);
  opacity: 0.15;
  animation: floatBubble 20s infinite;
}

.resume-builder::before {
  top: -100px;
  right: -100px;
  animation-delay: -5s;
}

.resume-builder::after {
  bottom: -100px;
  left: -100px;
}

@keyframes floatBubble {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, 50px) scale(1.2); }
  50% { transform: translate(0, 100px) scale(1); }
  75% { transform: translate(-50px, 50px) scale(0.8); }
}

::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Project, Award, and Hobby specific styles */
.project-entry,
.award-entry {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.hobby-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.hobby-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 9999px;
  border: 1px solid rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

.remove-tag {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.remove-tag:hover {
  background: rgba(96, 165, 250, 0.2);
}

.add-button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.entry-header h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #94a3b8;
}

.remove-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-button:hover {
  background: rgba(239, 68, 68, 0.2);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input {
  width: 1rem;
  height: 1rem;
}

.checkbox-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.hobbies-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

  .input-group {
    width: 100%;
  }

.add-hobby-form {
  width: 50%;
}

.hobby-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.hobby-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 9999px;
  border: 1px solid rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

.remove-tag {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.remove-tag:hover {
  background: rgba(96, 165, 250, 0.2);
}

.add-hobby-form {
  display: flex;
  gap: 0.75rem;
}

.add-hobby-form input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
}

.add-hobby-form input:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

/* Scrollable container for entries */
.entries-container {
  overflow-y: auto;
  flex: 1;
  padding-right: 1rem;
  margin-right: -1rem;
  padding-bottom: 1rem;
}

/* Scrollbar styling */
.entries-container::-webkit-scrollbar {
  width: 8px;
}

.entries-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.entries-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.entries-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Add button container */
.add-button-container {
  margin-top: 1.5rem;
  flex-shrink: 0;
}

/* Fancy divider between entries */
.project-entry:not(:last-child)::after,
.award-entry:not(:last-child)::after,
.experience-entry:not(:last-child)::after,
.education-entry:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: -1.5rem;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(96, 165, 250, 0.2) 20%,
    rgba(167, 139, 250, 0.2) 50%,
    rgba(96, 165, 250, 0.2) 80%,
    transparent
  );
}

/* Decorative dots on divider */
.project-entry:not(:last-child)::before,
.award-entry:not(:last-child)::before,
.experience-entry:not(:last-child)::before,
.education-entry:not(:last-child)::before {
  content: '•••';
  position: absolute;
  bottom: -1.9rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(96, 165, 250, 0.3);
  letter-spacing: 0.5rem;
  font-size: 1rem;
}

.experience-entry,
.education-entry {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  transition: all 0.3s ease;
}

.experience-entry:hover,
.education-entry:hover,
.project-entry:hover,
.award-entry:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.category-header {
  margin-bottom: 1.5rem;
}

.category-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.category-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.toggle-input {
  width: 1rem;
  height: 1rem;
}

.toggle-text {
  font-size: 0.875rem;
  color: #94a3b8;
}

.skill-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.skill-input {
  margin: 0;
}

.level-select {
  width: 150px;
  margin: 0;
  position: relative;
}

.level-select select {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s;
}

/* Custom dropdown arrow */
.level-select::after {
  content: '';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.8rem;
  height: 0.8rem;
  background: linear-gradient(45deg, #60a5fa, #a78bfa);
  clip-path: polygon(50% 75%, 0% 25%, 100% 25%);
  transition: transform 0.2s;
  pointer-events: none;
}

.level-select:hover::after {
  transform: translateY(-50%) scale(1.2);
}

.level-select select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

/* Style the options */
.level-select select option {
  background: #1e293b;
  color: #fff;
  padding: 0.75rem;
  font-size: 0.875rem;
}

/* Hover state for select */
.level-select select:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Add a subtle glow effect on hover */
.level-select:hover select {
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.1);
}

.skills-list {
  margin-bottom: 1.5rem;
}

.add-skill {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.skill-category {
  margin-bottom: 2rem;
}

.skill-category:last-child {
  margin-bottom: 1rem;
}

.language-selector {
  position: absolute;
  top: 1rem;
  inset-inline-end: 1rem;
  z-index: 50;
}

.custom-select {
  position: relative;
  width: 160px;
}

.selected-option {
  display: flex;
  align-items: center;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.8rem;
  height: 0.8rem;
  background: linear-gradient(45deg, #60a5fa, #a78bfa);
  clip-path: polygon(50% 75%, 0% 25%, 100% 25%);
  pointer-events: none;
}

[dir="rtl"] .select-arrow {
  right: auto;
  left: 1rem;
}

.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: #1e293b;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.select-option {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-option:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #60a5fa;
}

.flag-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
}

/* RTL Support */
[dir="rtl"] .side-nav {
  left: auto;
  right: 0;
  border-right: none;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

[dir="rtl"] .main-container {
  margin-left: 0;
  margin-right: 320px;
}

/* Additional RTL adjustments for language selector */
[dir="rtl"] .language-selector select {
  padding: 0.5rem 1rem 0.5rem 2.5rem;
}

[dir="rtl"] .flag-icon {
  margin-right: 0;
  margin-left: 8px;
}

.nav-indicators {
  display: flex;
  align-items: center;
}

.error-badge {
  background: #ef4444;
  color: white;
  border-radius: 9999px;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: errorPulse 2s infinite;
}

@keyframes errorPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.nav-button:hover .error-badge {
  background: #dc2626;
}

/* Photo Upload Section */
.photo-upload-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.photo-preview {
  width: 120px;
  height: 120px;
  border-radius: 9999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 50%;
  height: 50%;
  color: #94a3b8;
}

.photo-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.hidden {
  display: none;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 0.5rem;
  color: #60a5fa;
  font-weight: 500;
  transition: all 0.2s;
}

.upload-button:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: rgba(96, 165, 250, 0.3);
}

.remove-photo-button {
  padding: 0.625rem 1.25rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
  color: #ef4444;
  font-weight: 500;
  transition: all 0.2s;
}

.remove-photo-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}
</style>
  