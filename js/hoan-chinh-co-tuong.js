// ========== CỜ TƯỚNG ONLINE HOÀN CHỈNH ==========

class CoTuongHoanChinh {
    constructor() {
        console.log("🚀 Khởi tạo Cờ Tướng Hoàn Chỉnh...");
        
        // Game state
        this.boardElement = document.getElementById('chessBoard');
        this.currentPlayer = 'red'; // Đỏ đi trước
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveCount = 0;
        this.moveHistory = [];
        this.capturedPieces = { red: [], black: [] };
        this.gameActive = true;
        this.isCheck = false;
        this.isAutoPlay = false; // Chế độ AI tự chơi
        this.checkingPiece = null;
        this.redTime = 600;
this.blackTime = 600;
this.timer = null;

        // Quân cờ đang tồn tại trên bàn
        this.activePieces = [];
        
        // Định nghĩa quân cờ
        this.pieceNames = {
            '帥': 'Tướng Đỏ', '將': 'Tướng Đen',
            '仕': 'Sĩ Đỏ', '士': 'Sĩ Đen',
            '相': 'Tượng Đỏ', '象': 'Tượng Đen',
            '馬': 'Mã Đỏ', '傌': 'Mã Đen',
            '車': 'Xe Đỏ', '俥': 'Xe Đen',
            '炮': 'Pháo Đỏ', '砲': 'Pháo Đen',
            '兵': 'Binh Đỏ', '卒': 'Tốt Đen'
        };
        
        if (!this.boardElement) {
            console.error("❌ Không tìm thấy bàn cờ!");
            return;
        }
        
        this.khoiTaoTroChoi();
    }
    
    khoiTaoTroChoi() {
        this.taoBanCo();
        this.datQuanCo();
        this.thietLapSuKien();
        this.setupModalEvents();
        this.capNhatHienThi();
        
        this.hienThiThongBao("🎮 Bắt đầu ván cờ! ĐỎ đi trước.", "success");
    }
    
    // ========== TẠO BÀN CỜ ==========
    
    taoBanCo() {
        // Completely clear the board - remove ALL children
        if (this.boardElement) {
            // Remove all child nodes
            while (this.boardElement.firstChild) {
                this.boardElement.removeChild(this.boardElement.firstChild);
            }
            this.boardElement.innerHTML = '';
        }
        
        this.activePieces = [];
        
        console.log("🔧 Clearing board and creating fresh 10x9 grid...");
        
        // Tạo bàn cờ 10x9
        for (let hang = 0; hang < 10; hang++) {
            for (let cot = 0; cot < 9; cot++) {
                const oCo = document.createElement('div');
                oCo.className = 'board-square';
                oCo.dataset.hang = hang;
                oCo.dataset.cot = cot;
                
                // Màu ô cờ (xen kẽ)
                if ((hang + cot) % 2 === 0) {
                    oCo.classList.add('light');
                } else {
                    oCo.classList.add('dark');
                }
                
                // Vùng sông (hàng 4-5)
                if (hang === 4 || hang === 5) {
                    oCo.classList.add('song');
                }
                
                // Cung (9 ô vuông mỗi bên)
                if ((hang <= 2 && cot >= 3 && cot <= 5) || 
                    (hang >= 7 && cot >= 3 && cot <= 5)) {
                    oCo.classList.add('cung');
                }
                
                this.boardElement.appendChild(oCo);
            }
        }
        
        console.log("✅ Fresh board created with 90 squares");
    }
    
    // ========== ĐẶT QUÂN CỜ BAN ĐẦU ==========
    
   datQuanCo() {
    // 🔥 1. XÓA TOÀN BỘ QUÂN CŨ TRÊN BÀN
    this.boardElement
        .querySelectorAll('.quan-co')
        .forEach(q => q.remove());

    // 🔥 2. RESET DANH SÁCH QUÂN
    this.activePieces = [];

    // 🔥 3. VỊ TRÍ BAN ĐẦU CHUẨN - SỬA LẠI ĐỊNH DẠNG
    const viTriBanDau = [
        // ĐỎ (hàng 6-9)
        ['車', 9, 0, 'red'], ['馬', 9, 1, 'red'], ['相', 9, 2, 'red'],
        ['仕', 9, 3, 'red'], ['帥', 9, 4, 'red'], ['仕', 9, 5, 'red'],
        ['相', 9, 6, 'red'], ['馬', 9, 7, 'red'], ['車', 9, 8, 'red'],
        ['炮', 7, 1, 'red'], ['炮', 7, 7, 'red'],
        ['兵', 6, 0, 'red'], ['兵', 6, 2, 'red'], ['兵', 6, 4, 'red'],
        ['兵', 6, 6, 'red'], ['兵', 6, 8, 'red'],

        // ĐEN (hàng 0-3)
        ['俥', 0, 0, 'black'], ['傌', 0, 1, 'black'], ['象', 0, 2, 'black'],
        ['士', 0, 3, 'black'], ['將', 0, 4, 'black'], ['士', 0, 5, 'black'],
        ['象', 0, 6, 'black'], ['傌', 0, 7, 'black'], ['俥', 0, 8, 'black'],
        ['砲', 2, 1, 'black'], ['砲', 2, 7, 'black'],
        ['卒', 3, 0, 'black'], ['卒', 3, 2, 'black'], ['卒', 3, 4, 'black'],
        ['卒', 3, 6, 'black'], ['卒', 3, 8, 'black']
    ];

    // 🔥 4. TẠO QUÂN MỚI TỪ ĐẦU
    viTriBanDau.forEach(([loaiQuan, hang, cot, mau]) => {
        this.taoQuanCo(loaiQuan, hang, cot, mau);
    });
}

    taoQuanCo(loaiQuan, hang, cot, mau) {
        const quanCo = document.createElement('div');
        quanCo.className = `quan-co ${mau}-quan`;
        quanCo.textContent = loaiQuan;
        quanCo.dataset.loai = loaiQuan;
        quanCo.dataset.mau = mau;
        quanCo.dataset.hang = hang;
        quanCo.dataset.cot = cot;
        
        // Thêm title để hiển thị tên quân khi hover
        quanCo.title = this.pieceNames[loaiQuan];
        
        const oCo = this.layOCo(hang, cot);
        if (oCo) {
            oCo.appendChild(quanCo);
            
            this.activePieces.push({
                element: quanCo,
                loai: loaiQuan,
                mau: mau,
                hang: hang,
                cot: cot
            });
        }
        
        return quanCo;
    }
    
    // ========== SỰ KIỆN ==========
    
    setupModalEvents() {
        // Gắn sự kiện cho nút Chơi lại trong modal
        const playAgainBtn = document.getElementById('play-again');
        if (playAgainBtn) {
            playAgainBtn.onclick = (e) => {
                e.preventDefault();
                this.resetGame();
            };
        }
        
        // Gắn sự kiện cho nút Đóng/Quay lại
        const backBtn = document.getElementById('back-to-lobby');
        if (backBtn) {
            backBtn.onclick = (e) => {
                e.preventDefault();
                const modal = document.getElementById('resultModal') || document.getElementById('result-modal');
                if (modal) modal.style.display = 'none';
            };
        }
    }

    thietLapSuKien() {
        // Ngăn chặn gắn sự kiện nhiều lần
        if (this.eventsAttached) return;
        this.eventsAttached = true;

        console.log("🎯 GẮN EVENT CLICK (SINGLE)");

        // 👉 GẮN EVENT DUY NHẤT 1 LẦN
        this.boardElement.addEventListener('click', (e) => {
            if (!this.gameActive) return;

            const quanCo = e.target.closest('.quan-co');
            if (quanCo) {
                this.xuLyClickQuanCo(quanCo);
                return;
            }

            const oCo = e.target.closest('.board-square');
            if (oCo) {
                this.xuLyClickOCo(oCo);
            }
        });
    }

    
    xuLyClickQuanCo(quanCo) {
    const mau = quanCo.dataset.mau;
    const hang = parseInt(quanCo.dataset.hang);
    const cot = parseInt(quanCo.dataset.cot);

    // 🔥 TRƯỜNG HỢP: đang chọn quân mình & click quân địch → ĂN
    if (this.selectedPiece && mau !== this.currentPlayer) {
        const nuocDi = this.validMoves.find(
            m => m.hang === hang && m.cot === cot && m.laAnQuan
        );

        if (nuocDi) {
            this.diChuyenQuanCo(hang, cot);
            return;
        }
    }

    // ❌ Không được chọn quân địch khi chưa có quân đang chọn
    if (mau !== this.currentPlayer) {
        const tenNguoiChoi = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
        this.hienThiThongBao(`⚠️ Lượt của ${tenNguoiChoi}`, "warning");
        return;
    }

    // Click lại quân đang chọn → bỏ chọn
    if (this.selectedPiece && this.selectedPiece.element === quanCo) {
        this.boChon();
        return;
    }

    // Chọn quân mới
    this.chonQuan(quanCo, hang, cot);
}

    
    xuLyClickOCo(oCo) {
        if (!this.selectedPiece) return;
        
        const hang = parseInt(oCo.dataset.hang);
        const cot = parseInt(oCo.dataset.cot);
        
        // Kiểm tra nước đi hợp lệ
        const nuocDiHopLe = this.validMoves.some(move => 
            move.hang === hang && move.cot === cot
        );
        
        if (nuocDiHopLe) {
            this.diChuyenQuanCo(hang, cot);
        } else {
            // Click vào ô không hợp lệ
            this.boChon();
        }
    }
    
