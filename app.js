// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navList.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Sticky header on scroll
const header = document.querySelector('.header');
const stickyThreshold = 100;

window.addEventListener('scroll', () => {
    if (window.scrollY > stickyThreshold) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
    document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && !e.target.closest('.hamburger')) {
        navList.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Fade-in animation on scroll
const fadeElements = document.querySelectorAll('.story, .product, .testimonials');

const fadeInOnScroll = () => {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
};

// Initial check on page load
window.addEventListener('load', fadeInOnScroll);
// Check on scroll
window.addEventListener('scroll', fadeInOnScroll);

// Add loading animation to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Form validation for newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
            // In a real application, you would send this to your backend
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
            emailInput.focus();
        }
    });
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements that should animate
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Trigger initial fade-in check
    fadeInOnScroll();
});

// Image fallback handling
document.addEventListener('DOMContentLoaded', function() {
    const storyImg = document.querySelector('.story-img');
    
    if (storyImg) {
        storyImg.addEventListener('error', function() {
            console.error('Story image failed to load');
            this.style.display = 'none';
            this.parentElement.classList.add('fallback');
        });
        
        storyImg.addEventListener('load', function() {
            console.log('Story image loaded successfully');
        });
    }
});

// SIMPLE AI Recommender - No automatic progression
let currentStep = 1;
const userAnswers = {};

function selectOption(button, value) {
    // Remove selected class from all options in current question
    const currentQuestion = document.getElementById(`q${currentStep}`);
    currentQuestion.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    button.classList.add('selected');
    
    // Store answer
    userAnswers[`q${currentStep}`] = value;
    
    // Move to next question after delay
    setTimeout(() => {
        nextQuestion();
    }, 800);
}

function nextQuestion() {
    currentStep++;
    
    if (currentStep <= 3) {
        // Hide current question
        const currentQ = document.getElementById(`q${currentStep - 1}`);
        currentQ.classList.remove('active');
        
        // Show next question
        const nextQ = document.getElementById(`q${currentStep}`);
        nextQ.classList.add('active');
        
        updateProgress();
    } else {
        // Show results
        showResults();
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepEl = document.getElementById('currentStep');
    
    progressFill.style.width = `${(currentStep / 3) * 100}%`;
    currentStepEl.textContent = currentStep;
}

function showResults() {
    // Hide questions
    document.querySelector('.ai-questions').style.display = 'none';
    
    // Calculate recommendation
    const recommendation = calculateRecommendation();
    const products = {
        obsidian: {
            name: "Obsidian Blend",
            description: "Perfect for late nights with its bold, intense flavors that stand up to milk and sugar.",
            price: "$18.99",
            reason: "Your preference for evening coffee and bold flavors makes this our top recommendation!"
        },
        velvet: {
            name: "Midnight Velvet", 
            description: "Ideal for afternoon enjoyment with its smooth, balanced profile that doesn't overwhelm.",
            price: "$19.99",
            reason: "Your choice of smooth flavors and afternoon drinking matches perfectly with this blend!"
        },
        starlight: {
            name: "Starlight Reserve",
            description: "Excellent for morning brewing with its bright, complex notes that awaken the senses.",
            price: "$22.99",
            reason: "Your preference for morning coffee and fruity flavors aligns with this exquisite single-origin!"
        }
    };
    
    const product = products[recommendation];
    
    // Show results
    const resultEl = document.getElementById('aiResult');
    const productEl = document.getElementById('recommendedProduct');
    
    productEl.innerHTML = `
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <p><strong>${product.reason}</strong></p>
        <div class="product-price">${product.price}</div>
        <div class="product-actions">
            <button class="btn-primary">See Tasting Notes</button>
            <button class="btn-secondary">Add to Cart</button>
        </div>
    `;
    
    resultEl.classList.add('active');
    
    // Update progress to complete
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('currentStep').textContent = '3';
}

function calculateRecommendation() {
    const answers = userAnswers;
    
    if (answers.q1 === 'night' && answers.q2 === 'bold') {
        return 'obsidian';
    } else if (answers.q1 === 'afternoon' && answers.q2 === 'smooth') {
        return 'velvet';
    } else if (answers.q1 === 'morning' && answers.q2 === 'fruity') {
        return 'starlight';
    } else if (answers.q2 === 'chocolate') {
        return 'obsidian';
    } else if (answers.q3 === 'espresso') {
        return 'obsidian';
    } else if (answers.q3 === 'pourOver') {
        return 'starlight';
    } else {
        return 'velvet';
    }
}

function restartQuiz() {
    currentStep = 1;
    
    // Clear answers
    for (let key in userAnswers) {
        delete userAnswers[key];
    }
    
    // Hide results
    document.getElementById('aiResult').style.display = 'none';
    
    // Show questions
    document.querySelector('.ai-questions').style.display = 'block';
    
    // Reset to first question
    document.querySelectorAll('.question').forEach((q, index) => {
        q.classList.remove('active');
        if (index === 0) q.classList.add('active');
    });
    
    // Reset options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset progress
    updateProgress();
    document.getElementById('progressFill').style.width = '33%';
    document.getElementById('currentStep').textContent = '1';
}