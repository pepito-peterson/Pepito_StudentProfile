**Name: Peterson C. Pepito**


# Activity 7 - Database Integration & Authentication

## 1. Project Description
The Student Profile application is a multipage, responsive mobile application built with **Apache Cordova**. It showcases my personal information, academic projects, skills, and contact details.

Over the activities, the app has evolved step by step:
* **Activities 1–4:** A static, multipage HTML/CSS/JS profile website.
* **Activity 5:** Added profile and contact editing with form validation (data saved in the browser's `localStorage`).
* **Activity 6:** Added native camera integration to change the profile picture.
* **Activity 7 (this activity):** The app is now **database-driven**. Students must **log in**, and their profile (name, course, year level, about me, skills, and profile picture) is loaded from and saved to a **MySQL database** through a **Node.js/Express backend API**. Data is no longer tied to a single phone; it lives on the server.

## 2. Application Pages
* **Login:** The entry point of the app. A student enters their Student ID (or school email) and password. Only logged-in students can access the other pages. If a student is not logged in, the app automatically redirects them back to the Login page.
* **Profile (Homepage):** Displays the logged-in student's core information (Name, Course, Year Level, About Me, Skills) and profile picture, loaded from the database. This page contains the **Edit Profile**, **Revert to Old Profile Picture**, and **Logout** buttons.
* **About:** Contains detailed personal information, educational background, extracurriculars (Karate, student-athlete), and career goals in networking and DBMS.
* **Skills:** Highlights my knowledge across front-end programming, database management, and version control.
* **Projects:** Showcases recent academic and software projects (Rental Booking Simulator, CollegeDB Enrollment Database, Personal Digital Portfolio).
* **Contact:** Displays contact details (School/Personal Email, GitHub, Location) with its own editing interface, alongside a layout for a messaging form.

## 3. Authentication
Students log in using their **Student ID or school email** and their **password**.

**Login → Authentication → Student Profile**

1. **Login:** The student fills in the form on `login.html` and taps **Login**. The app sends the Student ID/email and password to the backend (`POST /api/login`).
2. **Authentication:** The backend looks up the student in the MySQL database and uses **bcrypt** to compare the entered password with the stored password **hash**. If they match, the backend creates a **JWT (JSON Web Token)** that is valid for 2 hours and sends it back. If they don't match, it replies with "Invalid credentials". It doesn't reveal whether the ID or the password was wrong.
3. **Student Profile:** The app stores the token on the device and opens the Profile page. Every request after this (loading, saving, and uploading the picture) includes the token in the `Authorization: Bearer <token>` header so the backend knows which student is making the request.

Every page (except Login) runs an **authentication guard** at the very top of `index.js`. If there is no token, the user is immediately sent back to the Login page. If the token has expired or is invalid, the backend rejects the request and the app logs the student out.

## 4. Student Profile Management
Once logged in, a student can:

* **View their profile:** When the Profile page opens, the app requests the student's data from the backend (`GET /api/profile`) and displays their name, course, year level, about me, skills, and profile picture.
* **Edit their information:** Tapping **Edit Profile** replaces the profile text with a form that's pre-filled with the current values.
* **Save changes:** Tapping **Save** validates the form (all required fields filled in, and both a first and last name). The app then sends the new values to the backend (`PUT /api/profile`), which updates the student's row in the database. While saving, the button shows "Saving..." and can't be pressed twice. A success message is shown when done.
* **Update their profile picture:** Tapping the profile picture opens the device camera. After a photo is taken, it is shown immediately and uploaded to the backend (`PUT /api/profile/picture`), which saves it in the database. The **Revert to Old Profile Picture** button removes the saved photo and restores the default picture.
* **Log out:** Tapping **Logout** deletes the login token and the cached picture from the device and returns to the Login page. Any page that needs login can no longer be opened until the student logs in again.

## 5. Database Integration
* **Database technology:** **MySQL 8.0** (database name: `student_profile_db`, table: `students`). The table structure is in [`backend/schema.sql`](backend/schema.sql).
* **What is stored for each student:**

| Column | What it stores |
|---|---|
| `id` | Internal record number (auto-increment primary key) |
| `student_id` | Student ID (unique), used for logging in |
| `email` | School email (unique), can also be used for logging in |
| `password_hash` | The password, stored as a **bcrypt hash** (never as plain text) |
| `full_name` | Full name |
| `course` | Course / program |
| `year_level` | Year level |
| `about_me` | About Me text |
| `skills` | Skills list |
| `profile_picture` | The profile photo, stored as a Base64 image string (`LONGTEXT`) |

## 6. API/Backend
The Cordova app never talks to MySQL directly. It talks to a **Node.js + Express** backend ([`backend/server.js`](backend/server.js)) using **HTTP requests with JSON** (JavaScript `fetch()`). The backend is the only part that connects to the database.

**Cordova Application → API/Backend → Database**

```
┌──────────────────────┐   HTTP + JSON    ┌───────────────────────┐    SQL     ┌──────────────┐
│  Cordova App         │  (fetch, JWT)    │  Node.js / Express    │  (mysql2)  │  MySQL 8.0   │
│  (HTML / CSS / JS    │ ───────────────► │  backend/server.js    │ ─────────► │  students    │
│   on Android)        │ ◄─────────────── │  port 3000            │ ◄───────── │  table       │
└──────────────────────┘   JSON response  └───────────────────────┘   rows     └──────────────┘
```

**API endpoints:**

| Method | Endpoint | Login needed? | Purpose |
|---|---|---|---|
| `GET` | `/api/ping` | No | Network test shown on the Login page ("Network Connected!") |
| `POST` | `/api/login` | No | Checks the Student ID/email and password, and returns a JWT token |
| `GET` | `/api/profile` | Yes | Returns the logged-in student's profile |
| `PUT` | `/api/profile` | Yes | Saves name, course, year level, about me, and skills |
| `PUT` | `/api/profile/picture` | Yes | Saves the profile picture (or removes it when sent `null`) |

The phone and the computer running the backend must be on the **same Wi-Fi network**. The app connects to the computer's local IP address (for example `http://192.168.x.x:3000/api`).

## 7. CRUD Operations
* **Create:** Student records are created by the seed script [`backend/seed.js`](backend/seed.js), which hashes each password with bcrypt and inserts the student into the `students` table (`INSERT`). It skips students that already exist, so it's safe to run more than once.
* **Read:** When any page opens, the app calls `GET /api/profile`. The backend runs `SELECT ... FROM students WHERE id = ?` for the logged-in student, and the app displays the result.
* **Update:** Saving the Edit Profile form calls `PUT /api/profile` (`UPDATE students SET full_name = ?, course = ?, year_level = ?, about_me = ?, skills = ? WHERE id = ?`). Taking a new photo calls `PUT /api/profile/picture` (`UPDATE students SET profile_picture = ? WHERE id = ?`).
* **Delete:** The **Revert to Old Profile Picture** button deletes the student's stored profile picture from the database (sets `profile_picture` to `NULL`), and the default picture is shown again. **Logout** deletes the login token and cached picture from the device. Student accounts themselves are not deleted from inside the app. That is an admin task done directly in MySQL, so a student cannot accidentally delete their whole account.

## 8. Camera Integration
The Activity 6 camera feature (`cordova-plugin-camera` and `cordova-plugin-android-permissions`) is kept. The difference is that the photo is now **saved in the database** instead of only on the phone:

1. **Tap the profile picture:** The app checks for camera permission (and asks for it if needed), then opens the native camera.
2. **Take a photo:** The camera returns the photo as a **Base64 image** (`DATA_URL`). It is resized to at most **600×600 pixels** so it stays small (about 15–20 KB) and uploads quickly.
3. **Show it:** The photo is displayed right away in the header.
4. **Save it:** The photo is sent to the backend (`PUT /api/profile/picture`) and stored in the `profile_picture` column. After the database save succeeds, it is also cached on the device (`localStorage`), and the message "Profile picture saved!" is shown.
5. **Load it later:** Every time the app opens, the picture is loaded from the database, so it appears on any device the student logs in from.

The Activity 6 error handling is still in place: denied permissions, a cancelled camera, and camera errors show a clear message instead of crashing the app. If the server can't be reached, the app shows a message telling the student to check the server and Wi-Fi.

## 9. Data Persistence
Profile information is stored in the **MySQL database on the server**, not just on the phone, so it stays available:

* **Closing the application:** Nothing is lost. All saved changes are already in the database.
* **Restarting the application:** The login token is kept on the device (valid for 2 hours). When the app opens, it loads the latest profile from the database. If the token has expired, the student is asked to log in again.
* **Logging out:** The token and the cached picture are removed from the device, but **the profile stays in the database**.
* **Logging in again:** The app requests the profile from the database (`GET /api/profile`), so the student sees the same name, course, year level, about me, skills, and profile picture they saved before. This works even on a different phone or after reinstalling the app.

> **Note:** Contact page details (personal email, GitHub, location) are still saved only on the device (`localStorage`), as in Activity 5. The school email shown there comes from the database.

## 10. Responsive Design
The interface adapts to different screen sizes using:
* **Viewport meta tag** (`width=device-width, initial-scale=1`) so the page fits the device width.
* **Flexbox and CSS Grid** for the header, navigation buttons, and project/skill cards, so items wrap and resize instead of overflowing.
* **Media queries** in `css/style.css`:
  * **Mobile (default):** single-column layout. The profile picture, name, and navigation are stacked and centered, the navigation buttons wrap onto multiple lines, and cards appear in **1 column**.
  * **Tablet (`min-width: 768px`):** larger headings, more padding, and cards in **2 columns**.
  * **Desktop (`min-width: 1024px`):** the header becomes one row (a smaller profile picture, then the name, then the navigation on the right), centered with a maximum width of 1200px, and cards appear in **3 columns**.
  * **Landscape phones (`orientation: landscape` and `max-height: 600px`):** a compact one-row header with a 60px profile picture, so content isn't pushed off the screen.

The Login page and the Edit Profile form use full-width inputs and buttons, so they're easy to tap on small screens.

## 11. Security
* **Passwords are not stored as plain text.** They are hashed with **bcrypt** (10 salt rounds) before being saved. During login, bcrypt compares the entered password against the hash.
* **Database credentials are not included in the source code.** The database host, user, password, and JWT secret are read from environment variables in `backend/.env` (using `dotenv`).
* **Sensitive configuration is stored outside the public repository.** `backend/.env` is listed in `.gitignore`, so it is never uploaded to GitHub. Only [`backend/.env.example`](backend/.env.example), which has placeholder values, is included.
* **Authentication is handled through the backend.** Login is checked on the server, which issues a **JWT** that expires after 2 hours. Every profile request goes through an `authenticateToken` check, and the backend only reads or updates the row that belongs to the logged-in student (`WHERE id = <id from the token>`). A student cannot view or change another student's profile.
* **Database credentials are not exposed to the Cordova application.** The app only knows the API address. It never connects to MySQL and contains no database username or password.
* **SQL injection protection:** All queries use placeholders (`?`) with `mysql2`, so user input is never pasted directly into SQL.
* **Content Security Policy (CSP):** Each page only allows network requests to its own files and the backend API address (`connect-src`).

## 12. How to Run

**Requirements:** Node.js, MySQL 8.0 (with MySQL Workbench), Android Studio (Android SDK and an emulator or a phone), and JDK 17.

**1. Install dependencies**
From the project folder:
```bash
npm install
```
This installs the backend packages (`express`, `mysql2`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`) and the Cordova tools listed in `package.json`.

**2. Configure the database**
1. Open MySQL Workbench and run [`backend/schema.sql`](backend/schema.sql). This creates the `student_profile_db` database and the `students` table.
2. Copy `backend/.env.example` to `backend/.env`, then fill in **your own** MySQL username, password, and a random JWT secret. (Never commit this file.)
3. Create the test accounts:
```bash
node backend/seed.js
```

**3. Start the backend/API**
```bash
cd backend
```
```bash
node server.js
```
You should see `=== Server Active (Port 3000) ===`. Keep this terminal open while using the app. If Windows Firewall asks, allow Node.js on **Private networks** so the phone/emulator can connect.

**4. Configure the Cordova application**
Find your computer's IPv4 address with `ipconfig` (for example `192.168.x.x`). Then replace the IP address in these places:
* `API_URL` in `www/js/index.js` and `www/js/login.js`
* `connect-src` in the Content Security Policy at the top of every HTML file in `www/`
* `<allow-navigation>` in `config.xml`

Make sure the phone/emulator is on the **same Wi-Fi network** as the computer.

**5. Build the application**
If the Android platform and plugins aren't installed yet:
```bash
npx cordova platform add android
```
```bash
npx cordova plugin add cordova-plugin-camera
```
```bash
npx cordova plugin add cordova-plugin-android-permissions
```
Then build:
```bash
npx cordova build android
```

**6. Run the application**
Start an emulator (or connect a phone with USB debugging), then:
```bash
npx cordova run android
```

> **Important:** After changing anything in `www/`, run `npx cordova run android` again. Cordova builds the app from a copy of `www/` inside `platforms/android`, so changes don't show up until you rebuild.
>
> **Troubleshooting:** If automatic installation fails (for example because of spaces in the Windows user folder path), install the built app manually:
> ```bash
> adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
> ```
> If the emulator shows a black screen, use **Device Manager → ⋮ → Cold Boot Now** in Android Studio.

## 13. Test Accounts
This account was created **only for demonstration**. It isn't a real person's account and doesn't use any personal or XU password.

| Name | Student ID | Email | Password |
|---|---|---|---|
| Juan Dela Cruz | `20240002` | `test2@my.xu.edu.ph` | `TestStudent2026` |

You can log in with either the Student ID or the email. The account is created by running `node backend/seed.js` (see step 2 of How to Run).

## Screenshots

**Login page**

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/08532a4d-0f72-456c-9f23-ad138a89c95e" />

**Successful login**

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/4e766c86-d0bc-46f9-8501-e5026a6ab524" />

(if invalid credentials of user's account)

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/50e5e3d7-81e3-4293-b617-1f748c0e3947" />

**Student Profile**

(current student profile)

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/301fec7d-dbca-487b-b14c-9606f3ec52fb" />

(after edits made)

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/682530a6-5176-440e-9fcf-6de41dd2ab89" />

**Edit Profile**

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/ef4a7b2e-7bba-485b-b180-5aee32b0b993" />

**Updated Profile**

<img width="496" height="865" alt="Image" src="https://github.com/user-attachments/assets/d086d5a3-4400-4eff-bb52-8551498874ef" />

<img width="429" height="866" alt="Image" src="https://github.com/user-attachments/assets/7a3f1c9a-00c4-41ef-970e-f585ad9b6204" />

**Profile Picture/Camera**

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/c8b717ab-29b7-4c24-a2ac-4e443696132d" />

**Logout**
(my mouse cursor is on the logout button, but it's not showing)
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/3aefcdd7-7ba8-4e5b-a393-5da872ff0685" />

(returns to login page)
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/b4442429-764c-4269-a344-e7e7ad4fafe3" />

**Database-related functionality, where appropriate**

(id 3 details still not edited)
<img width="1647" height="298" alt="Image" src="https://github.com/user-attachments/assets/0e81e45d-78ba-4ee3-892c-9fa3ee49b30b" />


(id 3 details edited)

<img width="1512" height="236" alt="Image" src="https://github.com/user-attachments/assets/8edfd048-53cc-4534-843c-b9899b714bae" />
