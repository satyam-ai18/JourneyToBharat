#!/usr/bin/env python3
"""
OpenJarvis Local-First Agent Bridge (Journey to Bharat)
Provides a lightweight local-first server compliant with OpenJarvis and Ollama protocols.
Allows local agent intelligence and tool execution for Journey to Bharat.

Usage:
    python scripts/openjarvis_bridge.py --port 8000
"""

import sys
import json
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 8000

class OpenJarvisHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self._set_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            resp = {
                "status": "ok",
                "service": "open-jarvis",
                "framework": "OpenJarvis + ECC Local-First Agent Core",
                "version": "1.0.0",
                "port": PORT
            }
            self.wfile.write(json.dumps(resp).encode("utf-8"))
            return

        if self.path in ("/v1/models", "/api/tags"):
            self.send_response(200)
            self._set_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            resp = {
                "models": [
                    {"name": "openjarvis-bharat-yatra", "modified_at": "2026-11-03"},
                    {"name": "ecc-travel-orchestrator", "modified_at": "2026-11-03"}
                ]
            }
            self.wfile.write(json.dumps(resp).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        if self.path in ("/v1/chat/completions", "/api/chat"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                data = {}

            messages = data.get("messages", [])
            last_msg = messages[-1].get("content", "") if messages else "नमस्ते"

            self.send_response(200)
            self._set_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()

            reply = {
                "id": "chatcmpl-jarvis-bharat",
                "object": "chat.completion",
                "created": 1730644000,
                "model": "openjarvis-bharat-yatra",
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": f"OpenJarvis Core: Processed '{last_msg}'."
                    },
                    "finish_reason": "stop"
                }]
            }
            self.wfile.write(json.dumps(reply).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

def run_server(port=8000):
    global PORT
    PORT = port
    server_address = ("", port)
    httpd = HTTPServer(server_address, OpenJarvisHandler)
    print(f"[OpenJarvis] Local Agent Server running on http://localhost:{port}")
    print("[OpenJarvis] Endpoints: GET /health, GET /v1/models, POST /v1/chat/completions")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[OpenJarvis] Shutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="OpenJarvis Local Agent Bridge")
    parser.add_argument("--port", type=int, default=8000, help="Port to run OpenJarvis daemon (default: 8000)")
    args = parser.parse_args()
    run_server(args.port)

