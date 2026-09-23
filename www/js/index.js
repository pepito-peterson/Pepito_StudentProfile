/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
/* --- Initialize Cordova --- */
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // ACTIVITY 6: Load the saved profile picture when the device is ready
    loadProfilePicture();
}

/* --- Activity 5 & 6: Profile, Contact & Camera Logic --- */
document.addEventListener('DOMContentLoaded', () => {

    // ACTIVITY 6: Load picture immediately when DOM loads (handles all 5 pages)
    loadProfilePicture();

    // ACTIVITY 6: Attach the camera click event safely using JavaScript
    const profileImageBtn = document.getElementById('profile-pic');
    if (profileImageBtn) {
        profileImageBtn.addEventListener('click', openCamera);
    }
    // NEW: Attach the Reset Picture event
        const resetPicBtn = document.getElementById('reset-pic-btn');
        if (resetPicBtn) {
            resetPicBtn.addEventListener('click', () => {
                // 1. Delete the saved camera photo from storage
                localStorage.removeItem('savedProfilePicture');
                // 2. Reload the profile picture (this will now fallback to your default image)
                loadProfilePicture();
                alert("Profile picture reverted to default!");
            });
        }
    // 1. Default Profile Data
    const defaultProfile = {
        name: "Peterson C. Pepito",
        course: "BS Information Technology",
        year: "3rd Year",
        about: "Hi! I am an undergraduate student currently enrolled in the College of Computer Studies at Xavier University - Ateneo de Cagayan. I am passionate about networking and doing a bit of DBMS.",
        skills: "Java, Python, Web Development, MySQL, Git/GitHub"
    };

    // 2. Fetch current profile from localStorage
    const profile = {
        name: localStorage.getItem('profileName') || defaultProfile.name,
        course: localStorage.getItem('profileCourse') || defaultProfile.course,
        year: localStorage.getItem('profileYear') || defaultProfile.year,
        about: localStorage.getItem('profileAbout') || defaultProfile.about,
        skills: localStorage.getItem('profileSkills') || defaultProfile.skills
    };

    // 3. GLOBAL UPDATE: Update the header name on ALL pages
    const headerName = document.querySelector('.header-text h1');
    if (headerName) {
        headerName.textContent = profile.name;
    }

    // ==========================================
    // 4. HOMEPAGE SPECIFIC UPDATE
    // ==========================================
    const displaySection = document.getElementById('profile-display');
    if (displaySection) {
        // Populate display fields
        document.getElementById('display-name').textContent = profile.name;
        document.getElementById('display-course').textContent = profile.course;
        document.getElementById('display-year').textContent = profile.year;
        document.getElementById('display-about').textContent = profile.about;
        document.getElementById('display-skills').textContent = profile.skills;

        // Form Elements
        const editSection = document.getElementById('profile-edit');
        const errorMsg = document.getElementById('error-message');
        const editBtn = document.getElementById('edit-btn');
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');

        // Event: Click "Edit Profile"
        editBtn.addEventListener('click', () => {
            document.getElementById('edit-name').value = document.getElementById('display-name').textContent;
            document.getElementById('edit-course').value = document.getElementById('display-course').textContent;
            document.getElementById('edit-year').value = document.getElementById('display-year').textContent;
            document.getElementById('edit-about').value = document.getElementById('display-about').textContent;
            document.getElementById('edit-skills').value = document.getElementById('display-skills').textContent;

            errorMsg.style.display = 'none';
            document.getElementById('edit-name').classList.remove('input-error');
            displaySection.classList.add('hidden');
            editSection.classList.remove('hidden');
        });

        // Event: Click "Cancel"
        cancelBtn.addEventListener('click', () => {
            editSection.classList.add('hidden');
            displaySection.classList.remove('hidden');
        });

        // Event: Click "Save"
        saveBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('edit-name');
            nameInput.classList.remove('input-error');
            errorMsg.style.display = 'none';

            const newName = nameInput.value.trim();
            const newCourse = document.getElementById('edit-course').value.trim();
            const newYear = document.getElementById('edit-year').value.trim();
            const newAbout = document.getElementById('edit-about').value.trim();
            const newSkills = document.getElementById('edit-skills').value.trim();

            // Validation: Prevent empty fields
            if (!newName || !newCourse || !newYear || !newAbout) {
                errorMsg.textContent = "Please complete all required fields.";
                errorMsg.style.display = 'block';
                return;
            }

            // Validation: Require First and Last Name
            const nameWords = newName.split(/\s+/);
            if (nameWords.length < 2) {
                errorMsg.textContent = "Please enter both a first and last name.";
                errorMsg.style.display = 'block';
                nameInput.classList.add('input-error');
                return;
            }

            // Save to localStorage
            localStorage.setItem('profileName', newName);
            localStorage.setItem('profileCourse', newCourse);
            localStorage.setItem('profileYear', newYear);
            localStorage.setItem('profileAbout', newAbout);
            localStorage.setItem('profileSkills', newSkills);

            // Update UI instantly
            document.getElementById('display-name').textContent = newName;
            document.getElementById('display-course').textContent = newCourse;
            document.getElementById('display-year').textContent = newYear;
            document.getElementById('display-about').textContent = newAbout;
            document.getElementById('display-skills').textContent = newSkills;
            headerName.textContent = newName;

            editSection.classList.add('hidden');
            displaySection.classList.remove('hidden');
        });
    }

    // ==========================================
    // 5. CONTACT PAGE SPECIFIC UPDATE
    // ==========================================
    const contactDisplaySection = document.getElementById('contact-display');
    if (contactDisplaySection) {

        // Default Contact Data
        const defaultContact = {
            schoolEmail: "20190018209@my.xu.edu.ph",
            personalEmail: "ersonpeito53@gmail.com",
            github: "github.com/pepito-peterson",
            location: "El Salvador City, Misamis Oriental, 9017"
        };

        // Fetch current contact info from localStorage
        const contactInfo = {
            schoolEmail: localStorage.getItem('contactSchool') || defaultContact.schoolEmail,
            personalEmail: localStorage.getItem('contactPersonal') || defaultContact.personalEmail,
            github: localStorage.getItem('contactGithub') || defaultContact.github,
            location: localStorage.getItem('contactLocation') || defaultContact.location
        };

        // Populate display fields
        document.getElementById('display-school-email').textContent = contactInfo.schoolEmail;
        document.getElementById('display-personal-email').textContent = contactInfo.personalEmail;
        document.getElementById('display-github').textContent = contactInfo.github;
        document.getElementById('display-location').textContent = contactInfo.location;

        const githubLink = document.getElementById('display-github-link');
        if (githubLink) {
            githubLink.href = contactInfo.github.startsWith('http') ? contactInfo.github : 'https://' + contactInfo.github;
        }

        // Form Elements
        const contactEditSection = document.getElementById('contact-edit');
        const contactErrorMsg = document.getElementById('contact-error-message');
        const editContactBtn = document.getElementById('edit-contact-btn');
        const saveContactBtn = document.getElementById('save-contact-btn');
        const cancelContactBtn = document.getElementById('cancel-contact-btn');

        // Event: Click "Edit Contact Info"
        editContactBtn.addEventListener('click', () => {
            document.getElementById('edit-school-email').value = document.getElementById('display-school-email').textContent;
            document.getElementById('edit-personal-email').value = document.getElementById('display-personal-email').textContent;
            document.getElementById('edit-github').value = document.getElementById('display-github').textContent;
            document.getElementById('edit-location').value = document.getElementById('display-location').textContent;

            contactErrorMsg.style.display = 'none';
            contactDisplaySection.classList.add('hidden');
            contactEditSection.classList.remove('hidden');
        });

        // Event: Click "Cancel"
        cancelContactBtn.addEventListener('click', () => {
            contactEditSection.classList.add('hidden');
            contactDisplaySection.classList.remove('hidden');
        });

        // Event: Click "Save"
        saveContactBtn.addEventListener('click', () => {
            const schoolInput = document.getElementById('edit-school-email');
            const personalInput = document.getElementById('edit-personal-email');

            // Reset errors
            schoolInput.classList.remove('input-error');
            personalInput.classList.remove('input-error');
            contactErrorMsg.style.display = 'none';

            const newSchool = schoolInput.value.trim();
            const newPersonal = personalInput.value.trim();
            const newGithub = document.getElementById('edit-github').value.trim();
            const newLocation = document.getElementById('edit-location').value.trim();

            // Validation: Prevent Empty Fields
            if (!newSchool || !newPersonal || !newGithub || !newLocation) {
                contactErrorMsg.textContent = "Please complete all required fields.";
                contactErrorMsg.style.display = 'block';
                return;
            }

            // Validation: Strict Email Format (Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(newSchool)) {
                contactErrorMsg.textContent = "Please enter a valid school email address.";
                contactErrorMsg.style.display = 'block';
                schoolInput.classList.add('input-error');
                return;
            }

            if (!emailRegex.test(newPersonal)) {
                contactErrorMsg.textContent = "Please enter a valid personal email address.";
                contactErrorMsg.style.display = 'block';
                personalInput.classList.add('input-error');
                return;
            }

            // Save to localStorage
            localStorage.setItem('contactSchool', newSchool);
            localStorage.setItem('contactPersonal', newPersonal);
            localStorage.setItem('contactGithub', newGithub);
            localStorage.setItem('contactLocation', newLocation);

            // Update UI instantly
            document.getElementById('display-school-email').textContent = newSchool;
            document.getElementById('display-personal-email').textContent = newPersonal;
            document.getElementById('display-github').textContent = newGithub;
            document.getElementById('display-location').textContent = newLocation;

            if (githubLink) {
                githubLink.href = newGithub.startsWith('http') ? newGithub : 'https://' + newGithub;
            }

            contactEditSection.classList.add('hidden');
            contactDisplaySection.classList.remove('hidden');
        });
    }
});

