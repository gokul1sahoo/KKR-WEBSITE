const News = require('../models/News');

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().populate('teamId').sort({ publishedAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by team
exports.getNewsByTeam = async (req, res) => {
  try {
    const news = await News.find({ teamId: req.params.teamId }).populate('teamId').sort({ publishedAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('teamId');
    if (!article) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create news
exports.createNews = async (req, res) => {
  const article = new News(req.body);
  try {
    const savedNews = await article.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
