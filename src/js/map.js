document.addEventListener("DOMContentLoaded", () => {
  // 1) Center coords for your business:
  const businessLatLng = [40.69847, -73.95144];

  // 2) Create the map
  const map = L.map("map").setView(businessLatLng, 15);
  //   15 is a good zoom for a single building/neighborhood

  // 3) Use OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // 4) Add your marker
  L.marker(businessLatLng)
    .addTo(map)
    .bindPopup(
      "<b>Dentique Clinic</b><br>203 Rain St. Mountain View, New york, USA"
    )
    .openPopup();
});
