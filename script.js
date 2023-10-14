const menuContainer = document.getElementById('menu-container');
const languageSelect = document.getElementById('language-select');
const priceSortSelect = document.getElementById('price-sort-select');
const foodTypeSelect = document.getElementById('food-type-select');
const allergySelect = document.getElementById('allergy-select');


let menuData = [];
let selectedLanguage = 'en'; // Default to English


// Fetch menu data based on language
async function fetchMenuData() {
    const response = await fetch('data.json'); // Change to 'data.json'
    const menuJson = await response.json();
    menuData = selectedLanguage === 'en' ? menuJson : menuJson.map(item => ({
        ...item,
        name: item.namn,
        price: item.pris,
        description: item.beskrivning,
        type: item.typ,
    }));
    sortAndRenderMenu();
    
}

// Function to sort and render the menu
function sortAndRenderMenu(order) {
    let sortedMenu = [...menuData];

    sortedMenu.sort((a, b) => {
        if (order === 'desc') {
            return b.price - a.price; // Sort in ascending order
        } else {
            return a.price - b.price; // Sort in descending order
        }
        
    });
    const selectedType = foodTypeSelect.value;
    if (selectedType !== 'all') {
        sortedMenu = sortedMenu.filter(item => item.type === selectedType);
    }

    return renderMenu(sortedMenu);
}

// Function to populate the menu cards
function renderMenu(menuItems) {
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
    fetchMenuData();
    updatePageContent(selectedLanguage);
});

// Event listener for sorting by price
priceSortSelect.addEventListener('change', function () {
    const currentSortOption = priceSortSelect.value;
    sortAndRenderMenu(currentSortOption);
});

// Initial rendering of the menu
fetchMenuData();




// Function to filter menu items by food type
function filterMenuByType(type) {
    let filteredMenu;
    
    if (type === 'all') {
        filteredMenu = menuData;
    } else {
        filteredMenu = menuData.filter(item => item.type === type);
    }  
    // Get the current sorting order
    const currentSortOption = priceSortSelect.value; 
    // Sort the filtered menu based on the sorting order
    sortAndRenderMenu(filteredMenu, currentSortOption);
}



// Event listener for food type selection
foodTypeSelect.addEventListener('change', function () {
    const selectedType = foodTypeSelect.value;
    filterMenuByType(selectedType);
});

function filterMenuByAllergies(allergies) {
    console.log("Filtering menu by allergies:", allergies);
    const filteredMenu = menuData.filter(item => {
        // Check each item for allergies
        const itemAllergies = item.foodAllergies;
        for (const allergen in allergies) {
            if (allergies[allergen] && itemAllergies[allergen]) {
                return false; 
            }
        }
        return true; 
    });

    renderMenu(filteredMenu);
}



// Event listener for allergy selection

allergySelect.addEventListener('change', function () {
    const selectedAllergy = allergySelect.value;

    if (selectedAllergy === 'none') {
        // Show all menu items if "None" is selected
        sortAndRenderMenu();
    } else {
        // Create an object to represent selected allergies
        const allergies = {
            dairy: selectedAllergy === 'dairy',
            gluten: selectedAllergy === 'gluten',
        };
        filterMenuByAllergies(allergies); // Call the filtering function with the selected allergies
    }
});


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












