# ☁️ Cloudit – Cloud Storage Platform

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" /></a>
  <a href="https://clerk.com/"><img src="https://img.shields.io/badge/Clerk-3B82F6?style=for-the-badge&logo=clerk&logoColor=white" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
  <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/Drizzle%20ORM-FFCA28?style=for-the-badge&logo=drizzle&logoColor=black" /></a>
  <a href="https://imagekit.io/"><img src="https://img.shields.io/badge/ImageKit-5C67F2?style=for-the-badge&logo=cloudinary&logoColor=white" /></a>
  <a href="https://neon.tech/"><img src="https://img.shields.io/badge/NeonDB-00E599?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
</p>

Cloudit is a **modern cloud storage platform** that allows users to securely upload, organize, and manage their files and folders.  
It is built with a **scalable directory structure**, robust authentication, and optimized database management.  

---

## ✨ Features

- 🔐 **Authentication with Clerk**  
  - Email/Password login & signup  
  - OTP verification for enhanced security  

- 📂 **Dashboard**  
  - Upload files (images) and create folders  
  - Organize files into a clean, scalable directory structure  
  - **Drag & Drop Support**  
    - Drag and drop files to upload with preview  
    - Drag and drop files directly into folders  

- 🗑️ **Trash Management**  
  - Deleted files & folders move to Trash  
  - Restore files/folders from Trash anytime  
  - Permanent delete option  

- 🌟 **Starred Items**  
  - Mark important files and folders as "Starred" for quick access  

- 🖼️ **Image Handling with ImageKit**  
  - Optimized image storage  
  - Fast delivery with CDN support  

- 🗄️ **Database**  
  - **Neon DB (PostgreSQL)** for relational data  
  - **Drizzle ORM** for type-safe, scalable queries  

- ⬇️ **Download Functionality**  
  - Download images directly  
  - Download folders as `.zip`, preserving full folder hierarchy  

- ⚡ **Scalable Architecture**  
  - Custom directory logic for optimized performance  
  - Built to handle large-scale file/folder management  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React)  
- **Backend:** Node.js / API Routes  
- **Authentication:** Clerk (with OTP support)  
- **Database:** Neon DB (PostgreSQL) + Drizzle ORM  
- **Storage & Media:** ImageKit (for images)  
- **Utilities:** File system handling, Zip compression, Drag & Drop APIs  

---

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/aayushpatel205/cloudit-cloud-storage.git

2. **Install Dependencies**
   ```bash
   npm install

3. **Environment Variables**
    ```bash
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_DATABASE_URL=your_neondb_url
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_public_url_endpoint
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
    NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
    NEXT_PUBLIC_SITE_URL=your_static_site_url

4. **Run the development server**
   ```bash
   npm run dev