    // ========== CHỌN QUÂN CỜ ==========
    
    chonQuan(quanCo, hang, cot) {
    // Xóa chọn cũ
    this.boChon();
    
    // Debug: in thông tin quân
    console.log("=== CHỌN QUÂN ===");
    console.log("Element:", quanCo);
    console.log("Dataset:", quanCo.dataset);
    console.log("Parent:", quanCo.parentNode);
    
    // Chọn quân mới
    this.selectedPiece = {
        element: quanCo,
        loai: quanCo.dataset.loai,
        mau: quanCo.dataset.mau,
        hang: hang,
        cot: cot
    };
    
    // Highlight quân được chọn
    quanCo.classList.add('selected');
    
    // Tính toán nước đi hợp lệ
    this.tinhToanNuocDi(hang, cot, quanCo);
    this.hienThiNuocDiHopLe();
    
    // Debug hiển thị các nước đi
    console.log("Nước đi hợp lệ:", this.validMoves);
    
    // Hiển thị thông tin quân
    const tenQuan = this.pieceNames[quanCo.dataset.loai];
    console.log(`✅ Đã chọn: ${tenQuan} tại [${hang},${cot}]`);
}
    // ========== TÍNH TOÁN NƯỚC ĐI HỢP LỆ ==========
    
    tinhToanNuocDi(hang, cot, quanCo) {
        this.validMoves = [];
        const loaiQuan = quanCo.dataset.loai;
        const mau = quanCo.dataset.mau;
        
        console.log(`🔍 Tính nước đi cho: ${this.pieceNames[loaiQuan]} (${mau}) tại [${hang},${cot}]`);
        
        switch(loaiQuan) {
            case '帥': // Tướng đỏ
            case '將': // Tướng đen
                this.tinhNuocDiTuong(hang, cot, mau);
                break;
                
            case '仕': // Sĩ đỏ
            case '士': // Sĩ đen
                this.tinhNuocDiSi(hang, cot, mau);
                break;
                
            case '相': // Tượng đỏ
            case '象': // Tượng đen
                this.tinhNuocDiTuongElephant(hang, cot, mau);
                break;
                
            case '馬': // Mã đỏ
            case '傌': // Mã đen
                this.tinhNuocDiMa(hang, cot, mau);
                break;
                
            case '車': // Xe đỏ
            case '俥': // Xe đen
                this.tinhNuocDiXe(hang, cot, mau);
                break;
                
            case '炮': // Pháo đỏ
            case '砲': // Pháo đen
                this.tinhNuocDiPhao(hang, cot, mau);
                break;
                
            case '兵': // Binh đỏ
            case '卒': // Tốt đen
                this.tinhNuocDiTot(hang, cot, mau);
                break;
        }
        
        console.log(`📋 Tìm thấy ${this.validMoves.length} nước đi hợp lệ`);
    }
    
    // TƯỚNG: Đi 1 ô 4 hướng, trong cung
    tinhNuocDiTuong(hang, cot, mau) {
        const huongDi = [[-1,0],[1,0],[0,-1],[0,1]];
        
        huongDi.forEach(([dH, dC]) => {
            const hangMoi = hang + dH;
            const cotMoi = cot + dC;
            
            if (this.trongCung(hangMoi, cotMoi, mau)) {
                this.kiemTraVaThemNuocDi(hangMoi, cotMoi, mau);
            }
        });
        
        // Kiểm tra mặt tướng (tướng đối mặt không có quân cản)
        const tuongDoiPhuong = this.timTuongDoiPhuong(mau);
        if (tuongDoiPhuong && tuongDoiPhuong.cot === cot) {
            let coQuanCan = false;
            const hangBatDau = Math.min(hang, tuongDoiPhuong.hang) + 1;
            const hangKetThuc = Math.max(hang, tuongDoiPhuong.hang);
            
            for (let h = hangBatDau; h < hangKetThuc; h++) {
                if (this.coQuanTai(h, cot)) {
                    coQuanCan = true;
                    break;
                }
            }
            
            if (!coQuanCan) {
                this.kiemTraVaThemNuocDi(tuongDoiPhuong.hang, tuongDoiPhuong.cot, mau);
            }
        }
    }
    
    // SĨ: Đi chéo 1 ô, trong cung
    tinhNuocDiSi(hang, cot, mau) {
        const huongDi = [[-1,-1],[-1,1],[1,-1],[1,1]];
        
        huongDi.forEach(([dH, dC]) => {
            const hangMoi = hang + dH;
            const cotMoi = cot + dC;
            
            if (this.trongCung(hangMoi, cotMoi, mau)) {
                this.kiemTraVaThemNuocDi(hangMoi, cotMoi, mau);
            }
        });
    }
    
    // TƯỢNG: Đi chéo 2 ô, không qua sông
    tinhNuocDiTuongElephant(hang, cot, mau) {
        const huongDi = [[-2,-2],[-2,2],[2,-2],[2,2]];
        
        huongDi.forEach(([dH, dC]) => {
            const hangMoi = hang + dH;
            const cotMoi = cot + dC;
            const hangChan = hang + dH/2;
            const cotChan = cot + dC/2;
            
            // Kiểm tra vị trí hợp lệ
            if (this.viTriHopLe(hangMoi, cotMoi)) {
                // Không có quân cản ở giữa
                if (!this.coQuanTai(hangChan, cotChan)) {
                    // Tượng đỏ không qua sông (hang >= 5)
                    if (mau === 'red' && hangMoi >= 5) {
                        this.kiemTraVaThemNuocDi(hangMoi, cotMoi, mau);
                    }
                    // Tượng đen không qua sông (hang <= 4)
                    else if (mau === 'black' && hangMoi <= 4) {
                        this.kiemTraVaThemNuocDi(hangMoi, cotMoi, mau);
                    }
                }
            }
        });
    }
    
    // MÃ: Đi ngựa (hình chữ L)
    tinhNuocDiMa(hang, cot, mau) {
        const nuocDiMa = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        nuocDiMa.forEach(([dH, dC]) => {
            const hangMoi = hang + dH;
            const cotMoi = cot + dC;
            
            if (this.viTriHopLe(hangMoi, cotMoi)) {
                // Kiểm tra chân ngựa (có quân cản hay không)
                let hangChan, cotChan;
                
                // Xác định vị trí cản
                if (Math.abs(dH) === 2) {
                    // Đi dọc: cản ở giữa theo chiều dọc
                    hangChan = hang + dH/2;
                    cotChan = cot;
                } else {
                    // Đi ngang: cản ở giữa theo chiều ngang
                    hangChan = hang;
                    cotChan = cot + dC/2;
                }
                
                // Nếu không có quân cản thì kiểm tra nước đi
                if (!this.coQuanTai(hangChan, cotChan)) {
                    this.kiemTraVaThemNuocDi(hangMoi, cotMoi, mau);
                }
            }
        });
    }
    
    // XE: Đi thẳng (ngang/dọc) không giới hạn ô
    tinhNuocDiXe(hang, cot, mau) {
    const huongDi = [[-1,0],[1,0],[0,-1],[0,1]];
    
    huongDi.forEach(([dH, dC]) => {
        for (let buoc = 1; buoc < 10; buoc++) {
            const hangMoi = hang + dH * buoc;
            const cotMoi = cot + dC * buoc;
            
            if (!this.viTriHopLe(hangMoi, cotMoi)) break;
            
            const coQuanTaiDay = this.coQuanTai(hangMoi, cotMoi);
            
            if (coQuanTaiDay) {
                const quanTaiViTri = this.layQuanTai(hangMoi, cotMoi);
                // Kiểm tra màu quân
                if (quanTaiViTri && quanTaiViTri.dataset.mau !== mau) {
                    // Là quân địch - có thể ăn
                    this.validMoves.push({ 
                        hang: hangMoi, 
                        cot: cotMoi, 
                        laAnQuan: true,
                        
                    });
                }
                break; // Dừng lại dù là quân mình hay địch
            } else {
                // Ô trống - có thể đi
                this.validMoves.push({ 
                    hang: hangMoi, 
                    cot: cotMoi, 
                    laAnQuan: false 
                });
            }
        }
    });
}
    
