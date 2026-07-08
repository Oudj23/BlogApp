import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import Logo from '../../assets/LOGO.png';
import { Link } from 'react-router-dom';

function Home() {
    const [splashTop, setSplashTop] = useState('0');
    const [messageOpacity, setMessageOpacity] = useState(1);
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // États locaux pour gérer le post en cours d'édition sur l'interface
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://blogapp-backend-u4uo.onrender.com/posts');
            setPosts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (!loading) {
            const animTimer = setTimeout(() => {
                setSplashTop('-100vh');
                setMessageOpacity(0);
            }, 1000);
            return () => clearTimeout(animTimer);
        }
    }, [loading]);

    // Activer le mode édition sur une carte
    const startEditing = (post) => {
        setEditingId(post._id);
        setEditTitle(post.title);
        setEditContent(post.content);
    };

    // Annuler l'édition
    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle('');
        setEditContent('');
    };

    // Sauvegarder les modifications (Requête PUT)
    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`https://blogapp-backend-u4uo.onrender.com/posts/${id}`, {
                title: editTitle,
                content: editContent
            });
            // Mettre à jour le tableau localement
            setPosts(posts.map(p => p._id === id ? response.data : p));
            setEditingId(null); // Quitter le mode édition
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            alert("Erreur de sauvegarde");
        }
    };

    // Supprimer un post
    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce post ?")) {
            try {
                await axios.delete(`https://blogapp-backend-u4uo.onrender.com/posts/${id}`);
                setPosts(posts.filter(post => post._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className='Home-container'>
            
            {/* Splash-screen Sitar */}
            <div className='Splash-screen' style={{ top: splashTop }}>
                <img src={Logo} className='Logo-Splash' alt="Logo" />
                <p className='Message-Splash' style={{ opacity: messageOpacity }}>Waiting data..</p>
            </div>

            {/* Contenu principal style image_9bc785.png */}
            <div className='Main-content'>
                
                <div className='NavBar'>
                    <div className='Nav-Links'>
                        <Link to="/addpost" className='Link'>Add</Link>
                        <Link to="/" className='Link'>Blogs</Link>
                    </div>
                    <img src={Logo} className='Nav-Logo' alt="Logo Nav" />
                </div>

                <div className='Posts-section'>
                    {posts.length === 0 ? (
                        <p className='No-posts'>No posts available yet.</p>
                    ) : (
                        <div className='Posts-list'>
                            {posts.map(post => (
                                <div key={post._id} className='Post-card'>
                                    {editingId === post._id ? (
                                        /* VUE MODE ÉDITION (Formulaire) */
                                        <div className='Edit-mode-container'>
                                            <input 
                                                type="text" 
                                                className='Edit-input-title'
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                            <textarea 
                                                className='Edit-textarea-content'
                                                rows="6"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            ></textarea>
                                            <div className='Post-footer'>
                                                <button className='save-btn' onClick={() => handleUpdate(post._id)}>Save</button>
                                                <button className='cancel-btn' onClick={cancelEditing}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* VUE NORMAL (Lecture seule) */
                                        <>
                                            <h2 className='Post-title'>{post.title}</h2>
                                            <p className='Post-body'>{post.content}</p>
                                            
                                            <div className='Post-footer'>
                                                {/* Bouton de Modification */}
                                                <button className='edit-btn' onClick={() => startEditing(post)}>
                                                    Edit
                                                </button>
                                                {/* Bouton de Suppression */}
                                                <button className='delete-btn' onClick={() => handleDelete(post._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;