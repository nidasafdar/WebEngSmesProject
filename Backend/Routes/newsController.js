const axios = require('axios');
const News = require('../Models/News');



const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return next(); // Continue to the next middleware
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  } catch (err) {
    console.error('Error checking admin role:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
const GetNews = async (req, res) => {
  const country = req.params.country;  // This will grab the country from the URL

  const newsSource = [
    "bbc-news", "cnn", "al-jazeera-english", "the-new-york-times", "the-washington-post",
    "reuters", "google-news", "the-guardian", "bbc-sport", "business-insider",
    "dawn", "geo-tv", "ary-news", "the-express-tribune", "ndtv", "times-of-india",
    "india-today", "hindu", "the-times", "the-sun", "guardian-uk", "sky-news",
    "mirror", "metro", "yahoo-news", "yonhap-news", "the-korea-herald", "der-spiegel",
    "die-welt", "frankfurter-allgemeine-zeitung", "le-monde", "le-figaro", "france-24",
    "xinhua-news", "china-daily"
  ];

  try {
    // Request for news from the sources
    const request = newsSource.map(source =>
      axios.get(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${process.env.NEWS_API_KEY}`)
    );

    const response = await Promise.all(request);
    const newsData = response.map(res => res.data.articles);

    // Flatten the array and limit to 100 news articles
    const combinedNews = newsData.flat().slice(0, 100);

    // Filter news by country-specific sources
    const pakistaniSources = ["dawn", "geo-tv", "ary-news", "the-express-tribune"];
    const ukSources = ["bbc-news", "the-guardian", "guardian-uk", "sky-news", "bbc-sport"];
    const koreanSources = ["yonhap-news", "the-korea-herald"];
    const germanSources = ["der-spiegel", "die-welt", "frankfurter-allgemeine-zeitung"];
    const frenchSources = ["le-monde", "le-figaro", "france-24"];
    const chineseSources = ["xinhua-news", "china-daily"];

    const selectedSources = countrySources[country.toLowerCase()] || newsSource;


    const pakistanNews = combinedNews.filter(article =>
      pakistaniSources.includes(article.source.id)
    );

    const ukNews = combinedNews.filter(article =>
      ukSources.includes(article.source.id)
    );

    const koreaNews = combinedNews.filter(article =>
      koreanSources.includes(article.source.id)
    );

    const germanNews = combinedNews.filter(article =>
      germanSources.includes(article.source.id)
    );

    const frenchNews = combinedNews.filter(article =>
      frenchSources.includes(article.source.id)
    );

    const chineseNews = combinedNews.filter(article =>
      chineseSources.includes(article.source.id)
    );

    // Optional mapping for news articles
    const mapNews = (news, country) => ({
      country: country,
      articles: news.map(article => ({
        title: article.title,
        description: article.description,
        dateNews: article.publishedAt,
        category: article.source.name,  // Assuming you want source name as category
        language: article.language || 'en',  // Set to 'en' if not provided
        author: article.author,  // Map the author
        image: article.urlToImage,  // Map the image
        content: article.content,  // Map the content
      }))
    });

    // Map each country's news into a structured object
    const mappedPakistanNews = mapNews(pakistanNews, 'Pakistan');
    const mappedUKNews = mapNews(ukNews, 'UK');
    const mappedKoreaNews = mapNews(koreaNews, 'South Korea');
    const mappedGermanNews = mapNews(germanNews, 'Germany');
    const mappedFrenchNews = mapNews(frenchNews, 'France');
    const mappedChineseNews = mapNews(chineseNews, 'China');

    // Combine all country-specific news
    const allMappedNews = [
      mappedPakistanNews,
      mappedUKNews,
      mappedKoreaNews,
      mappedGermanNews,
      mappedFrenchNews,
      mappedChineseNews
    ];
    const mappedNews = mapNews(combinedNews, country);

    // Send the structured news
    res.status(200).json(allMappedNews);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in Fetching news" });
  }
};

const PostNews = async (req, res) => {
  try {
    console.log('Request Body:');
    req.body.forEach(countryData => {
      console.log(`Country: ${countryData.country}`);
      countryData.articles.forEach((article, index) => {
        console.log(`Article ${index + 1}:`);
        console.log(`  Title: ${article.title}`);
        console.log(`  Description: ${article.description}`);
        console.log(`  Author: ${article.author}`);
        console.log(`  Published At: ${article.publishedAt}`);
        console.log(`  Source: ${article.source ? article.source.name : 'Unknown'}`);
      });
    });

    const allNews = [];

    for (let countryData of req.body) {
      const country = countryData.country;
      for (let article of countryData.articles) {
        const { title, description, publishedAt, source, author, content, urlToImage } = article;

        // Fallback to 'Unknown' if source or source.name is undefined
        const category = source ? source.name : 'Unknown';

        // Create a new news entry
        const newNews = new News({
          title,
          description,
          dateNews: publishedAt,
          category, // Use the fallback value here
          language: article.language || 'en',
          author,
          image: urlToImage,
          content,
        });

        // Save the news to the database
        const savedNews = await newNews.save();

        // Log the saved news data
        console.log('Saved News:', savedNews);

        allNews.push(savedNews);
      }
    }

    // Return the saved news
    res.status(201).json({ message: 'News added successfully', news: allNews });

  } catch (err) {
    console.error('Error adding news:', err);
    res.status(500).json({ message: 'Error adding news' });
  }
};







module.exports = {  GetNews , isAdmin , PostNews};
