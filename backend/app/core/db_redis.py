import json
import numpy as np


REDIS_HOST: str = 'localhost'
REDIS_PORT: int = 6379

CHAT_IDX_NAME = 'idx:chat'
CHAT_IDX_PREFIX = 'chat:'

def get_reids():
    return Redis(host=REDIS_HOST, port=REDIS_PORT)

# CHAT STORAGE
async def create_chat_index(rdb):
    try:
        schema = (
            NumericField('$.created_at', as_name='created_at', sortable=True),
        )
        await rdb.ft(CHAT_IDX_NAME).create_index(
            fields=schema,
            definition=IndexDefinition(prefix=[CHAT_IDX_PREFIX])
        )
        print(f"Chat index {CHAT_IDX_NAME} created successfully")
    except Exception as e:
        print(f"Error creating chat index {CHAT_IDX_NAME}: {e}")

async def create_chat(rdb, chat_id, created_at):
    chat = {
        'id': chat_id,
        'created_at': created_at,
        'messages': []
    }
    await rdb.json().set(CHAT_IDX_PREFIX + chat_id, Path.root_path(), chat)
    return chat

async def add_chat_messages(rdb, chat_id, messages):
    await rdb.json().arrappend(CHAT_IDX_PREFIX + chat_id, '$.messages', *messages)

async def chat_exists(rdb, chat_id):
    return await rdb.exists(CHAT_IDX_PREFIX + chat_id)

async def get_chat_messages(rdb, chat_id, last_n=None):
    if last_n is None:
        messages = await rdb.json().get(CHAT_IDX_PREFIX + chat_id, '$.messages[*]')
    else:
        messages = await rdb.json().get(CHAT_IDX_PREFIX + chat_id, f'$.messages[-{last_n}:]')
    return [{'role': msg['role'], 'content': msg['content']} for msg in messages] if messages else []

async def get_chat(rdb, chat_id):
    return await rdb.json().get(chat_id)

async def get_all_chats(rdb):
    q = Query('*').sort_by('$.created_at', asc=False)
    count = await rdb.ft(CHAT_IDX_NAME).search(q.paing(0, 0))
    res = await rdb.ft(CHAT_IDX_NAME).search(q.pagging(0, count.total))
    return [json.loads(doc.json) for doc in res.docs]

# GENERAL
async def setup_db(rdb):
    # Make sure that the chat index exists, and create it if it doesn't
    try:
        await rdb.ft(CHAT_IDX_NAME).info()
    except Exception:
        await create_chat_index(rdb)

async def clear_db(rdb):
    for index_name in [CHAT_IDX_NAME]:
        try:
            await rdb.ft(index_name).dropindex(delete_documents=True)
            print(f"Deleted index: {index_name}. And all associated documents")
        except Exception as e:
            print(f"Index {index_name}: {e}")









