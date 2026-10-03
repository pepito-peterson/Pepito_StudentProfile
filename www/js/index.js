// ==========================================
// 1. AUTHENTICATION GUARD 
// ==========================================
const token = localStorage.getItem('studentToken');
if (!token) {
    window.location.replace('login.html');
}

//Backend Node.js Server IP
const API_URL = 'http://192.168.100.4:3000/api';


// ==========================================
// 2. CORDOVA DEVICE READY
// ==========================================
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    loadProfilePicture();//ACTIVITY 6: Load picture when device is ready
}

// ==========================================
// 3. MAIN UI & DATA LOADING (Activities 5, 6, 7)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {


//--- ACTIVITY 6: Image Initializations ---
loadProfilePicture();

    const profileImageBtn = document.getElementById('profile-pic');
    if (profileImageBtn) profileImageBtn.addEventListener('click', openCamera);

    const resetPicBtn = document.getElementById('reset-pic-btn');
    if (resetPicBtn) {
        resetPicBtn.addEventListener('click', async () => {
            localStorage.removeItem('savedProfilePicture');
            loadProfilePicture();
            if (await saveProfilePicture(null)) {
                alert("Profile picture reverted to default!");
            }
        });
    }

    //--- LOGOUT BUTTON EVENT ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('studentToken');
            localStorage.removeItem('savedProfilePicture');
            window.location.replace('login.html');
        });
    }

    //--- ACTIVITY 7: Fetch Live Database Profile (Read) ---
    try {
        const res = await fetch(`${API_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const dbData = await res.json();
            //Update local storage with fresh DB data
            localStorage.setItem('profileName', dbData.full_name);
            localStorage.setItem('profileCourse', dbData.course);
            localStorage.setItem('profileYear', dbData.year_level);
            localStorage.setItem('contactSchool', dbData.email);
            //Clear the old cached values when this account has none,
            //so a different account doesn't show the previous user's About Me / Skills
            if (dbData.about_me) localStorage.setItem('profileAbout', dbData.about_me);
            else localStorage.removeItem('profileAbout');
            if (dbData.skills) localStorage.setItem('profileSkills', dbData.skills);
            else localStorage.removeItem('profileSkills');
            if (dbData.profile_picture) {
                //safeSetItem won't crash if the picture is too big for localStorage
                safeSetItem('savedProfilePicture', dbData.profile_picture);
            } else {
                localStorage.removeItem('savedProfilePicture');
            }
            loadProfilePicture();
        } else if (res.status === 401 || res.status === 403) {
            logoutUser(); // Fallback if token expires
        }
    } catch (err) {
        console.error("Backend offline. Using cached local storage data.", err);
    }

    //--- ACTIVITY 5: UI Rendering (Using DB data or Local Fallbacks) ---
    const defaultProfile = {
        name: "Peterson C. Pepito",
        course: "BS Information Technology",
        year: "3rd Year",
        about: "Hi! I am an undergraduate student currently enrolled in the College of Computer Studies at Xavier University - Ateneo de Cagayan. I am passionate about networking and doing a bit of DBMS.",
        skills: "Java, Python, Web Development, MySQL, Git/GitHub"
    };

    const profile = {
        name: localStorage.getItem('profileName') || defaultProfile.name,
        course: localStorage.getItem('profileCourse') || defaultProfile.course,
        year: localStorage.getItem('profileYear') || defaultProfile.year,
        about: localStorage.getItem('profileAbout') || defaultProfile.about,
        skills: localStorage.getItem('profileSkills') || defaultProfile.skills
    };

    //Update the header name on ALL pages
    const headerName = document.querySelector('.header-text h1');
    if (headerName) headerName.textContent = profile.name;

    //Update the subtitle under the name on ALL pages from the saved course
    const headerCourse = document.querySelector('.header-text h2');
    if (headerCourse) headerCourse.textContent = courseToTitle(profile.course);

    // --- HOMEPAGE LOGIC ---
    const displaySection = document.getElementById('profile-display');
    if (displaySection) {
        document.getElementById('display-name').textContent = profile.name;
        document.getElementById('display-course').textContent = profile.course;
        document.getElementById('display-year').textContent = profile.year;
        document.getElementById('display-about').textContent = profile.about;
        document.getElementById('display-skills').textContent = profile.skills;

        const editSection = document.getElementById('profile-edit');
        const errorMsg = document.getElementById('error-message');
        const editBtn = document.getElementById('edit-btn');
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');

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

        cancelBtn.addEventListener('click', () => {
            editSection.classList.add('hidden');
            displaySection.classList.remove('hidden');
        });

        // ACTIVITY 7: Save to Database (Update)
        saveBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('edit-name');
            nameInput.classList.remove('input-error');
            errorMsg.style.display = 'none';

            const newName = nameInput.value.trim();
            const newCourse = document.getElementById('edit-course').value.trim();
            const newYear = document.getElementById('edit-year').value.trim();
            const newAbout = document.getElementById('edit-about').value.trim();
            const newSkills = document.getElementById('edit-skills').value.trim();

            if (!newName || !newCourse || !newYear || !newAbout) {
                errorMsg.textContent = "Please complete all required fields.";
                errorMsg.style.display = 'block';
                return;
            }

            const nameWords = newName.split(/\s+/);
            if (nameWords.length < 2) {
                errorMsg.textContent = "Please enter both a first and last name.";
                errorMsg.style.display = 'block';
                nameInput.classList.add('input-error');
                return;
            }

            // ACTIVITY 7: Database Update Fetch
            //Disable the button while saving so it can't be double-clicked
            saveBtn.disabled = true;
            saveBtn.textContent = "Saving...";
            try {
                const response = await fetch(`${API_URL}/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: newName,
                        course: newCourse,
                        year: newYear,
                        about: newAbout,
                        skills: newSkills
                    })
                });

                if (response.ok) {
                    alert("Profile updated successfully.");

                    localStorage.setItem('profileName', newName);
                    localStorage.setItem('profileCourse', newCourse);
                    localStorage.setItem('profileYear', newYear);
                    localStorage.setItem('profileAbout', newAbout);
                    localStorage.setItem('profileSkills', newSkills);

                    document.getElementById('display-name').textContent = newName;
                    document.getElementById('display-course').textContent = newCourse;
                    document.getElementById('display-year').textContent = newYear;
                    document.getElementById('display-about').textContent = newAbout;
                    document.getElementById('display-skills').textContent = newSkills;
                    if (headerName) headerName.textContent = newName;
                    //Update the header subtitle right away after saving
                    if (headerCourse) headerCourse.textContent = courseToTitle(newCourse);

                    editSection.classList.add('hidden');
                    displaySection.classList.remove('hidden');
                } else if (response.status === 401 || response.status === 403) {
                    alert("Your session has expired. Please log in again.");
                    logoutUser();
                } else {
                    const data = await response.json().catch(() => ({}));
                    alert(data.error || "Unable to update your profile.");
                }
            } catch (err) {
                console.error("Profile update failed:", err);
                //Clearer message, since this only happens when the server can't be reached
                alert("Cannot reach the server. Make sure node server.js is running and your phone is on the same Wi-Fi.");
            } finally {
                //Re-enable the button whether the save worked or not
                saveBtn.disabled = false;
                saveBtn.textContent = "Save";
            }
        });
    }

    // --- CONTACT PAGE LOGIC ---
    const contactDisplaySection = document.getElementById('contact-display');
    if (contactDisplaySection) {
        const defaultContact = {
            schoolEmail: "20190018209@my.xu.edu.ph",
            personalEmail: "ersonpeito53@gmail.com",
            github: "github.com/pepito-peterson",
            location: "El Salvador City, Misamis Oriental, 9017"
        };

        const contactInfo = {
            schoolEmail: localStorage.getItem('contactSchool') || defaultContact.schoolEmail,
            personalEmail: localStorage.getItem('contactPersonal') || defaultContact.personalEmail,
            github: localStorage.getItem('contactGithub') || defaultContact.github,
            location: localStorage.getItem('contactLocation') || defaultContact.location
        };

        document.getElementById('display-school-email').textContent = contactInfo.schoolEmail;
        document.getElementById('display-personal-email').textContent = contactInfo.personalEmail;
        document.getElementById('display-github').textContent = contactInfo.github;
        document.getElementById('display-location').textContent = contactInfo.location;

        const githubLink = document.getElementById('display-github-link');
        if (githubLink) {
            githubLink.href = contactInfo.github.startsWith('http') ? contactInfo.github : 'https://' + contactInfo.github;
        }

        const contactEditSection = document.getElementById('contact-edit');
        const contactErrorMsg = document.getElementById('contact-error-message');
        const editContactBtn = document.getElementById('edit-contact-btn');
        const saveContactBtn = document.getElementById('save-contact-btn');
        const cancelContactBtn = document.getElementById('cancel-contact-btn');

        editContactBtn.addEventListener('click', () => {
            document.getElementById('edit-school-email').value = document.getElementById('display-school-email').textContent;
            document.getElementById('edit-personal-email').value = document.getElementById('display-personal-email').textContent;
            document.getElementById('edit-github').value = document.getElementById('display-github').textContent;
            document.getElementById('edit-location').value = document.getElementById('display-location').textContent;

            contactErrorMsg.style.display = 'none';
            contactDisplaySection.classList.add('hidden');
            contactEditSection.classList.remove('hidden');
        });

        cancelContactBtn.addEventListener('click', () => {
            contactEditSection.classList.add('hidden');
            contactDisplaySection.classList.remove('hidden');
        });

        saveContactBtn.addEventListener('click', () => {
            const schoolInput = document.getElementById('edit-school-email');
            const personalInput = document.getElementById('edit-personal-email');

            schoolInput.classList.remove('input-error');
            personalInput.classList.remove('input-error');
            contactErrorMsg.style.display = 'none';

            const newSchool = schoolInput.value.trim();
            const newPersonal = personalInput.value.trim();
            const newGithub = document.getElementById('edit-github').value.trim();
            const newLocation = document.getElementById('edit-location').value.trim();

            if (!newSchool || !newPersonal || !newGithub || !newLocation) {
                contactErrorMsg.textContent = "Please complete all required fields.";
                contactErrorMsg.style.display = 'block';
                return;
            }

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

            localStorage.setItem('contactSchool', newSchool);
            localStorage.setItem('contactPersonal', newPersonal);
            localStorage.setItem('contactGithub', newGithub);
            localStorage.setItem('contactLocation', newLocation);

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
// 4. GLOBAL FUNCTIONS (Camera & Fallback Auth)
// ==========================================
function openCamera() {
    if (!navigator.camera) {
        alert("Camera plugin not found. Ensure you are running this on an emulator or physical device.");
        return;
    }

    if (cordova.plugins && cordova.plugins.permissions) {
        const permissions = cordova.plugins.permissions;
        permissions.checkPermission(permissions.CAMERA, function(status) {
            if (status.hasPermission) {
                launchCamera();
            } else {
                permissions.requestPermission(permissions.CAMERA, function(status) {
                    if (status.hasPermission) {
                        launchCamera();
                    } else {
                        alert("Camera access was denied. Please enable camera permissions in your device settings.");
                    }
                }, function() {
                    alert("Camera permission request failed.");
                });
            }
        });
    } else {
        launchCamera();
    }
}
function launchCamera() {
    let options = {
        quality: 50,
        //Use DATA_URL to bypass Android file security blocks
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        //Shrink the photo to 600x600 max. A full-size phone photo is several MB,
        //which is too big for localStorage and slow to upload.
        targetWidth: 600,
        targetHeight: 600,
        correctOrientation: true,
        saveToPhotoAlbum: false
    };
    navigator.camera.getPicture(onCameraSuccess, onCameraFail, options);
}

//Must be a plain "function", NOT "async function".
//The Cordova camera plugin rejects async functions as callbacks and the camera never opens.
function onCameraSuccess(imageData) {
    let imageElement = document.getElementById('profile-pic');

    //cordova-plugin-camera v8 already returns "data:image/jpeg;base64,...".
    //Only add the prefix if it's missing, otherwise the image is broken (shows alt text).
    let base64Image = imageData.startsWith("data:") ? imageData : "data:image/jpeg;base64," + imageData;

    if (imageElement) imageElement.src = base64Image;

    //Save to the database FIRST, then cache it locally.
    //uses .then() instead of await, since this is no longer an async function
    saveProfilePicture(base64Image).then(function(saved) {
        if (saved) {
            safeSetItem('savedProfilePicture', base64Image);
            alert("Profile picture saved!");
        }
    });
}

//localStorage.setItem that doesn't crash when storage is full
function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (err) {
        console.warn("Could not cache " + key + " in localStorage:", err);
    }
}

// ACTIVITY 7: Save (or clear, when null) the profile picture in the database
async function saveProfilePicture(base64Image) {
    try {
        const response = await fetch(`${API_URL}/profile/picture`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ profile_picture: base64Image })
        });

        if (response.ok) return true;
        if (response.status === 401 || response.status === 403) {
            alert("Your session has expired. Please log in again.");
            logoutUser();
            return false;
        }
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Unable to save your profile picture.");
    } catch (err) {
        console.error("Profile picture upload failed:", err);
        //Clearer message, since this only happens when the server can't be reached
        alert("Cannot reach the server. Make sure node server.js is running and your phone is on the same Wi-Fi.");
    }
    return false;
}

function onCameraFail(message) {
    if (message.toLowerCase().includes("no image selected") || message.toLowerCase().includes("cancelled")) {
        console.log("Camera cancelled by user.");
        return;
    }
    if (message.toLowerCase().includes("permission")) {
        alert("Camera access was denied. Please check your device permissions.");
        return;
    }
    alert("Unable to access the camera: " + message);
}

function loadProfilePicture() {
    let storedImage = localStorage.getItem('savedProfilePicture');
    let imageElement = document.getElementById('profile-pic');

    if (imageElement) {
        if (storedImage) {
            imageElement.src = storedImage;
        } else {
            imageElement.src = "img/PetersonPepito.jpg";
        }
    }
}

//Turns a course into the header subtitle, e.g.
// "BS Information Technology" -> "Information Technology Student"
// "Bachelor of Science in Computer Science" -> "Computer Science Student"
function courseToTitle(course) {
    const field = course
        .replace(/^(BS|B\.S\.|BSc|AB|BA)\s+(in\s+)?/i, '')
        .replace(/^Bachelor of (Science|Arts)( in)?\s+/i, '')
        .trim();
    return (field || course) + " Student";
}

function logoutUser() {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('savedProfilePicture');
    window.location.replace('login.html');
}

