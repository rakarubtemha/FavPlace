// JavaScript for the venue detail page

document.addEventListener("DOMContentLoaded", () => {
  // Get venue ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const venueId = Number.parseInt(urlParams.get("id")) || 1

  // Mock data for venue details
  const venue = {
    id: 1,
    name: "Cafe Istanbul",
    type: "Kafe",
    rating: 4.7,
    reviewCount: 128,
    image: "img/placeholder.jpg",
    location: "Kadıköy, İstanbul",
    address: "Caferağa Mah. Moda Cad. No:123, Kadıköy/İstanbul",
    phone: "+90 212 123 4567",
    website: "https://cafeistanbul.com",
    description:
      "Modern bir ortamda kaliteli kahve ve atıştırmalıklar sunan şık bir kafe. Özel kavrulan kahve çekirdekleri ve ev yapımı tatlılarıyla ünlüdür. Hafta sonları canlı müzik etkinlikleri düzenlenmektedir.",
    hours: [
      { day: "Pazartesi - Cuma", hours: "08:00 - 22:00" },
      { day: "Cumartesi - Pazar", hours: "09:00 - 23:00" },
    ],
    features: ["Wi-Fi", "Dış Mekan", "Kahvaltı", "Vejetaryen Seçenekler"],
  }

  // Mock data for menu
  const menuCategories = [
    { id: "kahveler", name: "Kahveler" },
    { id: "sicak-icecekler", name: "Sıcak İçecekler" },
    { id: "soguk-icecekler", name: "Soğuk İçecekler" },
    { id: "tatlilar", name: "Tatlılar" },
    { id: "kahvalti", name: "Kahvaltı" },
  ]

  const menuItems = {
    kahveler: [
      {
        id: 1,
        name: "Espresso",
        description: "Yoğun ve aromatik espresso",
        price: "25 TL",
        image: "img/placeholder.jpg",
        tags: ["Klasik"],
      },
      {
        id: 2,
        name: "Americano",
        description: "Espresso ve sıcak su",
        price: "30 TL",
        image: "img/placeholder.jpg",
        tags: ["Klasik"],
      },
      {
        id: 3,
        name: "Latte",
        description: "Espresso ve buharla ısıtılmış süt",
        price: "35 TL",
        image: "img/placeholder.jpg",
        tags: ["Popüler", "Sütlü"],
      },
    ],
    "sicak-icecekler": [
      {
        id: 6,
        name: "Çay",
        description: "Demlik çay",
        price: "15 TL",
        image: "img/placeholder.jpg",
        tags: [],
      },
      {
        id: 7,
        name: "Bitki Çayı",
        description: "Çeşitli bitki çayları",
        price: "25 TL",
        image: "img/placeholder.jpg",
        tags: [],
      },
    ],
    "soguk-icecekler": [
      {
        id: 9,
        name: "Soğuk Kahve",
        description: "Buz ile servis edilen filtre kahve",
        price: "35 TL",
        image: "img/placeholder.jpg",
        tags: [],
      },
    ],
    tatlilar: [
      {
        id: 12,
        name: "Cheesecake",
        description: "Ev yapımı cheesecake",
        price: "45 TL",
        image: "img/placeholder.jpg",
        tags: ["Ev Yapımı", "Popüler"],
      },
    ],
    kahvalti: [
      {
        id: 15,
        name: "Türk Kahvaltısı",
        description: "Peynir, zeytin, domates, salatalık, bal, reçel ve simit ile",
        price: "85 TL",
        image: "img/placeholder.jpg",
        tags: ["Popüler"],
      },
    ],
  }

  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      user: "Ahmet Y.",
      date: "15 Mayıs 2023",
      rating: 5,
      comment:
        "Harika bir kafe! Kahveleri çok lezzetli ve personel çok ilgili. Özellikle filtre kahveleri denemelisiniz.",
      likes: 12,
    },
    {
      id: 2,
      user: "Ayşe K.",
      date: "3 Mayıs 2023",
      rating: 4,
      comment: "Güzel bir ortam ve lezzetli yemekler. Fiyatlar biraz yüksek ama kalitesi de ona göre iyi.",
      likes: 8,
    },
    {
      id: 3,
      user: "Mehmet S.",
      date: "28 Nisan 2023",
      rating: 3,
      comment: "Ortalama bir mekan. Yemekler fena değil ama servis biraz yavaştı. Belki yoğun olduğu için öyleydi.",
      likes: 3,
    },
  ]

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Caz Gecesi",
      date: "15 Haziran 2023",
      time: "20:00 - 23:00",
      image: "img/placeholder.jpg",
    },
    {
      id: 2,
      title: "Akustik Müzik Akşamı",
      date: "22 Haziran 2023",
      time: "19:30 - 22:30",
      image: "img/placeholder.jpg",
    },
  ]

  // Mock data for similar venues
  const similarVenues = [
    {
      id: 2,
      name: "Marmara Cafe",
      type: "Kafe",
      rating: 4.3,
      image: "img/placeholder.jpg",
    },
    {
      id: 3,
      name: "Bosphorus Bistro",
      type: "Bistro",
      rating: 4.8,
      image: "img/placeholder.jpg",
    },
    {
      id: 4,
      name: "Anadolu Restaurant",
      type: "Restoran",
      rating: 4.5,
      image: "img/placeholder.jpg",
    },
  ]

  // Render venue image
  const venueImage = document.getElementById("venueImage")
  if (venueImage) {
    venueImage.innerHTML = `<img src="${venue.image}" alt="${venue.name}">`
  }

  // Render venue header
  const venueHeader = document.getElementById("venueHeader")
  if (venueHeader) {
    venueHeader.innerHTML = `
            <div class="venue-title">
                <h1>${venue.name}</h1>
                <span class="venue-badge">${venue.type}</span>
            </div>
            <div class="venue-info">
                <div class="venue-info-item">
                    <i class="fas fa-star"></i>
                    <span>${venue.rating}</span>
                    <span>(${venue.reviewCount} değerlendirme)</span>
                </div>
                <div class="venue-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${venue.location}</span>
                </div>
            </div>
            <div class="venue-actions">
                <button class="btn btn-primary" id="favoriteBtn">
                    <i class="far fa-heart"></i>
                    <span>Favorilere Ekle</span>
                </button>
            </div>
        `

    // Add favorite functionality
    const favoriteBtn = document.getElementById("favoriteBtn")
    if (favoriteBtn) {
      favoriteBtn.addEventListener("click", function () {
        const icon = this.querySelector("i")
        const text = this.querySelector("span")

        if (icon.classList.contains("far")) {
          icon.classList.remove("far")
          icon.classList.add("fas")
          text.textContent = "Favorilerde"
          this.classList.add("active")
          window.showToast("Favorilere Eklendi", "Mekan favorilerinize eklendi.", "success")
        } else {
          icon.classList.remove("fas")
          icon.classList.add("far")
          text.textContent = "Favorilere Ekle"
          this.classList.remove("active")
          window.showToast("Favorilerden Çıkarıldı", "Mekan favorilerinizden çıkarıldı.", "info")
        }
      })
    }
  }

  // Render about tab
  const aboutTab = document.getElementById("aboutTab")
  if (aboutTab) {
    aboutTab.innerHTML = `
            <div class="venue-section">
                <h2>Açıklama</h2>
                <p>${venue.description}</p>
            </div>
            
            <div class="venue-section">
                <h2>İletişim Bilgileri</h2>
                <div class="venue-contact">
                    <div class="venue-contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${venue.address}</span>
                    </div>
                    <div class="venue-contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${venue.phone}</span>
                    </div>
                    <div class="venue-contact-item">
                        <i class="fas fa-globe"></i>
                        <a href="${venue.website}" target="_blank">${venue.website}</a>
                    </div>
                </div>
            </div>
            
            <div class="venue-section">
                <h2>Çalışma Saatleri</h2>
                <div class="venue-hours">
                    ${venue.hours
                      .map(
                        (item) => `
                        <div class="venue-hours-item">
                            <i class="fas fa-clock"></i>
                            <span>${item.day}: ${item.hours}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="venue-section">
                <h2>Özellikler</h2>
                <div class="venue-features">
                    ${venue.features
                      .map(
                        (feature) => `
                        <span class="venue-badge">${feature}</span>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="venue-section">
                <h2>Yaklaşan Etkinlikler</h2>
                <div class="venue-events">
                    ${
                      events.length > 0
                        ? events
                            .map(
                              (event) => `
                        <div class="venue-event-item">
                            <div class="venue-event-image">
                                <img src="${event.image}" alt="${event.title}">
                            </div>
                            <div class="venue-event-content">
                                <h3>${event.title}</h3>
                                <div class="venue-event-date">
                                    <i class="fas fa-calendar"></i>
                                    <span>${event.date}, ${event.time}</span>
                                </div>
                                <a href="event-detail.html?id=${event.id}" class="venue-event-link">
                                    Detayları Gör
                                    <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    `,
                            )
                            .join("")
                        : "<p>Yaklaşan etkinlik bulunmuyor.</p>"
                    }
                    
                    ${
                      events.length > 0
                        ? `
                        <a href="events.html?venue=${venue.id}" class="btn btn-outline btn-block">
                            Tüm Etkinlikleri Gör
                        </a>
                    `
                        : ""
                    }
                </div>
            </div>
        `
  }

  // Render menu tab
  const menuTab = document.getElementById("menuTab")
  if (menuTab) {
    // Create menu tabs
    const menuTabsHtml = `
            <div class="menu-tabs">
                <div class="tabs-nav">
                    ${menuCategories
                      .map(
                        (category, index) => `
                        <button class="tab-btn ${index === 0 ? "active" : ""}" data-tab="menu-${category.id}">
                            ${category.name}
                        </button>
                    `,
                      )
                      .join("")}
                </div>
                
                ${menuCategories
                  .map(
                    (category, index) => `
                    <div class="tab-content ${index === 0 ? "active" : ""}" id="menu-${category.id}Tab">
                        ${menuItems[category.id]
                          .map(
                            (item) => `
                            <div class="menu-item">
                                <div class="menu-item-image">
                                    <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="menu-item-content">
                                    <div class="menu-item-header">
                                        <span class="menu-item-title">${item.name}</span>
                                        <span class="menu-item-price">${item.price}</span>
                                    </div>
                                    <p class="menu-item-description">${item.description}</p>
                                    ${
                                      item.tags.length > 0
                                        ? `
                                        <div class="menu-item-tags">
                                            ${item.tags
                                              .map(
                                                (tag) => `
                                                <span class="menu-item-tag">${tag}</span>
                                            `,
                                              )
                                              .join("")}
                                        </div>
                                    `
                                        : ""
                                    }
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    menuTab.innerHTML = menuTabsHtml

    // Add menu tab functionality
    const menuTabBtns = menuTab.querySelectorAll(".tab-btn")
    menuTabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tabName = this.getAttribute("data-tab")
        const tabContent = document.getElementById(tabName + "Tab")

        // Remove active class from all buttons and contents
        menuTabBtns.forEach((btn) => btn.classList.remove("active"))
        menuTab.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

        // Add active class to clicked button and corresponding content
        this.classList.add("active")
        tabContent.classList.add("active")
      })
    })
  }

  // Render reviews tab
  const reviewsTab = document.getElementById("reviewsTab")
  if (reviewsTab) {
    reviewsTab.innerHTML = `
            <div class="review-form">
                <h2>Değerlendirme Yap</h2>
                <div class="rating-stars" id="ratingStars">
                    <i class="far fa-star" data-rating="1"></i>
                    <i class="far fa-star" data-rating="2"></i>
                    <i class="far fa-star" data-rating="3"></i>
                    <i class="far fa-star" data-rating="4"></i>
                    <i class="far fa-star" data-rating="5"></i>
                </div>
                <textarea id="reviewComment" placeholder="Bu mekan hakkında ne düşünüyorsunuz?"></textarea>
                <button id="submitReview" class="btn btn-primary">Değerlendirme Gönder</button>
            </div>
            
            <div class="review-list">
                <h2>Değerlendirmeler</h2>
                ${
                  reviews.length > 0
                    ? reviews
                        .map(
                          (review) => `
                    <div class="review-item">
                        <div class="review-header">
                            <span class="review-author">${review.user}</span>
                            <span class="review-date">${review.date}</span>
                        </div>
                        <div class="review-rating">
                            ${Array(5)
                              .fill()
                              .map(
                                (_, i) => `
                                <i class="${i < review.rating ? "fas" : "far"} fa-star"></i>
                            `,
                              )
                              .join("")}
                        </div>
                        <p class="review-content">${review.comment}</p>
                        <div class="review-actions">
                            <button class="review-action like-btn" data-id="${review.id}">
                                <i class="far fa-thumbs-up"></i>
                                <span>${review.likes}</span>
                            </button>
                            <button class="review-action report-btn" data-id="${review.id}">
                                <i class="far fa-flag"></i>
                                <span>Bildir</span>
                            </button>
                        </div>
                    </div>
                `,
                        )
                        .join("")
                    : "<p>Henüz değerlendirme yok.</p>"
                }
            </div>
        `

    // Add rating functionality
    const ratingStars = document.getElementById("ratingStars")
    let selectedRating = 0

    if (ratingStars) {
      const stars = ratingStars.querySelectorAll("i")

      stars.forEach((star) => {
        // Hover effect
        star.addEventListener("mouseenter", function () {
          const rating = Number.parseInt(this.getAttribute("data-rating"))

          stars.forEach((s, index) => {
            if (index < rating) {
              s.classList.remove("far")
              s.classList.add("fas")
            } else {
              s.classList.remove("fas")
              s.classList.add("far")
            }
          })
        })

        // Click to select rating
        star.addEventListener("click", function () {
          selectedRating = Number.parseInt(this.getAttribute("data-rating"))

          stars.forEach((s, index) => {
            if (index < selectedRating) {
              s.classList.remove("far")
              s.classList.add("fas")
            } else {
              s.classList.remove("fas")
              s.classList.add("far")
            }
          })
        })
      })

      // Reset on mouse leave if no rating selected
      ratingStars.addEventListener("mouseleave", () => {
        stars.forEach((s, index) => {
          if (index < selectedRating) {
            s.classList.remove("far")
            s.classList.add("fas")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
          }
        })
      })
    }

    // Add submit review functionality
    const submitReview = document.getElementById("submitReview")
    const reviewComment = document.getElementById("reviewComment")

    if (submitReview && reviewComment) {
      submitReview.addEventListener("click", () => {
        if (selectedRating === 0) {
          window.showToast("Puan gerekli", "Lütfen bir puan verin.", "error")
          return
        }

        if (!reviewComment.value.trim()) {
          window.showToast("Yorum gerekli", "Lütfen bir yorum yazın.", "error")
          return
        }

        // In a real app, you would submit the review to your API
        window.showToast("Değerlendirme gönderildi", "Değerlendirmeniz için teşekkür ederiz!", "success")

        // Reset form
        selectedRating = 0
        reviewComment.value = ""

        const stars = ratingStars.querySelectorAll("i")
        stars.forEach((s) => {
          s.classList.remove("fas")
          s.classList.add("far")
        })
      })
    }

    // Add like functionality
    const likeBtns = reviewsTab.querySelectorAll(".like-btn")
    likeBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const icon = this.querySelector("i")
        const count = this.querySelector("span")

        if (icon.classList.contains("far")) {
          icon.classList.remove("far")
          icon.classList.add("fas")
          count.textContent = Number.parseInt(count.textContent) + 1
        } else {
          icon.classList.remove("fas")
          icon.classList.add("far")
          count.textContent = Number.parseInt(count.textContent) - 1
        }
      })
    })

    // Add report functionality
    const reportBtns = reviewsTab.querySelectorAll(".report-btn")
    reportBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const reviewId = this.getAttribute("data-id")
        window.showToast("Değerlendirme bildirildi", "Bu değerlendirmeyi bildirdiğiniz için teşekkür ederiz.", "info")
      })
    })
  }

  // Render venue address
  const venueAddress = document.getElementById("venueAddress")
  if (venueAddress) {
    venueAddress.textContent = venue.address
  }

  // Render similar venues
  const similarVenuesContainer = document.getElementById("similarVenues")
  if (similarVenuesContainer) {
    similarVenuesContainer.innerHTML = similarVenues
      .map(
        (venue) => `
            <div class="similar-item">
                <div class="similar-item-image">
                    <img src="${venue.image}" alt="${venue.name}">
                </div>
                <div class="similar-item-content">
                    <h3>${venue.name}</h3>
                    <div class="similar-item-info">
                        <i class="fas fa-star"></i>
                        <span>${venue.rating} • ${venue.type}</span>
                    </div>
                    <a href="venue-detail.html?id=${venue.id}" class="similar-item-link">
                        Detayları Gör
                    </a>
                </div>
            </div>
        `,
      )
      .join("")
  }
})
