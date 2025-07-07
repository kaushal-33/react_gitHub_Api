import { useEffect, useState, useRef } from 'react';
import domtoimage from 'dom-to-image-more';
import {
    Search, Download, Github, MapPin, Calendar,
    ExternalLink, Users, BookOpen, Star
} from 'lucide-react';

const GithubCard = () => {
    const [username, setUsername] = useState('');
    const [query, setQuery] = useState('octocat');
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const cardRef = useRef(null);

    const fetchUser = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.github.com/users/${query}`);
            const data = await res.json();
            if (res.status === 404) {
                setError('User not found');
                setUserData({});
            } else {
                setUserData(data);
            }
        } catch (err) {
            setError('Failed to fetch user data');
        }
        setLoading(false);
    };
    const handleDownloadPNG = () => {
        if (!cardRef.current) return;
        domtoimage.toPng(cardRef.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `${query}_profile.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error('Error generating PNG:', error);
            });
    };

    useEffect(() => {
        if (query) fetchUser();
    }, [query]);

    const handleSearch = () => {
        if (username.trim()) {
            setQuery(username.trim());
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
            {/* Background Effects */}
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 w-full max-w-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        GitHub Profile Card
                    </h1>
                    <p className="text-slate-400 mt-2 mb-6">Discover & download GitHub profiles</p>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Enter GitHub username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="w-full py-3 pl-12 pr-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-xl font-medium transition"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="text-center bg-red-500/10 border border-red-400/30 text-red-300 p-4 rounded-xl mb-4">
                        {error}
                    </div>
                )}

                {!loading && userData.login && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
                        <div ref={cardRef}>
                            <div className="flex flex-col items-center text-center mb-6">
                                <img
                                    src={userData.avatar_url}
                                    alt="Avatar"
                                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white/20 shadow-lg"
                                />
                                <h2 className="text-xl sm:text-2xl font-bold mt-4">{userData.name || userData.login}</h2>
                                <p className="text-purple-300">@{userData.login}</p>
                                <p className="text-slate-300 text-sm max-w-xs mt-2">{userData.bio}</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 mb-6">
                                {userData.location && (
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{userData.location}</span>
                                )}
                                {userData.created_at && (
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined {new Date(userData.created_at).getFullYear()}</span>
                                )}
                                {userData.blog && (
                                    <span className="flex items-center gap-1 max-w-[150px] truncate">
                                        <ExternalLink className="w-4 h-4" />
                                        <a href={userData.blog} target="_blank" rel="noreferrer" className="hover:underline">
                                            {userData.blog}
                                        </a>
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <BookOpen className="mx-auto mb-1 text-purple-400" />
                                    <p className="text-lg font-bold">{userData.public_repos}</p>
                                    <p>Repos</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <Users className="mx-auto mb-1 text-pink-400" />
                                    <p className="text-lg font-bold">{userData.followers}</p>
                                    <p>Followers</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <Star className="mx-auto mb-1 text-yellow-400" />
                                    <p className="text-lg font-bold">{userData.following}</p>
                                    <p>Following</p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons shown on screen but not captured */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <a
                                href={userData.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-xl font-medium"
                            >
                                <Github className="inline mr-2 w-5 h-5" />
                                View Profile
                            </a>
                            <button
                                onClick={handleDownloadPNG}
                                className="flex-1 cursor-pointer bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-xl font-medium"
                            >
                                <Download className='inline mr-2 w-5 h-5' />
                                Download PNG
                            </button>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default GithubCard;
