const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const BlogPost = require('./models/BlogPost');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get a specific post
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the post' });
  }
});

// Create a new post
app.post('/posts', async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    if (!title || !content || !excerpt) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const post = await BlogPost.create({ title, content, excerpt });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update a post
app.put('/posts/:id', async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;
    const post = await BlogPost.findByPk(req.params.id);
    if (post) {
      post.title = title || post.title;
      post.content = content || post.content;
      post.excerpt = excerpt || post.excerpt;
      await post.save();
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (post) {
      await post.destroy();
      res.json({ message: 'Post deleted' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