    // PHÁO: Đi thẳng, ăn phải có đệm
   tinhNuocDiPhao(hang, cot, mau) {
    const huongDi = [[-1,0],[1,0],[0,-1],[0,1]];
    
    huongDi.forEach(([dH, dC]) => {
        let daTimThayDem = false;
        
        for (let buoc = 1; buoc < 10; buoc++) {
            const hangMoi = hang + dH * buoc;
            const cotMoi = cot + dC * buoc;
            
            if (!this.viTriHopLe(hangMoi, cotMoi)) break;
            
            const coQuanTaiDay = this.coQuanTai(hangMoi, cotMoi);
            
            if (!daTimThayDem) {
                // Chưa tìm thấy đệm
                if (coQuanTaiDay) {
                    // Gặp quân đầu tiên - đó là đệm
                    daTimThayDem = true;
                } else {
                    // Ô trống - có thể di chuyển
                    this.validMoves.push({ 
                        hang: hangMoi, 
                        cot: cotMoi, 
                        laAnQuan: false 
                    });
                }
            } else {
                // Đã có đệm, tìm mục tiêu để ăn
                if (coQuanTaiDay) {
                    const quanTaiViTri = this.layQuanTai(hangMoi, cotMoi);
                    // Gặp quân thứ hai
                    if (quanTaiViTri && quanTaiViTri.dataset.mau !== mau) {
                        // Là quân địch - có thể ăn
                        this.validMoves.push({ 
                            hang: hangMoi, 
                            cot: cotMoi, 
                            laAnQuan: true,
                        
                        });
                    }
                    break; // Dừng lại sau khi gặp quân thứ hai
                }
                // Nếu ô trống: tiếp tục tìm (không thêm nước đi)
            }
        }
    });
}
    // TỐT/BINH: Đi thẳng, qua sông đi ngang
    tinhNuocDiTot(hang, cot, mau) {
        if (mau === 'red') {
            // Đỏ đi lên (giảm hàng)
            if (hang > 0) {
                this.kiemTraVaThemNuocDi(hang - 1, cot, mau);
            }
            
            // Đã qua sông (hàng <= 4) có thể đi ngang
            if (hang <= 4) {
                if (cot > 0) this.kiemTraVaThemNuocDi(hang, cot - 1, mau);
                if (cot < 8) this.kiemTraVaThemNuocDi(hang, cot + 1, mau);
            }
        } else {
            // Đen đi xuống (tăng hàng)
            if (hang < 9) {
                this.kiemTraVaThemNuocDi(hang + 1, cot, mau);
            }
            
            // Đã qua sông (hàng >= 5) có thể đi ngang
            if (hang >= 5) {
                if (cot > 0) this.kiemTraVaThemNuocDi(hang, cot - 1, mau);
                if (cot < 8) this.kiemTraVaThemNuocDi(hang, cot + 1, mau);
            }
        }
    }
    
    // KIỂM TRA VÀ THÊM NƯỚC ĐI (dùng cho các quân đơn giản)
    kiemTraVaThemNuocDi(hang, cot, mau) {
        if (!this.viTriHopLe(hang, cot)) return;
        
        const coQuanTaiDay = this.coQuanTai(hang, cot);
        
        if (coQuanTaiDay) {
            // Có quân ở vị trí đích
            const quanTaiViTri = this.layQuanTai(hang, cot);
            if (quanTaiViTri && quanTaiViTri.dataset.mau && quanTaiViTri.dataset.mau !== mau) {
                // Là quân địch - có thể ăn
                console.log(`   📍 [${hang},${cot}] - CÓ QUÂN ĐỊCH (${quanTaiViTri.dataset.loai}) - CÓ THỂ ĂN`);
                this.validMoves.push({ 
                    hang, 
                    cot, 
                    laAnQuan: true,
                    
                });
            } else if (quanTaiViTri && quanTaiViTri.dataset.mau === mau) {
                // Là quân cùng màu - không thể đi
                console.log(`   📍 [${hang},${cot}] - CÓ QUÂN CÙNG MÀU (${quanTaiViTri.dataset.loai}) - KHÔNG THỂ ĐI`);
            }
        } else {
            // Ô trống - thêm nước đi bình thường
            console.log(`   📍 [${hang},${cot}] - ÔNG TRỐNG - CÓ THỂ ĐI`);
            this.validMoves.push({ 
                hang, 
                cot, 
                laAnQuan: false 
            });
        }
    }
    tinhNuocDiTam(loai, hang, cot, mau) {
    const moves = [];

    const backup = this.validMoves;
    this.validMoves = moves;

    switch(loai) {
        case '帥': case '將': this.tinhNuocDiTuong(hang, cot, mau); break;
        case '仕': case '士': this.tinhNuocDiSi(hang, cot, mau); break;
        case '相': case '象': this.tinhNuocDiTuongElephant(hang, cot, mau); break;
        case '馬': case '傌': this.tinhNuocDiMa(hang, cot, mau); break;
        case '車': case '俥': this.tinhNuocDiXe(hang, cot, mau); break;
        case '炮': case '砲': this.tinhNuocDiPhao(hang, cot, mau); break;
        case '兵': case '卒': this.tinhNuocDiTot(hang, cot, mau); break;
    }

    this.validMoves = backup;
    return moves;
}

    // ========== DI CHUYỂN VÀ ĂN QUÂN ==========
    
    diChuyenQuanCo(hangDich, cotDich) {
        if (!this.selectedPiece) {
            console.log("❌ Không có quân được chọn!");
            return;
        }
        
        const hangDau = this.selectedPiece.hang;
        const cotDau = this.selectedPiece.cot;
        const quanCo = this.selectedPiece.element;
        const loaiQuan = this.selectedPiece.loai;
        const mau = this.selectedPiece.mau;
        
        // Kiểm tra không đi chỗ mình
        if (hangDau === hangDich && cotDau === cotDich) {
            console.log("❌ Không thể đi đến cùng vị trí!");
            this.hienThiThongBao("❌ Không thể đi đến cùng vị trí!", "error");
            this.boChon();
            return;
        }
        
        // Tìm nước đi trong danh sách hợp lệ
        const nuocDi = this.validMoves.find(m => 
            m.hang === hangDich && m.cot === cotDich
        );
        
        if (!nuocDi) {
            this.hienThiThongBao("❌ Nước đi không hợp lệ!", "error");
            this.boChon();
            return;
        }
        
        console.log(`🎯 Di chuyển ${this.pieceNames[loaiQuan]} từ [${hangDau},${cotDau}] đến [${hangDich},${cotDich}]`);
        
        // Lấy ô đích và ô đầu
        const oCoDich = this.layOCo(hangDich, cotDich);
        const oCoDau = this.layOCo(hangDau, cotDau);
        
        if (!oCoDich || !oCoDau) {
            console.error("❌ Không tìm thấy ô cờ!");
            return;
        }
        
        // XỬ LÝ ĂN QUÂN TRƯỚC KHI DI CHUYỂN - LẤY QUÂN FRESH TỪ DOM
       if (nuocDi.laAnQuan) {
    const capturedPiece = this.layQuanTai(hangDich, cotDich);

    if (capturedPiece && capturedPiece !== quanCo) {
        console.log(`⚔️ Ăn quân tại [${hangDich},${cotDich}]`);
        console.log(`🔍 Quân bị ăn: ${capturedPiece.dataset.loai} (${capturedPiece.dataset.mau})`);
        this.anQuan(capturedPiece);
        
        // 🔥 KIỂM TRA NẾU GAME KẾT THÚC (ĂN TƯỚNG)
        if (!this.gameActive) {
            // Di chuyển visual quân ăn vào vị trí tướng để hoàn tất animation
            if (quanCo.parentNode === oCoDau) oCoDau.removeChild(quanCo);
            oCoDich.appendChild(quanCo);
            quanCo.dataset.hang = hangDich;
            quanCo.dataset.cot = cotDich;
            this.boChon();
            return; // 🛑 DỪNG LOGIC TẠI ĐÂY ĐỂ TRÁNH ĐỔI LƯỢT
        }
    } else {
        console.warn(
            `⚠️ Nước đi đánh dấu ăn quân nhưng không tìm thấy quân tại [${hangDich},${cotDich}]`
        );
    }
} else {
    this.playSound('move');
}

        // Xóa quân khỏi ô đầu
        if (quanCo.parentNode === oCoDau) {
            oCoDau.removeChild(quanCo);
        }
        
        // Double-check: Xóa bất kỳ quân còn lại ở ô đích (không nên xảy ra nhưng để an toàn)
        const remainingPiece = oCoDich.querySelector('.quan-co');
        if (remainingPiece && remainingPiece !== quanCo) {
            console.warn(`⚠️ Vẫn có quân khác tại [${hangDich},${cotDich}] - xóa nó!`);
            remainingPiece.remove();
            this.activePieces = this.activePieces.filter(p => p.element !== remainingPiece);
        }
        
        // Thêm quân vào ô đích
        oCoDich.appendChild(quanCo);
        
        // Cập nhật dữ liệu
        quanCo.dataset.hang = hangDich;
        quanCo.dataset.cot = cotDich;
        quanCo.dataset.pos = `${hangDich}-${cotDich}`;
        
        // Cập nhật trong activePieces
        const pieceIndex = this.activePieces.findIndex(p => p.element === quanCo);
        if (pieceIndex !== -1) {
            this.activePieces[pieceIndex].hang = hangDich;
            this.activePieces[pieceIndex].cot = cotDich;
        }
        
        // GHI LỊCH SỬ (ghi trước khi đổi lượt để ghi tên người chơi đúng)
        this.ghiLichSu(hangDau, cotDau, hangDich, cotDich, nuocDi.laAnQuan);
        
        // HIGHLIGHT NƯỚC ĐI CUỐI
        this.hienThiNuocDiCuoi(hangDau, cotDau, hangDich, cotDich);
        
        // ĐỔI LƯỢT TỰ ĐỘNG (sau khi ghi lịch sử)
        this.doiLuot();
        
        // BỎ CHỌN QUÂN
        this.boChon();
        
        // KIỂM TRA CHIẾU TƯỚNG
        this.kiemTraChieuTuong();
    }
    
