<script setup lang="ts">
import { formatMonth, resume, resumePdf } from '~/data/resume'
import { site } from '~/site'

const github = site.socials.find(social => social.name === 'GitHub')!
const linkedin = site.socials.find(social => social.name === 'LinkedIn')!

function print() {
  window.print()
}
</script>

<template>
  <div class="resume">
    <div class="print-header">
      <p class="print-name">
        {{ site.name }}
      </p>
      <p class="print-headline">
        {{ resume.headline }}
      </p>
    </div>

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

    <section aria-labelledby="resume-experience">
      <h2 id="resume-experience">
        Experience
      </h2>
      <div v-for="job in resume.experience" :key="job.company" class="resume-entry">
        <div class="entry-row">
          <h3>
            <a :href="job.url" target="_blank" rel="noopener noreferrer">{{ job.company }}</a>
          </h3>
          <span class="entry-aside">{{ job.location }}</span>
        </div>
        <ul class="roles">
          <li v-for="role in job.roles" :key="role.title" class="role">
            <div class="entry-row">
              <span class="role-title">{{ role.title }} <span class="role-type">· {{ role.type }}</span></span>
              <span class="entry-aside">
                <time :datetime="role.start">{{ formatMonth(role.start) }}</time> – <time v-if="role.end" :datetime="role.end">{{ formatMonth(role.end) }}</time><template v-else>Present</template>
              </span>
            </div>
            <ul v-if="role.highlights?.length" class="highlights">
              <li v-for="highlight in role.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
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
          <span class="entry-aside">
            <time :datetime="edu.start">{{ formatMonth(edu.start) }}</time> – <time v-if="edu.end" :datetime="edu.end">{{ formatMonth(edu.end) }}</time><template v-else>Present</template>
          </span>
        </div>
        <div class="entry-row entry-sub">
          <span>{{ edu.degree }}<template v-if="edu.specialization"> — {{ edu.specialization }}</template></span>
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
              <li v-for="skill in group.items" :key="skill">
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
          <li v-for="tech in project.stack" :key="tech">
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
      <ul class="highlights certifications">
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
  margin: 0.15rem 0 0 !important;
  padding: 0 !important;
  list-style: none;
  color: var(--c-fg-muted);
}

.chips > li {
  margin: 0;
  padding: 0;
}

.chips > li:not(:last-child)::after {
  content: '·';
  margin: 0 0.5rem;
  opacity: 0.6;
}

.resume-entry > .chips {
  font-size: 0.875rem;
}

.highlights {
  margin: 0.5rem 0 0 !important;
}

.highlights > li {
  margin: 0.25rem 0;
}

.roles {
  margin: 0.35rem 0 0 !important;
  padding: 0 !important;
  list-style: none;
}

.roles > li {
  margin: 0;
  padding: 0;
}

.roles > li::before {
  display: none;
}

.role + .role {
  margin-top: 0.25rem;
}

.role-title {
  font-weight: 600;
  color: var(--c-fg);
}

.role-type {
  font-weight: 400;
  color: var(--c-fg-muted);
}

.print-header {
  display: none;
}

/* One-page printable resume (also used to generate the PDF via `pnpm resume:pdf`). */
@media print {
  .resume {
    font-size: 9.6pt;
    line-height: 1.33;
    color: #1a1a1a;
  }

  .resume a {
    color: inherit;
    border-bottom: 0 !important;
  }

  .print-header {
    display: block;
  }

  .resume-actions {
    display: none;
  }

  .print-name {
    margin: 0 !important;
    font-size: 2.15em;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: #000;
  }

  .print-headline {
    margin: 0.2em 0 0 !important;
    font-size: 1.1em;
    color: #333;
  }

  .contact-list {
    gap: 0.1em 1.3em;
    margin: 0.55em 0 0.2em !important;
    font-size: 0.95em;
  }

  .resume h2 {
    margin: 0.85em 0 0.35em !important;
    padding-bottom: 0.15em;
    border-bottom-color: #c8c8c8;
    font-size: 1.05em;
    color: #000;
  }

  .resume h3,
  .role-title {
    font-size: 1em;
    color: #000;
  }

  .resume p {
    margin: 0 !important;
  }

  .resume-entry + .resume-entry {
    margin-top: 0.55em;
  }

  .entry-aside {
    font-size: 0.95em;
    color: #444;
  }

  .entry-detail {
    margin-top: 0.15em !important;
    font-size: 0.95em;
  }

  .roles {
    margin-top: 0.15em !important;
  }

  .role + .role {
    margin-top: 0.05em;
  }

  .skills {
    gap: 0.12em;
  }

  /* Render skill and tech lists as plain comma-separated text. */
  .skill-group {
    display: flex;
    gap: 0.4em;
  }

  .skills dt::after {
    content: ':';
  }

  .skills dt {
    flex-shrink: 0;
    font-size: 1em;
  }

  .skills dd,
  .chips {
    display: inline;
    margin: 0 !important;
  }

  .chips > li {
    display: inline;
    padding: 0;
    border: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  .chips > li:not(:last-child)::after {
    content: ', ';
    margin: 0;
    opacity: 1;
  }

  .resume-entry > .chips {
    display: block;
    margin-top: 0.05em !important;
    font-style: italic;
    color: #444;
  }

  .highlights {
    margin: 0.1em 0 0 !important;
  }

  .highlights > li {
    margin: 0.05em 0;
  }

  /* Center the bullet on the first line at the tighter print line-height. */
  .highlights > li::before {
    top: calc(0.665em - 0.1875em);
    background-color: #666;
  }

  .certifications {
    padding: 0 !important;
  }

  .certifications > li {
    display: inline;
    margin: 0;
    padding: 0;
  }

  .certifications > li::before {
    display: none;
  }

  .certifications > li:not(:last-child)::after {
    content: '  ·  ';
    white-space: pre;
    color: #888;
  }

  .resume-entry,
  .skill-group,
  .highlights > li {
    break-inside: avoid;
  }

  h2 {
    break-after: avoid;
  }
}
</style>
