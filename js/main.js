// ========== MAIN INITIALIZATION ==========

// Toastr configuration
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

// Global variables
let chessGame;
let uiManager;
let advancedAI;
let onlineSystem;

// Simple stub classes for missing dependencies
class ChessGame {
    constructor() {
        this.state = { 
            board: this.initializeBoard(),
            moveHistory: []
        };
    }
    
    initializeBoard() {
        return Array(10).fill(null).map(() => Array(9).fill(null));
    }
    
    calculateValidMoves(piece, x, y) {
        return [];
    }
    
    newGame() {
        console.log('New game started');
    }
    
    undoMove() {
        console.log('Move undone');
    }
    
    saveGame() {
        console.log('Game saved');
    }
}

class UIManager {
    constructor() {
        console.log('UI Manager initialized');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Cờ Tướng Online...');
        
        // Initialize systems
        uiManager = new UIManager();
        chessGame = new ChessGame();
        
        // Only initialize AI if AdvancedChessAI class exists
        if (typeof AdvancedChessAI !== 'undefined') {
            try {
                advancedAI = new AdvancedChessAI(chessGame);
                console.log('AI System initialized');
            } catch (aiError) {
                console.error('Error initializing AI:', aiError);
            }
        } else {
            console.warn('AdvancedChessAI not loaded yet');
        }
        
        // Only initialize online system if OnlineSystem class exists
        if (typeof OnlineSystem !== 'undefined') {
            try {
                onlineSystem = new OnlineSystem();
                console.log('Online System initialized');
            } catch (onlineError) {
                console.error('Error initializing Online System:', onlineError);
            }
        } else {
            console.warn('OnlineSystem not loaded yet');
        }
        
        // Initialize user menu
        initializeUserMenu();
        
        // Show welcome message
        setTimeout(() => {
            if (typeof toastr !== 'undefined' && toastr.info) {
                toastr.info(
                    'Chào mừng đến với Cờ Tướng Online!<br>Chọn quân và bắt đầu chơi ngay.',
                    'Xin chào',
                    { timeOut: 5000 }
                );
            }
        }, 1000);
        
        // Update online stats periodically
        setInterval(() => {
            const onlineCount = document.getElementById('onlineCount');
            if (onlineCount) {
                const count = Math.floor(Math.random() * 1000) + 1000;
                onlineCount.textContent = count.toLocaleString();
            }
        }, 10000);
        
    } catch (error) {
        console.error('Critical error during initialization:', error);
        if (typeof toastr !== 'undefined' && toastr.error) {
            toastr.error('Lỗi khởi tạo ứng dụng: ' + error.message, 'Lỗi');
        }
    }
});

// ========== USER MENU SYSTEM - FIXED ==========

let gamePlayer = null;

