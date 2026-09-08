document.getElementById('searchBtn').addEventListener('click', searchDestination);
document.getElementById('clearBtn').addEventListener('click', clearResults);

function searchDestination() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    if (!input) return;

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            let keyword = input;
            if (keyword.includes('beach')) {
                keyword = 'beaches';
            } else if (keyword.includes('temple')) {
                keyword = 'temples';
            } else if (keyword.includes('country') || keyword.includes('countries')) {
                keyword = 'countries';
            }

            if (data[keyword]) {
                if (keyword === 'countries') {
                    data.countries.forEach(country => {
                        country.cities.forEach(city => displayCard(city, resultContainer));
                    });
                } else {
                    data[keyword].forEach(item => displayCard(item, resultContainer));
                }
            } else {
                // Check if user entered a specific country name (e.g., "japan" or "australia")
                const foundCountry = data.countries.find(c => c.name.toLowerCase() === input);
                if (foundCountry) {
                    foundCountry.cities.forEach(city => displayCard(city, resultContainer));
                } else {
                    resultContainer.innerHTML = '<p class="no-result">No results found. Try searching for "beach", "temple", or a country like "Australia" or "Japan".</p>';
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayCard(item, container) {
    const card = document.createElement('div');
    card.classList.add('result-card');
    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="card-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button class="visit-btn">Visit</button>
        </div>
    `;
    container.appendChild(card);
}

function clearResults() {
    document.getElementById('searchInput').value = '';
    document.getElementById('result').innerHTML = '';
}
