/* public/js/script.js - 终极清洗修复版 (包含所有功能) */

let allSongs = []; 
let currentSongId = null;

// ================= 0. 初始化 (程序入口) =================
document.addEventListener('DOMContentLoaded', () => {
    fetchSongs();
    checkLoginState();
    
    // 1. 监听搜索框
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredSongs = allSongs.filter(song => 
                song.title.toLowerCase().includes(searchTerm) || 
                song.artist.toLowerCase().includes(searchTerm)
            );
            renderSongs(filteredSongs);
        });
    }

    // 2. 绑定创建歌单按钮
    const createBtn = document.getElementById('createPlaylistBtn');
    if (createBtn) {
        createBtn.onclick = () => {
            document.getElementById('createPlaylistModal').style.display = 'flex';
        };
    }
});

// ================= 1. 歌曲数据获取与渲染 =================

async function fetchSongs() {
    try {
        const response = await fetch('/api/songs');
        if (!response.ok) throw new Error("Failed to fetch songs");
        allSongs = await response.json();
        renderSongs(allSongs);
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

function renderSongs(songs) {
    if (!songs || songs.length === 0) return;

    // 1. 获取当前用户身份
    const currentUser = localStorage.getItem('username');
    const isAdmin = currentUser && currentUser.toLowerCase() === 'admin';

    // 2. 打乱歌曲排序
    const shuffled = [...songs].sort(() => 0.5 - Math.random());

    // --- 核心子函数：创建包含删除按钮的卡片 ---
    const createSongCard = (song) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative'; // 确保删除按钮定位正确

        // 如果是管理员，则生成删除按钮
        let adminDeleteHtml = '';
        if (isAdmin) {
            adminDeleteHtml = `
                <div class="admin-delete-btn" 
                     onclick="deleteSongAsAdmin(event, '${song._id}')" 
                     style="position: absolute; top: 8px; right: 8px; background: rgba(255,0,0,0.8); color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; z-index: 100; cursor: pointer; font-size: 14px; font-weight: bold;"
                     title="Admin Delete">
                     🗑️
                </div>
            `;
        }

        card.innerHTML = `
            ${adminDeleteHtml}
            <img src="${song.coverImage}" alt="${song.title}" onclick="openSongModal('${song._id}')" onerror="this.src='https://placehold.co/400x400/282828/white?text=Music'">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        `;
        return card;
    };

    // --- 核心辅助函数：填充容器 ---
    const populateSection = (containerId, songList) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = ''; // 清空旧内容
        songList.forEach(song => {
            container.appendChild(createSongCard(song));
        });
    };

    // 3. 渲染各个板块
    // Trending (前12首)
    populateSection('trending-container', shuffled.slice(0, 12));

    // Pop & K-Pop
    let popKpop = songs.filter(s => s.genre === 'Pop' || s.genre === 'K-Pop');
    if (popKpop.length < 12) {
        const fillers = shuffled.filter(s => s.genre !== 'Pop' && s.genre !== 'K-Pop').slice(0, 12 - popKpop.length);
        popKpop = [...popKpop, ...fillers].slice(0, 12);
    }
    populateSection('pop-kpop-container', popKpop);

    // Rock & Hip-Hop
    let rockHiphop = songs.filter(s => s.genre === 'Rock' || s.genre === 'Hip-Hop');
    if (rockHiphop.length < 12) {
        const fillers = shuffled.filter(s => s.genre !== 'Rock' && s.genre !== 'Hip-Hop').slice(0, 12 - rockHiphop.length);
        rockHiphop = [...rockHiphop, ...fillers].slice(0, 12);
    }
    populateSection('rock-hiphop-container', rockHiphop);
}


// ================= 2. 歌曲详情 (播放 + 评论 + 删除评论) =================

/* public/js/script.js - 修复 ID 捕获逻辑 */

