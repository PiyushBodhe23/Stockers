Stockers – Trade Smarter. Grow Faster.

Stockers is a modern stock trading application designed to provide a clean, fast, and intuitive experience for users who want to explore trading, manage portfolios, and simulate buy/sell operations with ease.
Built with a powerful MERN-stack architecture, Stockers brings together real-time data visualization, secure authentication, and a sleek user interface.

🚀 Features

🔐 Secure user login & authentication
💰 Buy/Sell simulation system
📁 Portfolio & holdings tracking
🧾 Order history section
📈 Interactive charts & analytics
⚡ Fast, responsive, and modern UI
🧩 Clean component-based architecture

🛠 Tech Stack


Frontend
React.js
Axios
React Router
Context API / State Management
CSS / Tailwind / Custom Styles


Backend
Node.js
Express.js
JWT Authentication
Cookie-based session handling


Database
MongoDB + Mongoose


Deployment
Vercel (Frontend & Backend)

📂 Project Structure
Stockers/
│── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── config/
│   ├── middleware/

🧑‍💻 Getting Started
🔧 Installation
# Clone repository
git clone https://github.com/PiyushBodhe23/Stockers.git

# Install frontend dependencies
cd Stockers/frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install Dashboard dependencies
cd ../dashboard
npm install

▶ Run the App
# Start frontend
npm start

# Start backend in development mode
npm run dev

🔑 Environment Variables

Create a .env file inside the backend folder:

MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000


Add any additional API keys if required.

📡 API Endpoints
Method	Endpoint	    Description
POST	/login	     User login
POST	/signup	     Create new user account
GET	   /orders	     Fetch  all orders
POST	/orders	     Place a new order
GET	   /holdings     Get user holdings


🎥 Live Demo

Frontend (Vercel): https://stockers-frontend.vercel.app/
Dashboard(Versal): https://zite-stockers-dashboard.vercel.app/login


🗺 Roadmap

Graphs using TradingView API
Advanced analytics dashboard
Improvements in UI/UX
Mobile responsive layout
Notification & alert system

👤 Author

Piyush Bodhe
📧 Email: piyushbodhe23@gmail.com
🔗 LinkedIn: www.linkedin.com/in/piyushbodhe
🌐 Portfolio: https://pb101123.netlify.app/

📝 License


This project is licensed under the MIT License.
