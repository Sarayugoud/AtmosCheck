const form = document.getElementById('locationForm');
const loading = document.getElementById('loading');
const container = document.getElementById('container');
const gasValues = document.getElementById('gas-values');
const birdContainer = document.getElementById('bird-container');
const suggestionButton = document.getElementById('suggestionButton');
const suggestionsContainer = document.getElementById('suggestions');
const suggestionList = document.getElementById('suggestionList');
const backButton = document.getElementById('backButton');

// Handle form submission to check air quality
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;

  loading.classList.remove('hidden');
  container.classList.add('blur-bg');
  gasValues.innerHTML = ''; // Clear previous gas data

  fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY`)
    .then(response => response.json())
    .then(data => {
      const components = data.list[0].components;
      displayGasValues(components);
      loading.classList.add('hidden');
      container.classList.remove('blur-bg');
      createBirds(10);
    })
    .catch(error => {
      console.error('Error fetching air quality data:', error);
    });
});

// Display gas values
function displayGasValues(components) {
  const gases = [
    { name: "CO", value: components.co },
    { name: "NO", value: components.no },
    { name: "NO₂", value: components.no2 },
    { name: "O₃", value: components.o3 },
    { name: "SO₂", value: components.so2 },
    { name: "PM₂.₅", value: components.pm2_5 },
    { name: "PM₁₀", value: components.pm10 },
    { name: "NH₃", value: components.nh3 }
  ];

  gases.forEach((gas, index) => {
    const gasItem = document.createElement('div');
    gasItem.classList.add('gas-item');
    gasItem.classList.add(index % 2 === 0 ? 'left' : 'right');
    gasItem.innerHTML = `${gas.name}: ${gas.value} µg/m³`;
    gasValues.appendChild(gasItem);
  });
}

// Create birds flying effect
function createBirds(count) {
  for (let i = 0; i < count; i++) {
    const bird = document.createElement('img');
    bird.src = "https://img1.picmix.com/output/stamp/normal/7/1/9/5/515917_c1088.gif";
    bird.className = 'bird';
    const angle = Math.random() * 360;
    const distance = Math.random() * 300 + 100;

    bird.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    bird.style.setProperty('--move-x', `${Math.cos(angle) * distance}px`);
    bird.style.setProperty('--move-y', `${Math.sin(angle) * distance}px`);

    birdContainer.appendChild(bird);

    setTimeout(() => {
      bird.remove();
    }, 4000);
  }
}

// Suggested places with latitudes and longitudes
const places = [
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "London", lat: 51.5074, lon: -0.1278 }
];

// Show suggestions when clicked
suggestionButton.addEventListener('click', function() {
  suggestionsContainer.classList.remove('hidden');
  container.classList.add('blur-bg');
  
  suggestionList.innerHTML = ''; // Clear suggestion list
  places.forEach(place => {
    const listItem = document.createElement('li');
    listItem.textContent = `${place.name} (Lat: ${place.lat}, Lon: ${place.lon})`;
    listItem.onclick = function() {
      document.getElementById('latitude').value = place.lat;
      document.getElementById('longitude').value = place.lon;
      suggestionsContainer.classList.add('hidden');
      container.classList.remove('blur-bg');
    };
    suggestionList.appendChild(listItem);
  });
});

// Back button to go back to the form
backButton.addEventListener('click', function() {
  suggestionsContainer.classList.add('hidden');
  container.classList.remove('blur-bg');
});

