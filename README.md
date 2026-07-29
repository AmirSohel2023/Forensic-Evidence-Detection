

# ForensicAI: An Agentic Multi-Agent Framework for Automated Crime Scene Detection and Analysis Using YOLOv11

## Overview

**ForensicAI** is an intelligent crime scene investigation system that leverages **YOLOv11-based object detection**, **multi-agent AI architecture**, and **automated forensic reporting** to assist law enforcement and forensic experts in identifying and documenting critical evidence from crime scene images.

The system automatically detects potential forensic evidence such as weapons, blood stains, biological traces, and other suspicious objects from uploaded images or live camera feeds. It then generates detailed forensic analysis reports to support crime scene investigations.

 Live Demo: https://yolo-ai-crimescene-analysis.netlify.app



---

## Key Features

### AI-Powered Evidence Detection

* Real-time object detection using YOLOv11
* Detection of forensic evidence including:

  * Knives
  * Firearms
  * Blood stains
  * Biological evidence
  * Crime scene objects

### Live Camera Analysis

* Capture images directly from device camera
* Instant AI-based crime scene analysis
* Real-time evidence identification

### Automated Forensic Reporting

* Professional PDF report generation
* Evidence cataloging
* Detection confidence scores
* Crime scene metadata documentation
* Chain-of-custody support information

### Multi-Agent Framework

The system employs multiple AI agents responsible for:

* Evidence Detection Agent
* Scene Analysis Agent
* Report Generation Agent
* Evidence Classification Agent
* Decision Support Agent

### Evidence Database Management

* SQLite-based storage
* Detection history tracking
* Evidence retrieval and review

---

## System Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Flask REST API
 │
 ▼
YOLOv11 Detection Engine
 │
 ├── Evidence Detection Agent
 ├── Classification Agent
 ├── Analysis Agent
 └── Report Generation Agent
 │
 ▼
SQLite Database
 │
 ▼
Forensic PDF Report
```

---

## Technology Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS


### Backend

* Flask
* Flask-CORS
* SQLite

### AI & Machine Learning

* YOLOv11 (Ultralytics)
* OpenCV
* PyTorch

### Report Generation

* jsPDF

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```text
Final_Year_Project
│
├── Backend
│   ├── app.py
│   ├── best.pt
│   ├── requirements.txt
│   ├── uploads/
│   └── detections.db
│
├── project
│   ├── src
│   │   ├── components
│   │   │   ├── CameraCapture.tsx
│   │   │   ├── DetectionResults.tsx
│   │   │   ├── ForensicReport.tsx
│   │   │   └── LoadingAnalysis.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## Installation

### Backend Setup

```bash
cd Backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Backend runs at:

```text
http://127.0.0.1:5000
```

---

### Frontend Setup

```bash
cd project

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## API Endpoints

### Detect Evidence

```http
POST /predict
```

Upload an image and receive detected forensic evidence.

### Retrieve Detection History

```http
GET /detections
```

Returns all stored detection records.

---

## Research Contributions

This project introduces an **Agentic Multi-Agent Framework** that integrates advanced computer vision and forensic intelligence to:

* Automate crime scene evidence detection
* Reduce manual forensic workload
* Improve investigation efficiency
* Provide standardized forensic reporting
* Support digital evidence management

---

## Future Enhancements

* Video crime scene analysis
* Multi-camera surveillance integration
* Face anonymization
* Fingerprint detection
* DNA evidence analysis support
* Cloud-based evidence storage
* Generative AI-powered forensic insights

---

## Authors

**Amir Sohel**
Final Year Project
Department of Computer Science & Engineering

---

## License

This project is developed for academic and research purposes. Use responsibly and in compliance with local laws and forensic investigation guidelines.

---

#

> **ForensicAI: An Agentic Multi-Agent Framework for Automated Crime Scene Detection and Analysis Using YOLOv11. A full-stack AI-powered forensic investigation system for real-time evidence detection, crime scene analysis, and automated forensic report generation.**

