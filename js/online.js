// ========== ONLINE MULTIPLAYER SYSTEM ==========
class OnlineSystem {
    constructor() {
        this.socket = null;
        this.roomId = null;
        this.opponent = null;
        this.matchmaking = false;
        this.isConnected = false;
        this.init();
    }
    
    init() {
        // For demo, simulate online features
        console.log('Online system initialized (demo mode)');
    }
    
    connect() {
        // Simulate connection
        return new Promise((resolve) => {
            setTimeout(() => {
                this.socket = { connected: true };
                this.isConnected = true;
                resolve(true);
            }, 1000);
        });
    }
    
    startMatchmaking() {
        if (this.matchmaking) return;
        
        this.matchmaking = true;
        if (typeof toastr !== 'undefined') {
            toastr.info('Đang tìm đối thủ...', 'Matchmaking');
        }
        
        // Simulate matchmaking
        setTimeout(() => {
            this.matchmaking = false;
            this.opponent = {
                id: 'opponent_' + Date.now(),
                username: 'Đối thủ Ngẫu nhiên',
                elo: Math.floor(Math.random() * 300) + 1400
            };
            
            if (typeof toastr !== 'undefined') {
                toastr.success(`Đã tìm thấy đối thủ: ${this.opponent.username} (${this.opponent.elo} ELO)`, 'Thành công');
            }
            
            // Update UI
            const blackPlayerName = document.getElementById('blackPlayerName');
            if (blackPlayerName) {
                blackPlayerName.textContent = `${this.opponent.username} (ĐEN)`;
            }
            
            const blackPlayerElo = document.getElementById('blackPlayerElo');
            if (blackPlayerElo) {
                blackPlayerElo.textContent = `ELO: ${this.opponent.elo}`;
            }
            
        }, 3000);
    }
    
    cancelMatchmaking() {
        this.matchmaking = false;
        if (typeof toastr !== 'undefined') {
            toastr.info('Đã hủy tìm trận', 'Matchmaking');
        }
    }
    
    sendMove(move) {
        if (!this.socket || !this.opponent) return;
        
        // Simulate sending move
        console.log('Sending move:', move);
        
        // Simulate opponent response after delay
        setTimeout(() => {
            // In real implementation, this would come from server
            this.receiveMove({
                from: { x: Math.floor(Math.random() * 9), y: Math.floor(Math.random() * 10) },
                to: { x: Math.floor(Math.random() * 9), y: Math.floor(Math.random() * 10) }
            });
        }, 1000);
    }
    
    receiveMove(move) {
        // Process opponent's move
        console.log('Received move:', move);
        
        // In real game, this would update the board
        if (typeof toastr !== 'undefined') {
            toastr.info('Đối thủ đã di chuyển', 'Thông báo');
        }
    }
    
    sendChatMessage(message) {
        if (!this.socket || !this.opponent) return;
        
        // Simulate sending chat
        console.log('Sending chat:', message);
    }
    
    disconnect() {
        this.socket = null;
        this.roomId = null;
        this.opponent = null;
        this.matchmaking = false;
    }
}

// Create global instance
let onlineSystem;