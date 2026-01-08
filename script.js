// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

    // 1. SELECT ELEMENTS
    var form = document.getElementById('portfolioForm');
    var themeBtn = document.getElementById('themeToggle');
    var downloadBtn = document.getElementById('downloadBtn');

    // 2. THEME TOGGLE (Dark/Light Mode)
    themeBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        // Change the icon
        var icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });

    // 3. LIVE PREVIEW (Update text as you type)
    form.addEventListener('input', function (event) {
        var inputId = event.target.id;
        var value = event.target.value;

        // Simple if/else checks for each field
        if (inputId === 'fullName') {
            document.getElementById('previewName').innerText = value;
            document.getElementById('footerName').innerText = value;
        }
        else if (inputId === 'role') {
            document.getElementById('previewRole').innerText = value;
        }
        else if (inputId === 'about') {
            document.getElementById('previewAbout').innerText = value;
        }
        else if (inputId === 'skills') {
            updateSkills(value);
        }
        else if (inputId === 'email' || inputId === 'github' || inputId === 'linkedin') {
            updateLinks();
        }
    });

    function updateSkills(text) {
        var skillsArray = text.split(',');
        var html = '';
        for (var i = 0; i < skillsArray.length; i++) {
            var skill = skillsArray[i].trim();
            if (skill !== "") {
                html += '<span class="skill-tag">' + skill + '</span>';
            }
        }
        document.getElementById('previewSkills').innerHTML = html;
    }

    function updateLinks() {
        var email = document.getElementById('email').value;
        var github = document.getElementById('github').value;
        var linkedin = document.getElementById('linkedin').value;

        var html = '';
        if (email) html += '<a href="mailto:' + email + '" class="social-link"><i class="fa-solid fa-envelope"></i></a>';
        if (github) html += '<a href="https://' + github + '" target="_blank" class="social-link"><i class="fa-brands fa-github"></i></a>';
        if (linkedin) html += '<a href="https://' + linkedin + '" target="_blank" class="social-link"><i class="fa-brands fa-linkedin"></i></a>';

        document.getElementById('heroLinks').innerHTML = html;
    }

    // 4. IMAGE UPLOAD
    document.getElementById('profileImage').addEventListener('change', function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('previewImage').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // 5. PROJECTS (Add/Remove)
    document.getElementById('addProjectBtn').addEventListener('click', function () {
        var projectId = Date.now();

        // Add Editor Input
        var projectList = document.getElementById('projectsEditorList');
        var editorItem = document.createElement('div');
        editorItem.className = 'project-item';
        editorItem.setAttribute('data-id', projectId);
        editorItem.innerHTML = `
            <button onclick="deleteProject(${projectId})" class="remove-project"><i class="fa-solid fa-trash"></i></button>
            <div class="form-group"><label>Title</label><input type="text" oninput="updateProjectTitle(${projectId}, this.value)" value="New Project"></div>
            <div class="form-group"><label>Details</label><textarea oninput="updateProjectDesc(${projectId}, this.value)">Project details...</textarea></div>
        `;
        projectList.appendChild(editorItem);

        // Add Preview Card
        var previewList = document.getElementById('previewProjects');
        var card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('id', 'card-' + projectId);
        card.innerHTML = `<h4>New Project</h4><p>Project details...</p>`;
        previewList.appendChild(card);
    });

    // Global helper functions
    window.deleteProject = function (id) {
        document.querySelector('.project-item[data-id="' + id + '"]').remove();
        document.getElementById('card-' + id).remove();
    }

    window.updateProjectTitle = function (id, text) {
        document.querySelector('#card-' + id + ' h4').innerText = text;
    }

    window.updateProjectDesc = function (id, text) {
        document.querySelector('#card-' + id + ' p').innerText = text;
    }

    // 6. DOWNLOAD BUTTON
    downloadBtn.addEventListener('click', function () {
        var htmlContent = document.getElementById('portfolioPreview').innerHTML;
        var fullHtml = `<!DOCTYPE html><html><head><title>Portfolio</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><style>body{font-family:sans-serif;}</style></head><body><div style="max-width:900px;margin:0 auto;">${htmlContent}</div></body></html>`;

        var blob = new Blob([fullHtml], { type: "text/html" });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "portfolio.html";
        link.click();
    });

});
