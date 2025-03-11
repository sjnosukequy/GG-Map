const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
const { SearchMap } = require('./main.js');

app.get("/", (req, res) => res.type('html').send(html));

app.get("/searchMap", async (req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng;
  const querry = req.query.querry;
  const response_obj = {
    'status': 200,
    'errorMessage': '',
    'data': null
  }
  try {
    if (!lat)
      throw new Error('lat is required')
    if (!lng)
      throw new Error('lng is required')
    if (!querry)
      throw new Error('querry is required')

    const data = await SearchMap(lat, lng, querry)
    response_obj['data'] = data
  } catch (e) {
    response_obj['status'] = 500;
    response_obj['errorMessage'] = e.message;
  } finally {
    res.send(response_obj)
  }
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Food Recommendations</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="max-w-md mx-auto min-h-screen p-4">
        <!-- Header -->
        <header class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Food Finder</h1>
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">👤</div>
        </header>

        <!-- Time Navigation -->
        <div class="flex justify-around mb-6 bg-white rounded-full p-2 shadow-sm">
            <button class="time-btn px-6 py-2 rounded-full font-medium bg-blue-500 text-white">Morning</button>
            <button class="time-btn px-6 py-2 rounded-full font-medium text-gray-500">Lunch</button>
            <button class="time-btn px-6 py-2 rounded-full font-medium text-gray-500">Dinner</button>
        </div>

        <!-- Meal Cards Container -->
        <div class="space-y-4 mb-6" id="meals-container">
            <!-- Meal cards will be dynamically inserted here -->
        </div>

        <!-- Map Section -->
        <div class="bg-red-500 h-64 rounded-2xl shadow-lg">
            <!-- Map placeholder -->
            <div class="w-full h-full flex items-center justify-center text-white font-bold">
                MAP AREA
            </div>
        </div>
    </div>

    <script>
        // Mock API Data
        const mockApi = {
            morning: [
                { name: "Avocado Toast", place: "Cafe Sunrise", rating: 4.8, distance: 0.8, image: "🥑" },
                { name: "Greek Yogurt Bowl", place: "Health Hub", rating: 4.5, distance: 1.2, image: "🍶" },
                { name: "Pancake Stack", place: "Morning Delight", rating: 4.7, distance: 0.5, image: "🥞" }
            ],
            lunch: [
                { name: "Grilled Chicken", place: "Protein Palace", rating: 4.6, distance: 0.9, image: "🍗" },
                { name: "Sushi Combo", place: "Tokyo Kitchen", rating: 4.9, distance: 1.5, image: "🍣" },
                { name: "Burger Meal", place: "American Diner", rating: 4.4, distance: 0.7, image: "🍔" }
            ],
            dinner: [
                { name: "Steak Dinner", place: "Prime Cut", rating: 4.7, distance: 1.1, image: "🥩" },
                { name: "Pasta Carbonara", place: "Italian Corner", rating: 4.8, distance: 0.6, image: "🍝" },
                { name: "Sushi Platter", place: "Sakura House", rating: 4.9, distance: 1.3, image: "🍱" }
            ]
        };

        // Function to render meals
        function renderMeals(time) {
            const container = document.getElementById('meals-container');
            container.innerHTML = mockApi[time].map(meal => \`
  < div class="bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow" >
    <div class="flex gap-4">
      <div class="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
        ${meal.image}
      </div>
      <div class="flex-1">
        <h3 class="font-bold text-gray-800">${meal.name}</h3>
        <p class="text-gray-500 text-sm">${meal.place}</p>
        <div class="flex items-center gap-2 mt-2">
          <span class="text-blue-500 text-sm font-medium">⭐ ${meal.rating}</span>
          <span class="text-gray-400 text-sm">•</span>
          <span class="text-gray-500 text-sm">${meal.distance} km</span>
        </div>
      </div>
    </div>
                </ >
  \`).join('');
        }

        // Tab switching functionality
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-btn').forEach(b => {
                    b.classList.remove('bg-blue-500', 'text-white');
                    b.classList.add('text-gray-500');
                });
                btn.classList.add('bg-blue-500', 'text-white');
                btn.classList.remove('text-gray-500');
                const time = btn.textContent.toLowerCase();
                renderMeals(time);
            });
        });

        // Initial load
        window.onload = () => renderMeals('morning');
    </script>
</body>
</html>
`