    // ========== ĂN QUÂN ==========
    
    anQuan(quanBiAn) {
        if (!quanBiAn) {
            console.error("❌ LỖI: Không có quân để ăn! (quanBiAn = null)");
            return;
        }
        
        if (!quanBiAn.dataset || !quanBiAn.dataset.mau || !quanBiAn.dataset.loai) {
            console.error("❌ LỖI: Quân không có dataset đầy đủ!");
            console.error(`   Dataset:`, quanBiAn.dataset);
            console.error(`   Element:`, quanBiAn);
            return;
        }
        
        const mau = quanBiAn.dataset.mau;
        const loaiQuan = quanBiAn.dataset.loai;
        const hang = parseInt(quanBiAn.dataset.hang);
        const cot = parseInt(quanBiAn.dataset.cot);
        
        console.log(`🍖 ĐANG ĂN QUÂN: ${this.pieceNames[loaiQuan]} (${mau}) tại [${hang},${cot}]`);
        console.log(`   Phía trước: activePieces có ${this.activePieces.length} quân`);
        
        // 1. Xóa khỏi activePieces
        const indexBefore = this.activePieces.length;
        this.activePieces = this.activePieces.filter(p => p.element !== quanBiAn);
        const indexAfter = this.activePieces.length;
        
        if (indexBefore === indexAfter) {
            console.warn("⚠️ Quân không tìm thấy trong activePieces - nhưng tiếp tục...");
        } else {
            console.log(`✅ Đã xóa quân khỏi activePieces (${indexBefore} → ${indexAfter})`);
        }
        
        // 2. Xóa khỏi DOM 
        if (quanBiAn && quanBiAn.parentNode) {
            const parentSquare = quanBiAn.parentNode;
            quanBiAn.remove();
            console.log(`✅ Quân đã xóa khỏi DOM tại ô [${hang},${cot}]`);
        } else {
            console.error("❌ LỖI: Quân không có parentNode!");
            return;
        }
        
        // 3. Thêm vào danh sách quân bị ăn
        this.capturedPieces[mau] = this.capturedPieces[mau] || [];
        this.capturedPieces[mau].push({
            loai: loaiQuan,
            mau: mau
        });
        console.log(`✅ Thêm vào capturedPieces[${mau}] (Tổng: ${this.capturedPieces[mau].length})`);
        
        this.playSound('capture');
        
        // 4. Hiển thị ở khu vực quân bị ăn (nếu có)
        const khuVucAn = mau === 'red' 
            ? document.getElementById('capturedRed')
            : document.getElementById('capturedBlack');
        
        if (khuVucAn) {
            const icon = document.createElement('div');
            icon.className = `captured-icon ${mau}-piece`;
            icon.textContent = loaiQuan;
            icon.title = this.pieceNames[loaiQuan];
            khuVucAn.appendChild(icon);
            console.log(`✅ Hiển thị quân bị ăn ở khu vực: ${mau === 'red' ? 'capturedRed' : 'capturedBlack'}`);
        } else {
            console.error(`❌ LỖI: Không tìm thấy khu vực captured (${mau === 'red' ? 'capturedRed' : 'capturedBlack'})`);
        }
        
        // 5. Kiểm tra ăn TƯỚNG (kết thúc game)
        if (loaiQuan === '帥' || loaiQuan === '將') {
            console.log(`🏆 ĐÃ ĂN TƯỚNG! KẾT THÚC GAME!`);
            const nguoiThang = mau === 'red' ? 'black' : 'red';
            this.ketThucGame(nguoiThang);
        }
    }
    
    // ========== KIỂM TRA CHIẾU TƯỚNG ==========
    
    kiemTraChieuTuong() {
        // Tìm vị trí tướng của cả hai bên
        const tuongDo = this.timTuong('red');
        const tuongDen = this.timTuong('black');
        
        if (!tuongDo || !tuongDen) return;
        
        // Kiểm tra xem tướng đang bị chiếu không
        this.isCheck = false;
        this.checkingPiece = null;
        
        // Kiểm tra tướng đỏ có bị chiếu không
        const coBiChieuDo = this.kiemTraBiChieu(tuongDo.hang, tuongDo.cot, 'red');
        
        // Kiểm tra tướng đen có bị chiếu không
        const coBiChieuDen = this.kiemTraBiChieu(tuongDen.hang, tuongDen.cot, 'black');
        
        if (coBiChieuDo && this.currentPlayer === 'red') {
            this.isCheck = true;
            this.playSound('check');
            this.rungBanCo();
            this.hienThiThongBao("🔔 CHIẾU TƯỚNG! ĐỎ ĐANG BỊ CHIẾU!", "error");
            
            // Kiểm tra chiếu bí
            if (this.kiemTraChieuBi('red')) {
                this.ketThucGame('black');
            }
        }
        
        if (coBiChieuDen && this.currentPlayer === 'black') {
            this.isCheck = true;
            this.playSound('check');
            this.rungBanCo();
            this.hienThiThongBao("🔔 CHIẾU TƯỚNG! ĐEN ĐANG BỊ CHIẾU!", "error");
            
            // Kiểm tra chiếu bí
            if (this.kiemTraChieuBi('black')) {
                this.ketThucGame('red');
            }
        }
    }
    
