// Load header and footer partials into pages and set the year
(function(){
  function loadPartial(id, path){
    var el = document.getElementById(id);
    if(!el) return;
    fetch(path).then(function(r){ return r.text(); }).then(function(html){ 
      el.innerHTML = html; 
      if(id==='site-footer') {
        setYear();
        initFooter();
      }
    });
  }

  function setYear(){
    var y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  }

  function initFooter(){
    // Obfuscate emails
    var emailEl = document.getElementById('email-obfuscated');
    if(emailEl) emailEl.innerHTML = '<a href="mailto:triplegemherbs@gmail.com">triplegemherbs@gmail.com</a>';
    
    var businessEmailEl = document.getElementById('business-email-obfuscated');
    if(businessEmailEl) businessEmailEl.innerHTML = '<a href="mailto:triplegemherbs@gmail.com">triplegemherbs@gmail.com</a>';
    
    // Handle form submission
    var form = document.getElementById('newsletter-form');
    if(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var messageDiv = document.getElementById('form-message');
        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        }).then(function(response) {
          if(response.ok) {
            messageDiv.innerHTML = '<p style="color: var(--accent);">Thanks for subscribing! Check your email for confirmation.</p>';
            messageDiv.style.display = 'block';
            form.reset();
          } else {
            messageDiv.innerHTML = '<p style="color: red;">Oops! Something went wrong. Please try again.</p>';
            messageDiv.style.display = 'block';
          }
        }).catch(function(error) {
          messageDiv.innerHTML = '<p style="color: red;">Network error. Please try again later.</p>';
          messageDiv.style.display = 'block';
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Determine the correct path to partials based on current page location
    var scriptPath = document.currentScript ? document.currentScript.src : '';
    var isRootPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    var partialsPath = isRootPage ? 'partials/' : '../partials/';
    
    loadPartial('site-header', partialsPath + 'header.html');
    loadPartial('site-footer', partialsPath + 'footer.html');
  });
})();
