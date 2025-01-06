const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

// backend related code 
// Assuming you have a click event for country selection like 'pakistan', 'uk', etc.
const countryLinks = document.querySelectorAll('.countries a');

countryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const country = e.target.id; // Get the country name (e.g., 'pakistan')

        // Now fetch news based on the selected country
        fetchNewsByCountry(country);
    });
});
const fetchNewsByCountry = async (country) => {
  try {
      const response = await fetch(`http://localhost:3000/api/news/${country}`); // Point to backend
      if (response.ok) {
          const data = await response.json();
          displayNews(data);
      } else {
          console.error('Error fetching data:', response.statusText);
      }
  } catch (error) {
      console.error('Error fetching news:', error);
  }
};

const displayNews = (data) => {
    const newsGrid = document.querySelector('.news-grid');
    newsGrid.innerHTML = ''; // Clear any previous news

    if (data && data.articles) {
        data.articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            newsItem.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <p><strong>Category:</strong> ${article.category}</p>
                <p><strong>Author:</strong> ${article.author}</p>
                <p><strong>Date:</strong> ${article.dateNews}</p>
                <img src="${article.image}" alt="Image" />
            `;

            newsGrid.appendChild(newsItem);
        });
    } else {
        newsGrid.innerHTML = '<p>No news available for this country.</p>';
    }
};
document.addEventListener('DOMContentLoaded', () => {
  const countryLinks = document.querySelectorAll('.countries a'); // Adjust selector to your HTML structure

  countryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default link behavior
          const country = e.target.id; // Assuming the ID of the link corresponds to the country name
          fetchNewsByCountry(country);
      });
  });
});























// fronted code

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
            dots[i].classList.add('active');
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const notebookIcon = document.querySelector('.notebook-icon');
  const popup = document.getElementById('popup');
  const saveButton = document.getElementById('saveNote');
  const noteInput = document.getElementById('noteInput');

  // Toggle popup on icon click
  notebookIcon.addEventListener('click', () => {
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
  });

  // Hide popup when clicking outside of it
  document.addEventListener('click', (event) => {
      if (!popup.contains(event.target) && !notebookIcon.contains(event.target)) {
          popup.style.display = 'none';
      }
  });

  // Save note to local storage
  saveButton.addEventListener('click', () => {
      const note = noteInput.value.trim();
      if (note) {
          localStorage.setItem('savedNote', note);
          alert('Note saved!');
          noteInput.value = ''; // Clear the textarea
      } else {
          alert('Please write something before saving!');
      }
  });

  // Load saved note (optional, if needed on page load)
  const savedNote = localStorage.getItem('savedNote');
  if (savedNote) {
      noteInput.value = savedNote;
  }
});


// Start slider
showSlide(currentIndex);
setInterval(nextSlide, 5000);



// Dark/Light Mode Toggle
const modeToggle = document.getElementById('modeToggle');
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#333' : '#fff';
  document.body.style.color = document.body.classList.contains('dark-mode') ? '#fff' : '#000';
});



// Fetch News API and Render News Items
const apiKey = '3288ea93c8bb4f14be6ff0647defe1be';
const newsGrid = document.querySelector('.news-grid');

fetch(`https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=us`)
  .then(response => response.json())
  .then(data => {
    if (data.articles) {
      data.articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        newsItem.innerHTML = `
          <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News Thumbnail">
          <div class="news-content">
            <div class="news-title">${article.title || 'No Title'}</div>
            <div class="news-meta">${article.source.name || 'Unknown'} - ${article.publishedAt || 'Unknown'}</div>
            <a class="read-more" href="${article.url}" target="_blank">Read More</a>
          </div>
        `;

        newsGrid.appendChild(newsItem);
      });
    }
  })
  .catch(error => console.error('Error fetching news:', error));
