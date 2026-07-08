import React, { useState } from 'react';
import axios from 'axios'; // Importation d'Axios
import './AddPost.css';
import Logo from '../../assets/LOGO.png';
import '../Home/Home.css'
import { Link } from 'react-router-dom';
function AddPost() {
    // Étape 1 : Initialisation des états pour le titre et le contenu
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Étape 2 : Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement automatique de la page

        // Vérification basique de sécurité
        if (!title.trim() || !content.trim()) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        try {
            // Étape 3 : Envoi de la requête POST avec Axios vers votre backend Express
            const response = await axios.post('https://blogapp-backend-u4uo.onrender.com/posts', {
                title: title,
                content: content
            });

            console.log('Post créé avec succès !', response.data);
            alert('Post créé avec succès !');

            // Optionnel : Réinitialiser le formulaire après l'envoi
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Erreur lors de la création du post:', error);
            alert('Une erreur est survenue lors de l\'envoi.');
        }
    };

    return (
        <div className="form-page-container">
            <div className='NavBar'>
                    <div className='Nav-Links'>
                        <Link to="/addpost" className='Link'>Add</Link>
                        <Link to="/" className='Link'>Blogs</Link>
                    </div>
                    <img src={Logo} className='Nav-Logo' alt="Logo Nav" />
                </div>
            <div className="form-card">
                <h2 className="form-title">Create New Post</h2>
                <form className="post-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            placeholder="Post Title" 
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} // Liaison avec l'état title
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <textarea 
                            placeholder="Content" 
                            className="form-textarea"
                            rows="6"
                            value={content}
                            onChange={(e) => setContent(e.target.value)} // Liaison avec l'état content
                            required
                        ></textarea>
                    </div>
                    
                    <div className="button-container">
                        <button type="submit" className="submit-btn">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPost;