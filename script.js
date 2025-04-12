document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabs = document.querySelectorAll('nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Auth Elements
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const ownerRegisterBtn = document.getElementById('owner-register-btn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const ownerRegisterModal = document.getElementById('ownerRegisterModal');
    const passwordModal = document.getElementById('passwordModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const ownerRegisterForm = document.getElementById('ownerRegisterForm');
    const passwordForm = document.getElementById('passwordForm');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showOwnerLoginBtn = document.getElementById('showOwnerLoginBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const ownerDashboardLink = document.getElementById('ownerDashboardLink');
    
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
    const addNewEventOwnerBtn = document.getElementById('addNewEventOwnerBtn');
    const sortByRatingBtn = document.getElementById('sort-by-rating');
    const sortByDateBtn = document.getElementById('sort-by-date');
    const searchEventsInput = document.getElementById('searchEventsInput');
    const searchEventsBtn = document.getElementById('searchEventsBtn');
    
    // Profile Elements
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const profileFavorites = document.getElementById('profileFavorites');
    const profileComments = document.getElementById('profileComments');
    const updateProfileBtn = document.getElementById('updateProfileBtn');
    
    // Owner Dashboard Elements
    const ownerPlacesList = document.getElementById('ownerPlacesList');
    const ownerEventsList = document.getElementById('ownerEventsList');
    
    // Menu Modal Elements
    const menuModal = document.getElementById('menuModal');
    const menuCategoriesList = document.getElementById('menuCategoriesList');
    const menuItemsList = document.getElementById('menuItemsList');
    const currentCategoryTitle = document.getElementById('currentCategoryTitle');
    const addCategoryForm = document.getElementById('addCategoryForm');
    const addMenuItemForm = document.getElementById('addMenuItemForm');
    const currentCategoryId = document.getElementById('currentCategoryId');
    
    // App State
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let places = JSON.parse(localStorage.getItem('places')) || [];
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let owners = JSON.parse(localStorage.getItem('owners')) || [];
    let menus = JSON.parse(localStorage.getItem('menus')) || [];
    
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
        ownerRegisterBtn.addEventListener('click', () => showModal(ownerRegisterModal));
        logoutBtn.addEventListener('click', handleLogout);
        showRegisterBtn.addEventListener('click', () => {
            hideModal(loginModal);
            showModal(registerModal);
        });
        showLoginBtn.addEventListener('click', () => {
            hideModal(registerModal);
            showModal(loginModal);
        });
        showOwnerLoginBtn.addEventListener('click', () => {
            hideModal(ownerRegisterModal);
            showModal(loginModal);
        });
        changePasswordBtn.addEventListener('click', () => showModal(passwordModal));
        
        // Auth forms
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        ownerRegisterForm.addEventListener('submit', handleOwnerRegister);
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
        addNewEventOwnerBtn.addEventListener('click', () => showEventForm());
        sortByRatingBtn.addEventListener('click', () => sortEvents('rating'));
        sortByDateBtn.addEventListener('click', () => sortEvents('date'));
        searchEventsBtn.addEventListener('click', () => renderEvents(searchEventsInput.value));
        searchEventsInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') renderEvents(searchEventsInput.value);
        });
        
        // Owner Dashboard
        document.getElementById('cancelEventFormBtn')?.addEventListener('click', () => hideModal(eventFormModal));
        document.getElementById('deleteEventBtn')?.addEventListener('click', handleDeleteEvent);
        
        // Menu Management
        addCategoryForm.addEventListener('submit', handleAddCategory);
        addMenuItemForm.addEventListener('submit', handleAddMenuItem);
        
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
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                    ownerId: 'owner1'
                },
                {
                    id: '2',
                    name: 'Kahve Dünyası',
                    address: 'Bağdat Caddesi No:123, Kadıköy, İstanbul',
                    type: 'kafe',
                    rating: 5,
                    notes: 'En sevdiğim kahvecilerden biri. Filtre kahveleri mükemmel.',
                    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                    ownerId: 'owner2'
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
                    ratingCount: 128,
                    ownerId: 'owner1'
                },
                {
                    id: '2',
                    name: 'Stand-up Show',
                    description: 'Ünlü komedyenler ile eğlenceli bir akşam',
                    location: 'Sahne Cafe, İstanbul',
                    date: '2023-11-20T19:30',
                    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                    rating: 4.2,
                    ratingCount: 87,
                    ownerId: 'owner2'
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
        
        // If no owners in storage, initialize with sample data
        if (owners.length === 0) {
            owners = [
                {
                    id: 'owner1',
                    name: 'Mehmet Yılmaz',
                    email: 'mehmet@example.com',
                    password: 'password123',
                    businessName: 'Lezzet Lokantası',
                    businessType: 'restoran',
                    businessAddress: 'İstiklal Caddesi No:45, Beyoğlu, İstanbul',
                    role: 'owner'
                },
                {
                    id: 'owner2',
                    name: 'Ayşe Kaya',
                    email: 'ayse@example.com',
                    password: 'password123',
                    businessName: 'Kahve Dünyası',
                    businessType: 'kafe',
                    businessAddress: 'Bağdat Caddesi No:123, Kadıköy, İstanbul',
                    role: 'owner'
                }
            ];
            localStorage.setItem('owners', JSON.stringify(owners));
        }
        
        // If no menus in storage, initialize with sample data
        if (menus.length === 0) {
            menus = [
                {
                    placeId: '1',
                    categories: [
                        {
                            id: 'cat1',
                            name: 'Ana Yemekler',
                            items: [
                                { id: 'item1', name: 'Köfte', price: '45 TL', description: 'Ev yapımı köftelerimiz' },
                                { id: 'item2', name: 'Kebap', price: '55 TL', description: 'Adana usulü kebap' }
                            ]
                        },
                        {
                            id: 'cat2',
                            name: 'Tatlılar',
                            items: [
                                { id: 'item3', name: 'Baklava', price: '25 TL', description: 'Fıstıklı baklava' }
                            ]
                        }
                    ]
                },
                {
                    placeId: '2',
                    categories: [
                        {
                            id: 'cat3',
                            name: 'Kahveler',
                            items: [
                                { id: 'item4', name: 'Türk Kahvesi', price: '15 TL', description: 'Geleneksel Türk kahvesi' },
                                { id: 'item5', name: 'Latte', price: '20 TL', description: 'Sütlü kahve' }
                            ]
                        }
                    ]
                }
            ];
            localStorage.setItem('menus', JSON.stringify(menus));
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
        } else if (tabId === 'owner-dashboard') {
            renderOwnerDashboard();
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
        
        // Check regular users
        const user = owners.find(owner => owner.email === email && owner.password === password);
        
        if (user) {
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user',
                businessName: user.businessName,
                businessType: user.businessType,
                businessAddress: user.businessAddress
            };
        } else {
            // In a real app, this would check a separate user database
            // For demo purposes, we'll just create a user
            currentUser = {
                id: 'user' + Date.now().toString(),
                name: 'Demo Kullanıcı',
                email: email,
                role: 'user'
            };
        }
        
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
        
        // Check if email already exists
        if (owners.some(owner => owner.email === email)) {
            alert('Bu e-posta adresi zaten kullanımda.');
            return;
        }
        
        // In a real app, this would be an API call
        currentUser = {
            id: 'user' + Date.now().toString(),
            name: name,
            email: email,
            role: 'user'
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
    
    function handleOwnerRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('ownerRegisterName').value;
        const email = document.getElementById('ownerRegisterEmail').value;
        const password = document.getElementById('ownerRegisterPassword').value;
        const confirmPassword = document.getElementById('ownerRegisterConfirmPassword').value;
        const businessName = document.getElementById('ownerBusinessName').value;
        const businessType = document.getElementById('ownerBusinessType').value;
        const businessAddress = document.getElementById('ownerBusinessAddress').value;
        
        // Validation
        if (!name || !email || !password || !confirmPassword || !businessName || !businessAddress) {
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
        
        // Check if email already exists
        if (owners.some(owner => owner.email === email)) {
            alert('Bu e-posta adresi zaten kullanımda.');
            return;
        }
        
        // Create owner account
        const owner = {
            id: 'owner' + Date.now().toString(),
            name: name,
            email: email,
            password: password,
            businessName: businessName,
            businessType: businessType,
            businessAddress: businessAddress,
            role: 'owner'
        };
        
        owners.push(owner);
        localStorage.setItem('owners', JSON.stringify(owners));
        
        // Create a place for the owner
        const place = {
            id: 'place' + Date.now().toString(),
            name: businessName,
            address: businessAddress,
            type: businessType,
            rating: 0,
            notes: '',
            image: '',
            ownerId: owner.id
        };
        
        places.push(place);
        localStorage.setItem('places', JSON.stringify(places));
        
        // Create an empty menu for the place
        const menu = {
            placeId: place.id,
            categories: []
        };
        
        menus.push(menu);
        localStorage.setItem('menus', JSON.stringify(menus));
        
        // Log in the owner
        currentUser = {
            id: owner.id,
            name: owner.name,
            email: owner.email,
            role: 'owner',
            businessName: owner.businessName,
            businessType: owner.businessType,
            businessAddress: owner.businessAddress
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthUI();
        
        // Hide modal and reset form
        hideModal(ownerRegisterModal);
        ownerRegisterForm.reset();
        
        // Show success message
        alert('Mekan sahibi kaydı başarılı! Hoş geldiniz.');
        
        // Show owner dashboard
        showTab('owner-dashboard');
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
            
            // Update role display
            profileRole.textContent = currentUser.role === 'owner' ? 'Mekan Sahibi' : 'Kullanıcı';
            profileRole.className = 'role-tag ' + (currentUser.role === 'owner' ? 'owner' : '');
            
            // Hide auth buttons
            document.querySelector('.auth-buttons').style.display = 'none';
            
            // Show logout button
            logoutBtn.style.display = 'block';
            
            // Enable features based on role
            addNewPlaceBtn.disabled = false;
            
            if (currentUser.role === 'owner') {
                addNewEventBtn.classList.add('hidden');
                ownerDashboardLink.classList.remove('hidden');
                addNewEventOwnerBtn.classList.remove('hidden');
            } else {
                addNewEventBtn.classList.add('hidden');
                ownerDashboardLink.classList.add('hidden');
                addNewEventOwnerBtn.classList.add('hidden');
            }
        } else {
            // Reset profile info
            profileUsername.textContent = 'Misafir';
            profileEmail.textContent = 'Giriş yapılmamış';
            profileRole.textContent = '';
            profileRole.className = 'role-tag';
            
            // Show auth buttons
            document.querySelector('.auth-buttons').style.display = 'flex';
            
            // Hide logout button
            logoutBtn.style.display = 'none';
            
            // Disable features that require auth
            addNewPlaceBtn.disabled = true;
            addNewEventBtn.classList.add('hidden');
            ownerDashboardLink.classList.add('hidden');
            addNewEventOwnerBtn.classList.add('hidden');
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
        
        const isOwner = currentUser && currentUser.role === 'owner' && currentUser.id === place.ownerId;
        
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
                    ${isOwner ? `
                        <button class="btn btn-primary" id="editPlaceBtn" data-id="${place.id}"><i class="fas fa-edit"></i> Düzenle</button>
                        <button class="btn btn-primary" id="manageMenuBtn" data-id="${place.id}"><i class="fas fa-utensils"></i> Menü Yönetimi</button>
                    ` : ''}
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
        
        // Add menu management event
        document.getElementById('manageMenuBtn')?.addEventListener('click', function() {
            showMenuModal(place.id);
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
        
        const place = { 
            id, 
            name, 
            address, 
            type, 
            rating, 
            notes, 
            image,
            ownerId: currentUser?.role === 'owner' ? currentUser.id : null
        };
        
        // Check if this is an edit or new place
        const existingIndex = places.findIndex(p => p.id === id);
        if (existingIndex >= 0) {
            // Update existing
            places[existingIndex] = place;
        } else {
            // Add new
            places.push(place);
            
            // If owner is adding a place, create an empty menu
            if (currentUser?.role === 'owner') {
                const menu = {
                    placeId: id,
                    categories: []
                };
                menus.push(menu);
                localStorage.setItem('menus', JSON.stringify(menus));
            }
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
            
            // Also remove the menu if exists
            menus = menus.filter(menu => menu.placeId !== id);
            localStorage.setItem('menus', JSON.stringify(menus));
            
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
            
            // Also remove the menu if exists
            menus = menus.filter(menu => menu.placeId !== id);
            localStorage.setItem('menus', JSON.stringify(menus));
            
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
            const isOwner = currentUser && currentUser.role === 'owner' && currentUser.id === event.ownerId;
            
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
                        ${isOwner ? `
                            <div class="event-actions">
                                <button class="btn btn-small btn-primary edit-event" data-id="${event.id}"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-small btn-danger delete-event" data-id="${event.id}"><i class="fas fa-trash"></i></button>
                            </div>
                        ` : `
                            <button class="favorite-btn ${isFavorite ? 'favorited' : ''}">
                                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                            </button>
                        `}
                    </div>
                </div>
            `;
            
            // Add click event to show event details
            eventCard.addEventListener('click', () => {
                showEventDetails(event.id);
            });
            
            // Add favorite button event
            const favoriteBtn = eventCard.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(event.id, 'event');
                    renderEvents();
                    renderProfileFavorites();
                });
            }
            
            // Add edit and delete events for owner
            if (isOwner) {
                const editBtn = eventCard.querySelector('.edit-event');
                const deleteBtn = eventCard.querySelector('.delete-event');
                
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showEventForm(event.id);
                });
                
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                        events = events.filter(e => e.id !== event.id);
                        localStorage.setItem('events', JSON.stringify(events));
                        renderEvents();
                        renderOwnerEvents();
                        updateDashboardStats();
                    }
                });
            }
            
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
        const isOwner = currentUser && currentUser.role === 'owner' && currentUser.id === event.ownerId;
        
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
            ratingCount: 0,
            ownerId: currentUser?.id || null
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
        renderOwnerEvents();
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
            renderOwnerEvents();
            hideModal(eventFormModal);
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
    
    // Owner Dashboard functions
    function renderOwnerDashboard() {
        if (!currentUser || currentUser.role !== 'owner') {
            showTab('dashboard');
            return;
        }
        
        renderOwnerPlaces();
        renderOwnerEvents();
    }
    
    function renderOwnerPlaces() {
        ownerPlacesList.innerHTML = '';
        
        const ownerPlaces = places.filter(place => place.ownerId === currentUser.id);
        
        if (ownerPlaces.length === 0) {
            ownerPlacesList.innerHTML = '<p>Henüz mekan eklemediniz.</p>';
            return;
        }
        
        ownerPlaces.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'place-card';
            placeCard.dataset.id = place.id;
            
            placeCard.innerHTML = `
                <img src="${place.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'}" alt="${place.name}">
                <div class="place-card-content">
                    <h3>${place.name}</h3>
                    <p>${place.address}</p>
                    <div class="place-card-footer">
                        <span class="place-type">${getTypeName(place.type)}</span>
                        <div class="place-actions">
                            <button class="btn btn-small btn-primary edit-place" data-id="${place.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-small btn-danger delete-place" data-id="${place.id}"><i class="fas fa-trash"></i></button>
                            <button class="btn btn-small btn-primary manage-menu" data-id="${place.id}"><i class="fas fa-utensils"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add click event to show place details
            placeCard.addEventListener('click', () => {
                displayPlaceDetails(place.id);
                showTab('places');
            });
            
            // Add edit and delete events
            const editBtn = placeCard.querySelector('.edit-place');
            const deleteBtn = placeCard.querySelector('.delete-place');
            const menuBtn = placeCard.querySelector('.manage-menu');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showPlaceForm(place.id);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Bu mekanı silmek istediğinize emin misiniz?')) {
                    places = places.filter(p => p.id !== place.id);
                    localStorage.setItem('places', JSON.stringify(places));
                    
                    // Also remove the menu if exists
                    menus = menus.filter(menu => menu.placeId !== place.id);
                    localStorage.setItem('menus', JSON.stringify(menus));
                    
                    renderOwnerPlaces();
                    renderPlaces();
                    updateDashboardStats();
                }
            });
            
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showMenuModal(place.id);
            });
            
            ownerPlacesList.appendChild(placeCard);
        });
    }
    
    function renderOwnerEvents() {
        ownerEventsList.innerHTML = '';
        
        const ownerEvents = events.filter(event => event.ownerId === currentUser.id);
        
        if (ownerEvents.length === 0) {
            ownerEventsList.innerHTML = '<p>Henüz etkinlik eklemediniz.</p>';
            return;
        }
        
        ownerEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.dataset.id = event.id;
            
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
                        <div class="event-actions">
                            <button class="btn btn-small btn-primary edit-event" data-id="${event.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-small btn-danger delete-event" data-id="${event.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add click event to show event details
            eventCard.addEventListener('click', () => {
                showEventDetails(event.id);
            });
            
            // Add edit and delete events
            const editBtn = eventCard.querySelector('.edit-event');
            const deleteBtn = eventCard.querySelector('.delete-event');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showEventForm(event.id);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                    events = events.filter(e => e.id !== event.id);
                    localStorage.setItem('events', JSON.stringify(events));
                    renderOwnerEvents();
                    renderEvents();
                    updateDashboardStats();
                }
            });
            
            ownerEventsList.appendChild(eventCard);
        });
    }
    
    // Menu Management functions
    function showMenuModal(placeId) {
        const place = places.find(p => p.id === placeId);
        if (!place) return;
        
        document.getElementById('menuModalTitle').textContent = `${place.name} Menüsü`;
        
        // Find or create menu for this place
        let menu = menus.find(m => m.placeId === placeId);
        if (!menu) {
            menu = {
                placeId: placeId,
                categories: []
            };
            menus.push(menu);
            localStorage.setItem('menus', JSON.stringify(menus));
        }
        
        // Render categories
        renderMenuCategories(menu);
        
        // Show modal
        showModal(menuModal);
    }
    
    function renderMenuCategories(menu) {
        menuCategoriesList.innerHTML = '';
        
        if (menu.categories.length === 0) {
            menuCategoriesList.innerHTML = '<p>Henüz kategori eklenmemiş.</p>';
            menuItemsList.innerHTML = '<p>Bir kategori seçin.</p>';
            currentCategoryTitle.textContent = 'Menü Öğeleri';
            currentCategoryId.value = '';
            return;
        }
        
        menu.categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.dataset.id = category.id;
            
            categoryItem.innerHTML = `
                <div class="category-item-header">
                    <span>${category.name}</span>
                    <button class="delete-category" data-id="${category.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add click event to show items in this category
            categoryItem.addEventListener('click', function(e) {
                if (e.target.closest('.delete-category')) return;
                
                // Set active category
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
                
                // Render items
                renderMenuItems(category);
            });
            
            // Add delete category event
            const deleteBtn = categoryItem.querySelector('.delete-category');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (confirm('Bu kategoriyi ve tüm öğelerini silmek istediğinize emin misiniz?')) {
                    const menuIndex = menus.findIndex(m => m.placeId === menu.placeId);
                    if (menuIndex !== -1) {
                        menus[menuIndex].categories = menus[menuIndex].categories.filter(c => c.id !== category.id);
                        localStorage.setItem('menus', JSON.stringify(menus));
                        renderMenuCategories(menus[menuIndex]);
                    }
                }
            });
            
            menuCategoriesList.appendChild(categoryItem);
        });
        
        // Select first category by default
        const firstCategory = menu.categories[0];
        document.querySelector('.category-item')?.classList.add('active');
        renderMenuItems(firstCategory);
    }
    
    function renderMenuItems(category) {
        if (!category) {
            menuItemsList.innerHTML = '<p>Bir kategori seçin.</p>';
            return;
        }
        
        currentCategoryTitle.textContent = `${category.name} Öğeleri`;
        currentCategoryId.value = category.id;
        menuItemsList.innerHTML = '';
        
        if (category.items.length === 0) {
            menuItemsList.innerHTML = '<p>Henüz öğe eklenmemiş.</p>';
            return;
        }
        
        category.items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.id = item.id;
            
            menuItem.innerHTML = `
                <div class="menu-item-info">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-price">${item.price}</div>
                    ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                </div>
                <button class="delete-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add delete item event
            const deleteBtn = menuItem.querySelector('.delete-item');
            deleteBtn.addEventListener('click', function() {
                if (confirm('Bu öğeyi silmek istediğinize emin misiniz?')) {
                    const menuIndex = menus.findIndex(m => m.placeId === menuModal.dataset.placeId);
                    if (menuIndex !== -1) {
                        const categoryIndex = menus[menuIndex].categories.findIndex(c => c.id === category.id);
                        if (categoryIndex !== -1) {
                            menus[menuIndex].categories[categoryIndex].items = menus[menuIndex].categories[categoryIndex].items.filter(i => i.id !== item.id);
                            localStorage.setItem('menus', JSON.stringify(menus));
                            renderMenuItems(menus[menuIndex].categories[categoryIndex]);
                        }
                    }
                }
            });
            
            menuItemsList.appendChild(menuItem);
        });
    }
    
    function handleAddCategory(e) {
        e.preventDefault();
        
        const categoryName = document.getElementById('newCategoryName').value;
        if (!categoryName) return;
        
        const menuIndex = menus.findIndex(m => m.placeId === menuModal.dataset.placeId);
        if (menuIndex === -1) return;
        
        const newCategory = {
            id: 'cat' + Date.now().toString(),
            name: categoryName,
            items: []
        };
        
        menus[menuIndex].categories.push(newCategory);
        localStorage.setItem('menus', JSON.stringify(menus));
        
        // Reset form and render categories
        addCategoryForm.reset();
        renderMenuCategories(menus[menuIndex]);
    }
    
    function handleAddMenuItem(e) {
        e.preventDefault();
        
        const categoryId = document.getElementById('currentCategoryId').value;
        const itemName = document.getElementById('newItemName').value;
        const itemPrice = document.getElementById('newItemPrice').value;
        const itemDescription = document.getElementById('newItemDescription').value;
        
        if (!categoryId || !itemName || !itemPrice) return;
        
        const menuIndex = menus.findIndex(m => m.placeId === menuModal.dataset.placeId);
        if (menuIndex === -1) return;
        
        const categoryIndex = menus[menuIndex].categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) return;
        
        const newItem = {
            id: 'item' + Date.now().toString(),
            name: itemName,
            price: itemPrice,
            description: itemDescription
        };
        
        menus[menuIndex].categories[categoryIndex].items.push(newItem);
        localStorage.setItem('menus', JSON.stringify(menus));
        
        // Reset form and render items
        addMenuItemForm.reset();
        renderMenuItems(menus[menuIndex].categories[categoryIndex]);
    }
    
    // Profile functions
    function renderProfile() {
        if (!currentUser) {
            profileUsername.textContent = 'Misafir';
            profileEmail.textContent = 'Giriş yapılmamış';
            profileRole.textContent = '';
            profileRole.className = 'role-tag';
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
            renderPlaces();
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
    // Silme butonunu sadece mekan sahibi görecek şekilde düzenleme (displayPlaceDetails fonksiyonunda)
function displayPlaceDetails(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;
    
    const isOwner = currentUser && currentUser.role === 'owner' && currentUser.id === place.ownerId;
    
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
                ${isOwner ? `
                    <button class="btn btn-primary" id="editPlaceBtn" data-id="${place.id}"><i class="fas fa-edit"></i> Düzenle</button>
                    <button class="btn btn-primary" id="manageMenuBtn" data-id="${place.id}"><i class="fas fa-utensils"></i> Menü Yönetimi</button>
                    <button class="btn btn-danger" id="deletePlaceBtn" data-id="${place.id}"><i class="fas fa-trash"></i> Mekanı Sil</button>
                ` : ''}
                <button class="btn btn-secondary" id="removeFavoriteBtn" data-id="${place.id}"><i class="fas fa-heart-broken"></i> Favorilerden Çıkar</button>
            </div>
        </div>
    `;
    
    // Hide welcome message
    document.querySelector('.place-details .welcome-message')?.classList.add('hidden');
    
    // Add edit event
    document.getElementById('editPlaceBtn')?.addEventListener('click', function() {
        showPlaceForm(place.id);
    });
    
    // Add menu management event
    document.getElementById('manageMenuBtn')?.addEventListener('click', function() {
        showMenuModal(place.id);
    });
    
    // Add delete place event (only for owner)
    document.getElementById('deletePlaceBtn')?.addEventListener('click', function() {
        deletePlace(place.id);
    });
    
    // Add remove from favorites event
    document.getElementById('removeFavoriteBtn')?.addEventListener('click', function() {
        removeFavorite(place.id, 'place');
    });
}

// Mekan listesinde silme butonunu sadece sahibe göster (renderPlaces fonksiyonunda)
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
        
        const isOwner = currentUser && currentUser.role === 'owner' && currentUser.id === place.ownerId;
        
        li.innerHTML = `
            <div>
                <span class="place-name">${place.name}</span>
                <span class="place-type">${getTypeName(place.type)}</span>
            </div>
            ${isOwner ? `
                <button class="delete-favorite" data-id="${place.id}">
                    <i class="fas fa-times"></i>
                </button>
            ` : ''}
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
        
        // Add delete event (only for owner)
        const deleteBtn = li.querySelector('.delete-favorite');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                deletePlace(place.id);
            });
        }
    });
    
    // Update dashboard stats
    updateDashboardStats();
}

