const menuContainer = document.getElementById('menu-container');
const languageSelect = document.getElementById('language-select');
const priceSortSelect = document.getElementById('price-sort-select');
const foodTypeSelect = document.getElementById('food-type-select');
const allergySelect = document.getElementById('allergy-select');

let menuData = [];
let selectedLanguage = 'en'; // Default to English

// Fetch menu data based on language
async function fetchMenuData() {
    const response = await fetch('data.json');
    const menuJson = await response.json();
    menuData = selectedLanguage === 'en' ? menuJson : menuJson.map(item => ({
        ...item,
        name: item.namn,
        price: item.pris,
        description: item.beskrivning,
        type: item.typ,
    }));
    applyFiltersAndSorting();
}
// Function to apply filters and sorting to the menu
function applyFiltersAndSorting() {
    const selectedType = foodTypeSelect.value;
    const selectedAllergy = allergySelect.value;
    const selectedPrice = priceSortSelect.value;
    
    // Filter by type
    let filteredMenu = menuData;
    if (selectedType !== 'all') {
        filteredMenu = filteredMenu.filter(item => item.type === selectedType);
    }
    
    // Filter by allergies
    if (selectedAllergy !== 'none') {
        const allergies = {
            lactose: selectedAllergy === 'lactose',
            gluten: selectedAllergy === 'gluten',
        };
        
        filteredMenu = filteredMenu.filter(item => {
            const itemAllergies = item.foodAllergies;
            for (const allergen in allergies) {
                if (allergies[allergen] && itemAllergies[allergen]) {
                    return false;
                }
            }
            return true;
        });
    }
    // Sort by price
    if (selectedPrice === 'asc') {
        filteredMenu.sort((a, b) => a.price - b.price);
    } else if (selectedPrice === 'desc') {
        filteredMenu.sort((a, b) => b.price - a.price);
    }
    // Sort and render
    sortAndRenderMenu(filteredMenu);
}

// Function to sort and render the menu
function sortAndRenderMenu(menuItems) {
    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <img src=${item.img} alt="${item[selectedLanguage === 'en' ? 'name' : 'namn']}"/>
            <h2>${item[selectedLanguage === 'en' ? 'name' : 'namn']}</h2>
            <p>${item[selectedLanguage === 'en' ? 'description' : 'beskrivning']}</p>
            <p id="priceElement">Price: ${item[selectedLanguage === 'en' ? 'price' : 'pris']}${selectedLanguage === 'en' ? 'kr' : 'Kr'}</p>
            <p>Type: ${item[selectedLanguage === 'en' ? 'type' : 'typ']}</p>
        `;
        menuContainer.appendChild(card);
    });
}

// Event listener for language selection
languageSelect.addEventListener('change', function () {
    selectedLanguage = languageSelect.value;
    applyFiltersAndSorting();
    updatePageContent(selectedLanguage);
});

// Event listeners for filtering and sorting
foodTypeSelect.addEventListener('change', applyFiltersAndSorting);
allergySelect.addEventListener('change', applyFiltersAndSorting);
priceSortSelect.addEventListener('change', applyFiltersAndSorting);

// Initial rendering of the menu
fetchMenuData();

// Function to update page content based on the selected language
function updatePageContent(language) {
    const translations = {
        'language-label': {
            en: 'Language',
            sv: 'Språk'
        },
        'food-type-label': {
            en: 'Food Type',
            sv: 'Typ av mat'
        },
        'all-option': {
            en: 'All',
            sv: 'Alla'
        },
        'beef-option': {
            en: 'Beef',
            sv: 'Nötkött'
        },
        'fish-option': {
            en: 'Fish',
            sv: 'Fisk'
        },
        'chicken-option': {
            en: 'Chicken',
            sv: 'Kyckling'
        },
        'vegetarian-option': {
            en: 'Vegetarian',
            sv: 'Vegetarisk'
        },
        'asc': {
            en: 'Price: Low to High',
            sv: 'Pris: Lågt till Högt',
        },
        'desc': {
            en: 'Price: High to Low',
            sv: 'Pris: Högt till Lågt'
        },
        'price-sort-label':{
            en:'Price Sorting',
            sv:'Prissortering'
        },
        'allergy-label':{
            en:'Filter by Allergies',
            sv:'Filtrera efter allergier'
        }
    };

    // Update text content for elements with translations
    for (const elementId in translations) {
        const element = document.getElementById(elementId);
        if (element && translations[elementId][language]) {
            element.textContent = translations[elementId][language];
        }
    }
}