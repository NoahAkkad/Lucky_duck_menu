const menuContainer = document.getElementById('menu-container');
const languageSelect = document.getElementById('language-select');
const foodTypeSelect = document.getElementById('food-type-select');
const priceSortSelect = document.getElementById('price-sort-select');
const allergySelect = document.getElementById('allergy-select');

//import file from json 
async function getTextEn(enMenu) {
    const myObjectEn = await fetch(enMenu);
    const menu = await myObjectEn.json();
    populateEnglishMenu(menu); 
}
async function getTextSv(svMeny) {
    const myObjectSv = await fetch(svMeny);
    const meny = await myObjectSv.json();
    populateSwedishMenu(meny);
}
getTextEn('enMenu.json') // Use English menu by default

// Event listener for language selection
languageSelect.addEventListener('change', function () {
    const selectedLanguage = languageSelect.value;
    updatePageContent(selectedLanguage);
    if (selectedLanguage === 'en') {   
        getTextEn('enMenu.json'); // Use English menu data
    } else if (selectedLanguage === 'sv') {
        getTextSv('svMeny.json'); // Use Swedish menu data
    }
});

// Function to populate the menu cards English
function populateEnglishMenu(menuItems) {
    menuContainer.innerHTML = ''; 
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <img src=${item.img} alt="${item.name}"/>
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <p id="priceElement">Price: ${item.price}kr</p>
            <p>Type: ${item.type}</p>
        `;
        menuContainer.appendChild(card);
    });
}
// Function to populate the menu cards Swedish
function populateSwedishMenu(menuItems) {
    menuContainer.innerHTML = ''; 
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.innerHTML = `
            <img src=${item.img} alt="${item.name}"/>
            <h2>${item.namn}</h2>
            <p>${item.beskrivning}</p>
            <p id="priceElement">Price: ${item.pris}Kr</p>
            <p>Type: ${item.typ}</p>
        `;
        menuContainer.appendChild(card);
    });
}

// Function to sort menu items by price
function sortMenuByPrice( order) {
    const sortedMenu = [...meny];
    sortedMenu.sort((a, b) => {
        if (order === 'asc') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
    populateEnglishMenu(sortedMenu);
}



// Event listener for price sorting
priceSortSelect.addEventListener('change', function () {
    const selectedOrder = priceSortSelect.value;
    sortMenuByPrice(selectedOrder);
    
});

// Function to filter menu items by food type
function filterMenuByType(type) {
    if (type === 'all') {
        populateEnglishMenu(menu);
    } else {
        const filteredMenu = menu.filter(item => item.type === type);
        populateEnglishMenu(filteredMenu);
    }
}

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


// Event listener for food type selection
foodTypeSelect.addEventListener('change', function () {
    const selectedType = foodTypeSelect.value;
    filterMenuByType(selectedType);
});


// Initial population of the menu
populateEnglishMenu(menu);

// Function to filter menu items by food allergies
function filterMenuByAllergies(allergies) {
    const filteredMenu = menu.filter(item => {
        // Check each item for allergies
        const itemAllergies = item.foodAllergies;
        for (const allergen in allergies) {
            if (allergies[allergen] && itemAllergies[allergen]) {
                return false; 
            }
        }
        return true; 
    });

    populateEnglishMenu(filteredMenu);
}

// Event listener for allergy selection

allergySelect.addEventListener('change', function () {
    const selectedAllergy = allergySelect.value;
    
    if (selectedAllergy === 'none') {
        populateEnglishMenu(menu); // Show all menu items if "None" selected
    } else {
        // Create an object to represent selected allergies
        const allergies = {
            nuts: selectedAllergy === 'nuts',
            dairy: selectedAllergy === 'dairy',
            gluten: selectedAllergy === 'gluten',
        };
        filterMenuByAllergies(allergies);
    }
});




