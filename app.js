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
            <span class="px-6 py-2 rounded-full font-medium bg-blue-500 text-white">Morning</span>
            <span class="px-6 py-2 rounded-full font-medium text-gray-500">Lunch</span>
            <span class="px-6 py-2 rounded-full font-medium text-gray-500">Dinner</span>
        </div>

        <!-- Meal Cards Container -->
        <div class="space-y-4 mb-6">
            <!-- Morning Meal 1 -->
            <div class="bg-white p-4 rounded-2xl shadow-sm">
                <div class="flex gap-4">
                    <div class="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                        🥑
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800">Avocado Toast</h3>
                        <p class="text-gray-500 text-sm">Cafe Sunrise</p>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-blue-500 text-sm font-medium">⭐ 4.8</span>
                            <span class="text-gray-400 text-sm">•</span>
                            <span class="text-gray-500 text-sm">0.8 km</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Morning Meal 2 -->
            <div class="bg-white p-4 rounded-2xl shadow-sm">
                <div class="flex gap-4">
                    <div class="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                        🍶
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800">Greek Yogurt Bowl</h3>
                        <p class="text-gray-500 text-sm">Health Hub</p>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-blue-500 text-sm font-medium">⭐ 4.5</span>
                            <span class="text-gray-400 text-sm">•</span>
                            <span class="text-gray-500 text-sm">1.2 km</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Morning Meal 3 -->
            <div class="bg-white p-4 rounded-2xl shadow-sm">
                <div class="flex gap-4">
                    <div class="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                        🥞
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800">Pancake Stack</h3>
                        <p class="text-gray-500 text-sm">Morning Delight</p>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-blue-500 text-sm font-medium">⭐ 4.7</span>
                            <span class="text-gray-400 text-sm">•</span>
                            <span class="text-gray-500 text-sm">0.5 km</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Map Section -->
        <div class="bg-red-500 h-64 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold">
            MAP AREA
        </div>
    </div>
</body>
</html>
`
