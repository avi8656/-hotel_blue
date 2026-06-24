/* -------------------------------------------------------------
 * HOTEL WISTERIA BLUE - Premium Luxury Website Controls
 * Interactive Single Page Website Functionality
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const header = document.querySelector('.header');
    const navMenu = document.getElementById('nav-menu');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // --- Sticky Header Effect & Active Link Scroll Tracking ---
    window.addEventListener('scroll', () => {
        // Sticky Header scroll styling toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight active link in navigation based on current viewport
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            // Capture if the section occupies current scroll viewport
            if (window.pageYOffset >= (sectionTop - 180)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Drawer Control Panels ---
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('open');
        navOverlay.classList.toggle('open', isOpen);
        
        // Prevent background body scrolling when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Toggle mobile icon between bars and close X
        const toggleIcon = mobileToggle.querySelector('i');
        if (toggleIcon) {
            if (isOpen) {
                toggleIcon.classList.remove('fa-bars');
                toggleIcon.classList.add('fa-xmark');
            } else {
                toggleIcon.classList.remove('fa-xmark');
                toggleIcon.classList.add('fa-bars');
            }
        }
    }

    if (mobileToggle && navOverlay) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
        navOverlay.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile drawer when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // --- Dynamic Pre-population of Booking Dates ---
    const checkinInput = document.getElementById('planner-checkin');
    const checkoutInput = document.getElementById('planner-checkout');
    
    if (checkinInput && checkoutInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };

        // Pre-set today and tomorrow
        checkinInput.value = formatDate(today);
        checkoutInput.value = formatDate(tomorrow);
        
        // Prevent booking in the past
        checkinInput.min = formatDate(today);
        checkoutInput.min = formatDate(tomorrow);
        
        // Adapt checkout min date when checkin is selected
        checkinInput.addEventListener('change', () => {
            const checkinVal = new Date(checkinInput.value);
            const nextDay = new Date(checkinVal);
            nextDay.setDate(nextDay.getDate() + 1);
            
            checkoutInput.min = formatDate(nextDay);
            if (new Date(checkoutInput.value) <= checkinVal) {
                checkoutInput.value = formatDate(nextDay);
            }
        });
    }

    // --- Modal Enquiry Window Management ---
    const modal = document.getElementById('enquiry-modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const modalTitleText = document.getElementById('modal-title-text');
    const modalCategoryInput = document.getElementById('modal-category');
    const modalHiddenItem = document.getElementById('modal-selected-item');
    const modalEnquiryForm = document.getElementById('modal-enquiry-form');
    const modalSuccessMsg = document.getElementById('modal-success');
    const modalDateInput = document.getElementById('modal-date');
    const modalMessageInput = document.getElementById('modal-message');

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const roomType = btn.getAttribute('data-room');
            const eventType = btn.getAttribute('data-event');
            
            // Pre-populate input options
            if (roomType) {
                if (modalTitleText) modalTitleText.innerText = 'Enquire about Room Booking';
                if (modalCategoryInput) modalCategoryInput.value = roomType;
                if (modalHiddenItem) modalHiddenItem.value = `Room booking: ${roomType}`;
                if (modalMessageInput) modalMessageInput.value = `I am interested in reserving the ${roomType} at Hotel Wisteria Blue. Please provide availability and rate options.`;
            } else if (eventType) {
                if (modalTitleText) modalTitleText.innerText = 'Book an Event Space';
                if (modalCategoryInput) modalCategoryInput.value = eventType;
                if (modalHiddenItem) modalHiddenItem.value = `Event space booking: ${eventType}`;
                if (modalMessageInput) modalMessageInput.value = `I am planning an event for ${eventType === 'Wedding Lawn (600 Guests)' ? 'a wedding/reception' : 'a gathering/seminar'} and would like details regarding the venue availability, catering services, and decorations.`;
            } else {
                if (modalTitleText) modalTitleText.innerText = 'Enquire with Hotel Wisteria Blue';
                if (modalCategoryInput) modalCategoryInput.value = 'General stay/event enquiry';
                if (modalHiddenItem) modalHiddenItem.value = 'General stay/event enquiry';
                if (modalMessageInput) modalMessageInput.value = '';
            }

            // Reset modal success state
            if (modalEnquiryForm) modalEnquiryForm.reset();
            if (modalSuccessMsg) modalSuccessMsg.classList.add('hidden');
            if (modalEnquiryForm) modalEnquiryForm.querySelector('button[type="submit"]').removeAttribute('disabled');

            // Open Modal
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Lock background scrolling
            }
        });
    });

    function closeModal() {
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = ''; // Unlock scrolling
        }
    }

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if (modal) {
        // Close modal if user clicks outside content container
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Handle Escape Keypress for Accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('open')) {
                closeModal();
            }
            const amenityPopup = document.getElementById('amenityPopup');
            if (amenityPopup && amenityPopup.style.display === 'flex') {
                closeAmenities();
            }
        }
    });

    // Close amenities popup on clicking backdrop overlay
    const amenityPopup = document.getElementById('amenityPopup');
    if (amenityPopup) {
        amenityPopup.addEventListener('click', (e) => {
            if (e.target === amenityPopup) {
                closeAmenities();
            }
        });
    }

    // --- Stay Planner Availability Bar Form Submission ---
    const stayPlannerForm = document.getElementById('stay-planner-form');
    if (stayPlannerForm) {
        stayPlannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const checkin = document.getElementById('planner-checkin').value;
            const checkout = document.getElementById('planner-checkout').value;
            const guests = document.getElementById('planner-guests').value;
            const selection = document.getElementById('planner-type').value;

            // Reset modal success state
            if (modalEnquiryForm) modalEnquiryForm.reset();
            if (modalSuccessMsg) modalSuccessMsg.classList.add('hidden');
            if (modalEnquiryForm) modalEnquiryForm.querySelector('button[type="submit"]').removeAttribute('disabled');
            
            // Prefill modal fields
            if (modalTitleText) modalTitleText.innerText = 'Check Availability & Book';
            if (modalCategoryInput) modalCategoryInput.value = selection;
            if (modalHiddenItem) modalHiddenItem.value = `Stay Planner Inquiry: ${selection}`;
            if (modalDateInput) modalDateInput.value = checkin;
            if (modalMessageInput) {
                modalMessageInput.value = `Stay & Event Details:\n- Arrival Date: ${checkin}\n- Departure Date: ${checkout}\n- Number of Guests: ${guests}\n- Selection: ${selection}`;
            }

            // Open Modal
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // --- Dynamic Form Submissions & Validations ---

    // 1. Contact Section Form Submission handler
    const mainContactForm = document.getElementById('main-contact-form');
    const mainSuccessMsg = document.getElementById('form-success');

    if (mainContactForm) {
        mainContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Perform basic validation checks
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !phone || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            // Simulate form submission transition
            const submitBtn = mainContactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending enquiry...';
            submitBtn.setAttribute('disabled', 'true');

            setTimeout(() => {
                submitBtn.innerText = 'Enquiry Submitted';
                if (mainSuccessMsg) mainSuccessMsg.classList.remove('hidden');
                
                // Clear inputs after success
                mainContactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.removeAttribute('disabled');
                }, 4000);

                console.log(`Main Form Submitted successfully! Name: ${name}, Phone: ${phone}`);
            }, 1200);
        });
    }

    // 2. Modal Form Submission handler
    if (modalEnquiryForm) {
        modalEnquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('modal-name').value.trim();
            const phone = document.getElementById('modal-phone').value.trim();
            const category = modalCategoryInput ? modalCategoryInput.value : '';

            if (!name || !phone) {
                alert('Please provide your name and phone number.');
                return;
            }

            const submitBtn = modalEnquiryForm.querySelector('button[type="submit"]');
            submitBtn.innerText = 'Sending request...';
            submitBtn.setAttribute('disabled', 'true');

            setTimeout(() => {
                submitBtn.innerText = 'Enquiry Sent';
                if (modalSuccessMsg) modalSuccessMsg.classList.remove('hidden');
                
                console.log(`Modal Form Submitted! Context: ${category}, Customer: ${name}, Contact: ${phone}`);
                
                // Delay modal closure slightly so user sees success confirmation
                setTimeout(() => {
                    closeModal();
                }, 2200);
            }, 1200);
        });
    }

    // --- Scroll Down Hero indicator click ---
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const welcomeSec = document.querySelector('.welcome-section');
            if (welcomeSec) {
                welcomeSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- Cinematic Parallax Hero Scroll Effect ---
    const parallaxBg = document.getElementById('hero-parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            // Only translate background image vertically on desktop (screens larger than 1024px wide)
            if (window.innerWidth > 1024) {
                const scrollY = window.pageYOffset;
                parallaxBg.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
            } else {
                parallaxBg.style.transform = 'none';
            }
        });
    }

    // --- Scroll Triggered Fade-up Animations ---
    const fadeUpElements = document.querySelectorAll('.fade-up-element');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // Viewport relative
            threshold: 0.1, // Trigger when 10% is visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before screen entrance
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        fadeUpElements.forEach(el => {
            animationObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        fadeUpElements.forEach(el => el.classList.add('active'));
    }

    // --- Guest Reflections Testimonial Slider ---
    const reviewsSlider = document.querySelector('.reviews-slider');
    const reviewCards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.review-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function adjustReviewsHeight() {
        if (!reviewsSlider) return;
        const activeCard = reviewsSlider.querySelector('.review-card.active');
        if (activeCard) {
            reviewsSlider.style.height = `${activeCard.offsetHeight}px`;
        }
    }

    function showSlide(index) {
        if (reviewCards.length === 0) return;
        
        // Wrap boundary checks
        if (index >= reviewCards.length) currentSlide = 0;
        else if (index < 0) currentSlide = reviewCards.length - 1;
        else currentSlide = index;

        // Toggle card visual active states
        reviewCards.forEach((card, i) => {
            if (i === currentSlide) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Toggle dot indicators active states
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update container height dynamically to prevent clipping or empty space
        adjustReviewsHeight();
    }

    // Adapt slider height dynamically when layout shifts
    window.addEventListener('resize', adjustReviewsHeight);
    window.addEventListener('load', () => setTimeout(adjustReviewsHeight, 300));
    setTimeout(adjustReviewsHeight, 300); // Call initially to prevent flat height

    function startSlideShow() {
        if (reviewCards.length <= 1) return;
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5500); // Transition every 5.5 seconds
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            resetSlideShow();
        });
    });

    // Start auto testimonial rotation
    startSlideShow();
});

function openAmenities(){

document.getElementById("amenityPopup").style.display="flex";

document.body.style.overflow="hidden";

}



function closeAmenities(){

document.getElementById("amenityPopup").style.display="none";

document.body.style.overflow="auto";

}

