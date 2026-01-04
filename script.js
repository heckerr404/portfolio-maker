/* 
   --------------------------------------------------------------
   Portfolio Builder - Core Logic
   Handles real-time updates, image processing, and export.
   --------------------------------------------------------------
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- State & Selectors ---
    const form = document.getElementById('portfolioForm');
    const previewPane = document.getElementById('previewPane');
    const themeToggle = document.getElementById('themeToggle');
    const downloadBtn = document.getElementById('downloadBtn');
    const projectsListObj = []; // Store projects data locally

    // Inputs
    const inputs = {
        fullName: document.getElementById('fullName'),
        role: document.getElementById('role'),
        about: document.getElementById('about'),
        skills: document.getElementById('skills'),
        email: document.getElementById('email'),
        github: document.getElementById('github'),
        linkedin: document.getElementById('linkedin'),
        profileImage: document.getElementById('profileImage')
    };

    // Preview Elements
    const previews = {
        name: document.getElementById('previewName'),
        role: document.getElementById('previewRole'),
        about: document.getElementById('previewAbout'),
        skills: document.getElementById('previewSkills'),
        image: document.getElementById('previewImage'),
        projects: document.getElementById('previewProjects'),
        heroLinks: document.getElementById('heroLinks'),
        footerName: document.getElementById('footerName'),
        year: document.getElementById('currentYear')
    };

    // --- Initialization ---
    previews.year.textContent = new Date().getFullYear();
    renderAll(); // Initial render

    // --- Event Listeners ---
    
    // Text Inputs: Real-time update
    Object.keys(inputs).forEach(key => {
        if (key !== 'profileImage' && inputs[key]) {
            inputs[key].addEventListener('input', updateSingleField);
        }
    });

    // Image Upload
    inputs.profileImage.addEventListener('change', handleImageUpload);

    // Theme Toggle (Dark Mode for Editor)
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Add Project Button
    document.getElementById('addProjectBtn').addEventListener('click', addProject);

    // Download Button
    downloadBtn.addEventListener('click', downloadPortfolio);


    // --- Core Functions ---

    function updateSingleField(e) {
        const id = e.target.id;
        const val = e.target.value;

        if (id === 'fullName') {
            previews.name.textContent = val || 'Your Name';
            previews.footerName.textContent = val || 'Your Name';
        } else if (id === 'role') {
            previews.role.textContent = val || 'Your Role';
        } else if (id === 'about') {
            previews.about.textContent = val || 'About yourself...';
        } else if (id === 'skills') {
            renderSkills(val);
        } else if (id === 'email' || id === 'github' || id === 'linkedin') {
            renderSocialLinks();
        }
    }

    function renderAll() {
        // Trigger updates for all static fields based on initial HTML values
        previews.name.textContent = inputs.fullName.value;
        previews.footerName.textContent = inputs.fullName.value;
        previews.role.textContent = inputs.role.value;
        previews.about.textContent = inputs.about.value;
        renderSkills(inputs.skills.value);
        renderSocialLinks();
    }

    function renderSkills(csvString) {
        if (!csvString) {
            previews.skills.innerHTML = '';
            return;
        }
        
        const skills = csvString.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        previews.skills.innerHTML = skills.map(skill => 
            `<span class="skill-tag">${escapeHtml(skill)}</span>`
        ).join('');
    }

    function renderSocialLinks() {
        const email = inputs.email.value;
        const github = inputs.github.value;
        const linkedin = inputs.linkedin.value;
        
        let html = '';
        
        if (email) {
            html += `<a href="mailto:${email}" class="social-link" title="Email"><i class="fa-solid fa-envelope"></i></a>`;
        }
        if (github) {
            // Add https if missing
            const url = github.startsWith('http') ? github : `https://${github}`;
            html += `<a href="${url}" target="_blank" class="social-link" title="GitHub"><i class="fa-brands fa-github"></i></a>`;
        }
        if (linkedin) {
            const url = linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
            html += `<a href="${url}" target="_blank" class="social-link" title="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>`;
        }

        previews.heroLinks.innerHTML = html;
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previews.image.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // --- Project Management ---

    function addProject() {
        // Create a unique ID
        const id = Date.now();
        
        // Add to data structure
        projectsListObj.push({
            id: id,
            title: 'New Project',
            description: 'Description of your project...'
        });

        // Add to Editor UI
        const editorList = document.getElementById('projectsEditorList');
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.dataset.id = id;
        projectItem.innerHTML = `
            <button type="button" class="remove-project" onclick="removeProject(${id})"><i class="fa-solid fa-trash"></i></button>
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" value="New Project" oninput="updateProjectData(${id}, 'title', this.value)">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="2" oninput="updateProjectData(${id}, 'description', this.value)">Description of your project...</textarea>
            </div>
        `;
        editorList.appendChild(projectItem);

        renderProjects();
    }

    // Expose these to global scope for the inline onclick handlers
    window.removeProject = function(id) {
        const index = projectsListObj.findIndex(p => p.id === id);
        if (index > -1) {
            projectsListObj.splice(index, 1);
            
            // Remove from Editor DOM
            const el = document.querySelector(`.project-item[data-id="${id}"]`);
            if (el) el.remove();
            
            renderProjects();
        }
    }

    window.updateProjectData = function(id, field, value) {
        const project = projectsListObj.find(p => p.id === id);
        if (project) {
            project[field] = value;
            renderProjects();
        }
    }

    function renderProjects() {
        if (projectsListObj.length === 0) {
            previews.projects.innerHTML = '<p style="color:#9ca3af; font-style:italic;">No projects added yet.</p>';
            return;
        }

        previews.projects.innerHTML = projectsListObj.map(p => `
            <div class="project-card">
                <h4>${escapeHtml(p.title)}</h4>
                <p>${escapeHtml(p.description)}</p>
            </div>
        `).join('');
    }

    // --- Export Function ---

    function downloadPortfolio() {
        // Clone the preview content to process it for export
        const content = document.getElementById('portfolioPreview').innerHTML;
        const styles = getComputedStyle(document.body);
        
        // Basic HTML structure for the exported file
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${inputs.fullName.value} - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Inlining critical styles for a standalone file */
        :root {
            --pf-bg: #ffffff;
            --pf-text: #1f2937;
            --pf-accent: #2563eb;
            --pf-section-alt: #f3f4f6;
            --pf-card-bg: #ffffff;
            --pf-card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--pf-text); background: var(--pf-bg); }
        .hero-section { padding: 5rem 2rem; text-align: center; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); }
        .profile-img-container { width: 140px; height: 140px; margin: 0 auto 1.5rem; border-radius: 50%; border: 4px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .profile-img-container img { width: 100%; height: 100%; object-fit: cover; }
        .hero-content h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; color: #0f172a; }
        .hero-content h2 { font-size: 1.25rem; font-weight: 500; color: #475569; margin-bottom: 1.5rem; }
        .hero-links { display: flex; justify-content: center; gap: 1rem; }
        .social-link { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: white; color: #1e293b; font-size: 1.1rem; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); transition: 0.2s; }
        .social-link:hover { transform: translateY(-2px); background: var(--pf-accent); color: white; }
        .preview-section { padding: 4rem 2rem; }
        .preview-section.alt-bg { background: var(--pf-section-alt); }
        .container { max-width: 800px; margin: 0 auto; }
        h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; position: relative; padding-bottom: 0.5rem; color: #111827; }
        h3::after { content: ''; position: absolute; left: 0; bottom: 0; width: 50px; height: 3px; background: var(--pf-accent); border-radius: 2px; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 0.8rem; }
        .skill-tag { background: white; padding: 0.5rem 1rem; border-radius: 99px; font-size: 0.95rem; font-weight: 500; color: #374151; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
        .project-card { background: var(--pf-card-bg); padding: 1.5rem; border-radius: 8px; border: 1px solid #f3f4f6; box-shadow: var(--pf-card-shadow); transition: transform 0.2s; }
        .project-card:hover { transform: translateY(-3px); }
        .project-card h4 { font-size: 1.15rem; margin-bottom: 0.5rem; color: #111827; }
        .project-card p { color: #6b7280; line-height: 1.6; font-size: 0.95rem; }
        footer { padding: 2rem; text-align: center; background: #111827; color: #9ca3af; font-size: 0.9rem; }
    </style>
</head>
<body>
    ${content}
</body>
</html>
        `;

        // Create a blob and download
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Helper to prevent XSS in preview (basic)
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});
