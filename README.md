## ASSIGNMENT Readme

---

## 🚀 Features

- ✅ **User Authentication** (Register, Login, Logout) using JWT  
- 🖼️ **Image Upload** with tags and color filters  
- 🔍 **Search & Filter** by tags or color  
- 🧭 **Responsive Dashboard** built with Tailwind CSS  
- 📝 **API Documentation** included (Word file)  
- 🌐 **GitHub Hosted Repository** (Frontend + Backend)  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (for image uploads)
- JSON Web Token (JWT)

---

---

## 🧰 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/auth-mern-app.git
cd auth-mern-app
cd backend
npm install
```

## Create a .env file in the backend folder:
PORT = 8080

MONGO_CONN = "mongodb+srv://akanksha70010_db_user:22TnuNDKXpyEnAaK@cluster0.qygapsw.mongodb.net/auth-db?retryWrites=true&w=majority&appName=Cluster0"

JWT_SECRET = "igotyou"

## Start the backend:

npm start

### 3️⃣ Install Frontend Dependencies
cd ../frontend
npm install


### Run the frontend:

npm run dev

### 🌐 API Endpoints
Method	    Endpoint	           Description	            Protected

POST	      /api/auth/register	 Register a new user     	❌ 

POST	      /api/auth/login	     Login user	              ❌ No

POST	      /api/posts	         Create new post (image)	✅ Yes

GET	        /api/posts	         Get all posts	          ❌ No

GET	    /api/posts/search?tag=	 Search posts by tag	    ❌ No

GET	    /api/posts/filter?color=	Filter posts by color	  ❌ No

DELETE	  /api/posts/:id	        Delete a post	          ✅ Yes

Full API documentation is provided in the API_Documentation.docx file.

### 🧪 Testing with Postman

Import the Postman_Collection.json file in Postman.

Register or login to get the JWT token.

Use the token in the Authorization header (no “Bearer” keyword).

Test image upload and search endpoints.


### 📎 Deliverables

✅ Frontend + Backend hosted on GitHub

✅ Working Authentication (Register/Login/Logout)

✅ Dashboard with CRUD operations

✅ Postman Collection / API Docs

✅ Scaling Note (in README)

### 👩‍💻 Author

Akanksha Singh
📧 akanksh70010@gmail.com