// ==========================================
// 6. ACTIVITY 6: CAMERA & PERMISSIONS FUNCTIONS
// ==========================================

function openCamera() {
    if (!navigator.camera) {
        alert("Camera plugin not found. Ensure you are running this on an emulator or physical device.");
        return;
    }

    // Explicitly check for Camera Permissions before opening the hardware
    if (cordova.plugins && cordova.plugins.permissions) {
        const permissions = cordova.plugins.permissions;

        permissions.checkPermission(permissions.CAMERA, function(status) {
            if (status.hasPermission) {
                // Permission already granted, launch camera immediately
                launchCamera();
            } else {
                // Permission not granted, explicitly request it from the user
                permissions.requestPermission(permissions.CAMERA, function(status) {
                    if (status.hasPermission) {
                        launchCamera(); // User tapped "Allow"
                    } else {
                        // User tapped "Deny"
                        alert("Camera access was denied. Please enable camera permissions in your device settings to change your profile picture.");
                    }
                }, function() {
                    alert("Camera permission request failed.");
                });
            }
        });
    } else {
        // Fallback: If the permissions plugin isn't installed, let the camera plugin attempt to handle it natively
        launchCamera();
    }
}

// Separated the actual camera launch into its own function to run after permissions are granted
function launchCamera() {
    let options = {
        quality: 50, // We can raise this back up safely now
        destinationType: Camera.DestinationType.FILE_URI, // FIX: Use file path instead of text
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
    };

    navigator.camera.getPicture(onCameraSuccess, onCameraFail, options);
}

