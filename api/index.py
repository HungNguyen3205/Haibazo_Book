from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from database import get_db_connection
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataPayload(BaseModel):
    username: str = None
    title: str = None
    author: str = None
    book: str = None
    review: str = None

def get_table_name(category: str):
    mapping = {
        "auth": "users",     
        "book": "books",     
        "review": "reviews"
    }
    if category not in mapping:
        raise HTTPException(status_code=404, detail="Category not found")
    return mapping[category]

@app.get("/{category}/list")
def list_data(category: str):
    table = get_table_name(category)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM {table} ORDER BY id DESC")
    data = cur.fetchall()
    cur.close()
    conn.close()
    return data

@app.post("/{category}/create")
def create_data(category: str, payload: DataPayload):
    conn = get_db_connection()
    cur = conn.cursor()
    
    if category == "auth":
        cur.execute("INSERT INTO users (username) VALUES (%s)", (payload.username,))
    elif category == "book":
        cur.execute("INSERT INTO books (title, author) VALUES (%s, %s)", (payload.title, payload.author))
    elif category == "review":
        cur.execute("INSERT INTO reviews (book, review) VALUES (%s, %s)", (payload.book, payload.review))
        
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "success"}

@app.put("/{category}/update/{id}")
def update_data(category: str, id: int, payload: DataPayload):
    conn = get_db_connection()
    cur = conn.cursor()
    
    if category == "auth":
        cur.execute("UPDATE users SET username = %s WHERE id = %s", (payload.username, id))
    elif category == "book":
        cur.execute("UPDATE books SET title = %s, author = %s WHERE id = %s", (payload.title, payload.author, id))
    elif category == "review":
        cur.execute("UPDATE reviews SET book = %s, review = %s WHERE id = %s", (payload.book, payload.review, id))

    conn.commit()
    cur.close()
    conn.close()
    return {"status": "updated"}

@app.delete("/{category}/delete/{id}")
def delete_data(category: str, id: int):
    table = get_table_name(category)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {table} WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "deleted"}

handler = Mangum(app)