// deletePlace fonksiyonuna yetki kontrolü ekleme
function deletePlace(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;
    
    // Check if current user is the owner
    if (currentUser?.role !== 'owner' || currentUser.id !== place.ownerId) {
        alert('Bu işlemi yapmaya yetkiniz yok. Sadece mekan sahipleri mekan silebilir.');
        return;
    }
    
    if (confirm('Bu mekanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
        places = places.filter(p => p.id !== id);
        localStorage.setItem('places', JSON.stringify(places));
        
        // Also remove the menu if exists
        menus = menus.filter(menu => menu.placeId !== id);
        localStorage.setItem('menus', JSON.stringify(menus));
        
        renderPlaces();
        renderOwnerPlaces();
        
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
document.addEventListener('DOMContentLoaded', function() {
    // Veri depolama
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let venues = JSON.parse(localStorage.getItem('venues')) || [];
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let currentVenueId = null;

    // DOM elementleri
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const authModal = document.getElementById('auth-modal');
    const modalTitle = document.getElementById('modal-title');
    const authForm = document.getElementById('auth-form');
    const userTypeSelect = document.getElementById('user-type');
    const submitBtn = document.getElementById('submit-btn');
    const userView = document.getElementById('user-view');
    const ownerView = document.getElementById('owner-view');
    const venuesContainer = document.getElementById('venues-container');
    const ownerVenuesContainer = document.getElementById('owner-venues');
    const ownerEventsContainer = document.getElementById('owner-events');
    const venueDetail = document.getElementById('venue-detail');
    const backBtn = document.getElementById('back-btn');
    const venueName = document.getElementById('venue-name');
    const venueDescription = document.getElementById('venue-description');
    const venueAddress = document.getElementById('venue-address');
    const venueCapacity = document.getElementById('venue-capacity');
    const menuItems = document.getElementById('menu-items');
    const venueEvents = document.getElementById('venue-events');
    const addVenueBtn = document.getElementById('add-venue');
    const addEventBtn = document.getElementById('add-event');
    const venueModal = document.getElementById('venue-modal');
    const eventModal = document.getElementById('event-modal');
    const newVenueForm = document.getElementById('new-venue-form');
    const newEventForm = document.getElementById('new-event-form');
    const eventVenueSelect = document.getElementById('event-venue-select');
    const menuForm = document.getElementById('menu-form');
    const menuEditor = document.getElementById('menu-editor');
    const addItemBtn = document.getElementById('add-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');

    // Modal kapatma
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Pencere dışına tıklayarak modal kapatma
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Tab geçişleri
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Giriş/Kayıt modalını aç
    loginBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Giriş Yap';
        userTypeSelect.style.display = 'none';
        submitBtn.textContent = 'Giriş Yap';
        authModal.style.display = 'block';
    });

    registerBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Kayıt Ol';
        userTypeSelect.style.display = 'block';
        submitBtn.textContent = 'Kayıt Ol';
        authModal.style.display = 'block';
    });

    // Çıkış yap
    logoutBtn.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUI();
    });

    // Kimlik doğrulama formu
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userType = userTypeSelect.value;

        if (modalTitle.textContent === 'Giriş Yap') {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                authModal.style.display = 'none';
                authForm.reset();
                updateUI();
            } else {
                alert('Kullanıcı adı veya şifre hatalı!');
            }
        } else {
            if (users.some(u => u.username === username)) {
                alert('Bu kullanıcı adı zaten alınmış!');
            } else {
                const newUser = {
                    id: Date.now(),
                    username,
                    password,
                    type: userType
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                currentUser = newUser;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                authModal.style.display = 'none';
                authForm.reset();
                updateUI();
            }
        }
    });

    // Mekan ekleme modalını aç
    addVenueBtn.addEventListener('click', function() {
        venueModal.style.display = 'block';
    });

    // Yeni mekan formu
    newVenueForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newVenue = {
            id: Date.now(),
            ownerId: currentUser.id,
            name: document.getElementById('venue-name-input').value,
            description: document.getElementById('venue-desc-input').value,
            address: document.getElementById('venue-address-input').value,
            capacity: document.getElementById('venue-capacity-input').value,
            menu: []
        };
        venues.push(newVenue);
        localStorage.setItem('venues', JSON.stringify(venues));
        venueModal.style.display = 'none';
        newVenueForm.reset();
        updateUI();
    });

    // Etkinlik ekleme modalını aç
    addEventBtn.addEventListener('click', function() {
        eventVenueSelect.innerHTML = '';
        const ownerVenuesList = venues.filter(v => v.ownerId === currentUser.id);
        ownerVenuesList.forEach(venue => {
            const option = document.createElement('option');
            option.value = venue.id;
            option.textContent = venue.name;
            eventVenueSelect.appendChild(option);
        });
        eventModal.style.display = 'block';
    });

    // Yeni etkinlik formu
    newEventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newEvent = {
            id: Date.now(),
            venueId: parseInt(eventVenueSelect.value),
            name: document.getElementById('event-name-input').value,
            description: document.getElementById('event-desc-input').value,
            date: document.getElementById('event-date-input').value
        };
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        eventModal.style.display = 'none';
        newEventForm.reset();
        updateUI();
    });

    // Menü öğesi ekle
    addItemBtn.addEventListener('click', function() {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-edit-item';
        itemDiv.innerHTML = `
            <input type="text" placeholder="Öğe adı" required>
            <input type="number" placeholder="Fiyat" step="0.01" required>
            <button type="button" class="delete-item-btn">Sil</button>
        `;
        menuEditor.appendChild(itemDiv);
        
        itemDiv.querySelector('.delete-item-btn').addEventListener('click', function() {
            itemDiv.remove();
        });
    });

    // Menü formu
    menuForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const menuItems = [];
        const inputs = menuEditor.querySelectorAll('.menu-edit-item');
        
        inputs.forEach(item => {
            const name = item.querySelector('input[type="text"]').value;
            const price = parseFloat(item.querySelector('input[type="number"]').value);
            if (name && !isNaN(price)) {
                menuItems.push({ name, price });
            }
        });
        
        const venueIndex = venues.findIndex(v => v.id === currentVenueId);
        if (venueIndex !== -1) {
            venues[venueIndex].menu = menuItems;
            localStorage.setItem('venues', JSON.stringify(venues));
            alert('Menü güncellendi!');
            loadVenueDetail(currentVenueId);
        }
    });

    // Geri dön butonu
    backBtn.addEventListener('click', function() {
        venueDetail.style.display = 'none';
        if (currentUser && currentUser.type === 'owner') {
            ownerView.style.display = 'block';
            userView.style.display = 'none';
        } else {
            userView.style.display = 'block';
            ownerView.style.display = 'none';
        }
    });

    // UI güncelleme fonksiyonu
    function updateUI() {
        if (currentUser) {
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            userInfo.textContent = `${currentUser.username} (${currentUser.type === 'owner' ? 'Mekan Sahibi' : 'Normal Kullanıcı'})`;
            
            if (currentUser.type === 'owner') {
                document.body.classList.add('owner');
                ownerView.style.display = 'block';
                userView.style.display = 'none';
                loadOwnerVenues();
                loadOwnerEvents();
            } else {
                document.body.classList.remove('owner');
                userView.style.display = 'block';
                ownerView.style.display = 'none';
                loadVenues();
            }
        } else {
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            userInfo.textContent = '';
            userView.style.display = 'block';
            ownerView.style.display = 'none';
            loadVenues();
        }
    }

    // Tüm mekanları yükle
    function loadVenues() {
        venuesContainer.innerHTML = '';
        venues.forEach(venue => {
            const venueCard = createVenueCard(venue);
            venuesContainer.appendChild(venueCard);
        });
    }

    // Mekan sahibinin mekanlarını yükle
    function loadOwnerVenues() {
        ownerVenuesContainer.innerHTML = '';
        const ownerVenuesList = venues.filter(v => v.ownerId === currentUser.id);
        
        if (ownerVenuesList.length === 0) {
            ownerVenuesContainer.innerHTML = '<p>Henüz mekan eklenmedi.</p>';
            return;
        }
        
        ownerVenuesList.forEach(venue => {
            const venueCard = createVenueCard(venue, true);
            ownerVenuesContainer.appendChild(venueCard);
        });
    }

    // Mekan sahibinin etkinliklerini yükle
    function loadOwnerEvents() {
        ownerEventsContainer.innerHTML = '';
        const ownerVenueIds = venues.filter(v => v.ownerId === currentUser.id).map(v => v.id);
        const ownerEventsList = events.filter(e => ownerVenueIds.includes(e.venueId));
        
        if (ownerEventsList.length === 0) {
            ownerEventsContainer.innerHTML = '<p>Henüz etkinlik eklenmedi.</p>';
            return;
        }
        
        ownerEventsList.forEach(event => {
            const venue = venues.find(v => v.id === event.venueId);
            const eventCard = document.createElement('div');
            eventCard.className = 'card';
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p>Mekan: ${venue.name}</p>
                <p>Tarih: ${new Date(event.date).toLocaleString()}</p>
                <p>${event.description}</p>
                <button class="delete-event" data-id="${event.id}">Sil</button>
            `;
            ownerEventsContainer.appendChild(eventCard);
            
            eventCard.querySelector('.delete-event').addEventListener('click', function() {
                const eventId = parseInt(this.getAttribute('data-id'));
                if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                    events = events.filter(e => e.id !== eventId);
                    localStorage.setItem('events', JSON.stringify(events));
                    loadOwnerEvents();
                }
            });
        });
    }

    // Mekan kartı oluştur
    function createVenueCard(venue, isOwner = false) {
        const venueCard = document.createElement('div');
        venueCard.className = 'card';
        venueCard.innerHTML = `
            <h3>${venue.name}</h3>
            <p>${venue.description.substring(0, 100)}...</p>
            <button class="view-venue" data-id="${venue.id}">Detayları Gör</button>
            ${isOwner ? `<button class="delete-venue" data-id="${venue.id}">Mekanı Sil</button>` : ''}
        `;
        
        venueCard.querySelector('.view-venue').addEventListener('click', function() {
            currentVenueId = parseInt(this.getAttribute('data-id'));
            loadVenueDetail(currentVenueId);
        });
        
        if (isOwner) {
            venueCard.querySelector('.delete-venue').addEventListener('click', function() {
                const venueId = parseInt(this.getAttribute('data-id'));
                if (confirm('Bu mekanı silmek istediğinize emin misiniz? Mekana ait menü ve etkinlikler de silinecek.')) {
                    venues = venues.filter(v => v.id !== venueId);
                    localStorage.setItem('venues', JSON.stringify(venues));
                    
                    events = events.filter(e => e.venueId !== venueId);
                    localStorage.setItem('events', JSON.stringify(events));
                    
                    loadOwnerVenues();
                    loadOwnerEvents();
                }
            });
        }
        
        return venueCard;
    }

    // Mekan detaylarını yükle
    function loadVenueDetail(venueId) {
        const venue = venues.find(v => v.id === venueId);
        if (!venue) return;
        
        venueName.textContent = venue.name;
        venueDescription.textContent = venue.description;
        venueAddress.textContent = `Adres: ${venue.address}`;
        venueCapacity.textContent = `Kapasite: ${venue.capacity} kişi`;
        
        menuItems.innerHTML = '';
        if (venue.menu.length > 0) {
            venue.menu.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price.toFixed(2)} ₺</span>
                `;
                menuItems.appendChild(menuItem);
            });
        } else {
            menuItems.innerHTML = '<p>Henüz menü eklenmemiş.</p>';
        }
        
        venueEvents.innerHTML = '';
        const venueEventsList = events.filter(e => e.venueId === venueId);
        if (venueEventsList.length > 0) {
            venueEventsList.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'card';
                eventItem.innerHTML = `
                    <h3>${event.name}</h3>
                    <p>Tarih: ${new Date(event.date).toLocaleString()}</p>
                    <p>${event.description}</p>
                    ${currentUser && currentUser.id === venue.ownerId ? 
                        `<button class="delete-event" data-id="${event.id}">Sil</button>` : ''}
                `;
                venueEvents.appendChild(eventItem);
                
                if (currentUser && currentUser.id === venue.ownerId) {
                    eventItem.querySelector('.delete-event').addEventListener('click', function() {
                        const eventId = parseInt(this.getAttribute('data-id'));
                        if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                            events = events.filter(e => e.id !== eventId);
                            localStorage.setItem('events', JSON.stringify(events));
                            loadVenueDetail(venueId);
                            loadOwnerEvents();
                        }
                    });
                }
            });
        } else {
            venueEvents.innerHTML = '<p>Henüz etkinlik eklenmemiş.</p>';
        }
        
        if (currentUser && currentUser.id === venue.ownerId) {
            menuEditor.innerHTML = '';
            venue.menu.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-edit-item';
                itemDiv.innerHTML = `
                    <input type="text" value="${item.name}" required>
                    <input type="number" value="${item.price}" step="0.01" required>
                    <button type="button" class="delete-item-btn">Sil</button>
                `;
                menuEditor.appendChild(itemDiv);
                
                itemDiv.querySelector('.delete-item-btn').addEventListener('click', function() {
                    itemDiv.remove();
                });
            });
        }
        
        userView.style.display = 'none';
        ownerView.style.display = 'none';
        venueDetail.style.display = 'block';
    }

   // ... (önceki kodlar aynı)

    // Mekan kartı oluştur
    function createVenueCard(venue, isOwner = false) {
        const venueCard = document.createElement('div');
        venueCard.className = 'card';
        venueCard.innerHTML = `
            <h3>${venue.name}</h3>
            <p>${venue.description.substring(0, 100)}...</p>
            <button class="view-venue" data-id="${venue.id}">Detayları Gör</button>
            ${isOwner ? `<button class="delete-venue" data-id="${venue.id}">Mekanı Sil</button>` : ''}
        `;
        
        venueCard.querySelector('.view-venue').addEventListener('click', function() {
            currentVenueId = parseInt(this.getAttribute('data-id'));
            loadVenueDetail(currentVenueId);
        });
        
        // Sadece mekan sahibi silme butonunu görebilir
        if (isOwner && currentUser && currentUser.type === 'owner') {
            venueCard.querySelector('.delete-venue').addEventListener('click', function() {
                const venueId = parseInt(this.getAttribute('data-id'));
                if (confirm('Bu mekanı silmek istediğinize emin misiniz? Mekana ait menü ve etkinlikler de silinecek.')) {
                    venues = venues.filter(v => v.id !== venueId);
                    localStorage.setItem('venues', JSON.stringify(venues));
                    
                    events = events.filter(e => e.venueId !== venueId);
                    localStorage.setItem('events', JSON.stringify(events));
                    
                    loadOwnerVenues();
                    loadOwnerEvents();
                }
            });
        } else {
            // Normal kullanıcılar için silme butonunu kaldır
            const deleteBtn = venueCard.querySelector('.delete-venue');
            if (deleteBtn) deleteBtn.remove();
        }
        
        return venueCard;
    }

    // Mekan detaylarını yükle
    function loadVenueDetail(venueId) {
        const venue = venues.find(v => v.id === venueId);
        if (!venue) return;
        
        venueName.textContent = venue.name;
        venueDescription.textContent = venue.description;
        venueAddress.textContent = `Adres: ${venue.address}`;
        venueCapacity.textContent = `Kapasite: ${venue.capacity} kişi`;
        
        menuItems.innerHTML = '';
        if (venue.menu.length > 0) {
            venue.menu.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price.toFixed(2)} ₺</span>
                `;
                menuItems.appendChild(menuItem);
            });
        } else {
            menuItems.innerHTML = '<p>Henüz menü eklenmemiş.</p>';
        }
        
        venueEvents.innerHTML = '';
        const venueEventsList = events.filter(e => e.venueId === venueId);
        if (venueEventsList.length > 0) {
            venueEventsList.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'card';
                eventItem.innerHTML = `
                    <h3>${event.name}</h3>
                    <p>Tarih: ${new Date(event.date).toLocaleString()}</p>
                    <p>${event.description}</p>
                    ${currentUser && currentUser.type === 'owner' && currentUser.id === venue.ownerId ? 
                        `<button class="delete-event" data-id="${event.id}">Sil</button>` : ''}
                `;
                venueEvents.appendChild(eventItem);
                
                // Sadece mekan sahibi etkinlik silebilir
                if (currentUser && currentUser.type === 'owner' && currentUser.id === venue.ownerId) {
                    eventItem.querySelector('.delete-event').addEventListener('click', function() {
                        const eventId = parseInt(this.getAttribute('data-id'));
                        if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                            events = events.filter(e => e.id !== eventId);
                            localStorage.setItem('events', JSON.stringify(events));
                            loadVenueDetail(venueId);
                            loadOwnerEvents();
                        }
                    });
                }
            });
        } else {
            venueEvents.innerHTML = '<p>Henüz etkinlik eklenmemiş.</p>';
        }
        
        // Menü düzenleme sekmesini sadece mekan sahibi görebilir
        if (currentUser && currentUser.type === 'owner' && currentUser.id === venue.ownerId) {
            menuEditor.innerHTML = '';
            venue.menu.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-edit-item';
                itemDiv.innerHTML = `
                    <input type="text" value="${item.name}" required>
                    <input type="number" value="${item.price}" step="0.01" required>
                    <button type="button" class="delete-item-btn">Sil</button>
                `;
                menuEditor.appendChild(itemDiv);
                
                itemDiv.querySelector('.delete-item-btn').addEventListener('click', function() {
                    itemDiv.remove();
                });
            });
        } else {
            // Normal kullanıcılar için menü düzenleme sekmesini gizle
            document.querySelector('[data-tab="edit-menu"]').style.display = 'none';
        }
        
        userView.style.display = 'none';
        ownerView.style.display = 'none';
        venueDetail.style.display = 'block';
    }

    // Mekan sahibinin etkinliklerini yükle
    function loadOwnerEvents() {
        ownerEventsContainer.innerHTML = '';
        const ownerVenueIds = venues.filter(v => v.ownerId === currentUser.id).map(v => v.id);
        const ownerEventsList = events.filter(e => ownerVenueIds.includes(e.venueId));
        
        if (ownerEventsList.length === 0) {
            ownerEventsContainer.innerHTML = '<p>Henüz etkinlik eklenmedi.</p>';
            return;
        }
        
        ownerEventsList.forEach(event => {
            const venue = venues.find(v => v.id === event.venueId);
            const eventCard = document.createElement('div');
            eventCard.className = 'card';
            eventCard.innerHTML = `
                <h3>${event.name}</h3>
                <p>Mekan: ${venue.name}</p>
                <p>Tarih: ${new Date(event.date).toLocaleString()}</p>
                <p>${event.description}</p>
                ${currentUser && currentUser.type === 'owner' ? 
                    `<button class="delete-event" data-id="${event.id}">Sil</button>` : ''}
            `;
            ownerEventsContainer.appendChild(eventCard);
            
            // Sadece mekan sahibi etkinlik silebilir
            if (currentUser && currentUser.type === 'owner') {
                eventCard.querySelector('.delete-event').addEventListener('click', function() {
                    const eventId = parseInt(this.getAttribute('data-id'));
                    if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                        events = events.filter(e => e.id !== eventId);
                        localStorage.setItem('events', JSON.stringify(events));
                        loadOwnerEvents();
                    }
                });
            }
        });
    }

// ... (diğer kodlar aynı)
   
    // Uygulamayı başlat
   
    updateUI();
});

    // Initialize the app
    init();
});
