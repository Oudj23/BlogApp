const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./PostModel'); 
require('dotenv').config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL
// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connecté à MongoDB avec succès !"))
  .catch((err) => console.error("Erreur de connexion MongoDB :", err));

// Étape 2 : POST pour créer un nouveau post
app.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Le titre et le contenu sont requis." });
        }
        const newPost = new Post({ title, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du post", error });
    }
});

// Étape 3 : GET pour récupérer tous les posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des posts", error });
    }
});

// Étape 4 : GET pour récupérer un seul post spécifique
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post introuvable" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du post", error });
    }
});
app.put('/posts/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true } // Renvoie le document modifié
        );
        if (!updatedPost) return res.status(404).json({ message: "Post introuvable" });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification", error });
    }
});

// NOUVEAU : DELETE pour supprimer un post par son ID
app.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post introuvable à supprimer" });
        }
        res.json({ message: "Post supprimé avec succès !", id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du post", error });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});