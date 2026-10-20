<script setup lang="ts">
import { resume, resumePdf } from '~/data/resume'
import { site } from '~/site'

const github = site.socials.find(social => social.name === 'GitHub')!
const linkedin = site.socials.find(social => social.name === 'LinkedIn')!

function print() {
  window.print()
}
</script>

<template>
  <div class="resume">
    <div class="resume-actions print:hidden">
      <a :href="resumePdf" download="Robert_Lewis_Resume.pdf" class="btn-primary">
        <span class="i-ri-download-2-line" aria-hidden="true" /> Download PDF
      </a>
      <a :href="resumePdf" target="_blank" rel="noopener" class="btn">
        <span class="i-ri-file-pdf-2-line" aria-hidden="true" /> View PDF
      </a>
      <button type="button" class="btn" @click="print">
        <span class="i-ri-printer-line" aria-hidden="true" /> Print
      </button>
    </div>

    <ul class="contact-list" aria-label="Contact">
      <li>
        <span class="i-ri-mail-line" aria-hidden="true" />
        <a :href="`mailto:${site.email}`">{{ site.email }}</a>
      </li>
      <li>
        <span class="i-ri-global-line" aria-hidden="true" />
        <a :href="`${site.url}/`">{{ site.domain }}</a>
      </li>
      <li>
        <span :class="github.icon" aria-hidden="true" />
        <a :href="github.url" target="_blank" rel="me noopener noreferrer">github.com/{{ github.handle }}</a>
      </li>
      <li>
        <span :class="linkedin.icon" aria-hidden="true" />
        <a :href="linkedin.url" target="_blank" rel="me noopener noreferrer">linkedin.com/in/{{ linkedin.handle }}</a>
      </li>
    </ul>

    <section aria-labelledby="resume-summary">
      <h2 id="resume-summary">
        Summary
      </h2>
      <p>{{ resume.summary }}</p>
    </section>

    <section aria-labelledby="resume-education">
      <h2 id="resume-education">
        Education
      </h2>
      <div v-for="edu in resume.education" :key="edu.school" class="resume-entry">
        <div class="entry-row">
          <h3>
            <a :href="edu.url" target="_blank" rel="noopener noreferrer">{{ edu.school }}</a>
          </h3>
          <span class="entry-aside">{{ edu.dates }}</span>
        </div>
        <div class="entry-row entry-sub">
          <span>{{ edu.degree }}</span>
          <span class="entry-aside">{{ edu.location }}</span>
        </div>
        <p class="entry-detail">
          <strong>{{ edu.courseworkLabel }}:</strong> {{ edu.coursework.join(', ') }}
        </p>
      </div>
    </section>

    <section aria-labelledby="resume-skills">
      <h2 id="resume-skills">
        Technical Skills
      </h2>
      <dl class="skills">
        <div v-for="group in resume.skills" :key="group.label" class="skill-group">
          <dt>{{ group.label }}</dt>
          <dd>
            <ul class="chips" :aria-label="group.label">
              <li v-for="skill in group.items" :key="skill" class="tag">
                {{ skill }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </section>

    <section aria-labelledby="resume-projects">
      <h2 id="resume-projects">
        Projects
      </h2>
      <div v-for="project in resume.projects" :key="project.name" class="resume-entry">
        <div class="entry-row">
          <h3>
            <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
            <template v-else>
              {{ project.name }}
            </template>
          </h3>
        </div>
        <ul class="chips" aria-label="Tech stack">
          <li v-for="tech in project.stack" :key="tech" class="tag">
            {{ tech }}
          </li>
        </ul>
        <ul class="highlights">
          <li v-for="highlight in project.highlights" :key="highlight">
            {{ highlight }}
          </li>
        </ul>
      </div>
    </section>

    <section aria-labelledby="resume-certifications">
      <h2 id="resume-certifications">
        Certifications
      </h2>
      <ul class="highlights">
        <li v-for="cert in resume.certifications" :key="cert">
          {{ cert }}
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.resume-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin: 0 0 2rem !important;
  padding: 0;
  list-style: none;
  font-size: 0.925rem;
}

.contact-list > li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
}

.contact-list > li::before,
.chips > li::before {
  display: none;
}

.resume h2 {
  margin-top: 2.25rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--c-border);
  font-size: 1.15rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.resume h3 {
  margin: 0;
  font-size: 1rem;
  opacity: 1;
  line-height: 1.5;
  color: var(--c-fg);
}

.resume-entry + .resume-entry {
  margin-top: 1.25rem;
}

.entry-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0 1rem;
}

.entry-sub {
  font-style: italic;
}

.entry-aside {
  font-size: 0.875rem;
  color: var(--c-fg-muted);
  font-variant-numeric: tabular-nums;
}

.entry-detail {
  margin: 0.4rem 0 0;
  font-size: 0.925rem;
}

.skills {
  display: grid;
  gap: 0.875rem;
  margin: 0;
}

.skills dt {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-fg);
}

.skills dd {
  margin: 0.35rem 0 0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0.4rem 0 0 !important;
  padding: 0 !important;
  list-style: none;
}

.chips > li {
  margin: 0;
  padding: 0.125rem 0.5rem;
}

.highlights {
  margin: 0.5rem 0 0 !important;
}

.highlights > li {
  margin: 0.25rem 0;
}
</style>
