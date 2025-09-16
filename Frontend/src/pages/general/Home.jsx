import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/reels.css';
import '../../styles/theme.css';
import Navbar from '../../components/Navbar';
import ReelFeed from '../../components/ReelFeed';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {
                if (response.data.foodItems) {
                    setVideos(response.data.foodItems);
                    setError("");
                } else if (response.data.message) {
                    setError(response.data.message);
                } else {
                    setError("No videos found.");
                }
            })
            .catch(() => {
                setError("Unable to fetch videos. Please try again later.");
            })
            .finally(() => setLoading(false));
        const onStorage = () => setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    async function likeVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, { withCredentials: true });
        if (response.data.like) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v));
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v));
        }
    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true });
        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v));
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v));
        }
    }

    return (
        <>
            <Navbar />
            <main className="home-main">
                {!isLoggedIn && (
                    <section className="home-hero">
                        <h1 className="home-title">Welcome to Zomato</h1>
                        <p className="home-desc">Discover delicious food reels and connect with food partners. Sign up or login to get started!</p>
                        <div className="home-actions">
                            <a href="/user/login" className="home-btn">Login</a>
                            <a href="/user/register" className="home-btn home-btn--primary">Sign Up</a>
                        </div>
                    </section>
                )}
                {loading ? (
                    <div className="home-loading">Loading...</div>
                ) : error ? (
                    <div className="home-error">{error}</div>
                ) : (
                    <ReelFeed
                        items={videos}
                        onLike={likeVideo}
                        onSave={saveVideo}
                        emptyMessage="No videos available."
                    />
                )}
            </main>
        </>
    );
};

export default Home;