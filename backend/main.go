package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/skip2/go-qrcode"
)

type QRRequest struct {
	Amount int    `json:"amount"`
	Note   string `json:"note"`
}

type QRResponse struct {
	QRUrl string `json:"qr_url"`
}

func main() {
	http.HandleFunc("/generate-qr", generateQRHandler)
	fmt.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func generateQRHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req QRRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Thông tin ngân hàng
	bankID := "VCB"                     // Vietcombank
	accountNo := "0123456789"           // STK ngân hàng
	accountName := "NGUYEN VAN A"       // Tên chủ TK
	amount := strconv.Itoa(req.Amount)  // Số tiền
	addInfo := req.Note                 // Nội dung CK

	// Link VietQR (theo tiêu chuẩn Napas)
	// Có thể đổi sang API VietQR chính thức nếu muốn
	qrContent := fmt.Sprintf("https://img.vietqr.io/image/%s-%s-qr_only.png?amount=%s&addInfo=%s&accountName=%s",
		bankID, accountNo, amount, addInfo, accountName)

	// Tạo ảnh QR từ link
	pngData, err := qrcode.Encode(qrContent, qrcode.Medium, 256)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Encode base64 để trả về
	base64Image := "data:image/png;base64," + base64.StdEncoding.EncodeToString(pngData)

	json.NewEncoder(w).Encode(QRResponse{
		QRUrl: base64Image,
	})
}
