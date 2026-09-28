// 1. COUNTDOWN TIMER
    function updateCountdown() {
      const weddingDate = new Date('November 5, 2026 18:00:00').getTime();
      const now = new Date().getTime();
      const distance = weddingDate - now;
      if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">We are married!</span></div>';
        return;
      }
      document.getElementById('days').innerText = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
      document.getElementById('hours').innerText = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
      document.getElementById('minutes').innerText = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      document.getElementById('seconds').innerText = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 2. LIVE GUEST COUNT
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1Yv2nbJh6FEpF7G04Tjpg0Cghi1J8jQUnprbeSj8NrVWG2JxK6QkbCcjUYqxNTKTEWA/exec';
    function updateGuestCount() {
      const el = document.getElementById('guestCount');
      el.innerText = '...';
      fetch(SCRIPT_URL)
        .then(res => res.json())
        .then(data => {
          console.log("✅ Live Data:", data);
          if (data.error) {
            el.innerText = 'Error';
            alert("Script Error: " + data.error);
          } else {
            el.innerText = data.totalGuests !== undefined ? data.totalGuests : '0';
          }
        })
        .catch(err => { 
          console.error(err);
          el.innerText = '0'; 
        });
    }

    // 3. UI HANDLING
    document.addEventListener('DOMContentLoaded', () => {
      
      // ✅ AUTO-SET GUESTS TO 0 AND DISABLE ON REGRET
      const joiningSelect = document.getElementById('joining');
      const guestsSelect = document.getElementById('guests');
      
      joiningSelect.addEventListener('change', function() {
        if (this.value === 'Regretfully cannot attend') {
          guestsSelect.value = '0';
          guestsSelect.disabled = true; // Disables the dropdown
        } else if (this.value === 'Yes, with joy!') {
          guestsSelect.disabled = false; // Re-enables the dropdown
          if (guestsSelect.value === '0') {
            guestsSelect.value = ''; // Reset to placeholder so they actively choose
          }
        }
      });

      document.querySelectorAll('.fade-in').forEach(el => {
        new IntersectionObserver(entries => {
          entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.15 }).observe(el);
      });
      
      document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      
      updateGuestCount();
    });

    function openPasswordModal() {
      document.getElementById('passwordModal').classList.add('show');
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordError').classList.remove('show');
      setTimeout(() => document.getElementById('passwordInput').focus(), 100);
    }
    
    function checkPassword() {
      if (document.getElementById('passwordInput').value === 'VG2026') {
        document.getElementById('passwordModal').classList.remove('show');
        document.getElementById('secretCompartment').classList.add('show');
        updateGuestCount();
      } else {
        document.getElementById('passwordError').classList.add('show');
        document.getElementById('passwordInput').value = '';
      }
    }
    
    function closeSecretCompartment() { 
      document.getElementById('secretCompartment').classList.remove('show'); 
    }
    
    document.getElementById('passwordInput').addEventListener('keypress', e => { 
      if (e.key === 'Enter') checkPassword(); 
    });

    // 4. ✅ RELIABLE FORM SUBMISSION (Hidden Iframe Method)
    document.getElementById('rsvpForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerText = 'Submitting...';

      const iframeName = 'hidden_iframe_' + Date.now();
      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSeTtvoVOhaG-qBne5nObd4ZkFssOrQljnzNrE8HR6qcJ3DAIQ/formResponse';
      form.target = iframeName;

      const fields = {
        'entry.2606285': document.getElementById('name').value,
        'entry.877086558': document.getElementById('joining').value,
        'entry.1498135098': document.getElementById('guests').value
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        document.getElementById('rsvpForm').style.display = 'none';
        document.getElementById('rsvpSuccess').classList.add('show');
        try {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
        } catch(err) {}
      }, 1500);
    });