// Toggle menu - FIXED VERSION
function toggleUserMenu(event) {
    if (event) event.stopPropagation();
    
    const menu = document.getElementById('userMenu');
    const btn = document.getElementById('userBtn');
    
    console.log('Toggle menu called', menu, btn); // Debug
    
    if (!menu || !btn) {
        console.error('Menu or button not found!');
        console.log('Menu element:', menu);
        console.log('Button element:', btn);
        return;
    }
    
    if (menu.classList.contains('active')) {
        // Hide menu
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-10px) scale(0.95)';
        setTimeout(() => {
            menu.classList.remove('active');
            menu.style.display = 'none'; // Ẩn hoàn toàn
        }, 200);
    } else {
        // Show menu
        menu.style.display = 'block'; // Hiển thị trước
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-10px) scale(0.95)';
        
        // Position menu - QUAN TRỌNG
        const rect = btn.getBoundingClientRect();
        console.log('Button position:', rect);
        
        // Đặt vị trí menu ngay dưới button
        menu.style.top = `${rect.bottom + window.scrollY}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        menu.style.left = 'auto'; // Reset left
        
        // Trigger animation
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0) scale(1)';
            menu.classList.add('active');
        }, 10);
    }
}

// Trong main.js, thêm vào function newGame()
function newGame() {
    console.log("Starting new game...");
    
    if (window.chessMovement) {
        // Reset movement system
        window.chessMovement.deselectPiece();
        window.chessMovement.moveHistory = [];
        window.chessMovement.currentMoveIndex = -1;
        window.chessMovement.isRedTurn = true;
        
        // Update UI
        const turnElement = document.getElementById('currentTurn');
        if (turnElement) {
            turnElement.textContent = 'ĐỎ';
            turnElement.className = 'red-turn';
        }
        
        // Clear captured pieces
        const capturedRed = document.getElementById('capturedRed');
        const capturedBlack = document.getElementById('capturedBlack');
        if (capturedRed) capturedRed.innerHTML = '';
        if (capturedBlack) capturedBlack.innerHTML = '';
        
        // Clear move history
        const moveHistory = document.getElementById('moveHistory');
        if (moveHistory) moveHistory.innerHTML = '';
        
        // Show instruction
        window.chessMovement.showInstruction("Bắt đầu ván mới! Đỏ đi trước.");
    }
    
    // Gọi hàm newGame của chessGame nếu có
    if (chessGame && chessGame.newGame) {
        chessGame.newGame();
    }
}
// Login cho game - FIXED VERSION
function gameLogin() {
    const name = prompt("Nhập tên người chơi:", "Kỳ thủ " + (Math.floor(Math.random() * 999) + 1));
    if (name && name.trim() !== "") {
        gamePlayer = {
            name: name.trim(),
            elo: 1200,
            wins: 0,
            losses: 0,
            createdAt: new Date().toISOString()
        };
        
        // Update UI
        updateUserInterface();
        
        // Lưu vào localStorage
        localStorage.setItem('coTuongPlayer', JSON.stringify(gamePlayer));
        
        // Thông báo
        if (typeof toastr !== 'undefined') {
            toastr.success(`Chào mừng ${gamePlayer.name} đến với Cờ Tướng!`);
        }
        
        console.log('Đăng nhập thành công:', gamePlayer);
    }
    
    // Đóng menu
    toggleUserMenu();
}

// Logout - FIXED VERSION
function gameLogout() {
    if (confirm("Bạn có muốn đăng xuất khỏi game?")) {
        gamePlayer = null;
        
        // Update UI
        updateUserInterface();
        
        // Xóa khỏi localStorage
        localStorage.removeItem('coTuongPlayer');
        
        if (typeof toastr !== 'undefined') {
            toastr.info("Đã đăng xuất khỏi game");
        }
        
        console.log('Đã đăng xuất');
    }
    
    // Đóng menu
    toggleUserMenu();
}

// Update UI based on login state
function updateUserInterface() {
    const userBtnText = document.getElementById('userBtnText');
    const loginOption = document.getElementById('loginOption');
    const logoutOption = document.getElementById('logoutOption');
    const userBtn = document.getElementById('userBtn');
    const redPlayerName = document.getElementById('redPlayerName');
    
    if (gamePlayer) {
        // Đã đăng nhập
        if (userBtnText) userBtnText.textContent = gamePlayer.name;
        if (loginOption) loginOption.style.display = 'none';
        if (logoutOption) logoutOption.style.display = 'flex';
        if (userBtn) userBtn.classList.add('logged');
        if (redPlayerName) redPlayerName.textContent = gamePlayer.name + " (ĐỎ)";
    } else {
        // Chưa đăng nhập
        if (userBtnText) userBtnText.textContent = "Đăng nhập";
        if (loginOption) loginOption.style.display = 'flex';
        if (logoutOption) logoutOption.style.display = 'none';
        if (userBtn) userBtn.classList.remove('logged');
        if (redPlayerName) redPlayerName.textContent = "Bạn (ĐỎ)";
    }
}

// Click ngoài để đóng menu - FIXED
document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    const btn = document.getElementById('userBtn');
    
    if (menu && btn) {
        const isClickInsideMenu = menu.contains(e.target);
        const isClickOnButton = btn.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnButton) {
            if (menu.classList.contains('active')) {
                toggleUserMenu();
            }
        }
    }
});

// Đóng menu bằng phím ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.getElementById('userMenu');
        if (menu && menu.classList.contains('active')) {
            toggleUserMenu();
        }
    }
});

// Khởi tạo user menu
function initializeUserMenu() {
    console.log('Initializing Game User Menu...');
    
    // Kiểm tra localStorage cho player
    const savedPlayer = localStorage.getItem('coTuongPlayer');
    if (savedPlayer) {
        try {
            gamePlayer = JSON.parse(savedPlayer);
            console.log('Loaded player from localStorage:', gamePlayer);
        } catch(e) {
            console.error('Error parsing saved player:', e);
            localStorage.removeItem('coTuongPlayer');
        }
    }
    
    // Update UI
    updateUserInterface();
    
    // Debug: Kiểm tra xem elements có tồn tại không
    console.log('User button exists:', !!document.getElementById('userBtn'));
    console.log('User menu exists:', !!document.getElementById('userMenu'));
    console.log('Login option exists:', !!document.getElementById('loginOption'));
    console.log('Logout option exists:', !!document.getElementById('logoutOption'));
}

// Gọi initialize trong DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... phần code khác ...
    
    initializeUserMenu(); // Đảm bảo gọi hàm này
});

// Global helper functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getPieceName(piece) {
    const pieceNames = {
        '帥': 'Tướng Đỏ', '將': 'Tướng Đen',
        '仕': 'Sĩ Đỏ', '士': 'Sĩ Đen',
        '相': 'Tượng Đỏ', '象': 'Tượng Đen',
        '馬': 'Mã Đỏ', '傌': 'Mã Đen',
        '車': 'Xe Đỏ', '俥': 'Xe Đen',
        '炮': 'Pháo Đỏ', '砲': 'Pháo Đen',
        '兵': 'Binh Đỏ', '卒': 'Tốt Đen'
    };
    return pieceNames[piece] || piece;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Ctrl + N: New game
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        if (chessGame) chessGame.newGame();
    }
    
    // Ctrl + Z: Undo move
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        if (chessGame) chessGame.undoMove();
    }
    
    // Ctrl + S: Save game
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (chessGame) chessGame.saveGame();
    }
    
    // H: Hint
    if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        if (chessGame) showHint();
    }
    
    // Esc: Close modals
    if (e.key === 'Escape') {
        // Close login modal
        const loginModal = document.getElementById('loginModal');
        if (loginModal && loginModal.style.display === 'flex') {
            loginModal.style.display = 'none';
        }
        
        // Close user menu
        const menu = document.getElementById('userMenu');
        if (menu && menu.classList.contains('active')) {
            toggleUserMenu();
        }
    }
});

// Update analysis periodically
setInterval(() => {
    if (!chessGame) return;
    
    const analysisScore = document.getElementById('analysisScore');
    const analysisBar = document.getElementById('analysisBar');
    const advantageText = document.getElementById('advantageText');
    
    if (analysisScore && analysisBar && advantageText) {
        // Simple random analysis for demo
        const score = (Math.random() * 3 - 1.5).toFixed(1);
        const percentage = (parseFloat(score) + 1.5) / 3 * 100;
        
        analysisScore.textContent = score > 0 ? `+${score}` : score;
        analysisScore.style.background = score > 0.5 ? 'linear-gradient(135deg, #2ecc71, #27ae60)' :
                                          score < -0.5 ? 'linear-gradient(135deg, #e74c3c, #c0392b)' :
                                          'linear-gradient(135deg, #f39c12, #d35400)';
        
        analysisBar.style.width = `${percentage}%`;
        
        if (score > 0.5) {
            advantageText.textContent = 'Đỏ có lợi thế';
            advantageText.style.color = '#2ecc71';
        } else if (score < -0.5) {
            advantageText.textContent = 'Đen có lợi thế';
            advantageText.style.color = '#e74c3c';
        } else {
            advantageText.textContent = 'Cân bằng';
            advantageText.style.color = '#f39c12';
        }
    }
}, 2000);

// Helper function for hints
function showHint() {
    if (chessGame) {
        console.log('Showing hint');
        showNotification('Gợi ý: Hãy di chuyển quân Xe vào trung tâm!', 'info');
    }
}

// Helper function for notifications
function showNotification(message, type = 'info') {
    if (typeof toastr !== 'undefined') {
        switch(type) {
            case 'success':
                toastr.success(message);
                break;
            case 'error':
                toastr.error(message);
                break;
            default:
                toastr.info(message);
        }
    }
}
// ========== SIMPLE USER MENU - GUARANTEED WORKING ==========

console.log("=== SIMPLE USER MENU LOADED ===");

// Biến global đơn giản
let currentPlayer = null;

// 1. Hàm toggle menu - cực đơn giản
function toggleTestMenu() {
    console.log("toggleTestMenu called!");
    
    const menu = document.getElementById('testUserMenu');
    const btn = document.getElementById('testUserBtn');
    
    console.log("Menu element:", menu);
    console.log("Menu style.display:", menu?.style.display);
    
    if (!menu || !btn) {
        console.error("Menu or button not found!");
        return;
    }
    
    if (menu.style.display === 'block') {
        // Hide menu
        menu.style.display = 'none';
        console.log("Hiding menu");
    } else {
        // Show menu
        menu.style.display = 'block';
        
        // Đặt vị trí
        const rect = btn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';
        
        console.log("Showing menu at position:", menu.style.top, menu.style.right);
    }
}

// 2. Hàm đăng nhập
function testLogin() {
    console.log("testLogin called!");
    
    const name = prompt("Nhập tên người chơi:", "Player" + Math.floor(Math.random() * 1000));
    if (name) {
        currentPlayer = {
            name: name,
            elo: 1200
        };
        
        // Update UI
        document.getElementById('testUserText').textContent = name;
        document.getElementById('testLoginBtn').style.display = 'none';
        document.getElementById('testLogoutBtn').style.display = 'block';
        document.getElementById('testUserBtn').style.background = '#48bb78';
        
        // Lưu vào localStorage
        localStorage.setItem('simplePlayer', JSON.stringify(currentPlayer));
        
        // Thông báo
        if (toastr) toastr.success("Đăng nhập thành công!");
        
        console.log("Logged in as:", name);
    }
    
    // Đóng menu
    toggleTestMenu();
}

// 3. Hàm đăng xuất
function testLogout() {
    console.log("testLogout called!");
    
    if (confirm("Đăng xuất?")) {
        currentPlayer = null;
        
        // Update UI
        document.getElementById('testUserText').textContent = "Đăng nhập";
        document.getElementById('testLoginBtn').style.display = 'block';
        document.getElementById('testLogoutBtn').style.display = 'none';
        document.getElementById('testUserBtn').style.background = '#667eea';
        
        // Xóa localStorage
        localStorage.removeItem('simplePlayer');
        
        if (toastr) toastr.info("Đã đăng xuất");
        
        console.log("Logged out");
    }
    
    // Đóng menu
    toggleTestMenu();
}

// 4. Load từ localStorage khi khởi động
function loadPlayerFromStorage() {
    console.log("Loading player from storage...");
    
    const saved = localStorage.getItem('simplePlayer');
    if (saved) {
        try {
            currentPlayer = JSON.parse(saved);
            
            // Update UI
            document.getElementById('testUserText').textContent = currentPlayer.name;
            document.getElementById('testLoginBtn').style.display = 'none';
            document.getElementById('testLogoutBtn').style.display = 'block';
            document.getElementById('testUserBtn').style.background = '#48bb78';
            
            console.log("Loaded player:", currentPlayer);
        } catch (e) {
            console.error("Error loading player:", e);
            localStorage.removeItem('simplePlayer');
        }
    }
}

// 5. Đóng menu khi click ra ngoài
document.addEventListener('click', function(event) {
    const menu = document.getElementById('testUserMenu');
    const btn = document.getElementById('testUserBtn');
    
    if (menu && btn && menu.style.display === 'block') {
        if (!menu.contains(event.target) && !btn.contains(event.target)) {
            menu.style.display = 'none';
            console.log("Closed menu by clicking outside");
        }
    }
});

// 6. Gắn event listeners TRỰC TIẾP
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== INITIALIZING SIMPLE MENU ===");
    
    // Gắn sự kiện click cho button
    const userBtn = document.getElementById('testUserBtn');
    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTestMenu();
        });
        console.log("Button event listener attached");
    }
    
    // Gắn sự kiện cho login button
    const loginBtn = document.getElementById('testLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            testLogin();
        });
        console.log("Login button event attached");
    }
    
    // Gắn sự kiện cho logout button
    const logoutBtn = document.getElementById('testLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            testLogout();
        });
        console.log("Logout button event attached");
    }
    
    // Load player từ storage
    loadPlayerFromStorage();
    
    console.log("=== SIMPLE MENU INITIALIZATION COMPLETE ===");
});

// 7. Debug: Thêm nút test vào console
console.log("Type 'testMenu()' in console to test the menu");
window.testMenu = function() {
    console.log("Testing menu...");
    toggleTestMenu();
};