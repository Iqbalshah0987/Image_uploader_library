# Image Library Uploader

## Overview
The **Image Library** is a JavaScript-based module that allows users to upload, search, and manage images dynamically in a web application. It provides configurations for file validation, event handling, and user interactions.

## Features
- Upload multiple images with validation
- File size, extension, and maximum file limit checks
- Search images dynamically
- Remove images from the library
- Custom event handlers for image-related actions

## Installation
Simply include the script in your project and initialize the `ImageLibrary` object with your preferred configuration.

```html
<script src="imageLibrary.js"></script>
```

## Initialization
To initialize the library, create a new instance of `ImageLibrary` with your configuration:

```javascript
let imageLibrary = new ImageLibrary({
    imageFormId: 'imageUploadForm', // optional
    imageFileInputId: 'imageFileInput', // optional
    imageFileInputName: 'imageFileInput',   // optional
    imageAltTextInputId: 'imageAltText',    // optional
    imageAltTextInputName: 'imageAltText',  // optional
    imageHiddenInputId: 'library_image_button', // optional
    imageHiddenInputName: 'library_image_button',   // optional
    imageSubmitButtonId: 'uploadImageButton',   // optional
    imageMessageFieldId: 'imageUploadMessage',  // optional
    imageSearchInputId: 'imageSearch',  // optional
    imageSearchInputName: 'imageSearch',    // optional
    imagesListContainerId: 'imageList', // optional
    imagesLibraryContainerId: 'imageLibrary',   // optional
    libraryToggleButtonId: 'toggleImageLibrary',    // optional

    // File Validations
    maxFiles: 20,
    maxFileSize: 100, // KB
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    checks: {
        maxFileSizeCheck: true,
        maxFilesCheck: true,
        allowedExtensionsCheck: true
    },

    // Callbacks
    onRemoveImage: removeLibraryImage,
    onSearchImages: null,
    onChangeImages: null,
    onSubmitImages: uploadLibraryImages,
    onLoadLibraryImages: function (res, instance) {
        console.log("Custom loadLibraryImages function", res);
    }
});
```

## Configuration Options
The library supports the following configuration options:

### **Form and Input IDs**
| Option | Description |
|--------|-------------|
| `imageFormId` | ID of the image upload form |
| `imageFileInputId` | ID of the file input field |
| `imageFileInputName` | Name attribute of the file input |
| `imageAltTextInputId` | ID for image alt text input |
| `imageAltTextInputName` | Name attribute for image alt text input |
| `imageHiddenInputId` | ID for the hidden input field |
| `imageHiddenInputName` | Name attribute for the hidden input field |
| `imageSubmitButtonId` | ID of the submit button |
| `imageMessageFieldId` | ID of the message display field |
| `imageSearchInputId` | ID of the search input field |
| `imageSearchInputName` | Name attribute of the search input field |
| `imagesListContainerId` | ID of the image list container |
| `imagesLibraryContainerId` | ID of the image library container |
| `libraryToggleButtonId` | ID of the button to toggle image library |

### **File Validation Options**
| Option | Description |
|--------|-------------|
| `maxFiles` | Maximum number of files allowed per upload |
| `maxFileSize` | Maximum file size allowed in KB |
| `allowedExtensions` | List of allowed file extensions |
| `checks.maxFileSizeCheck` | Enable/disable file size check |
| `checks.maxFilesCheck` | Enable/disable max file count check |
| `checks.allowedExtensionsCheck` | Enable/disable file extension check |

### **Event Handlers**
| Option | Description |
|--------|-------------|
| `onRemoveImage` | Function called when an image is removed |
| `onSearchImages` | Function called when searching images |
| `onChangeImages` | Function called when file input changes |
| `onSubmitImages` | Function called when the form is submitted |
| `onLoadLibraryImages` | Function for loading images into the library | `defaultLoadLibraryImages` |

## Default Methods
The library includes default implementations for various actions:

This function loads the image library with images.
```javascript
// response = [{id:1, img:'path'}]
imageLibrary.loadLibraryImages(response);
// User Can override above method by ``` onLoadLibraryImages ``` define this callback.
```

### **Removing an Image**
```javascript
defaultRemoveImage(imageId) {
    const imageElement = document.querySelector(`[data-id="${imageId}"]`);
    if (imageElement) {
        imageElement.parentElement.remove();
    }
};
// User Can override above method by ``` onRemoveImage ``` define this callback.
```

### **Validating Image Files**
```javascript
defaultChangeImages = () => {
    const files = document.querySelector(`input[type="file"][name="${this.config.imageFileInputName}[]"]`).files;
    if (!files.length) return;


    if(this.config.checks.maxFileSizeCheck){
        const maxFileSize = this.config.maxFileSize * 1024; // Max size in KB
        for (let file of files) {
            if (file.size > maxFileSize) {
                this.showLibraryMessage(`File "${file.name}" exceeds the allowed size ${this.config.maxFileSize} KB.`, 'red');
                return;
            }
        }
    }

    if(this.config.checks.maxFilesCheck){
        if (files.length > this.config.maxFiles) {
            this.showLibraryMessage(`You can only upload up to ${this.config.maxFiles} files at a time.`, 'red');
            return;
        }
    }

    if(this.config.checks.allowedExtensionsCheck){
        let extension_not_allow = false;
        Array.from(files).forEach((file, index) => {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            if (!this.config.allowedExtensions.includes(fileExtension)) {
                extension_not_allow = true;
                return false;
            }
        });
        if (extension_not_allow) {
            this.showLibraryMessage(`You are trying to upload some invalid files!`, 'red');
            return false;
        }
    }
};
// User Can override above method by ``` onChangeImages ``` define this callback.
```