function openSongModal(songOrId) {
    // --- 核心修复：无论传进来的是字符串还是对象，都能准确拿到 ID ---
    if (typeof songOrId === 'string') {
        currentSongId = songOrId; // 如果是字符串，直接就是 ID
    } else if (songOrId && songOrId._id) {
        currentSongId = songOrId._id; // 如果是对象，取它的 ._id
    }
    
    console.log("🎯 成功捕获并锁定全局歌曲 ID:", currentSongId);

    // 接下来是原来的显示逻辑，不用动
    const reviewSection = document.getElementById('reviewInputSection');
    const addSection = document.getElementById('addToPlaylistSection');
    const loginHint = document.getElementById('loginToReview');
    const token = localStorage.getItem('token');
    const isUserLoggedIn = !!token;

    if (reviewSection) reviewSection.style.display = isUserLoggedIn ? 'block' : 'none';
    if (addSection) addSection.style.display = isUserLoggedIn ? 'block' : 'none';
    if (loginHint) loginHint.style.display = isUserLoggedIn ? 'none' : 'block';

    // 如果 currentSongId 已经是字符串了，我们需要获取完整的歌曲对象来填充 UI
    // 这里我们直接从 allSongs 数组里找
    const song = typeof songOrId === 'object' ? songOrId : allSongs.find(s => s._id === currentSongId);

    if (song) {
        document.getElementById('modal-img').src = song.coverImage;
        document.getElementById('modal-title').innerText = song.title;
        document.getElementById('modal-artist').innerText = song.artist;
        
        const playBtn = document.getElementById('modal-play-btn');
        if (playBtn) {
            const newBtn = playBtn.cloneNode(true);
            playBtn.parentNode.replaceChild(newBtn, playBtn);
            newBtn.onclick = () => playMusic(song);
        }
        renderReviews(song.reviews);
    }

    if (token) fetchMyPlaylists(); 
    document.getElementById('songModal').style.display = 'flex';
}
/* public/js/script.js - 找到 renderReviews 替换 */

function renderReviews(reviews) {
    console.log("前端收到的原始评论数据:", reviews);
    const container = document.getElementById('modal-comments');
    if (!container) return;
    
    container.innerHTML = ''; 
    
    const safeReviews = (reviews || []).filter(r => r !== null && r !== undefined);

    // ▼▼▼ 核心修复：在这里定义管理员判断 ▼▼▼
    const currentUser = localStorage.getItem('username');
    const isAdmin = currentUser === 'admin'; 
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    if (safeReviews.length > 0) {
        safeReviews.forEach(review => {
            try {
                const content = review.content || "暂无内容";
                const rating = review.rating || 5;
                
                let userName = 'Unknown';
                if (review.user && review.user.username) {
                    userName = review.user.username; 
                } else if (review.user && typeof review.user === 'string') {
                    userName = 'User ' + review.user.substring(0, 6); 
                }

                const reviewId = review._id;

                const div = document.createElement('div');
                div.className = 'comment';
                div.style.padding = '10px 0';
                div.style.borderBottom = '1px solid #333';
                div.style.position = 'relative';

                // ▼▼▼ 修改这里的逻辑判断 ▼▼▼
                let deleteHtml = '';
                
                // 逻辑：只要你是 admin，或者你是评论作者，就显示按钮
                if (isAdmin || (currentUser && userName === currentUser)) {
                     deleteHtml = `
                        <span onclick="deleteReview('${currentSongId}', '${reviewId}')" 
                              style="position:absolute; right:0; top:0; cursor:pointer; color:#ff5555; font-size:14px; font-weight:bold;"
                              title="Delete">✖ 删除</span>
                    `;
                }
                // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

                div.innerHTML = `
                    <div style="font-size:14px;">
                        <span style="color: #1db954; font-weight: bold;">${userName}</span> 
                        <span style="color: #ffd700; margin-left:5px;">★${rating}</span>
                    </div>
                    <div style="color: #ddd; margin-top:4px;">${content}</div>
                    ${deleteHtml}
                `;
                container.appendChild(div);
            } catch (err) {
                console.error("渲染单条评论出错，已跳过:", err);
            }
        });
    } else {
        container.innerHTML = '<p style="color:#777; text-align:center; padding:20px;">No reviews yet.</p>';
    }
}

