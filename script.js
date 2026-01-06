// Lys/mørk tilstand
const darkModeToggle = document.getElementById('darkModeToggle');

// Funktioner til at styre dark mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.add('dark-mode');
    });
    if (darkModeToggle) {
        darkModeToggle.classList.add('dark-mode');
        darkModeToggle.textContent = 'wb_sunny'; // Skift til sol-ikon
    }
    localStorage.setItem('theme', 'dark'); // Gem valget
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.remove('dark-mode');
    });
    if (darkModeToggle) {
        darkModeToggle.classList.remove('dark-mode');
        darkModeToggle.textContent = 'brightness_2'; // Skift til måne-ikon
    }
    localStorage.setItem('theme', 'light'); // Gem valget
}

// Tjek om brugeren har valgt dark mode tidligere
if (localStorage.getItem('theme') === 'dark') {
    enableDarkMode();
}

// Lyt efter klik på knappen
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
}

// Tilbage til toppen-knap
const backToTopBtn = document.getElementById("backToTopBtn");

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

backToTopBtn.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

// Funktion til at tjekke om et element er i viewporten
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.bottom >= 0 &&
    rect.right >= 0
  );
}

// Vælg alle sektioner med klassen "section-container"
const sections = document.querySelectorAll('.section-container');

// Funktion til at håndtere scroll-hændelsen
function handleScroll() {
    sections.forEach((section) => {
        if (isElementInViewport(section)) {
            section.classList.add('show');
        } else {
            section.classList.remove('show');
        }
    });
}

// Lyt efter scroll-hændelsen og kald handleScroll-funktionen
window.addEventListener('scroll', handleScroll);

// Kald handleScroll en gang for at tjekke ved indlæsning af siden
handleScroll();

// --- AI Neural Network Animation (Header Background) ---
const canvas = document.getElementById('ai-network');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    // Sæt canvas størrelse
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    // Håndter resize af vinduet
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        init();
    });

    // Mus interaktion
    const mouse = { x: null, y: null, radius: 100 };
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Partikel klasse
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            // Bevægelse
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            
            // Mus interaktion (skubber partikler væk)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = 'rgba(52, 152, 219, 0.5)'; // Blå partikler (synlige på både lys og mørk)
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/10000);
                    ctx.strokeStyle = 'rgba(52, 152, 219,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();
}

// Funktion til at vise beskeder pænt i formularen
function displayMessage(form, message, type) {
    let msgElement = form.querySelector('.form-message');
    // Hvis elementet ikke findes endnu, opret det
    if (!msgElement) {
        msgElement = document.createElement('div');
        msgElement.className = 'form-message';
        form.appendChild(msgElement);
    }
    
    // Sørg for den er synlig og har den rigtige farve
    msgElement.style.display = ''; 
    msgElement.className = 'form-message ' + type;
    msgElement.textContent = message;
    
    // Fjern beskeden igen efter 5 sekunder (valgfrit)
    setTimeout(() => {
        msgElement.style.display = 'none';
    }, 5000);
}

// --- Håndtering af Kontaktformular (Egen Backend) ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop siden fra at genindlæse

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sender...";

        // Send data til min lokale Python backend
        fetch('https://osman-backend.onrender.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server fejl');
            }
        })
        .then(data => {
            displayMessage(contactForm, "Tak! Din besked er modtaget. Jeg vender tilbage hurtigst muligt.", "success");
            contactForm.reset();
            submitBtn.textContent = originalText;
        })
        .catch(error => {
            console.error('Fejl:', error);
            displayMessage(contactForm, "Der skete en fejl ved afsendelse. Prøv venligst igen senere.", "error");
            submitBtn.textContent = originalText;
        });
    });
}

// --- Håndtering af Bookingformular ---
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            email: document.getElementById('booking-email').value,
            date: document.getElementById('booking-date').value,
            time: document.getElementById('booking-time').value
        };

        const submitBtn = bookingForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sender forespørgsel...";

        // Send data til min lokale Python backend (nyt endpoint)
        fetch('https://osman-backend.onrender.com/book-meeting', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server fejl');
            }
        })
        .then(data => {
            displayMessage(bookingForm, "Tak! Din forespørgsel er sendt. Jeg vender tilbage for at bekræfte tiden.", "success");
            bookingForm.reset();
            submitBtn.textContent = originalText;
        })
        .catch(error => {
            console.error('Fejl:', error);
            displayMessage(bookingForm, "Der skete en fejl ved booking. Prøv venligst igen senere.", "error");
            submitBtn.textContent = originalText;
        });
    });
}
