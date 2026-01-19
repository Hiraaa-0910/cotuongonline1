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
        this.checkingPiece = null;
        
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
        this.capNhatHienThi();
        
        this.hienThiThongBao("🎮 Bắt đầu ván cờ! ĐỎ đi trước.", "success");
    }
    
    // ========== TẠO BÀN CỜ ==========
    
    taoBanCo() {
        this.boardElement.innerHTML = '';
        this.activePieces = [];
        
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
    }
    
    // ========== ĐẶT QUÂN CỜ BAN ĐẦU ==========
    
    datQuanCo() {
        // Vị trí quân cờ chuẩn theo luật cờ tướng
        const viTriBanDau = [
            // ĐỎ (phía dưới - hàng 6-9)
            ['車', 9, 0, 'red'], ['馬', 9, 1, 'red'], ['相', 9, 2, 'red'],
            ['仕', 9, 3, 'red'], ['帥', 9, 4, 'red'], ['仕', 9, 5, 'red'],
            ['相', 9, 6, 'red'], ['馬', 9, 7, 'red'], ['車', 9, 8, 'red'],
            ['炮', 7, 1, 'red'], ['炮', 7, 7, 'red'],
            ['兵', 6, 0, 'red'], ['兵', 6, 2, 'red'], ['兵', 6, 4, 'red'],
            ['兵', 6, 6, 'red'], ['兵', 6, 8, 'red'],
            
            // ĐEN (phía trên - hàng 0-3)
            ['俥', 0, 0, 'black'], ['傌', 0, 1, 'black'], ['象', 0, 2, 'black'],
            ['士', 0, 3, 'black'], ['將', 0, 4, 'black'], ['士', 0, 5, 'black'],
            ['象', 0, 6, 'black'], ['傌', 0, 7, 'black'], ['俥', 0, 8, 'black'],
            ['砲', 2, 1, 'black'], ['砲', 2, 7, 'black'],
            ['卒', 3, 0, 'black'], ['卒', 3, 2, 'black'], ['卒', 3, 4, 'black'],
            ['卒', 3, 6, 'black'], ['卒', 3, 8, 'black']
        ];
        
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
    
    thietLapSuKien() {
        // Click vào quân cờ
        this.boardElement.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const quanCo = e.target.closest('.quan-co');
            if (quanCo) {
                this.xuLyClickQuanCo(quanCo);
                return;
            }
            
            // Click vào ô cờ
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
        
        // Chỉ được chọn quân của mình
        if (mau !== this.currentPlayer) {
            this.hienThiThongBao(`⚠️ Không phải lượt của ${mau === 'red' ? 'ĐỎ' : 'ĐEN'}!`, "warning");
            return;
        }
        
        // Nếu click lại quân đang chọn thì bỏ chọn
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
                        quanBiAn: quanTaiViTri 
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
                            quanBiAn: quanTaiViTri 
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
        if (quanTaiViTri && quanTaiViTri.dataset.mau !== mau) {
            // Là quân địch - có thể ăn
            this.validMoves.push({ 
                hang, 
                cot, 
                laAnQuan: true,
                quanBiAn: quanTaiViTri 
            });
        }
        // Nếu là quân cùng màu, KHÔNG thêm nước đi
    } else {
        // Ô trống - thêm nước đi bình thường
        this.validMoves.push({ 
            hang, 
            cot, 
            laAnQuan: false 
        });
    }
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
        
        // Tìm nước đi trong danh sách hợp lệ
        const nuocDi = this.validMoves.find(m => 
            m.hang === hangDich && m.cot === cotDich
        );
        
        if (!nuocDi) {
            this.hienThiThongBao("❌ Nước đi không hợp lệ!", "error");
            return;
        }
        
        console.log(`🎯 Di chuyển ${this.pieceNames[loaiQuan]} từ [${hangDau},${cotDau}] đến [${hangDich},${cotDich}]`);
        
        // XỬ LÝ ĂN QUÂN TRƯỚC KHI DI CHUYỂN
        if (nuocDi.laAnQuan && nuocDi.quanBiAn) {
            console.log(`⚔️ Ăn quân tại [${hangDich},${cotDich}]`);
            this.anQuan(nuocDi.quanBiAn);
        }
        
        // Lấy ô đích và ô đầu
        const oCoDich = this.layOCo(hangDich, cotDich);
        const oCoDau = this.layOCo(hangDau, cotDau);
        
        if (!oCoDich || !oCoDau) {
            console.error("❌ Không tìm thấy ô cờ!");
            return;
        }
        
        // Xóa quân khỏi ô đầu
        if (quanCo.parentNode === oCoDau) {
            oCoDau.removeChild(quanCo);
        }
        
        // Thêm quân vào ô đích
        oCoDich.appendChild(quanCo);
        
        // Cập nhật dữ liệu
        quanCo.dataset.hang = hangDich;
        quanCo.dataset.cot = cotDich;
        
        // Cập nhật trong activePieces
        const pieceIndex = this.activePieces.findIndex(p => p.element === quanCo);
        if (pieceIndex !== -1) {
            this.activePieces[pieceIndex].hang = hangDich;
            this.activePieces[pieceIndex].cot = cotDich;
        }
        
        // GHI LỊCH SỬ
        this.ghiLichSu(hangDau, cotDau, hangDich, cotDich, nuocDi.laAnQuan);
        
        // ĐỔI LƯỢT TỰ ĐỘNG
        this.doiLuot();
        
        // BỎ CHỌN QUÂN
        this.boChon();
        
        // KIỂM TRA CHIẾU TƯỚNG
        this.kiemTraChieuTuong();
    }
    
    // ========== ĂN QUÂN ==========
    
    anQuan(quanBiAn) {
        if (!quanBiAn) {
            console.error("❌ Không có quân để ăn!");
            return;
        }
        
        const mau = quanBiAn.dataset.mau;
        const loaiQuan = quanBiAn.dataset.loai;
        const hang = parseInt(quanBiAn.dataset.hang);
        const cot = parseInt(quanBiAn.dataset.cot);
        
        console.log(`🍖 Ăn quân: ${this.pieceNames[loaiQuan]} (${mau}) tại [${hang},${cot}]`);
        
        // Thêm vào danh sách quân bị ăn
        this.capturedPieces[mau].push({
            loai: loaiQuan,
            element: quanBiAn
        });
        
        // Hiển thị ở khu vực quân bị ăn (nếu có)
        const khuVucAn = mau === 'red' 
            ? document.getElementById('capturedRed')
            : document.getElementById('capturedBlack');
        
        if (khuVucAn) {
            const icon = document.createElement('div');
            icon.className = `captured-icon ${mau}-piece`;
            icon.textContent = loaiQuan;
            icon.title = this.pieceNames[loaiQuan];
            khuVucAn.appendChild(icon);
        }
        
        // Xóa khỏi activePieces
        this.activePieces = this.activePieces.filter(p => p.element !== quanBiAn);
        
        // Xóa khỏi DOM
        if (quanBiAn.parentNode) {
            quanBiAn.remove();
        }
        
        // Kiểm tra ăn TƯỚNG (kết thúc game)
        if (loaiQuan === '帥' || loaiQuan === '將') {
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
            this.hienThiThongBao("⚡ CHIẾU TƯỚNG ĐỎ!", "warning");
            
            // Kiểm tra chiếu bí
            if (this.kiemTraChieuBi('red')) {
                this.ketThucGame('black');
            }
        }
        
        if (coBiChieuDen && this.currentPlayer === 'black') {
            this.isCheck = true;
            this.hienThiThongBao("⚡ CHIẾU TƯỚNG ĐEN!", "warning");
            
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
        // Đổi lượt
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.moveCount++;
        
        // Cập nhật hiển thị
        this.capNhatHienThi();
        
        // Thông báo
        const playerName = this.currentPlayer === 'red' ? 'ĐỎ' : 'ĐEN';
        this.hienThiThongBao(`🔄 Lượt của ${playerName}`);
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
    
    // ========== KẾT THÚC GAME ==========
    
    ketThucGame(nguoiThang) {
        this.gameActive = false;
        
        const tenNguoiThang = nguoiThang === 'red' ? 'ĐỎ' : 'ĐEN';
        const tenNguoiThua = nguoiThang === 'red' ? 'ĐEN' : 'ĐỎ';
        
        this.hienThiThongBao(`🏆 CHIẾN THẮNG! ${tenNguoiThang} thắng! ${tenNguoiThua} bị CHIẾU BÍ!`, "success");
        
        this.hienThiKetQua(nguoiThang);
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
    
    // ========== RESET GAME ==========
    
    resetGame() {
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveCount = 0;
        this.moveHistory = [];
        this.capturedPieces = { red: [], black: [] };
        this.gameActive = true;
        this.isCheck = false;
        this.checkingPiece = null;
        
        // Xóa bàn cờ cũ
        this.taoBanCo();
        this.datQuanCo();
        
        // Xóa quân bị ăn
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
        const modal = document.getElementById('resultModal');
        if (modal) modal.style.display = 'none';
        
        this.hienThiThongBao("🔄 Bắt đầu ván mới! Đỏ đi trước.", "success");
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
    
    hienThiThongBao(message, type = 'info') {
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

// ========== KHỞI TẠO GAME ==========

let coTuongGame;

document.addEventListener('DOMContentLoaded', function() {
    console.log("🎮 Khởi động Cờ Tướng Online...");
    
    // Đợi DOM load hoàn tất
    setTimeout(() => {
        coTuongGame = new CoTuongHoanChinh();
        
        // Gắn sự kiện cho các nút
        const newGameBtn = document.querySelector('[onclick*="newGame"]');
        if (newGameBtn) {
            newGameBtn.onclick = function() {
                if (coTuongGame) {
                    coTuongGame.resetGame();
                }
            };
        }
        
        const hintBtn = document.querySelector('[onclick*="showHint"]');
        if (hintBtn) {
            hintBtn.onclick = function() {
                // Gợi ý nước đi
                if (coTuongGame && coTuongGame.gameActive) {
                    coTuongGame.hienThiThongBao("💡 Chọn quân để xem nước đi hợp lệ!");
                }
            };
        }
        
        console.log("✅ Cờ Tướng sẵn sàng!");
    }, 500);
});

// Export functions
window.newGame = function() {
    if (coTuongGame) coTuongGame.resetGame();
};

window.showHint = function() {
    if (coTuongGame && coTuongGame.gameActive) {
        coTuongGame.hienThiThongBao("💡 Di chuyển chuột vào quân cờ để xem tên, click để chọn!");
    }
};

window.undoMove = function() {
    if (coTuongGame) {
        coTuongGame.hienThiThongBao("⏪ Chức năng Undo đang phát triển!", "info");
    }
};

window.debugGame = function() {
    if (coTuongGame) {
        console.log("=== DEBUG GAME ===");
        console.log("Số quân trên bàn:", coTuongGame.activePieces.length);
        console.log("Lượt hiện tại:", coTuongGame.currentPlayer);
        console.log("Đang chiếu:", coTuongGame.isCheck);
        
        coTuongGame.activePieces.forEach((piece, index) => {
            console.log(`${index}: ${coTuongGame.pieceNames[piece.loai]} (${piece.mau}) tại [${piece.hang},${piece.cot}]`);
        });
    }
};