### **Search Images**
```javascript
defaultSearchImages(searchText, images) {
    images.forEach(img => {
        const imageElement = img.parentElement;
        const isMatch = img.alt.toLowerCase().includes(searchText.toLowerCase());
        imageElement.style.display = isMatch ? "block" : "none";
    });
};
// User Can override above method by ``` onSearchImages ``` define this callback.
```

### **Handling Form Submission**
```javascript
defaultSubmitImages = (e) => {
    e.preventDefault();
    try {
        this.showLibraryMessage(`Uploading...`, 'red');
        const submitButton = document.querySelector(`#${this.config.imageSubmitButtonId}`);
        submitButton.setAttribute('disabled', 'disabled');
        submitButton.querySelector('span:first-child').style.display = 'none';
        submitButton.querySelector('span:last-child').style.display = 'block';

        // Uploading Code
    } catch (error) {
        console.error('Error uploading images:', error);
    } finally {
        this.showLibraryMessage(`The images were uploaded successfully!`, 'green');
        submitButton.querySelector('span:last-child').style.display = 'none';
        submitButton.querySelector('span:first-child').style.display = 'block';
        submitButton.removeAttribute('disabled');
    }
};
// User Can override above method by ``` onSubmitImages ``` define this callback.
```

## Event Listeners
The library listens for various user actions:

```javascript
eventListeners = () => {
    // Event delegation for image-related actions
    document.addEventListener('click', (e) => {
        // Image click (copy URL)
        if (e.target && e.target.classList.contains('image_target')) {
            const input = e.target.parentElement.querySelector('input');
            this.copy_text(input.value);
        }

        // Remove image click
        else if (e.target && e.target.classList.contains('remove_image_target')) {
            const id = e.target.parentElement.getAttribute('data-id');

            // Call the custom or default remove image method
            if (typeof this.config.onRemoveImage === 'function') {
                this.config.onRemoveImage(id, this);
            }
        }
    });

    // Search images event listener
    const searchInput = document.getElementById(`${this.config.imageSearchInputId}`);
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const searchText = e.target.value;
            const images = document.querySelectorAll(`#${this.config.imagesListContainerId} img`);

            // Call the custom or default search method
            if (typeof this.config.onSearchImages === 'function') {
                this.config.onSearchImages(searchText, images, this);
            }
        });
    }

    const form = document.getElementById(this.config.imageFormId);
    if (form) {
        if (typeof this.config.onChangeImages === 'function') {
            form.addEventListener('change', this.config.onChangeImages);
        }
        if (typeof this.config.onSubmitImages === 'function') {
            form.addEventListener('submit', this.config.onSubmitImages);
        }
    }
};
```


## Example Usage

### Removing an Image

```javascript
let removeLibraryImage = async (id) => {
    if (!confirm('Are you sure you want to remove?')) return;

    try {
        const response = await fetch('/apis/image-library', {
            method: 'POST',
            body: JSON.stringify({ image_id: id }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const res = await response.json();
        if (res.status === 200) {
            console.log('Image removed successfully');
            let cachedImages = JSON.parse(localStorage.getItem('libraryImages')) || [];
            cachedImages = cachedImages.filter(img => img.id !== id);
            localStorage.setItem('libraryImages', JSON.stringify(cachedImages));
            document.querySelector(`[data-id="${id}"]`).parentElement.remove();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
```

### Uploading Images

```javascript
let uploadLibraryImages = async (e) => {
    e.preventDefault();
    let formElement = document.getElementById('imageUploadForm');
    let message = document.getElementById('imageUploadMessage');
    const formData = new FormData(formElement);
    formData.append('source', 'blogs');

    try {
        message.textContent = 'Uploading...';
        message.style.color = 'blue';

        const response = await fetch('/apis/image-library', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const res = await response.json();
        if (res.status === 200) {
            message.textContent = 'Upload successful!';
            message.style.color = 'green';
            formElement.reset();
            localStorage.setItem('libraryImages', JSON.stringify(res.newImages));
            imageLibrary.loadLibraryImages(res.newImages);
        } else {
            message.textContent = res.msg || 'Failed to upload';
            message.style.color = 'red';
        }
    } catch (error) {
        console.error('Error uploading images:', error);
        message.textContent = 'Upload error!';
        message.style.color = 'red';
    } finally {
        setTimeout(() => {
            message.textContent = '';
        }, 3000);
    }
};
```

### Fetching Images

```javascript
async function get_images() {
    try {
        const cachedImages = localStorage.getItem('libraryImages');
        if (cachedImages) {
            imageLibrary.loadLibraryImages(JSON.parse(cachedImages));
            return;
        }

        const response = await fetch('/apis/image-library?getImages=blogs');
        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`);
        }

        const res = await response.json();
        localStorage.setItem('libraryImages', JSON.stringify(res));
        imageLibrary.loadLibraryImages(res);
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}
```

### Overriding `loadLibraryImages`

You can define a custom function to handle image loading:

```javascript
imageLibrary.loadLibraryImages = function(images) {
    let container = document.getElementById('imageLibrary');
    container.innerHTML = '';

    images.forEach(image => {
        let imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.setAttribute('data-id', image.id);
        container.appendChild(imgElement);
    });
};
```

### Automatically Fetch Images on Page Load

```javascript
window.addEventListener('load', get_images);
```

## Conclusion

This library allows for seamless image upload and management with caching support. You can customize various behaviors by overriding event handlers and functions.

Happy coding! 🚀

---

## License
This project is open-source and available for use.

