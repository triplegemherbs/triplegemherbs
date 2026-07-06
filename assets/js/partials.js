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
      if(id==='site-header') {
        initHeader();
      }
    });
  }

  function setYear(){
    var y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  }

  function initNewsletterForms() {
    document.querySelectorAll('.newsletter-form').forEach(function(form) {
      if(form.dataset.nsInit) return;
      form.dataset.nsInit = '1';
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var messageDiv = form.nextElementSibling;
        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        }).then(function(response) {
          if(response.ok) {
            if(messageDiv) {
              messageDiv.innerHTML = '<p style="color: var(--teal);">Thanks for subscribing!</p>';
              messageDiv.style.display = 'block';
            }
            form.reset();
          } else {
            if(messageDiv) {
              messageDiv.innerHTML = '<p style="color: red;">Oops! Something went wrong. Please try again.</p>';
              messageDiv.style.display = 'block';
            }
          }
        }).catch(function() {
          if(messageDiv) {
            messageDiv.innerHTML = '<p style="color: red;">Network error. Please try again later.</p>';
            messageDiv.style.display = 'block';
          }
        });
      });
    });
  }

  function initFooter(){
    // Obfuscate emails
    var emailEl = document.getElementById('email-obfuscated');
    if(emailEl) emailEl.innerHTML = '<a href="mailto:triplegemherbs@gmail.com">triplegemherbs@gmail.com</a>';

    var businessEmailEl = document.getElementById('business-email-obfuscated');
    if(businessEmailEl) businessEmailEl.innerHTML = '<a href="mailto:triplegemherbs@gmail.com">triplegemherbs@gmail.com</a>';

    initNewsletterForms();
  }

  document.addEventListener('DOMContentLoaded', function(){
    var segments = window.location.pathname.split('/').filter(Boolean).length;
    var prefix = segments === 0 ? '' : '../'.repeat(Math.max(0, segments - 1));
    var partialsPath = prefix + 'partials/';

    loadPartial('site-header', partialsPath + 'header.html?v=4');
    loadPartial('site-footer', partialsPath + 'footer.html?v=4');
    initNewsletterForms();
  });

  function initHeader() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    // Mark active nav link based on current path
    var path = window.location.pathname;
    nav.querySelectorAll('a[href]').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && !href.startsWith('http') && path.endsWith(href.replace(/^\//, ''))) {
        link.classList.add('active');
      }
    });

    function setOpen(isOpen) {
      nav.classList.toggle('open', isOpen);
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    toggle.addEventListener('click', function() {
      setOpen(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          setOpen(false);
        }
      });
    });
  }
})();