// 发送评论 (修复 Token 问题)
async function submitReview() {
    const rating = document.getElementById('reviewRating').value;
    const content = document.getElementById('reviewText').value;
    const token = localStorage.getItem('token');

    if (!token) return alert("Please log in");

    try {
        const res = await fetch(`/api/reviews/${currentSongId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // 关键：必须用 x-auth-token
            },
            body: JSON.stringify({ rating, content })
        });
        
        if (res.ok) {
            // 刷新评论区
            const songRes = await fetch(`/api/songs/${currentSongId}`);
            const updatedSong = await songRes.json();
            renderReviews(updatedSong.reviews);
            document.getElementById('reviewText').value = ''; 
        } else {
            const data = await res.json();
            alert('Failed: ' + (data.message || data.msg || 'Unknown error'));
        }
    } catch (err) { console.error(err); }
}

// 删除评论
async function deleteReview(songId, reviewId) {
    if(!confirm("Delete this review?")) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/reviews/${songId}/${reviewId}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });
        if (res.ok) {
            // 刷新评论区
            const songRes = await fetch(`/api/songs/${songId}`);
            const updatedSong = await songRes.json();
            renderReviews(updatedSong.reviews);
        } else {
            alert("Delete failed");
        }
    } catch(err) { console.error(err); }
}

// ================= 3. 歌单系统 (CRUD + 详情 + 移除歌曲) =================

async function fetchMyPlaylists() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch('/api/playlists/my', {
            headers: { 'x-auth-token': token } 
        });
        if (!res.ok) return;

        const playlists = await res.json();
        
        // A. 填充 "Add to Playlist" 下拉框
        const select = document.getElementById('playlistSelect');
        if (select) {
            select.innerHTML = '<option value="">Select a playlist...</option>';
            playlists.forEach(pl => {
                const option = document.createElement('option');
                option.value = pl._id;
                option.innerText = pl.name;
                select.appendChild(option);
            });
        }

        // B. 填充 "Your Library" 页面 (带垃圾桶按钮)
        const libContainer = document.getElementById('playlists-container');
        if (libContainer) {
            libContainer.innerHTML = '';
            playlists.forEach(pl => {
                const card = document.createElement('div');
                card.className = 'card';
                // 点击卡片本体 -> 打开详情
                card.onclick = () => openPlaylistModal(pl); 

                card.innerHTML = `
                    <div style="position: relative;">
                        <div style="width: 100%; aspect-ratio: 1; background: #282828; display: flex; justify-content: center; align-items: center; border-radius: 4px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                            <i class="fas fa-music" style="font-size: 50px; color: #1db954;"></i>
                        </div>
                        <button onclick="deletePlaylist(event, '${pl._id}')" 
                                title="Delete Playlist"
                                style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.6); border: none; color: #ff5555; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; justify-content: center; align-items: center;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <h3 style="text-align:left; margin:0; font-size:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${pl.name}</h3>
                    <p style="text-align:left; color:#b3b3b3; margin:5px 0 0; font-size:14px;">${pl.songs.length} songs</p>
                `;
                libContainer.appendChild(card);
            });
        }
    } catch (err) { console.error('Playlist fetch error:', err); }
}

// 创建歌单 (修复 Token Header)
async function submitCreatePlaylist() {
    const name = document.getElementById('newPlaylistName').value;
    const description = document.getElementById('newPlaylistDesc').value;
    const token = localStorage.getItem('token');

    try {
        const res = await fetch('/api/playlists', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // 关键修复
            },
            body: JSON.stringify({ name, description })
        });

        if (res.ok) {
            alert('Playlist Created!');
            closeModal('createPlaylistModal');
            document.getElementById('newPlaylistName').value = ''; 
            document.getElementById('newPlaylistDesc').value = '';
            fetchMyPlaylists(); // 刷新
        } else {
            const data = await res.json();
            // 让它把后端传回来的具体 error 信息显示出来
            alert('后端报错详情: ' + (data.error || data.message));
        }
    } catch (err) { console.error(err); }
}

async function addToPlaylist() {
    const playlistId = document.getElementById('playlistSelect').value;
    const token = localStorage.getItem('token');

    if (!playlistId) return alert('Please select a playlist');

    try {
        const res = await fetch('/api/playlists/add-song', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify({ playlistId, songId: currentSongId })
        });
        
        if (res.ok) {
            alert('Song added to playlist!');
            fetchMyPlaylists(); 
        } else {
            alert('Failed to add song (maybe duplicate?)');
        }
    } catch (err) { alert('Error adding song'); }
}

// 删除歌单
async function deletePlaylist(event, id) {
    event.stopPropagation(); // 阻止冒泡
    if(!confirm("Are you sure you want to delete this playlist?")) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/playlists/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });
        if(res.ok) fetchMyPlaylists();
        else alert("Failed to delete");
    } catch(err) { console.error(err); }
}

// 歌单详情弹窗 (带移除歌曲功能)
function openPlaylistModal(playlist) {
    const modal = document.getElementById('playlistModal');
    const listContainer = document.getElementById('pl-songs-list');
    
    document.getElementById('pl-modal-title').innerText = playlist.name;
    document.getElementById('pl-modal-desc').innerText = playlist.description || "No description";
    listContainer.innerHTML = '';

    if (playlist.songs && playlist.songs.length > 0) {
        playlist.songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.style.padding = "10px";
            item.style.borderBottom = "1px solid #333";
            item.style.display = "flex";
            item.style.justifyContent = "space-between"; 
            item.style.alignItems = "center";
            item.style.cursor = "pointer";
            
            // 左侧：信息区
            const infoDiv = document.createElement('div');
            infoDiv.style.display = "flex";
            infoDiv.style.alignItems = "center";
            infoDiv.style.flex = "1";
            infoDiv.onclick = () => {
                closeModal('playlistModal'); 
                openSongModal(song);        
            };
            
            infoDiv.innerHTML = `
                <span style="color: #1db954; font-weight:bold; margin-right:15px;">${index + 1}</span>
                <img src="${song.coverImage}" style="width:40px; height:40px; border-radius:4px; margin-right:15px;" onerror="this.onerror=null;this.src='https://placehold.co/40';">
                <div>
                    <div style="color: white; font-weight: bold;">${song.title}</div>
                    <div style="color: #b3b3b3; font-size: 12px;">${song.artist}</div>
                </div>
            `;

            // 右侧：移除按钮 (✖)
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '✖';
            removeBtn.title = "Remove from playlist";
            removeBtn.style.background = "transparent";
            removeBtn.style.border = "none";
            removeBtn.style.color = "#555";
            removeBtn.style.fontSize = "16px";
            removeBtn.style.cursor = "pointer";
            removeBtn.style.padding = "0 10px";
            
            removeBtn.onmouseover = () => removeBtn.style.color = "#ff5555";
            removeBtn.onmouseout = () => removeBtn.style.color = "#555";

            removeBtn.onclick = (e) => {
                e.stopPropagation(); 
                removeSongFromPlaylist(playlist._id, song._id);
            };

            item.appendChild(infoDiv);
            item.appendChild(removeBtn);
            listContainer.appendChild(item);
        });
    } else {
        listContainer.innerHTML = '<p style="text-align:center; color:#777; padding:20px;">This playlist is empty.</p>';
    }

    modal.style.display = 'flex';
}

// 移除歌曲
async function removeSongFromPlaylist(playlistId, songId) {
    if(!confirm("Remove this song from playlist?")) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/playlists/${playlistId}/song/${songId}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });

        if (res.ok) {
            // 刷新弹窗
            const updatedRes = await fetch('/api/playlists/my', { headers: { 'x-auth-token': token } });
            const playlists = await updatedRes.json();
            const currentPl = playlists.find(p => p._id === playlistId);
            if (currentPl) openPlaylistModal(currentPl);
        } else {
            alert("Failed to remove song");
        }
    } catch (err) { console.error(err); }
}

// ================= 4. 用户认证与通用 =================

function checkLoginState() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    // ▼▼▼ 如果用户名是 admin，就显示红色按钮 ▼▼▼
    const isAdmin = (username === 'admin'); 

    const loginBtn = document.getElementById('loginBtn');
    const createPlaylistBtn = document.getElementById('createPlaylistBtn');
    const adminBtn = document.getElementById('adminBtn'); 

    if (token && username) {
        if(loginBtn) {
            loginBtn.innerText = `👤 ${username} (Logout)`;
            loginBtn.onclick = logout;
        }
        if(createPlaylistBtn) createPlaylistBtn.style.display = 'inline-block';
        
        // 管理员特权
        if (isAdmin && adminBtn) {
            adminBtn.style.display = 'inline-block';
            adminBtn.onclick = () => {
                document.getElementById('adminModal').style.display = 'flex';
            };
        }
        
        fetchMyPlaylists();
    } else {
        if(loginBtn) {
            loginBtn.innerText = 'Log in';
            loginBtn.onclick = openAuthModal;
        }
        if(createPlaylistBtn) createPlaylistBtn.style.display = 'none';
        if(adminBtn) adminBtn.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    location.reload();
}

function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    switchMode('login');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchMode(mode) {
    const title = document.getElementById('authTitle');
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');

    if (mode === 'login') {
        title.innerText = 'Log in';
        loginForm.style.display = 'flex';
        regForm.style.display = 'none';
    } else {
        title.innerText = 'Sign up';
        loginForm.style.display = 'none';
        regForm.style.display = 'flex';
    }
}

function showSection(section) {
    document.getElementById('home-view').style.display = section === 'home' ? 'block' : 'none';
    document.getElementById('library-view').style.display = section === 'library' ? 'block' : 'none';
    
    if (section === 'library' && !localStorage.getItem('token')) {
        const plContainer = document.getElementById('playlists-container');
        if(plContainer) plContainer.innerHTML = '<p style="padding:20px; color:#ccc;">Please log in to view your library.</p>';
    }
}

// 登录/注册表单监听
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUser').value;
        const password = document.getElementById('loginPass').value;
        await handleAuth('/api/auth/login', { username, password });
    };
}

const regForm = document.getElementById('registerForm');
if(regForm) {
    regForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUser').value;
        const password = document.getElementById('regPass').value;
        await handleAuth('/api/auth/register', { username, password });
    };
}

async function handleAuth(url, body) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.user.username);
                closeModal('authModal');
                checkLoginState();
                alert('Success!');
            } else {
                alert('Registered! Please log in.');
                switchMode('login');
            }
        } else {
            alert(data.message);
        }
    } catch (err) { alert('Error connecting to server'); }
}

// 点击背景关闭弹窗
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ================= 5. 音乐播放逻辑 =================

function playMusic(song) {
    const audio = document.getElementById('audio-element');
    const ctrlBtn = document.getElementById('player-ctrl-btn');
    
    document.getElementById('player-cover').src = song.coverImage;
    document.getElementById('player-title').innerText = song.title;
    document.getElementById('player-artist').innerText = song.artist;
    
    audio.src = song.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    audio.play();
    
    ctrlBtn.innerText = "⏸";
}

function togglePlay() {
    const audio = document.getElementById('audio-element');
    const ctrlBtn = document.getElementById('player-ctrl-btn');
    
    if (!audio.src) return; 

    if (audio.paused) {
        audio.play();
        ctrlBtn.innerText = "⏸";
    } else {
        audio.pause();
        ctrlBtn.innerText = "▶";
    }
}

// ▼▼▼ Admin 上传歌曲 ▼▼▼
async function submitNewSong() {
    const title = document.getElementById('newSongTitle').value;
    const artist = document.getElementById('newSongArtist').value;
    const genre = document.getElementById('newSongGenre').value;
    const coverImage = document.getElementById('newSongCover').value;
    const audioUrl = document.getElementById('newSongAudio').value;
    const token = localStorage.getItem('token');

    if (!title || !artist || !coverImage) return alert("Please fill in required fields!");

    try {
        const res = await fetch('/api/songs', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify({ title, artist, genre, coverImage, audioUrl })
        });

        if (res.ok) {
            alert('🔥 Song Uploaded Successfully!');
            document.getElementById('adminModal').style.display = 'none';
            // 刷新页面以显示新歌
            window.location.reload();
        } else {
            alert('Failed: You are not authorized (Admins only)!');
        }
    } catch (err) { console.error(err); }
}

async function deleteSongAsAdmin(event, songId) {
    event.stopPropagation(); // 防止点击删除时触发歌曲播放

    if (!confirm("⚠️ ADMIN: 确定要永久删除这首歌吗？")) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/songs/${songId}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });

        if (res.ok) {
            alert('🗑️ 歌曲已删除');
            window.location.reload();
        } else {
            alert('❌ 删除失败');
        }
    } catch (err) {
        console.error(err);
    }
}