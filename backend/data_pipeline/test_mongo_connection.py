import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)
MONGO_URI = os.getenv('MONGO_URI')

try:
    client = MongoClient(
        MONGO_URI, 
        serverSelectionTimeoutMS=5000,
        tlsCAFile=certifi.where()
    )
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print('✅ Successfully connected to MongoDB Atlas!')
    print(f'📊 Available databases: {client.list_database_names()}')
except Exception as e:
    print(f'❌ Connection failed: {e}')
