document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabs = document.querySelectorAll('nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Auth Elements
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const passwordModal = document.getElementById('passwordModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const passwordForm = document.getElementById('passwordForm');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    
    // Places Elements
    const favoritesList = document.getElementById('favoritesList');
    const placeDetails = document.getElementById('placeDetails');
    const placeForm = document.getElementById('placeForm');
    const placeFormElement = document.getElementById('placeFormElement');
    const addNewPlaceBtn = document.getElementById('addNewPlaceBtn');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const deletePlaceBtn = document.getElementById('deletePlaceBtn');
    const searchPlacesInput = document.getElementById('searchPlacesInput');
    const searchPlacesBtn = document.getElementById('searchPlacesBtn');
    
    // Events Elements
    const eventsContainer = document.getElementById('eventsContainer');
    const eventModal = document.getElementById('eventModal');
    const eventFormModal = document.getElementById('eventFormModal');
    const eventForm = document.getElementById('eventForm');
    const addNewEventBtn = document.getElementById('addNewEventBtn');
    const sortByRatingBtn = document.getElementById('sort-by-rating');
    const sortByDateBtn = document.getElementById('sort-by-date');
    const searchEventsInput = document.getElementById('searchEventsInput');
    const searchEventsBtn = document.getElementById('searchEventsBtn');
    
    // Profile Elements
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const profileFavorites = document.getElementById('profileFavorites');
    const profileComments = document.getElementById('profileComments');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    
    // App State
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let places = JSON.parse(localStorage.getItem('places')) || [];
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Initialize the app
    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Update UI based on auth state
        updateAuthUI();
        
        // Load data
        loadInitialData();
        
        // Show dashboard by default
        showTab('dashboard');
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                showTab(tabId);
            });
        });
        
        // Auth buttons
        loginBtn.addEventListener('click', () => showModal(loginModal));
        registerBtn.addEventListener('click', () => showModal(registerModal));
        logoutBtn.addEventListener('click', handleLogout);
        showRegisterBtn.addEventListener('click', () => {
            hideModal(loginModal);
            showModal(registerModal);
        });
        showLoginBtn.addEventListener('click', () => {
            hideModal(registerModal);
            showModal(loginModal);
        });
        changePasswordBtn.addEventListener('click', () => showModal(passwordModal));
        
        // Auth forms
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        passwordForm.addEventListener('submit', handleChangePassword);
        
        // Places
        addNewPlaceBtn.addEventListener('click', () => showPlaceForm());
        cancelFormBtn.addEventListener('click', () => hidePlaceForm());
        deletePlaceBtn.addEventListener('click', handleDeletePlace);
        placeFormElement.addEventListener('submit', handleSavePlace);
        searchPlacesBtn.addEventListener('click', () => renderPlaces(searchPlacesInput.value));
        searchPlacesInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') renderPlaces(searchPlacesInput.value);
        });
        
        // Events
        addNewEventBtn.addEventListener('click', () => showEventForm());
        sortByRatingBtn.addEventListener('click', () => sortEvents('rating'));
        sortByDateBtn.addEventListener('click', () => sortEvents('date'));
        searchEventsBtn.addEventListener('click', () => renderEvents(searchEventsInput.value));
        searchEventsInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') renderEvents(searchEventsInput.value);
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) hideModal(modal);
            });
        });
        
        // Close modals with close buttons
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                hideModal(modal);
            });
        });
    }
    
    // Load initial data
    function loadInitialData() {
        // If no places in storage, load sample data
        if (places.length === 0) {
            places = [
                {
                    id: '1',
                    name: 'Lezzet Lokantası',
                    address: 'İstiklal Caddesi No:45, Beyoğlu, İstanbul',
                    type: 'restoran',
                    rating: 4,
                    notes: 'Harika geleneksel yemekler. Özellikle etli yemekleri çok lezzetli.',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                },
                {
                    id: '2',
                    name: 'Kahve Dünyası',
                    address: 'Bağdat Caddesi No:123, Kadıköy, İstanbul',
                    type: 'kafe',
                    rating: 5,
                    notes: 'En sevdiğim kahvecilerden biri. Filtre kahveleri mükemmel.',
                    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
                }
            ];
            localStorage.setItem('places', JSON.stringify(places));
        }
        
        // If no events in storage, load sample data
        if (events.length === 0) {
            events = [
                {
                    id: '1',
                    name: 'Jazz Gecesi',
                    description: 'Uluslararası jazz sanatçıları ile unutulmaz bir gece',
                    location: 'Kültür Merkezi, İstanbul',
                    date: '2023-12-15T20:00',
                    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                    rating: 4.5,
                    ratingCount: 128
                },
                {
                    id: '2',
                    name: 'Stand-up Show',
                    description: 'Ünlü komedyenler ile eğlenceli bir akşam',
                    location: 'Sahne Cafe, İstanbul',
                    date: '2023-11-20T19:30',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                    rating: 4.2,
                    ratingCount: 87
                }
            ];
            localStorage.setItem('events', JSON.stringify(events));
        }
        
        // If no comments in storage, load sample data
        if (comments.length === 0) {
            comments = [
                {
                    id: '1',
                    eventId: '1',
                    userId: '1',
                    username: 'Ahmet Yılmaz',
                    text: 'Harika bir etkinlikti, tekrar gelmek istiyorum!',
                    date: '2023-10-15'
                },
                {
                    id: '2',
                    placeId: '1',
                    userId: '1',
                    username: 'Ahmet Yılmaz',
                    text: 'Yemekler çok lezzetli, personel çok ilgili.',
                    date: '2023-10-10'
                }
            ];
            localStorage.setItem('comments', JSON.stringify(comments));
        }
        
        // If no favorites in storage, initialize empty array
        if (favorites.length === 0) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        
        // Render initial data
        renderPlaces();
        renderEvents();
        updateDashboardStats();
    }
    
    // Show a specific tab
    function showTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tabs
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show the selected tab content
        document.getElementById(tabId).classList.add('active');
        
        // Add active class to the selected tab
        document.querySelector(`nav a[data-tab="${tabId}"]`).classList.add('active');
        
        // Special cases
        if (tabId === 'profile') {
            renderProfile();
        } else if (tabId === 'places') {
            if (places.length > 0) {
                displayPlaceDetails(places[0].id);
            }
        }
    }
    
    // Modal functions
    function showModal(modal) {
        modal.classList.add('active');
    }
    
    function hideModal(modal) {
        modal.classList.remove('active');
    }
    
    // Auth functions
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation
        if (!email || !password) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        
        // In a real app, this would be an API call
        currentUser = {
            id: '1',
            name: 'Demo Kullanıcı',
            email: email
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthUI();
        
        // Hide modal and reset form
        hideModal(loginModal);
        loginForm.reset();
        
        // Show success message
        alert('Başarıyla giriş yaptınız!');
    }
    
    function handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor.');
            return;
        }
        
        if (password.length < 6) {
            alert('Şifre en az 6 karakter olmalıdır.');
            return;
        }
        
        // In a real app, this would be an API call
        currentUser = {
            id: Date.now().toString(),
            name: name,
            email: email
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthUI();
        
        // Hide modal and reset form
        hideModal(registerModal);
        registerForm.reset();
        
        // Show success message
        alert('Kayıt başarılı! Hoş geldiniz.');
    }
    
    function handleLogout() {
        if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthUI();
            showTab('dashboard');
        }
    }
    
    function handleChangePassword(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            alert('Yeni şifreler eşleşmiyor.');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('Şifre en az 6 karakter olmalıdır.');
            return;
        }
        
        // In a real app, this would be an API call
        hideModal(passwordModal);
        passwordForm.reset();
        alert('Şifreniz başarıyla değiştirildi.');
    }
    
    function updateAuthUI() {
        if (currentUser) {
            // Update profile info
            profileUsername.textContent = currentUser.name;
            profileEmail.textContent = currentUser.email;
            
            // Hide auth buttons
            document.querySelector('.auth-buttons').style.display = 'none';
            
            // Show logout button
            logoutBtn.style.display = 'block';
            
            // Enable features that require auth
            addNewPlaceBtn.disabled = false;
            addNewEventBtn.disabled = false;
        } else {
            // Reset profile info
            profileUsername.textContent = 'Misafir';
            profileEmail.textContent = 'Giriş yapılmamış';
            
            // Show auth buttons
            document.querySelector('.auth-buttons').style.display = 'flex';
            
            // Hide logout button
            logoutBtn.style.display = 'none';
            
            // Disable features that require auth
            addNewPlaceBtn.disabled = true;
            addNewEventBtn.disabled = true;
        }
    }
    
    // Places functions
    function renderPlaces(filter = '') {
        favoritesList.innerHTML = '';
        
        const filteredPlaces = places.filter(place => 
            place.name.toLowerCase().includes(filter.toLowerCase()) || 
            place.address.toLowerCase().includes(filter.toLowerCase())
        );
        
        if (filteredPlaces.length === 0) {
            favoritesList.innerHTML = '<li class="no-results">Sonuç bulunamadı</li>';
            return;
        }
        
        filteredPlaces.forEach(place => {
            const li = document.createElement('li');
            li.dataset.id = place.id;
            
            li.innerHTML = `
                <div>
                    <span class="place-name">${place.name}</span>
                    <span class="place-type">${getTypeName(place.type)}</span>
                </div>
                <button class="delete-favorite" data-id="${place.id}"><i class="fas fa-times"></i></button>
            `;
            
            favoritesList.appendChild(li);
            
            // Add click event to show details
            li.addEventListener('click', function(e) {
                if (e.target.closest('.delete-favorite')) return;
                displayPlaceDetails(place.id);
                
                // Set active class
                document.querySelectorAll('#favoritesList li').forEach(item => {
                    item.classList.remove('active');
                });
                li.classList.add('active');
            });
            
            // Add delete event
            const deleteBtn = li.querySelector('.delete-favorite');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                deletePlace(place.id);
            });
        });
        
        // Update dashboard stats
        updateDashboardStats();
    }
    
    function displayPlaceDetails(id) {
        const place = places.find(p => p.id === id);
        if (!place) return;
        
        placeDetails.innerHTML = `
            <div class="place-info">
                <h2><i class="fas ${getTypeIcon(place.type)}"></i> ${place.name}</h2>
                ${place.image ? `<img src="${place.image}" alt="${place.name}" class="place-image">` : ''}
                
                <div class="place-meta">
                    <div><i class="fas fa-map-marker-alt"></i> ${place.address}</div>
                    <div><i class="fas fa-star"></i> ${place.rating}/5</div>
                    <div><i class="fas fa-tag"></i> ${getTypeName(place.type)}</div>
                </div>
                
                ${place.notes ? `<div class="place-notes"><h4>Notlar:</h4><p>${place.notes}</p></div>` : ''}
                
                <div class="place-actions">
                    <button class="btn btn-primary" id="editPlaceBtn" data-id="${place.id}"><i class="fas fa-edit"></i> Düzenle</button>
                    <button class="btn btn-danger" id="removeFavoriteBtn" data-id="${place.id}"><i class="fas fa-heart-broken"></i> Favorilerden Çıkar</button>
                </div>
            </div>
        `;
        
        // Hide welcome message
        document.querySelector('.place-details .welcome-message')?.classList.add('hidden');
        
        // Add edit event
        document.getElementById('editPlaceBtn')?.addEventListener('click', function() {
            showPlaceForm(place.id);
        });
        
        // Add remove from favorites event
        document.getElementById('removeFavoriteBtn')?.addEventListener('click', function() {
            deletePlace(place.id);
        });
    }
    
    function showPlaceForm(id = null) {
        placeDetails.classList.add('hidden');
        placeForm.classList.remove('hidden');
        
        if (id) {
            // Edit mode
            document.getElementById('formTitle').textContent = 'Mekanı Düzenle';
            deletePlaceBtn.classList.remove('hidden');
            
            const place = places.find(p => p.id === id);
            if (place) {
                document.getElementById('placeId').value = place.id;
                document.getElementById('placeName').value = place.name;
                document.getElementById('placeAddress').value = place.address;
                document.getElementById('placeType').value = place.type;
                document.getElementById('placeRating').value = place.rating;
                document.getElementById('placeNotes').value = place.notes || '';
                document.getElementById('placeImage').value = place.image || '';
            }
        } else {
            // Add mode
            document.getElementById('formTitle').textContent = 'Yeni Mekan Ekle';
            deletePlaceBtn.classList.add('hidden');
            placeFormElement.reset();
            document.getElementById('placeId').value = '';
        }
    }
    
    function hidePlaceForm() {
        placeForm.classList.add('hidden');
        placeDetails.classList.remove('hidden');
    }
    
    function handleSavePlace(e) {
        e.preventDefault();
        
        const id = document.getElementById('placeId').value || Date.now().toString();
        const name = document.getElementById('placeName').value;
        const address = document.getElementById('placeAddress').value;
        const type = document.getElementById('placeType').value;
        const rating = parseInt(document.getElementById('placeRating').value);
        const notes = document.getElementById('placeNotes').value;
        const image = document.getElementById('placeImage').value;
        
        if (!name || !address) {
            alert('Lütfen mekan adı ve adres bilgilerini girin.');
            return;
        }
        
        const place = { id, name, address, type, rating, notes, image };
        
        // Check if this is an edit or new place
        const existingIndex = places.findIndex(p => p.id === id);
        if (existingIndex >= 0) {
            // Update existing
            places[existingIndex] = place;
        } else {
            // Add new
            places.push(place);
        }
        
        // Save to localStorage
        localStorage.setItem('places', JSON.stringify(places));
        
        // Update UI
        renderPlaces();
        displayPlaceDetails(id);
        hidePlaceForm();
        
        // Set active class
        document.querySelectorAll('#favoritesList li').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.id === id) {
                item.classList.add('active');
            }
        });
        
        // Update dashboard stats
        updateDashboardStats();
    }
    
    function handleDeletePlace() {
        const id = document.getElementById('placeId').value;
        if (!id) return;
        
        if (confirm('Bu mekanı silmek istediğinize emin misiniz?')) {
            places = places.filter(p => p.id !== id);
            localStorage.setItem('places', JSON.stringify(places));
            
            renderPlaces();
            hidePlaceForm();
            
            // If we deleted the currently displayed place
            if (places.length > 0) {
                displayPlaceDetails(places[0].id);
            } else {
                placeDetails.innerHTML = `
                    <div class="welcome-message">
                        <h3>Bir mekan seçin</h3>
                        <p>Soldaki listeden bir mekan seçerek detaylarını görüntüleyebilirsiniz.</p>
                    </div>
                `;
            }
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
    
    function deletePlace(id) {
        if (confirm('Bu mekanı silmek istediğinize emin misiniz?')) {
            places = places.filter(p => p.id !== id);
            localStorage.setItem('places', JSON.stringify(places));
            
            renderPlaces();
            
            // If we deleted the currently displayed place
            if (places.length > 0) {
                displayPlaceDetails(places[0].id);
            } else {
                placeDetails.innerHTML = `
                    <div class="welcome-message">
                        <h3>Bir mekan seçin</h3>
                        <p>Soldaki listeden bir mekan seçerek detaylarını görüntüleyebilirsiniz.</p>
                    </div>
                `;
            }
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
    
    // Events functions
    function renderEvents(filter = '') {
        eventsContainer.innerHTML = '';
        
        const filteredEvents = events.filter(event => 
            event.name.toLowerCase().includes(filter.toLowerCase()) || 
            event.location.toLowerCase().includes(filter.toLowerCase())
        );
        
        if (filteredEvents.length === 0) {
            eventsContainer.innerHTML = '<p class="no-results">Sonuç bulunamadı</p>';
            return;
        }
        
        filteredEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.dataset.id = event.id;
            
            const isFavorite = favorites.some(fav => fav.id === event.id && fav.type === 'event');
            
            eventCard.innerHTML = `
                <img src="${event.image}" alt="${event.name}">
                <div class="event-card-content">
                    <h3>${event.name}</h3>
                    <p>${event.description}</p>
                    <div class="event-card-footer">
                        <div class="event-rating">
                            <div class="stars">
                                ${renderStars(event.rating)}
                            </div>
                            <span class="count">(${event.ratingCount})</span>
                        </div>
                        <button class="favorite-btn ${isFavorite ? 'favorited' : ''}">
                            <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add click event to show event details
            eventCard.addEventListener('click', () => {
                showEventDetails(event.id);
            });
            
            // Add favorite button event
            const favoriteBtn = eventCard.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(event.id, 'event');
                renderEvents();
                renderProfileFavorites();
            });
            
            eventsContainer.appendChild(eventCard);
        });
    }
    
    function sortEvents(criteria) {
        if (criteria === 'rating') {
            events.sort((a, b) => b.rating - a.rating);
        } else if (criteria === 'date') {
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        renderEvents();
    }
    
    function showEventDetails(id) {
        const event = events.find(e => e.id === id);
        if (!event) return;
        
        const isFavorite = favorites.some(fav => fav.id === id && fav.type === 'event');
        
        // Update modal content
        document.getElementById('eventModalTitle').textContent = event.name;
        document.getElementById('eventModalImage').src = event.image;
        document.getElementById('eventModalImage').alt = event.name;
        document.getElementById('eventModalDescription').textContent = event.description;
        document.getElementById('eventModalLocation').textContent = event.location;
        
        // Format date
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('eventModalDate').textContent = formattedDate;
        
        // Update rating
        document.getElementById('eventAverageRating').textContent = event.rating.toFixed(1);
        
        // Render stars
        const starsContainer = document.getElementById('eventRatingStars');
        starsContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = i <= Math.floor(event.rating) ? 'fas fa-star' : 
                             (i === Math.ceil(event.rating) && event.rating % 1 >= 0.5 ? 'fas fa-star-half-alt' : 'far fa-star');
            star.dataset.rating = i;
            starsContainer.appendChild(star);
        }
        
        // Add star rating event
        starsContainer.querySelectorAll('i').forEach(star => {
            star.addEventListener('click', (e) => {
                if (!currentUser) {
                    alert('Puan vermek için giriş yapmalısınız.');
                    return;
                }
                
                const rating = parseInt(e.target.dataset.rating);
                alert(`${rating} yıldız puanı verdiniz!`);
            });
        });
        
        // Render comments
        renderEventComments(id);
        
        // Show modal
        showModal(eventModal);
    }
    
    function renderEventComments(eventId) {
        const commentsList = document.getElementById('eventCommentsList');
        commentsList.innerHTML = '';
        
        const eventComments = comments.filter(comment => comment.eventId === eventId);
        
        if (eventComments.length === 0) {
            commentsList.innerHTML = '<p>Henüz yorum yapılmamış.</p>';
            return;
        }
        
        eventComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.username}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsList.appendChild(commentElement);
        });
    }
    
    function showEventForm(id = null) {
        if (id) {
            // Edit mode
            document.getElementById('eventFormTitle').textContent = 'Etkinlik Düzenle';
            document.getElementById('deleteEventBtn').classList.remove('hidden');
            
            const event = events.find(e => e.id === id);
            if (event) {
                document.getElementById('eventId').value = event.id;
                document.getElementById('eventName').value = event.name;
                document.getElementById('eventDescription').value = event.description;
                document.getElementById('eventLocation').value = event.location;
                document.getElementById('eventDate').value = event.date;
                document.getElementById('eventImage').value = event.image;
            }
        } else {
            // Add mode
            document.getElementById('eventFormTitle').textContent = 'Yeni Etkinlik Ekle';
            document.getElementById('deleteEventBtn').classList.add('hidden');
            eventForm.reset();
            document.getElementById('eventId').value = '';
        }
        
        showModal(eventFormModal);
    }
    
    function handleSaveEvent(e) {
        e.preventDefault();
        
        const id = document.getElementById('eventId').value || Date.now().toString();
        const name = document.getElementById('eventName').value;
        const description = document.getElementById('eventDescription').value;
        const location = document.getElementById('eventLocation').value;
        const date = document.getElementById('eventDate').value;
        const image = document.getElementById('eventImage').value;
        
        if (!name || !description || !location || !date) {
            alert('Lütfen tüm gerekli alanları doldurun.');
            return;
        }
        
        const event = {
            id,
            name,
            description,
            location,
            date,
            image,
            rating: 0,
            ratingCount: 0
        };
        
        // Check if this is an edit or new event
        const existingIndex = events.findIndex(e => e.id === id);
        if (existingIndex >= 0) {
            // Preserve rating and ratingCount when editing
            event.rating = events[existingIndex].rating;
            event.ratingCount = events[existingIndex].ratingCount;
            
            // Update existing
            events[existingIndex] = event;
        } else {
            // Add new
            events.push(event);
        }
        
        // Save to localStorage
        localStorage.setItem('events', JSON.stringify(events));
        
        // Update UI
        renderEvents();
        hideModal(eventFormModal);
        
        // Update dashboard stats
        updateDashboardStats();
    }
    
    function handleDeleteEvent() {
        const id = document.getElementById('eventId').value;
        if (!id) return;
        
        if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
            events = events.filter(e => e.id !== id);
            localStorage.setItem('events', JSON.stringify(events));
            
            renderEvents();
            hideModal(eventFormModal);
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
    
    // Profile functions
    function renderProfile() {
        if (!currentUser) {
            profileUsername.textContent = 'Misafir';
            profileEmail.textContent = 'Giriş yapılmamış';
            profileFavorites.innerHTML = '<p>Favorilerinizi görmek için giriş yapmalısınız.</p>';
            profileComments.innerHTML = '<p>Yorumlarınızı görmek için giriş yapmalısınız.</p>';
            return;
        }
        
        renderProfileFavorites();
        renderProfileComments();
    }
    
    function renderProfileFavorites() {
        profileFavorites.innerHTML = '';
        
        const userFavorites = favorites.filter(fav => fav.userId === currentUser.id);
        
        if (userFavorites.length === 0) {
            profileFavorites.innerHTML = '<p>Henüz favori eklemediniz.</p>';
            return;
        }
        
        userFavorites.forEach(fav => {
            let item;
            
            if (fav.type === 'place') {
                const place = places.find(p => p.id === fav.id);
                if (!place) return;
                
                item = document.createElement('div');
                item.className = 'favorite-item';
                item.innerHTML = `
                    <div class="favorite-info">
                        <h4><i class="fas ${getTypeIcon(place.type)}"></i> ${place.name}</h4>
                        <p>${getTypeName(place.type)}</p>
                    </div>
                    <button class="remove-favorite" data-id="${place.id}" data-type="place">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            } else if (fav.type === 'event') {
                const event = events.find(e => e.id === fav.id);
                if (!event) return;
                
                item = document.createElement('div');
                item.className = 'favorite-item';
                item.innerHTML = `
                    <div class="favorite-info">
                        <h4><i class="fas fa-calendar-alt"></i> ${event.name}</h4>
                        <p>Etkinlik</p>
                    </div>
                    <button class="remove-favorite" data-id="${event.id}" data-type="event">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            }
            
            if (item) {
                profileFavorites.appendChild(item);
                
                // Add remove favorite event
                const removeBtn = item.querySelector('.remove-favorite');
                removeBtn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const type = this.getAttribute('data-type');
                    removeFavorite(id, type);
                });
            }
        });
    }
    
    function renderProfileComments() {
        profileComments.innerHTML = '';
        
        const userComments = comments.filter(comment => comment.userId === currentUser.id);
        
        if (userComments.length === 0) {
            profileComments.innerHTML = '<p>Henüz yorum yapmadınız.</p>';
            return;
        }
        
        userComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            
            let title = '';
            if (comment.eventId) {
                const event = events.find(e => e.id === comment.eventId);
                title = event ? event.name : 'Etkinlik';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-title"><i class="fas fa-calendar-alt"></i> ${title}</span>
                        <span class="comment-date">${formatDate(comment.date)}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                `;
            } else if (comment.placeId) {
                const place = places.find(p => p.id === comment.placeId);
                title = place ? place.name : 'Mekan';
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-title"><i class="fas fa-map-marker-alt"></i> ${title}</span>
                        <span class="comment-date">${formatDate(comment.date)}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                `;
            }
            
            profileComments.appendChild(commentElement);
        });
    }
    
    // Favorites functions
    function toggleFavorite(id, type) {
        if (!currentUser) {
            alert('Favori eklemek için giriş yapmalısınız.');
            showModal(loginModal);
            return;
        }
        
        const existingIndex = favorites.findIndex(fav => 
            fav.id === id && fav.type === type && fav.userId === currentUser.id
        );
        
        if (existingIndex === -1) {
            // Add to favorites
            favorites.push({
                id,
                type,
                userId: currentUser.id,
                date: new Date().toISOString()
            });
        } else {
            // Remove from favorites
            favorites.splice(existingIndex, 1);
        }
        
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    function removeFavorite(id, type) {
        if (confirm('Bu öğeyi favorilerinizden çıkarmak istediğinize emin misiniz?')) {
            favorites = favorites.filter(fav => 
                !(fav.id === id && fav.type === type && fav.userId === currentUser.id)
            );
            
            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            // Update UI
            renderProfileFavorites();
            renderEvents();
        }
    }
    
    // Utility functions
    function getTypeName(type) {
        const types = {
            'restoran': 'Restoran',
            'kafe': 'Kafe',
            'bar': 'Bar',
            'park': 'Park',
            'müze': 'Müze',
            'diğer': 'Diğer'
        };
        return types[type] || type;
    }
    
    function getTypeIcon(type) {
        const icons = {
            'restoran': 'fa-utensils',
            'kafe': 'fa-coffee',
            'bar': 'fa-glass-martini-alt',
            'park': 'fa-tree',
            'müze': 'fa-landmark',
            'diğer': 'fa-map-marker-alt'
        };
        return icons[type] || 'fa-map-marker-alt';
    }
    
    function renderStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }
    
    function updateDashboardStats() {
        document.getElementById('total-places').textContent = places.length;
        document.getElementById('total-events').textContent = events.length;
        
        if (favorites.length > 0 && currentUser) {
            const userFavorites = favorites.filter(fav => fav.userId === currentUser.id && fav.type === 'place');
            if (userFavorites.length > 0) {
                const favoritePlace = places.find(p => p.id === userFavorites[0].id);
                if (favoritePlace) {
                    document.getElementById('favorite-place').textContent = favoritePlace.name;
                    return;
                }
            }
        }
        
        document.getElementById('favorite-place').textContent = 'Yok';
    }
    
    // Initialize the app
    init();
});