    kiemTraBiChieu(hangTuong, cotTuong, mauTuong) {
        const mauDoiPhuong = mauTuong === 'red' ? 'black' : 'red';
        
        // Kiểm tra tất cả quân đối phương
        for (const piece of this.activePieces) {
            if (piece.mau === mauDoiPhuong) {
                // Tính toán nước đi của quân đối phương
                const validMoves = [];
                const loaiQuan = piece.loai;
                const hang = piece.hang;
                const cot = piece.cot;
                
                // Tạm thời lưu validMoves hiện tại
                const tempValidMoves = this.validMoves;
                this.validMoves = validMoves;
                
                // Tính nước đi của quân này
                switch(loaiQuan) {
                    case '帥': case '將': this.tinhNuocDiTuong(hang, cot, mauDoiPhuong); break;
                    case '仕': case '士': this.tinhNuocDiSi(hang, cot, mauDoiPhuong); break;
                    case '相': case '象': this.tinhNuocDiTuongElephant(hang, cot, mauDoiPhuong); break;
                    case '馬': case '傌': this.tinhNuocDiMa(hang, cot, mauDoiPhuong); break;
                    case '車': case '俥': this.tinhNuocDiXe(hang, cot, mauDoiPhuong); break;
                    case '炮': case '砲': this.tinhNuocDiPhao(hang, cot, mauDoiPhuong); break;
                    case '兵': case '卒': this.tinhNuocDiTot(hang, cot, mauDoiPhuong); break;
                }
                
                // Khôi phục validMoves
                this.validMoves = tempValidMoves;
                
                // Kiểm tra xem có nước đi nào đến vị trí tướng không
                for (const move of validMoves) {
                    if (move.hang === hangTuong && move.cot === cotTuong) {
                        this.checkingPiece = piece;
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    kiemTraChieuBi(mau) {
        // Lấy tất cả quân của người chơi
        const mauDoiPhuong = mau === 'red' ? 'black' : 'red';

        const quanCuaNguoiChoi = this.activePieces.filter(p => p.mau === mau);
        
        // Duyệt qua tất cả quân
        for (const piece of quanCuaNguoiChoi) {
            // Tính toán nước đi hợp lệ của quân này
          
            const validMoves = [];
            const loaiQuan = piece.loai;
            const hang = piece.hang;
            const cot = piece.cot;
            
            // Tạm thời lưu validMoves hiện tại
            const tempValidMoves = this.validMoves;
            this.validMoves = validMoves;
            
            // Tính nước đi
            switch(loaiQuan) {
                case '帥': case '將': this.tinhNuocDiTuong(hang, cot, mau); break;
                case '仕': case '士': this.tinhNuocDiSi(hang, cot, mau); break;
                case '相': case '象': this.tinhNuocDiTuongElephant(hang, cot, mau); break;
                case '馬': case '傌': this.tinhNuocDiMa(hang, cot, mau); break;
                case '車': case '俥': this.tinhNuocDiXe(hang, cot, mau); break;
                case '炮': case '砲': this.tinhNuocDiPhao(hang, cot, mau); break;
                case '兵': case '卒': this.tinhNuocDiTot(hang, cot, mau); break;
            }
            
            // Khôi phục validMoves
            this.validMoves = tempValidMoves;
            
            // Nếu có bất kỳ nước đi hợp lệ nào => không bị chiếu bí
            if (validMoves.length > 0) {
                return false;
            }
        }
        
        // Không có nước đi nào hợp lệ => chiếu bí
        return true;
    }
    
    // ========== CÁC PHƯƠNG THỨC HỖ TRỢ ==========
    
    timTuong(mau) {
        const loaiTuong = mau === 'red' ? '帥' : '將';
        return this.activePieces.find(p => p.loai === loaiTuong && p.mau === mau);
    }
    
    timTuongDoiPhuong(mau) {
        const loaiTuong = mau === 'red' ? '將' : '帥';
        return this.activePieces.find(p => p.loai === loaiTuong);
    }
    
    // ========== ĐỔI LƯỢT ==========
    
    doiLuot() {
    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
    this.startTimer();

    // Chế độ AI tự chơi (Auto Play)
    if (this.isAutoPlay) {
        setTimeout(() => this.aiMove(), 500);
    } 
    // Chế độ Người đấu với Máy (PvE)
    else if (this.playWithAI && this.currentPlayer === this.aiColor) {
        setTimeout(() => this.aiMove(), 500);
    }
}


    
    // ========== GHI LỊCH SỬ ==========
    
    ghiLichSu(hangDau, cotDau, hangDich, cotDich, daAnQuan) {
        const cotChu = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        const kyHieuDau = `${cotChu[cotDau]}${9 - hangDau}`;
        const kyHieuDich = `${cotChu[cotDich]}${9 - hangDich}`;
        
        const move = {
            soNuoc: Math.floor(this.moveHistory.length / 2) + 1,
            nguoiChoi: this.currentPlayer === 'red' ? 'Đỏ' : 'Đen',
            tu: kyHieuDau,
            den: kyHieuDich,
            kyHieu: `${kyHieuDau} → ${kyHieuDich}`,
            daAnQuan: daAnQuan
        };
        
        this.moveHistory.push(move);
        this.capNhatLichSu();
    }
    
    // ========== CẬP NHẬT HIỂN THỊ ==========
    
    capNhatHienThi() {
        // Cập nhật lượt
        const luotElement = document.getElementById('currentTurn');
        const trangThaiElement = document.getElementById('gameStatus');
        
        if (luotElement) {
            luotElement.textContent = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
            luotElement.className = this.currentPlayer === 'red' ? 'red-turn' : 'black-turn';
        }
        
        if (trangThaiElement) {
            let trangThai = this.currentPlayer === 'red' ? 'ĐỎ ĐANG ĐI' : 'ĐEN ĐANG ĐI';
            if (this.isCheck) {
                trangThai += ' - ⚡ CHIẾU TƯỚNG!';
            }
            trangThaiElement.textContent = trangThai;
        }
    }
    
    capNhatLichSu() {
        const lichSuElement = document.getElementById('moveHistory');
        if (!lichSuElement) return;
        
        lichSuElement.innerHTML = '';
        
        this.moveHistory.forEach((move, index) => {
            const item = document.createElement('div');
            item.className = 'move-history-item';
            
            let html = `<span class="move-number">${move.soNuoc}.</span>`;
            html += `<span class="move-player">${move.nguoiChoi}:</span>`;
            html += `<span class="move-notation">${move.kyHieu}</span>`;
            
            if (move.daAnQuan) {
                html += '<span class="move-capture">⚔</span>';
            }
            
            item.innerHTML = html;
            lichSuElement.appendChild(item);
        });
        
        // Scroll xuống cuối
        lichSuElement.scrollTop = lichSuElement.scrollHeight;
    }

    // ========== AI ENGINE (MINIMAX + ALPHA-BETA) ==========
    
    async aiMove() {
        if (!this.gameActive) return;

        const level = this.aiLevel || 3;
        const computerColor = this.currentPlayer;
        console.log(`🤖 AI (${computerColor} - Level ${level}) đang suy nghĩ...`);

        // Delay nhỏ để UI kịp cập nhật
        await new Promise(resolve => setTimeout(resolve, 100));

        const bestMove = this.getBestMoveAI(computerColor);

        if (bestMove) {
            const pieceElement = this.layQuanTai(bestMove.from.r, bestMove.from.c);
            if (pieceElement) {
                this.selectedPiece = {
                    element: pieceElement,
                    loai: bestMove.piece.type,
                    mau: bestMove.piece.color,
                    hang: bestMove.from.r,
                    cot: bestMove.from.c
                };

                // Thiết lập nước đi hợp lệ để hàm diChuyenQuanCo chấp nhận
                this.validMoves = [{
                    hang: bestMove.to.r,
                    cot: bestMove.to.c,
                    laAnQuan: !!this.layQuanTai(bestMove.to.r, bestMove.to.c)
                }];

                this.diChuyenQuanCo(bestMove.to.r, bestMove.to.c);
            }
        } else {
            console.log("⚠️ AI không tìm thấy nước đi (Có thể đã bị chiếu bí)");
        }
    }

    getBestMoveAI(playerColor) {
        const board = this.getVirtualBoard();
        const color = playerColor || this.aiColor || 'black';
        
        // Cấu hình độ sâu theo cấp độ
        const depthMap = { 1: 1, 2: 2, 3: 3, 4: 3, 5: 4 };
        const depth = depthMap[this.aiLevel] || 2;

        const result = this.minimax(board, depth, -Infinity, Infinity, true, color, color);
        return result.move;
    }

    minimax(board, depth, alpha, beta, isMaximizing, currentColor, rootColor) {
        if (depth === 0) {
            return { score: this.evaluateVirtualBoard(board, rootColor) };
        }

        const moves = this.getAllVirtualMoves(board, currentColor);
        
        if (moves.length === 0) {
            return { score: isMaximizing ? -100000 : 100000 };
        }

        // Sắp xếp nước đi: Ưu tiên ăn quân để cắt tỉa tốt hơn
        moves.sort((a, b) => {
            const scoreA = board[a.to.r][a.to.c] ? 10 : 0;
            const scoreB = board[b.to.r][b.to.c] ? 10 : 0;
            return scoreB - scoreA;
        });

        let bestMove = moves[0];
        const nextColor = currentColor === 'red' ? 'black' : 'red';

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                const captured = board[move.to.r][move.to.c];
                
                board[move.to.r][move.to.c] = board[move.from.r][move.from.c];
                board[move.from.r][move.from.c] = null;

                const evalObj = this.minimax(board, depth - 1, alpha, beta, false, nextColor, rootColor);
                
                board[move.from.r][move.from.c] = board[move.to.r][move.to.c];
                board[move.to.r][move.to.c] = captured;

                if (evalObj.score > maxEval) {
                    maxEval = evalObj.score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, evalObj.score);
                if (beta <= alpha) break;
            }
            return { score: maxEval, move: bestMove };
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                const captured = board[move.to.r][move.to.c];
                
                board[move.to.r][move.to.c] = board[move.from.r][move.from.c];
                board[move.from.r][move.from.c] = null;

                const evalObj = this.minimax(board, depth - 1, alpha, beta, true, nextColor, rootColor);
                
                board[move.from.r][move.from.c] = board[move.to.r][move.to.c];
                board[move.to.r][move.to.c] = captured;

                if (evalObj.score < minEval) {
                    minEval = evalObj.score;
                    bestMove = move;
                }
                beta = Math.min(beta, evalObj.score);
                if (beta <= alpha) break;
            }
            return { score: minEval, move: bestMove };
        }
    }

    getVirtualBoard() {
        const board = Array(10).fill(null).map(() => Array(9).fill(null));
        this.activePieces.forEach(p => {
            board[p.hang][p.cot] = { type: p.loai, color: p.mau };
        });
        return board;
    }

    evaluateVirtualBoard(board, maximizingColor) {
        let score = 0;
        const values = {
            '帥': 10000, '將': 10000, '車': 900, '俥': 900, '炮': 450, '砲': 450,
            '馬': 400, '傌': 400, '相': 200, '象': 200, '仕': 200, '士': 200, '兵': 100, '卒': 100
        };

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                const p = board[r][c];
                if (p) {
                    let val = values[p.type] || 0;
                    if (p.type === '兵' || p.type === '卒') {
                        if ((p.color === 'red' && r <= 4) || (p.color === 'black' && r >= 5)) val += 20;
                    }
                    if (p.color === maximizingColor) score += val;
                    else score -= val;
                }
            }
        }
        return score;
    }

