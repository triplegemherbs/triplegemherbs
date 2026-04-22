document.addEventListener('DOMContentLoaded', () => {
  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const forms = document.querySelectorAll('form.protected-form');
  forms.forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
      // Honeypot field name: hp_address
      const hp = form.querySelector('input[name="hp_address"]');
      if (hp && hp.value.trim() !== '') {
        // Likely a bot — prevent submission
        e.preventDefault();
        return;
      }

      // Basic client-side validation
      const email = form.querySelector('input[name="email"]');
      const message = form.querySelector('textarea[name="message"]');
      if (email && !isEmailValid(email.value || '')) {
        e.preventDefault();
        email.focus();
        alert('Please enter a valid email address.');
        return;
      }
      if (message && message.value.trim().length < 5) {
        e.preventDefault();
        message.focus();
        alert('Please enter a longer message.');
        return;
      }

      // Disable submit to prevent double submits
      if (submitBtn) {
        submitBtn.disabled = true;
        setTimeout(() => submitBtn.disabled = false, 5000);
      }
      // Allow normal submit (e.g., to Formspree) to proceed
    });
  });
});
