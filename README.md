**Name: Peterson C. Pepito**


# Activity 5 - Interactive Student Profile Application

## 1. Project Description
The Student Profile application is a multipage, responsive mobile application built with Apache Cordova. It showcases my personal info, academic projects, skills, and contact information. 

## 2. Application Pages
* **Profile (Homepage):** Acts as the main entry point, dynamically displaying my core information (Name, Course, Year Level, About Me, Skills). This page houses the primary Edit Profile functionality.
* **About:** Contains detailed personal information, educational background, extracurriculars (Karate, student-athlete), and career goals in networking and DBMS.
* **Skills:** Highlights my knowledge across front-end programming, database management, and version control.
* **Projects:** Showcases recent academic and software projects (Rental Booking Simulator, CollegeDB Enrollment Database, Personal Digital Portfolio).
* **Contact:** Displays dynamically loaded contact details (School/Personal Email, GitHub, Location) with its own dedicated editing interface, alongside a layout for a messaging form.

## 3. Profile & Contact Editing
The application features interactive editing on both the Profile and Contact pages.
* **Profile Editing:** Users can modify their Full Name, Course, Year Level, About Me, and Skills.
* **Contact Editing:** Users can modify their School Email, Personal Email, GitHub Link, and Location.
  When the "Edit" button is clicked, the static text is seamlessly replaced by a form interface pre-filled with the current data.

## 4. JavaScript Functionality
 utilized JS strictly for DOM manipulation, form handling, and data persistence, without relying on dynamically generating new HTML pages:
* **Form Handling:** Event listeners toggle a `.hidden` CSS class to smoothly swap between the "Display View" and the "Edit View".
* **Validation:** Before saving, the script ensures no fields are left blank. It also enforces strict rules: the Full Name field requires both a first and last name (checking word count), and the Contact email fields utilize Regular Expressions (Regex) to ensure valid email formatting. Invalid inputs trigger a red border and a specific error message.
* **Profile Updates:** Upon passing validation, the DOM's `textContent` is instantly updated with the new values, including a global update to the Header Name across all pages.
* **Save / Cancel:** The 'Save' button commits changes to storage and updates the UI. The 'Cancel' button discards any typed changes and safely reverts to the Display View.

## 5. Local Data Storage
To ensure data persists even after the app is fully closed and reopened, the application utilizes the browser's `localStorage` API.
* When changes are saved, `localStorage.setItem()` stores the strings.
* Upon application boot, the script uses `localStorage.getItem()` to populate the interface.
* If the app is launched for the very first time (and `localStorage` is empty), the script gracefully falls back to a hardcoded `defaultProfile` and `defaultContact` object.

## 6. Responsive Design
The application employs a Mobile-First design strategy using CSS Flexbox, Grid, and `@media` queries:
* **Mobile (Default):** Elements stack vertically. A specific landscape orientation query (`max-height: 600px`) shrinks the header and aligns elements horizontally to maximize vertical reading space on rotated phones.
* **Tablet:** Expands to a two-column grid (`min-width: 768px`) for content cards and expands padding.
* **Desktop:** Transitions to a three-column grid (`min-width: 1024px`), and the navigation header reorganizes into a horizontal top bar to prevent stretching.

## 7. How to Run
1. Clone or download the repository to your local machine.
2. Open your terminal and navigate to the root directory of the project.
3. Run `cordova prepare android` to sync the HTML, CSS, and JS files from the `www/` folder to the Android platform directory.
4. Open the project in Android Studio and launch your Android Virtual Device (AVD).
5. Run `cordova emulate android` in the terminal (or press the Play button in Android Studio) to build the APK and deploy the application.

## 8. Application Screenshots

### Student Profile (Display View)
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/b45af131-4cd3-453f-9959-da265bf313b4" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/67ebee81-d044-430e-9bb5-1b124eea8434" />

### Edit Profile (Form View)
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/b7c1ca8c-4783-4fbb-921a-4ff993aa1159" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/5e380502-9e4b-4a65-b4e7-ef617b0e194f" />

### Updated Profile (After Saving)
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/3d0bcc83-8c84-4fa9-a6eb-50bf11d4be5c" />

### Contact Page (With Editable Info)
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/78e1aa25-0f2c-4b52-bb0e-5c5e41321402" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/607b9fc4-044f-414f-9951-0cfbdd487d62" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/b5ff54fe-d8a5-47af-bdde-ed651c783d63" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/6222e7a6-a25d-401f-a82c-190b0221b563" />