    getAllVirtualMoves(board, color) {
        const moves = [];
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                const p = board[r][c];
                if (p && p.color === color) {
                    this.getPieceMoves(board, r, c, p.type, p.color, moves);
                }
            }
        }
        return moves;
    }

    getPieceMoves(board, r, c, type, color, moves) {
        const add = (nr, nc) => {
            if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
                const target = board[nr][nc];
                if (!target || target.color !== color) {
                    moves.push({ from: {r, c}, to: {r: nr, c: nc}, piece: {type, color} });
                }
            }
        };

        switch (type) {
            case '帥': case '將': 
                [[r+1,c], [r-1,c], [r,c+1], [r,c-1]].forEach(([nr, nc]) => {
                    if (nc >= 3 && nc <= 5 && ((color === 'red' && nr >= 7) || (color === 'black' && nr <= 2))) add(nr, nc);
                });
                break;
            case '仕': case '士': 
                [[r+1,c+1], [r+1,c-1], [r-1,c+1], [r-1,c-1]].forEach(([nr, nc]) => {
                    if (nc >= 3 && nc <= 5 && ((color === 'red' && nr >= 7) || (color === 'black' && nr <= 2))) add(nr, nc);
                });
                break;
            case '相': case '象': 
                [[r+2,c+2], [r+2,c-2], [r-2,c+2], [r-2,c-2]].forEach(([nr, nc]) => {
                    if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
                        if ((color === 'red' && nr >= 5) || (color === 'black' && nr <= 4)) {
                            const br = (r + nr) / 2, bc = (c + nc) / 2;
                            if (!board[br][bc]) add(nr, nc);
                        }
                    }
                });
                break;
            case '馬': case '傌': 
                [[r+2,c+1,r+1,c], [r+2,c-1,r+1,c], [r-2,c+1,r-1,c], [r-2,c-1,r-1,c],
                 [r+1,c+2,r,c+1], [r+1,c-2,r,c-1], [r-1,c+2,r,c+1], [r-1,c-2,r,c-1]].forEach(([nr, nc, br, bc]) => {
                    if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9 && !board[br][bc]) add(nr, nc);
                });
                break;
            case '車': case '俥': 
            case '炮': case '砲': 
                [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dr, dc]) => {
                    let nr = r + dr, nc = c + dc;
                    let jumped = false;
                    while (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
                        const target = board[nr][nc];
                        if (type === '車' || type === '俥') {
                            if (!target) add(nr, nc);
                            else { if (target.color !== color) add(nr, nc); break; }
                        } else {
                            if (!jumped) {
                                if (!target) add(nr, nc);
                                else jumped = true;
                            } else {
                                if (target) {
                                    if (target.color !== color) add(nr, nc);
                                    break;
                                }
                            }
                        }
                        nr += dr; nc += dc;
                    }
                });
                break;
            case '兵': case '卒': 
                const forward = color === 'red' ? -1 : 1;
                add(r + forward, c);
                if ((color === 'red' && r <= 4) || (color === 'black' && r >= 5)) {
                    add(r, c + 1); add(r, c - 1);
                }
                break;
        }
    }

    
    
    hienThiKetQua(nguoiThang) {
        const modal = document.getElementById('resultModal');
        if (!modal) return;
        
        const icon = modal.querySelector('#resultIcon');
        const message = modal.querySelector('#resultMessage');
        const details = modal.querySelector('#resultDetails');
        
        if (nguoiThang === 'red') {
            icon.innerHTML = '<i class="fas fa-crown" style="color: #C62828;"></i>';
            message.textContent = 'ĐỎ CHIẾN THẮNG!';
            message.style.color = '#C62828';
        } else {
            icon.innerHTML = '<i class="fas fa-crown" style="color: #212121;"></i>';
            message.textContent = 'ĐEN CHIẾN THẮNG!';
            message.style.color = '#212121';
        }
        
        details.textContent = `Sau ${this.moveCount} nước đi (CHIẾU BÍ)`;
        modal.style.display = 'flex';
    }
    
    // ========== FIREWORKS EFFECT ==========
    hienThiPhaoHoa() {
        const colors = ['#ff0000', '#ffd700', '#00ff00', '#00ffff', '#ff00ff', '#ffffff'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * (window.innerHeight * 0.6);
                
                for (let j = 0; j < 30; j++) {
                    const particle = document.createElement('div');
                    particle.className = 'firework-particle';
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    const angle = Math.random() * Math.PI * 2;
                    const velocity = 50 + Math.random() * 150;
                    
                    particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
                    particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
                    
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), 1000);
                }
            }, i * 200);
        }
    }

    // ========== VISUAL EFFECTS ==========
    rungBanCo() {
        if (this.boardElement) {
            this.boardElement.classList.remove('shake-effect');
            void this.boardElement.offsetWidth; // Trigger reflow
            this.boardElement.classList.add('shake-effect');
            
            setTimeout(() => {
                if (this.boardElement) {
                    this.boardElement.classList.remove('shake-effect');
                }
            }, 500);
        }
    }

    // ========== SOUND EFFECTS ==========
    playSound(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            const now = ctx.currentTime;
            
            if (type === 'move') {
                // Low thud for move
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'capture') {
                // Higher pitch for capture
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'check') {
                // Tiếng "Beng" khi chiếu tướng
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, now); // Tần số thấp (A3) tạo tiếng trầm
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.5, now + 0.05); // Đánh mạnh (Attack)
                gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5); // Ngân dài (Decay)
                
                osc.start(now);
                osc.stop(now + 1.5);
            }
        } catch (e) {
            console.error('Sound error:', e);
        }
    }

    // ========== HIGHLIGHT LAST MOVE ==========
    hienThiNuocDiCuoi(h1, c1, h2, c2) {
        // Xóa highlight cũ
        if (this.boardElement) {
            this.boardElement.querySelectorAll('.last-move').forEach(el => el.classList.remove('last-move'));
        }
        
        const o1 = this.layOCo(h1, c1);
        const o2 = this.layOCo(h2, c2);
        
        if (o1) o1.classList.add('last-move');
        if (o2) o2.classList.add('last-move');
    }

    // ========== RESET GAME ==========
    
    // ========== RESET GAME ==========
resetGame() {
    console.log("🔄 Reset game");

    // Store AI settings before reset
    const wasPlayingWithAI = this.playWithAI;
    const savedAIColor = this.aiColor;
    const savedAILevel = this.aiLevel;
    const wasAutoPlay = this.isAutoPlay;

    // Reset tất cả trạng thái game
    this.currentPlayer = 'red';
    this.selectedPiece = null;
    this.validMoves = [];
    this.moveCount = 0;
    this.moveHistory = [];
    this.capturedPieces = { red: [], black: [] };
    this.gameActive = true;
    this.isCheck = false;
    this.checkingPiece = null;
    this.redTime = 600;
    this.blackTime = 600;
    this.isAutoPlay = false;
    
    // Dừng timer cũ
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }

    // Reset danh sách quân
    this.activePieces = [];

    // 🔥 QUAN TRỌNG: Xóa toàn bộ DOM cũ
    if (this.boardElement) {
        this.boardElement.innerHTML = '';
    }

    // Tạo lại bàn cờ mới
    this.taoBanCo();
    this.datQuanCo();
    
    // Khởi động lại timer
    this.startTimer();
    this.updateTimerUI();

    // Restore AI settings if they were set
    if (wasPlayingWithAI) {
        this.playWithAI = true;
        this.aiColor = savedAIColor;
        this.aiLevel = savedAILevel;
        console.log(`🤖 AI mode preserved: Level ${this.aiLevel}`);
    }
    
    // Restore Auto Play if it was set
    if (wasAutoPlay) {
        this.isAutoPlay = true;
        console.log("🤖 Auto Play mode preserved");
        // Trigger first move if Red
        if (this.currentPlayer === 'red') {
            setTimeout(() => this.aiMove(), 500);
        }
    }

    // Xóa khu vực quân bị ăn
    const capturedRed = document.getElementById('capturedRed');
    const capturedBlack = document.getElementById('capturedBlack');
    if (capturedRed) capturedRed.innerHTML = '';
    if (capturedBlack) capturedBlack.innerHTML = '';
    
    // Xóa lịch sử
    const lichSuElement = document.getElementById('moveHistory');
    if (lichSuElement) lichSuElement.innerHTML = '';
    
    // Cập nhật hiển thị
    this.capNhatHienThi();
    
    // Ẩn modal kết quả
    const modal = document.getElementById('resultModal') || document.getElementById('result-modal');
    if (modal) modal.style.display = 'none';
    
    this.hienThiThongBao("🔄 Ván mới bắt đầu! Đỏ đi trước.", "success");
}
    startTimer() {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
        if (!this.gameActive) return;

        if (this.currentPlayer === 'red') {
            this.redTime--;
        } else {
            this.blackTime--;
        }

        this.updateTimerUI();

        if (this.redTime <= 0) this.ketThucGame('black');
        if (this.blackTime <= 0) this.ketThucGame('red');

    }, 1000);
}
updateTimerUI() {
    const r = document.getElementById('redTime');
    const b = document.getElementById('blackTime');

    if (r) r.textContent = this.formatTime(this.redTime);
    if (b) b.textContent = this.formatTime(this.blackTime);
}

formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

    // ========== HOÀN TÁC NƯỚC ĐI ==========
    diChuyenQuanCoTam(hangDich, cotDich) {
    if (!this.selectedPiece) return;

    const quanCo = this.selectedPiece.element;
    const hangDau = this.selectedPiece.hang;
    const cotDau = this.selectedPiece.cot;

    const oCoDau = this.layOCo(hangDau, cotDau);
    const oCoDich = this.layOCo(hangDich, cotDich);
    if (!oCoDau || !oCoDich) return;

    // ăn quân nếu có
    const biAn = this.layQuanTai(hangDich, cotDich);
    if (biAn && biAn !== quanCo) {
        this.activePieces = this.activePieces.filter(p => p.element !== biAn);
        biAn.remove();
    }

    oCoDau.removeChild(quanCo);
    oCoDich.appendChild(quanCo);

    quanCo.dataset.hang = hangDich;
    quanCo.dataset.cot = cotDich;

    const piece = this.activePieces.find(p => p.element === quanCo);
    if (piece) {
        piece.hang = hangDich;
        piece.cot = cotDich;
    }
}

    
    hoanTacNuocDi() {
        this.dangHoanTac = true;

    if (this.moveHistory.length === 0) {
        this.hienThiThongBao("⚠️ Không có nước đi để hoàn tác!", "warning");
        return;
    }

    // 1. Bỏ nước đi cuối
    const savedMoves = this.moveHistory.slice(0, -1);

    // 2. Reset game hoàn toàn
    this.currentPlayer = 'red';
    this.selectedPiece = null;
    this.validMoves = [];
    this.moveCount = 0;
    this.moveHistory = [];
    this.capturedPieces = { red: [], black: [] };
    this.gameActive = true;
    this.isCheck = false;

    this.boardElement.innerHTML = '';
    this.activePieces = [];
    this.taoBanCo();
    this.datQuanCo(true);


    // 3. Chạy lại các nước đi cũ (KHÔNG ghi lịch sử)
    savedMoves.forEach(move => {
        const [fromCol, fromRow] = move.tu.split('');
        const [toCol, toRow] = move.den.split('');

        const cotChu = ['A','B','C','D','E','F','G','H','I'];

        const hangDau = 9 - parseInt(fromRow);
        const cotDau = cotChu.indexOf(fromCol);
        const hangDich = 9 - parseInt(toRow);
        const cotDich = cotChu.indexOf(toCol);

        const quan = this.layQuanTai(hangDau, cotDau);
        if (!quan) return;

        this.selectedPiece = {
            element: quan,
            loai: quan.dataset.loai,
            mau: quan.dataset.mau,
            hang: hangDau,
            cot: cotDau
        };

        
       this.diChuyenQuanCoTam(hangDich, cotDich, false);

    }

);

    // 🔥 KHÔI PHỤC LỊCH SỬ & LƯỢT
this.moveHistory = savedMoves;
this.moveCount = savedMoves.length;
this.currentPlayer = savedMoves.length % 2 === 0 ? 'red' : 'black';

this.capNhatLichSu();
this.capNhatHienThi();

this.hienThiThongBao("⏮️ Đã hoàn tác 1 nước đi", "success");

}
// Hàm xử lý xin hòa
offerDraw() {
    if (!this.gameActive) {
        this.hienThiThongBao("⚠️ Ván cờ đã kết thúc!", "warning");
        return;
    }
    
    const playerName = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
    const confirmDraw = confirm(
        `Bạn có muốn xin hòa?\n\n` +
        `Người chơi ${playerName} xin hòa.`
    );
    
    if (confirmDraw) {
        this.ketThucGame('draw');
    }
}

// Hàm kết thúc hòa
ketThucGame(nguoiThang) {
    this.gameActive = false;
    
    // Stop timer if running
    if (typeof stopTimer === 'function') {
        stopTimer();
    }
    
    if (nguoiThang === 'draw') {
        this.hienThiThongBao("🤝 VÁN CỜ HÒA!", "info");
        this.hienThiKetQua('draw');
    } else {
        const tenNguoiThang = nguoiThang === 'red' ? 'ĐỎ' : 'ĐEN';
        
        this.hienThiThongBao(`🏆 CHIẾN THẮNG! ${tenNguoiThang} ĐÃ CHIẾN THẮNG!`, "success");
        this.hienThiPhaoHoa();
        this.hienThiKetQua(nguoiThang);
    }
}

// Cập nhật hàm hiển thị kết quả
hienThiKetQua(nguoiThang) {
    // Hỗ trợ cả 2 loại ID (camelCase và kebab-case) để tương thích với HTML
    let modal = document.getElementById('resultModal') || document.getElementById('result-modal');
    
    if (!modal) {
        console.error("❌ Không tìm thấy modal kết quả!");
        alert(`🏆 KẾT THÚC: ${nguoiThang === 'red' ? 'ĐỎ' : 'ĐEN'} CHIẾN THẮNG!`);
        return;
    }
    
    const icon = modal.querySelector('#resultIcon') || modal.querySelector('#result-icon');
    const message = modal.querySelector('#resultMessage') || modal.querySelector('#result-message');
    const details = modal.querySelector('#resultDetails') || modal.querySelector('#result-details');
    
    if (nguoiThang === 'red') {
        icon.innerHTML = '<i class="fas fa-crown" style="color: #C62828;"></i>';
        message.textContent = 'ĐỎ CHIẾN THẮNG!';
        message.style.color = '#C62828';
        details.textContent = `Sau ${this.moveHistory.length} nước đi`;
    } else if (nguoiThang === 'black') {
        icon.innerHTML = '<i class="fas fa-crown" style="color: #212121;"></i>';
        message.textContent = 'ĐEN CHIẾN THẮNG!';
        message.style.color = '#212121';
        details.textContent = `Sau ${this.moveHistory.length} nước đi`;
    } else if (nguoiThang === 'draw') {
        icon.innerHTML = '<i class="fas fa-handshake" style="color: #FF9800;"></i>';
        message.textContent = 'VÁN CỜ HÒA!';
        message.style.color = '#FF9800';
        details.textContent = `Sau ${this.moveHistory.length} nước đi - Cả hai đều thi đấu xuất sắc!`;
    }
    
    modal.style.display = 'flex';
}

    showHint() {
    if (!this.gameActive || !this.currentPlayer) {
        this.hienThiThongBao("⚠️ Ván cờ chưa bắt đầu!", "warning");
        return;
    }
    
    // Lấy tất cả quân của người chơi hiện tại
    const currentPlayerPieces = this.activePieces.filter(p => p.mau === this.currentPlayer);
    
    if (currentPlayerPieces.length === 0) {
        this.hienThiThongBao("⚠️ Không có quân nào để di chuyển!", "warning");
        return;
    }
    
    // Chọn ngẫu nhiên một quân
    const randomPiece = currentPlayerPieces[Math.floor(Math.random() * currentPlayerPieces.length)];
    
    // Tính nước đi hợp lệ của quân đó
    const validMoves = this.tinhNuocDiTam(
        randomPiece.loai,
        randomPiece.hang,
        randomPiece.cot,
        randomPiece.mau
    );
    
    if (validMoves.length === 0) {
        this.hienThiThongBao("⚠️ Quân này không có nước đi hợp lệ!", "warning");
        return;
    }
    
    // Chọn ngẫu nhiên một nước đi
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    
    const pieceNames = {
        '帥': 'Tướng Đỏ', '將': 'Tướng Đen',
        '仕': 'Sĩ Đỏ', '士': 'Sĩ Đen',
        '相': 'Tượng Đỏ', '象': 'Tượng Đen',
        '馬': 'Mã Đỏ', '傌': 'Mã Đen',
        '車': 'Xe Đỏ', '俥': 'Xe Đen',
        '炮': 'Pháo Đỏ', '砲': 'Pháo Đen',
        '兵': 'Binh Đỏ', '卒': 'Tốt Đen'
    };
    
    const pieceName = pieceNames[randomPiece.loai] || randomPiece.loai;
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const fromNotation = `${columns[randomPiece.cot]}${9 - randomPiece.hang}`;
    const toNotation = `${columns[randomMove.cot]}${9 - randomMove.hang}`;
    
    this.hienThiThongBao(
        `💡 Gợi ý: Di chuyển ${pieceName} từ ${fromNotation} đến ${toNotation}`,
        "info"
    );
    
    // Highlight quân và nước đi gợi ý
    this.boChon();

    randomPiece.element.classList.add('selected');
    
    // Highlight nước đi gợi ý
    const targetSquare = this.layOCo(randomMove.hang, randomMove.cot);
    if (targetSquare) {
        targetSquare.classList.add('hint-move');
        
        // Tự động xóa highlight sau 3 giây
        setTimeout(() => {
            randomPiece.element.classList.remove('selected');
            targetSquare.classList.remove('hint-move');
        }, 3000);
    }
}
    // ========== ĐẦU HÀNG ==========
    
    dauHang() {
        if (!this.gameActive) {
            this.hienThiThongBao("⚠️ Ván cờ đã kết thúc!", "warning");
            return;
        }
        
        const playerName = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
        const confirmSurrender = confirm(
            `Bạn có chắc chắn muốn đầu hàng?\n\n` +
            `Người chơi ${playerName} sẽ thua cuộc!`
        );
        
        if (confirmSurrender) {
            // Người thắng là đối thủ
            const nguoiThang = this.currentPlayer === 'red' ? 'black' : 'red';
            const tenNguoiThang = nguoiThang === 'red' ? 'ĐỎ' : 'ĐEN';
            const tenNguoiThua = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
            
            this.hienThiThongBao(`🏆 ${tenNguoiThang} CHIẾN THẮNG! ${tenNguoiThua} đã đầu hàng!`, "success");
            this.ketThucGame(nguoiThang);
            
            // Tự động reset sau 2 giây
            setTimeout(() => {
                this.resetGame();
            }, 2000);
        }
    }
    
    // ========== BỎ CHỌN QUÂN ==========
    
    boChon() {
        // Bỏ highlight quân được chọn
        if (this.selectedPiece && this.selectedPiece.element) {
            this.selectedPiece.element.classList.remove('selected');
        }
        
        // Xóa dữ liệu
        this.selectedPiece = null;
        this.validMoves = [];
        
        // Xóa highlight nước đi hợp lệ
        this.xoaHighlightNuocDi();
    }
    
    // ========== HIỂN THỊ NƯỚC ĐI HỢP LỆ ==========
    
    hienThiNuocDiHopLe() {
        this.xoaHighlightNuocDi();
        
        this.validMoves.forEach(move => {
            const oCo = this.layOCo(move.hang, move.cot);
            if (oCo) {
                oCo.classList.add('valid-move');
                if (move.laAnQuan) {
                    oCo.classList.add('capture');
                }
            }
        });
    }
    
    xoaHighlightNuocDi() {
        document.querySelectorAll('.valid-move').forEach(oCo => {
            oCo.classList.remove('valid-move', 'capture');
        });
    }
    
    hienThiThongBao(message, type = 
        'info') {
        if (typeof toastr !== 'undefined') {
            if (type === 'success') toastr.success(message);
            else if (type === 'error') toastr.error(message);
            else if (type === 'warning') toastr.warning(message);
            else toastr.info(message);
        } else {
            console.log(`${type}: ${message}`);
        }
    }
    
    // ========== UTILITIES ==========
    
    layOCo(hang, cot) {
        return document.querySelector(`.board-square[data-hang="${hang}"][data-cot="${cot}"]`);
    }
    
    layQuanTai(hang, cot) {
        const oCo = this.layOCo(hang, cot);
        if (!oCo) return null;
        return oCo.querySelector('.quan-co');
    }
    
    coQuanTai(hang, cot) {
        return !!this.layQuanTai(hang, cot);
    }
    
    viTriHopLe(hang, cot) {
        return hang >= 0 && hang < 10 && cot >= 0 && cot < 9;
    }
    
    trongCung(hang, cot, mau) {
        if (!this.viTriHopLe(hang, cot)) return false;
        
        if (mau === 'red') {
            // Cung đỏ (hàng 7-9, cột 3-5)
            return hang >= 7 && hang <= 9 && cot >= 3 && cot <= 5;
        } else {
            // Cung đen (hàng 0-2, cột 3-5)
            return hang >= 0 && hang <= 2 && cot >= 3 && cot <= 5;
        }
    }
}

