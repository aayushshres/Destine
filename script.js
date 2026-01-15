document.addEventListener('DOMContentLoaded', () => {
    /** 
     * DESTINÉ - CORE LOGIC
     * This script manages the user journey through 4 main stages:
     * 1. Landing: The entry point (Hero Section)
     * 2. Signup: Collecting user birth data
     * 3. Profile: Displaying the calculated birth chart
     * 4. Swiping: The interactive matching interface (App Interface)
     */

    // --- 1. ELEMENT SELECTIONS ---
    // Sections (Stages)
    const stages = {
        hero: document.getElementById('heroSection'),
        signup: document.getElementById('signupSection'),
        profile: document.getElementById('profileSection'),
        app: document.getElementById('appInterface'),
        matches: document.getElementById('matchesSection')
    };

    // Buttons & Interactive Elements
    const getStartedBtn = document.getElementById('getStartedBtn');
    const signupForm = document.getElementById('signupForm');
    const startMatchingBtn = document.getElementById('startMatchingBtn');
    const navLogo = document.getElementById('navLogo');
    const navMatches = document.getElementById('navMatches');
    const backToSwiping = document.getElementById('backToSwiping');
    const likeBtn = document.getElementById('likeBtn');
    const nopeBtn = document.getElementById('nopeBtn');

    // Global App State
    let matchedProfiles = [];
    let currentProfileIndex = 0;
    let userZodiac = "";

    // --- 2. STATE MANAGEMENT (FADING & HIDING) ---
    /**
     * Helper function to switch between screens smoothly
     * It uses the .hidden class which has display: none !important;
     * @param {string} targetStage - The key from the stages object
     */
    function navigateTo(targetStage) {
        // Hide all stages by adding the .hidden class
        Object.values(stages).forEach(stage => {
            if (stage) stage.classList.add('hidden');
        });

        // Reveal only the target stage
        if (stages[targetStage]) {
            stages[targetStage].classList.remove('hidden');

            // If going back to hero, reset its opacity
            if (targetStage === 'hero') stages.hero.style.opacity = '1';

            console.log(`Navigated to stage: ${targetStage}`);
        }
    }

    // --- 3. STAGE 1: LANDING LOGIC ---
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // Smoothly fade the hero section before switching
            stages.hero.style.opacity = '0';
            setTimeout(() => {
                navigateTo('signup');
            }, 500);
        });
    }

    // --- 4. STAGE 2: SIGNUP LOGIC ---
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value;
            const birthDate = document.getElementById('birthDate').value;
            const city = document.getElementById('birthCity').value;
            const country = document.getElementById('birthCountry').value;

            // Calculate Zodiac sign based on birth date string
            userZodiac = getSunSign(birthDate);

            // Visual feedback on the button (Magical loading state)
            const submitBtn = signupForm.querySelector('.cta-button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Consulting the Stars...";
            submitBtn.disabled = true;

            setTimeout(() => {
                // Prepare the profile reveal
                updateUserProfileUI(name, userZodiac, city);

                // Show the Profile section
                navigateTo('profile');

                // Reset button for future use
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    /**
     * Helper: Updates the Profile UI with the user's specific astrological data
     */
    function updateUserProfileUI(name, sign, city) {
        const profileName = document.getElementById('profileName');
        const profileSign = document.getElementById('profileSign');
        const chartSummary = document.getElementById('chartSummary');
        const cosmicVibe = document.getElementById('cosmicVibe');

        // Helper to capitalize
        const cap = (s) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

        // Display user name capitalized
        if (profileName) profileName.innerText = cap(name);

        // Display sign with its emoji
        const symbol = zodiacSymbols[sign] || "✨";
        if (profileSign) profileSign.innerHTML = `<span style="font-size: 1.5rem; vertical-align: middle;">${symbol}</span> ${sign}`;

        // Get the elemental energy (Fire, Water, etc.)
        const element = signElements[sign.toLowerCase()] || "mystery";

        // Render Chart Summary with emojis
        if (chartSummary) {
            const elementEmoji = {
                'fire': '🔥',
                'water': '💧',
                'earth': '🌍',
                'air': '💨'
            };
            const emoji = elementEmoji[element] || '✨';
            const description = element === 'fire' ? 'bold passion and leadership 🦁' :
                element === 'water' ? 'deep emotion and intuition 🌊' :
                    element === 'earth' ? 'stability and practical wisdom 🏔️' : 'intellect and social curiosity 🦋';

            chartSummary.innerHTML = `${emoji} Your sun is in <strong>${sign}</strong>, a ${element} sign. This suggests a core nature driven by ${description}. ✨`;
        }

        // Render Cosmic Vibe (Italicized via CSS)
        if (cosmicVibe) {
            cosmicVibe.innerText = `You radiate ${element === 'fire' ? 'bold, dynamic' :
                element === 'water' ? 'deep, intuitive' :
                    element === 'earth' ? 'grounded, sensual' : 'curious, social'
                } energy today. Your presence feels aligned with the celestial currents.`;
        }
    }

    // --- 5. STAGE 3: PROFILE LOGIC ---
    if (startMatchingBtn) {
        startMatchingBtn.addEventListener('click', () => {
            // Sort potential matches based on compatibility with user's sign
            sortProfilesByCompatibility(userZodiac);

            // Switch to the Matching interface (Swiping)
            navigateTo('app');

            // Load the first match card
            renderCard();
        });
    }

    // --- 6. GLOBAL NAVIGATION & MATCHES ---
    // Clicking the "Destiné" logo takes you home to your Profile
    if (navLogo) {
        navLogo.addEventListener('click', () => navigateTo('profile'));
    }

    // Show the matches tracking list
    if (navMatches) {
        navMatches.addEventListener('click', () => {
            navigateTo('matches');
            renderMatchesList();
        });
    }

    // Close buttons and Back actions
    if (backToSwiping) {
        backToSwiping.addEventListener('click', () => navigateTo('app'));
    }

    // --- 7. HELPER: ASTROLOGY CALCULATIONS ---
    function getSunSign(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // JS months are 0-indexed

        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
        return "Gemini";
    }

    const signElements = {
        aries: 'fire', leo: 'fire', sagittarius: 'fire',
        taurus: 'earth', virgo: 'earth', capricorn: 'earth',
        gemini: 'air', libra: 'air', aquarius: 'air',
        cancer: 'water', scorpio: 'water', pisces: 'water'
    };

    const zodiacSymbols = {
        "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋",
        "Leo": "♌", "Virgo": "♍", "Libra": "♎", "Scorpio": "♏",
        "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
    };

    // --- 8. THE SWIPING ENGINE (STAGING MATCHES) ---

    function createCardElement(profile, isTop = false) {
        const compatibility = getCompatibility(userZodiac, profile.sign);
        const symbol = zodiacSymbols[profile.sign] || "";

        const card = document.createElement('div');
        const element = signElements[profile.sign.toLowerCase()] || 'air';
        card.className = `swipe-card ${element}`;
        if (isTop) card.id = 'currentCard';

        card.innerHTML = `
            <div class="card-image"><span>${profile.emoji}</span></div>
            <div class="card-content">
                <h2>${profile.name}, ${profile.age}</h2>
                <p class="card-vibe">${profile.vibe}</p>
                <div class="card-details">
                    <span class="zodiac-tag">${symbol} ${profile.sign}</span>
                    <div class="match-score"><span>✨ ${compatibility}% Match</span></div>
                </div>
            </div>
        `;
        return card;
    }

    function renderCard() {
        const cardStack = document.getElementById('cardStack');
        cardStack.innerHTML = '';

        if (currentProfileIndex >= profiles.length) {
            cardStack.innerHTML = `<div class="placeholder-card"><h2>The stars are resting.</h2><p>No more matches found tonight.</p></div>`;
            return;
        }

        // Render "next" card behind
        if (currentProfileIndex + 1 < profiles.length) {
            const nextProfile = profiles[currentProfileIndex + 1];
            const nextCard = createCardElement(nextProfile, false);
            nextCard.style.transform = 'scale(0.95) translateY(10px)';
            nextCard.style.opacity = '0.5';
            cardStack.appendChild(nextCard);
        }

        // Render "current" card on top
        const currentProfile = profiles[currentProfileIndex];
        const currentCard = createCardElement(currentProfile, true);
        cardStack.appendChild(currentCard);

        initDrag();
    }

    function handleSwipe(direction) {
        const currentCard = document.getElementById('currentCard');
        if (!currentCard) return;

        const profile = profiles[currentProfileIndex];

        // Apply the CSS animation class
        if (direction === 'right') {
            currentCard.classList.add('swipe-right');
            matchedProfiles.push(profile);

            // CELESTIAL ALIGNMENT CHECK:
            // We only show the "It's a Match!" overlay if the compatibility score 
            // calculated by the cosmic engine is 80% or higher.
            const score = getCompatibility(userZodiac, profile.sign);
            if (score >= 80) {
                setTimeout(() => {
                    const overlay = document.getElementById('matchOverlay');
                    if (overlay) overlay.classList.remove('hidden');
                }, 300);
            }
        } else {
            currentCard.classList.add('swipe-left');
        }

        // Wait for animation to finish (300ms matches style.css transition)
        setTimeout(() => {
            currentCard.remove(); // Explicitly remove from DOM
            currentProfileIndex++;
            renderCard(); // Render the new top and background cards
        }, 300);
    }

    // --- 9. MAGIC UI EFFECTS (CURSORS & PARTICLES) ---
    document.addEventListener('mousemove', (e) => {
        // Track cursor for the hidden constellation reveal
        document.body.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.body.style.setProperty('--cursor-y', `${e.clientY}px`);

        const layer = document.getElementById('constellationLayer');
        if (layer) layer.classList.add('active');

        // Spawn temporary sparkle particles
        if (Math.random() > 0.8) {
            const p = document.createElement('div');
            p.className = 'magic-particle';
            p.style.left = e.clientX + 'px';
            p.style.top = e.clientY + 'px';
            p.style.setProperty('--tx', (Math.random() - 0.5) * 80 + 'px');
            p.style.setProperty('--ty', (Math.random() - 0.5) * 80 + 'px');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1000);
        }
    });

    // --- 10. DETAIL VIEW POPUP ---
    function openDetail(profile) {
        const overlay = document.getElementById('profileDetailOverlay');
        const signSymbol = zodiacSymbols[profile.sign] || "";
        const element = signElements[profile.sign.toLowerCase()] || "Fire";

        document.getElementById('detailEmoji').innerText = profile.emoji;
        document.getElementById('detailName').innerText = `${profile.name}, ${profile.age}`;
        document.getElementById('detailSignInfo').innerText = `${signSymbol} ${profile.sign} • ${element}`;
        document.getElementById('detailVibe').innerText = profile.vibe;
        document.getElementById('detailBio').innerText = profile.bio;
        document.getElementById('detailCelestial').innerText = profile.details;

        const hobbiesContainer = document.getElementById('detailHobbies');
        hobbiesContainer.innerHTML = profile.hobbies.map(h => `<span>${h}</span>`).join('');

        overlay.classList.remove('hidden');
    }

    // --- 11. MATCHES LIST RENDERER ---
    function renderMatchesList() {
        const list = document.getElementById('matchesList');
        if (!list) return;

        if (matchedProfiles.length === 0) {
            list.innerHTML = `<p class="no-matches">The stars haven't aligned for a match just yet...</p>`;
            return;
        }

        // Render each matched profile with their zodiac symbol
        list.innerHTML = matchedProfiles.map((p, index) => {
            const symbol = zodiacSymbols[p.sign] || "✨";
            return `
                <div class="match-item" data-index="${index}">
                    <div class="match-avatar">${p.emoji}</div>
                    <div class="match-info">
                        <h4>${p.name}, ${p.age}</h4>
                        <p>${symbol} ${p.sign} • ${p.vibe.split('.')[0]}.</p>
                    </div>
                </div>
            `;
        }).join('');

        // Add click listeners to matches list items
        list.querySelectorAll('.match-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = item.getAttribute('data-index');
                openDetail(matchedProfiles[index]);
            });
        });
    }

    // --- DRAG LOGIC (TINDER-STYLE) ---
    let isDragging = false, startX = 0, currentX = 0;
    let dragThresholdActive = false; // Persistent flag to distinguish swipe from click

    function initDrag() {
        const card = document.getElementById('currentCard');
        if (!card) return;

        const onStart = (e) => {
            isDragging = true;
            dragThresholdActive = false; // Reset on every touch start
            startX = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
            card.style.transition = 'none';
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
            currentX = x - startX;

            // If they move more than 10px, it's definitely a drag
            if (Math.abs(currentX) > 10) dragThresholdActive = true;

            card.style.transform = `translateX(${currentX}px) rotate(${currentX / 12}deg)`;
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            if (currentX > 130) handleSwipe('right');
            else if (currentX < -130) handleSwipe('left');
            else {
                card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.transform = 'translate(0, 0) rotate(0)';
            }

            // IMPORTANT: We reset currentX AFTER a short delay 
            // so the click event has time to fire and check its value.
            setTimeout(() => { currentX = 0; }, 50);
        };

        // Event binding
        card.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        card.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);

        // Click handler inside initDrag shares the threshold state
        card.addEventListener('click', () => {
            if (!dragThresholdActive) {
                openDetail(profiles[currentProfileIndex]);
            }
        });
    }

    // --- COMPATIBILITY ENGINE ---
    const profiles = [
        { name: "Atlas", sign: "Leo", age: 24, emoji: "🦁", vibe: "He radiates bold, dynamic fire energy.", bio: "Always finding the spotlight...", hobbies: ["Hiking", "Tech"], details: "Sun in Leo, Moon in Aries" },
        { name: "Lyra", sign: "Libra", age: 22, emoji: "⚖️", vibe: "She exudes harmony and curious air energy.", bio: "Searching for balance...", hobbies: ["Yoga", "Art"], details: "Sun in Libra, Moon in Taurus" },
        { name: "Orion", sign: "Scorpio", age: 26, emoji: "🦂", vibe: "He channels deep, intuitive water energy.", bio: "Still waters run deep...", hobbies: ["Chess", "Nightwalks"], details: "Sun in Scorpio, Moon in Pisces" },
        { name: "Luna", sign: "Cancer", age: 23, emoji: "🦀", vibe: "She flows with gentle, nurturing water energy.", bio: "Home is where the heart is...", hobbies: ["Cooking", "Poetry"], details: "Sun in Cancer, Moon in Scorpio" },
        { name: "Nova", sign: "Aquarius", age: 21, emoji: "🏺", vibe: "She vibrates with visionary air energy.", bio: "Dreaming of the future...", hobbies: ["Coding", "Sci-Fi"], details: "Sun in Aquarius, Moon in Gemini" }
    ];

    /**
     * STABLE COSMIC ENGINE
     * Returns a deterministic compatibility score based on elemental relationships.
     * No randomness ensures that the deck order remains stable.
     */
    function getCompatibility(s1, s2) {
        if (!s1 || !s2) return 70;
        const e1 = signElements[s1.toLowerCase()];
        const e2 = signElements[s2.toLowerCase()];

        // Fixed scores for stability
        if (e1 === e2) return 95; // Perfect Elemental Match
        if ((e1 === 'fire' && e2 === 'air') || (e1 === 'air' && e2 === 'fire')) return 88; // Stimulating Match
        if ((e1 === 'earth' && e2 === 'water') || (e1 === 'water' && e2 === 'earth')) return 82; // Grounded Match

        return 64; // Neutral Alignment
    }

    function sortProfilesByCompatibility(userSign) {
        // Only sort if we have a valid sign
        if (!userSign) return;
        profiles.sort((a, b) => getCompatibility(userSign, b.sign) - getCompatibility(userSign, a.sign));
    }

    // Initialize the landing page
    navigateTo('hero');

    // UI Listeners
    document.getElementById('keepSwipingBtn').addEventListener('click', () => document.getElementById('matchOverlay').classList.add('hidden'));
    document.getElementById('closeDetail').addEventListener('click', () => document.getElementById('profileDetailOverlay').classList.add('hidden'));
    if (likeBtn) likeBtn.addEventListener('click', () => handleSwipe('right'));
    if (nopeBtn) nopeBtn.addEventListener('click', () => handleSwipe('left'));
});
