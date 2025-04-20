// JavaScript for the venues page

document.addEventListener("DOMContentLoaded", () => {
  // Mock data for venues
  const venues = [
    {
      id: 1,
      name: "Cafe Istanbul",
      type: "Kafe",
      rating: 4.7,
      image: "img/placeholder.jpg",
      location: "Kadıköy, İstanbul",
      description: "Modern bir ortamda kaliteli kahve ve atıştırmalıklar sunan şık bir kafe.",
    },
    {
      id: 2,
      name: "Anadolu Restaurant",
      type: "Restoran",
      rating: 4.5,
      image: "img/placeholder.jpg",
      location: "Beşiktaş, İstanbul",
      description: "Geleneksel Türk mutfağından lezzetler sunan otantik bir restoran.",
    },
    {
      id: 3,
      name: "Bosphorus Bistro",
      type: "Bistro",
      rating: 4.8,
      image: "img/placeholder.jpg",
      location: "Üsküdar, İstanbul",
      description: "Boğaz manzaralı, modern Avrupa mutfağı sunan şık bir bistro.",
    },
    {
      id: 4,
      name: "Marmara Cafe",
      type: "Kafe",
      rating: 4.3,
      image: "img/placeholder.jpg",
      location: "Beyoğlu, İstanbul",
      description: "Tarihi bir binada hizmet veren, ev yapımı tatlılarıyla ünlü kafe.",
    },
    {
      id: 5,
      name: "Ege Restaurant",
      type: "Restoran",
      rating: 4.6,
      image: "img/placeholder.jpg",
      location: "Şişli, İstanbul",
      description: "Ege mutfağının en iyi örneklerini sunan, zeytinyağlı yemekleriyle ünlü restoran.",
    },
    {
      id: 6,
      name: "Karadeniz Pide Salonu",
      type: "Restoran",
      rating: 4.4,
      image: "img/placeholder.jpg",
      location: "Fatih, İstanbul",
      description: "Karadeniz mutfağından pideler ve hamur işleri sunan geleneksel bir mekan.",
    },
  ]

  // Get DOM elements
  const venuesList = document.getElementById("venuesList")
  const venueSearch = document.getElementById("venueSearch")
  const venueTypeFilter = document.getElementById("venueTypeFilter")
  const venueSortBy = document.getElementById("venueSortBy")
  const noResults = document.getElementById("noResults")
  const clearFilters = document.getElementById("clearFilters")

  // Track favorites
  let favorites = []

  // Function to render venues
  function renderVenues(venuesList, venuesToRender) {
    // Clear current venues
    venuesList.innerHTML = ""

    if (venuesToRender.length === 0) {
      noResults.style.display = "block"
      return
    }

    noResults.style.display = "none"

    // Render each venue
    venuesToRender.forEach((venue) => {
      const venueCard = document.createElement("div")
      venueCard.className = "venue-card"

      const isFavorite = favorites.includes(venue.id)

      venueCard.innerHTML = `
                <div class="venue-image">
                    <img src="${venue.image}" alt="${venue.name}">
                    <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${venue.id}">
                        <i class="${isFavorite ? "fas" : "far"} fa-heart"></i>
                    </button>
                </div>
                <div class="venue-content">
                    <div class="venue-title">
                        <h3>${venue.name}</h3>
                        <span class="venue-badge">${venue.type}</span>
                    </div>
                    <div class="venue-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${venue.location}</span>
                    </div>
                    <div class="venue-rating">
                        <i class="fas fa-star"></i>
                        <span>${venue.rating}</span>
                    </div>
                    <p class="venue-description">${venue.description}</p>
                    <a href="venue-detail.html?id=${venue.id}" class="btn btn-primary btn-block">Detayları Gör</a>
                </div>
            `

      venuesList.appendChild(venueCard)
    })

    // Add favorite functionality
    const favoriteBtns = venuesList.querySelectorAll(".favorite-btn")
    favoriteBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        const venueId = Number.parseInt(this.getAttribute("data-id"))
        const icon = this.querySelector("i")

        // Toggle favorite status
        if (icon.classList.contains("far")) {
          icon.classList.remove("far")
          icon.classList.add("fas")
          this.classList.add("active")
          favorites.push(venueId)
          window.showToast("Favorilere Eklendi", "Mekan favorilerinize eklendi.", "success")
        } else {
          icon.classList.remove("fas")
          icon.classList.add("far")
          this.classList.remove("active")
          favorites = favorites.filter((id) => id !== venueId)
          window.showToast("Favorilerden Çıkarıldı", "Mekan favorilerinizden çıkarıldı.", "info")
        }
      })
    })
  }

  // Function to filter and sort venues
  function filterAndSortVenues() {
    const searchTerm = venueSearch.value.toLowerCase()
    const venueType = venueTypeFilter.value.toLowerCase()
    const sortBy = venueSortBy.value

    // Filter venues
    const filteredVenues = venues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(searchTerm) || venue.location.toLowerCase().includes(searchTerm)

      const matchesType = venueType === "all" || venue.type.toLowerCase() === venueType

      return matchesSearch && matchesType
    })

    // Sort venues
    filteredVenues.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "rating-desc":
          return b.rating - a.rating
        case "rating-asc":
          return a.rating - b.rating
        default:
          return 0
      }
    })

    // Render filtered and sorted venues
    renderVenues(venuesList, filteredVenues)
  }

  // Initial render
  if (venuesList) {
    renderVenues(venuesList, venues)

    // Add event listeners for filtering and sorting
    if (venueSearch) {
      venueSearch.addEventListener("input", filterAndSortVenues)
    }

    if (venueTypeFilter) {
      venueTypeFilter.addEventListener("change", filterAndSortVenues)
    }

    if (venueSortBy) {
      venueSortBy.addEventListener("change", filterAndSortVenues)
    }

    if (clearFilters) {
      clearFilters.addEventListener("click", () => {
        venueSearch.value = ""
        venueTypeFilter.value = "all"
        venueSortBy.value = "name-asc"
        filterAndSortVenues()
      })
    }
  }
})