// ========== KHỞI TẠO GAME =========

document.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 Khởi động Cờ Tướng Online...");

    if (!window.coTuongGame) {
        window.coTuongGame = new CoTuongHoanChinh();
    }

    console.log("✅ Game ready:", window.coTuongGame);
    console.log("✅ Cờ Tướng sẵn sàng!");
});


// ========== GLOBAL BUTTON FUNCTIONS ==========

// 1. VÁN MỚI
window.newGame = function() {
    console.log("🔄 newGame() called globally");
    if (window.coTuongGame) {
        // Kiểm tra nếu đang chơi dở
        if (window.coTuongGame.gameActive && window.coTuongGame.moveHistory.length > 0) {
            if (!confirm("Ván cờ đang diễn ra. Bạn có chắc muốn chơi ván mới?")) {
                return;
            }
        }
        window.coTuongGame.resetGame();
        if (typeof toastr !== 'undefined') {
            toastr.success("Ván mới bắt đầu! ĐỎ đi trước", "success");
        }
    } else {
        console.error("coTuongGame is not initialized!");
        alert("Game chưa sẵn sàng!");
    }
};

// 2. LÙI NƯỚC
window.undoMove = function() {
    console.log("⏪ undoMove() called globally");
    if (window.coTuongGame && typeof window.coTuongGame.hoanTacNuocDi === 'function') {
        window.coTuongGame.hoanTacNuocDi();
    } else {
        console.error("coTuongGame or hoanTacNuocDi not found!");
        alert("Chức năng lùi nước chưa sẵn sàng!");
    }
};

// 3. GỢI Ý
window.showHint = function() {
    console.log("💡 showHint() called globally");
    if (window.coTuongGame && typeof window.coTuongGame.showHint === 'function') {
        window.coTuongGame.showHint();
    } else if (window.coTuongGame) {
        window.coTuongGame.hienThiThongBao("💡 Chọn một quân cờ để xem nước đi hợp lệ!", "info");
    } else {
        console.error("coTuongGame not found!");
        alert("Game chưa sẵn sàng!");
    }
};

// 4. XIN HÒA
window.offerDraw = function() {
    console.log("🤝 offerDraw() called globally");
    if (window.coTuongGame && typeof window.coTuongGame.offerDraw === 'function') {
        window.coTuongGame.offerDraw();
    } else if (window.coTuongGame) {
        if (confirm("Bạn có muốn xin hòa?")) {
            window.coTuongGame.hienThiThongBao("🤝 Đã gửi yêu cầu hòa!", "info");
        }
    } else {
        console.error("coTuongGame not found!");
        alert("Game chưa sẵn sàng!");
    }
};

// 5. ĐẦU HÀNG
window.surrender = function() {
    console.log("🏳️ surrender() called globally");
    if (window.coTuongGame && typeof window.coTuongGame.dauHang === 'function') {
        window.coTuongGame.dauHang();
    } else if (window.coTuongGame) {
        if (confirm("Bạn có chắc muốn đầu hàng?")) {
            window.coTuongGame.hienThiThongBao("🏳️ Bạn đã đầu hàng!", "warning");
            // Tự động reset game sau 2 giây
            setTimeout(() => {
                if (window.coTuongGame && typeof window.coTuongGame.resetGame === 'function') {
                    window.coTuongGame.resetGame();
                }
            }, 2000);
        }
    } else {
        console.error("coTuongGame not found!");
        alert("Game chưa sẵn sàng!");
    }
};

// ========== KIỂM TRA KHI DOM LOAD ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 DOM Content Loaded - Initializing game...");
    
    // Tạo game instance
    setTimeout(() => {
        if (!window.coTuongGame) {
            window.coTuongGame = new CoTuongHoanChinh();
            console.log("✅ Game initialized:", window.coTuongGame);
        }
        
        // Test các hàm
        console.log("=== TESTING GLOBAL FUNCTIONS ===");
        console.log("window.newGame:", typeof window.newGame);
        console.log("window.undoMove:", typeof window.undoMove);
        console.log("window.showHint:", typeof window.showHint);
        console.log("window.offerDraw:", typeof window.offerDraw);
        console.log("window.surrender:", typeof window.surrender);
        
        // Thêm sự kiện test cho các nút
        const buttons = document.querySelectorAll('.game-controls button');
        buttons.forEach(btn => {
            const originalClick = btn.onclick;
            btn.onclick = function(e) {
                console.log(`Button clicked: ${btn.textContent.trim()}`);
                if (originalClick) {
                    originalClick.call(this, e);
                }
            };
        });
        
        // Hiển thị thông báo
        if (typeof toastr !== 'undefined') {
            toastr.success("Game đã sẵn sàng! Click vào quân cờ để bắt đầu.", "success");
        }
    }, 1000);
});

// ========== AI CONTROL FUNCTIONS ==========

// 6. BẮT ĐẦU CHẾ ĐỘ TỰ ĐỘNG CHƠI (AI vs AI)
window.startAutoPlay = function() {
    if (window.coTuongGame) {
        window.coTuongGame.isAutoPlay = true;
        window.coTuongGame.aiLevel = 3; // Mặc định cấp 3
        window.coTuongGame.resetGame();
        console.log("🤖 Đã bật chế độ Tự Động Chơi (AI vs AI)");
    }
};

// 7. BẮT ĐẦU CHẾ ĐỘ ĐẤU VỚI MÁY (PvE)
window.startPvE = function(level = 3, color = 'black') {
    if (window.coTuongGame) {
        window.coTuongGame.playWithAI = true;
        window.coTuongGame.aiColor = color;
        window.coTuongGame.aiLevel = level;
        window.coTuongGame.isAutoPlay = false;
        window.coTuongGame.resetGame();
        console.log(`🤖 Đã bật chế độ Đấu với Máy (Cấp ${level})`);
    }
};