function onCameraSuccess(imageURI) {
    let imageElement = document.getElementById('profile-pic');

    // Display the newly captured image using the direct file path
    if (imageElement) {
        imageElement.src = imageURI;
    }

    // Save the tiny file path to localStorage instead of a massive block of text
    localStorage.setItem('savedProfilePicture', imageURI);
}

function onCameraFail(message) {
    // Handle cancellation gracefully without throwing an error
    if (message.toLowerCase().includes("no image selected") || message.toLowerCase().includes("cancelled")) {
        console.log("Camera cancelled by user. Existing picture remains.");
        return;
    }

    // Catch automatic permission denials triggered directly by the camera plugin
    if (message.toLowerCase().includes("permission")) {
        alert("Camera access was denied. Please check your device permissions.");
        return;
    }

    // Handle actual hardware/software errors
    alert("Unable to access the camera: " + message);
}

function loadProfilePicture() {
    let storedImage = localStorage.getItem('savedProfilePicture');
    let imageElement = document.getElementById('profile-pic');

    if (imageElement) {
        if (storedImage) {
            // If a camera photo exists in storage, display it
            imageElement.src = storedImage;
        } else {
            // If no photo exists, force the default image path
            imageElement.src = "img/PetersonPepito.jpg";
        }
    }
}
