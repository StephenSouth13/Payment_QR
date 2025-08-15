package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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
	http.HandleFunc("/generate-qr", handleGenerateQR)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🚀 Backend running at http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleGenerateQR(w http.ResponseWriter, r *http.Request) {
	// CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req QRRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Thông tin tài khoản MB Bank
	bankCode := "970422"                      // Mã ngân hàng MB theo NAPAS
	accountNumber := "0001244698984"          // STK của bạn
	accountName := "QUACH THANH LONG"         // Tên chủ tài khoản
	amount := req.Amount                      // Số tiền
	addInfo := req.Note                       // Nội dung chuyển khoản

	// Link VietQR chính thức
	// Tham khảo: https://vietqr.net
	// Ví dụ: https://img.vietqr.io/image/{bank}-{account}-compact2.png?amount={amount}&addInfo={note}
	vietQRLink := fmt.Sprintf(
		"https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s",
		bankCode, accountNumber, amount, addInfo, accountName,
	)

	// Tạo QR code base64 từ link VietQR
	qrBytes, err := qrcode.Encode(vietQRLink, qrcode.Medium, 256)
	if err != nil {
		http.Error(w, "Error generating QR", http.StatusInternalServerError)
		return
	}

	base64Image := base64.StdEncoding.EncodeToString(qrBytes)
	qrDataURL := "data:image/png;base64," + base64Image

	resp := QRResponse{QRUrl: qrDataURL}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
