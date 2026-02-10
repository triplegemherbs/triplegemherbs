// Load header and footer partials into pages and set the year
(function(){
  function loadPartial(id, path){
    var el = document.getElementById(id);
    if(!el) return;
    fetch(path).then(function(r){ return r.text(); }).then(function(html){ el.innerHTML = html; if(id==='site-footer') setYear(); });
  }

  function setYear(){
    var y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', function(){
    loadPartial('site-header','/partials/header.html');
    loadPartial('site-footer','/partials/footer.html');
  });
})();
