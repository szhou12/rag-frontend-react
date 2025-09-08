#!/usr/bin/env python3
"""
Simple test script for RAG endpoints
Run this after starting your FastAPI server
"""
import requests
import json

# Test configuration
BASE_URL = "http://localhost:8001"
RAG_ENDPOINT = f"{BASE_URL}/rag"

def test_rag_health():
    """Test RAG health endpoint"""
    print("🔍 Testing RAG health endpoint...")
    try:
        response = requests.get(f"{RAG_ENDPOINT}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_rag_simple():
    """Test simple RAG endpoint"""
    print("\n🔍 Testing simple RAG endpoint...")
    try:
        response = requests.post(f"{RAG_ENDPOINT}/test")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Simple test failed: {e}")
        return False

def test_rag_with_history():
    """Test RAG endpoint with chat history"""
    print("\n🔍 Testing RAG with chat history...")
    
    # Test payload
    payload = {
        "input": "What about solar panel efficiency?",
        "chat_history": [
            {"role": "human", "content": "Tell me about renewable energy"},
            {"role": "assistant", "content": "Renewable energy comes from sources like solar, wind, and hydro..."}
        ]
    }
    
    try:
        response = requests.post(
            f"{RAG_ENDPOINT}/answer",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Answer: {result['answer'][:200]}...")
            print(f"Context documents: {len(result.get('context', []))}")
        else:
            print(f"Error: {response.text}")
            
        return response.status_code == 200
    except Exception as e:
        print(f"❌ History test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing RAG Endpoints")
    print("=" * 50)
    
    # Run tests
    health_ok = test_rag_health()
    simple_ok = test_rag_simple()
    # history_ok = test_rag_with_history()  # This needs auth
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"✅ Health Check: {'PASS' if health_ok else 'FAIL'}")
    print(f"✅ Simple Test: {'PASS' if simple_ok else 'FAIL'}")
    # print(f"✅ History Test: {'PASS' if history_ok else 'FAIL'}")
    
    if health_ok and simple_ok:
        print("\n🎉 Basic RAG functionality is working!")
    else:
        print("\n❌ Some tests failed. Check your setup.")
