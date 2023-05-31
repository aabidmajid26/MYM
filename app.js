const imageContainer = document.getElementById('image-container');
const API_KEY = "fjBWTdYh5E38CxFPr8zyo69niO8h5jwjnrgBfPiH"

// Fetch NASA API
fetch('https://api.nasa.gov/planetary/apod?api_key=fjBWTdYh5E38CxFPr8zyo69niO8h5jwjnrgBfPiH')
  .then(response => response.json())
  .then(data => {
    // Update the image container with the fetched image
    const image = document.createElement('img');
    image.src = data.url;
    imageContainer.appendChild(image);
  })
  .catch(error => {
    console.error('Error fetching data from NASA API:', error);
  });
