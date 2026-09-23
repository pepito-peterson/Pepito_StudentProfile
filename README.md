**Name: Peterson C. Pepito**


# Activity 6 - Camera Integration 

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

## 4. Camera Integration
The application utilizes the `cordova-plugin-camera` to interact with the device's camera hardware.
* **The Process:**
  1. **Change Profile Picture:** The user taps on their existing profile picture in the header.
  2. **Open Camera:** The application triggers the Cordova plugin to launch the device's native camera interface.
  3. **Capture Image:** The user takes a photo and confirms the capture using the on-screen checkmark.
  4. **Update Profile Picture:** The application receives the image data and instantly updates the DOM to display the newly captured photo in the header.

## 5. Device Feature Integration
Standard mobile web browsers run in a sandbox and have restricted access to native hardware. **Apache Cordova** is used as a bridge to solve this problem. By wrapping the HTML/JS web application in a native Android container, Cordova's plugins allow the JavaScript code to directly communicate with the Android operating system, enabling features like native camera access and system-level permission requests.

## 6. Image Handling
To maintain strict memory optimization and prevent storage limits from being exceeded, the captured image is not converted into a massive Base64 text string.
* **Persistence:** The camera saves the photo as a temporary file on the device and returns a direct `FILE_URI` (file path). This lightweight path is then saved to `localStorage`.
* **Display:** The application's Content Security Policy (CSP) and `config.xml` file are explicitly configured to trust local `file://` URIs, allowing the app to render the saved photo directly from the device's storage upon restart. A "Revert to Old Profile Picture" button is included to clear this storage and restore the default asset if needed.

## 7. Error Handling
The application is designed to handle camera and hardware exceptions gracefully without crashing:
* **Camera Permission Denial:** If the user denies the native Android camera permission prompt, the application catches the rejection and displays an alert box instructing the user to enable permissions in their device settings.
* **Camera Cancellation:** If the user opens the camera but presses the "back" button without taking a photo, the app silently catches the "no image selected" event and keeps the existing profile picture intact.
* **Camera Errors:** If the hardware fails to initialize or encounters a system error, a generic alert box displays the exact error message provided by the Android OS for easy troubleshooting.

## 8. Responsive Design
The user interface is built to be fully responsive. By utilizing CSS Flexbox, CSS Grid, and scalable viewport meta tags, the application layout seamlessly adapts its structure, font sizes, and image dimensions to provide an optimal viewing experience across **Desktop**, **Tablet**, and **Mobile** screen sizes.

## 9. How to Run

**1. Install Dependencies**
Ensure you have Node.js and the Android SDK installed, then install Cordova globally:
npm install -g cordova

**2. Configure the Cordova project**
cordova platform add android

**(NOTE FOR CONFIG: Ensure the preference <preference name="AndroidInsecureFileModeEnabled" value="true" /> is present in your config.xml 
to allow the Android WebView to render the local image file paths.)**

**3. Install/configure the camera plugin**
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-android-permissions

**4. Build the application**
cordova build android

**5. Run the application**
cordova emulate android

**(NOTE WHEN RUNNING THE APP IF IT BUGS OUT AGAIN: Deployment Troubleshooting: If the automatic deployment fails due to local environment pathing issues 
(such as spaces in Windows user directories), use the Android Debug Bridge (ADB) to force the installation manually)**\

Run this command: adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk


### Student Profile 
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/beab88d9-4948-4d5a-8124-56faae94de4e" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/6a23ef5a-a666-4409-909a-e3ca989bda14" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/50c7e7cf-5563-4a53-b31b-54247d0cd2a4" />
(I also added a feature where u revert to the default pic by clicking a revert btn)

### Change Profile Picture
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/26c7e6a2-9a4d-48c7-a3d9-419f5fa436c4" />

### Camera
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/835b9f55-2d94-41bf-bb31-7fe833ee56df" />

### Captured Image
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/83f56f09-2016-402f-9173-439aab594980" />
(different photo taken from one of my tests where after clicking the cam button three different buttons appeared. On the left side it reverts to the camera again if you've taken a photo, 
secondly the check mark is for confirmation of your photo taken, and lastly the x mark closes the camera.)

### Updated Profile Picture
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/cacd78b8-aad8-4af8-b514-716ad92619e4" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/9de2e376-480b-4d90-b386-b553ae99f820" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/1e161599-421f-41b8-acbe-ba16f8f1e257" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/25af4d3b-5a28-44f7-b2e7-beddc0bb7089" />

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/f4c52191-fb66-450e-aa55-0cdf6061c593" />

(the old pf used stays on too if u open the camera and close the application)
