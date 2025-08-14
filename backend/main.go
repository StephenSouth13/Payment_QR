package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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

	fmt.Println("🚀 Backend running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleGenerateQR(w http.ResponseWriter, r *http.Request) {
	// Bật CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Xử lý preflight OPTIONS request
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

	// Giả lập nội dung thanh toán (ở đây chỉ tạo QR từ text)
	paymentInfo := fmt.Sprintf("Pay %d VND - Note: %s", req.Amount, req.Note)

	// Tạo QR code dạng base64
	qrBytes, err := qrcode.Encode(paymentInfo, qrcode.Medium, 256)
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
