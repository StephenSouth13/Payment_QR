Payment_QR — Automatic Payment QR Code Generator

Payment_QR is a Go-based backend service that automatically generates payment QR codes based on order details.
The system calculates the total amount and payment note when the customer confirms a purchase, then generates a QR code following the VietQR / Napas standard or an e-wallet payment link.

Key Features

✅ Automatic QR code generation after order confirmation.

✅ Supports dynamic parameters: amount, payment note, order ID.

✅ Integrates with VietQR to support most Vietnamese banks.

✅ RESTful API to receive order data and return QR code URLs or image files.

✅ Easy integration with e-commerce frontends (Next.js, React, Vue, etc.).

Workflow

The customer places an order on the website.

Payment_QR backend receives the order data (total amount, note, bank info).

The system generates a VietQR link and converts it into a QR code image.

The result is sent back to the frontend for the customer to scan and pay.

Tech Stack

Language: Go

QR Code Library: skip2/go-qrcode or boombuler/barcode

API Standard: RESTful JSON responses

QR Standard: VietQR / Napas

Deployment: Docker-ready, compatible with cloud hosting