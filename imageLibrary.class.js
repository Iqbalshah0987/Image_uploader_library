class ImageLibrary {
    constructor(options = {}) {
        // Configuration options
        this.config = {
            imageFormId: options.imageFormId || 'imageUploadForm',

            imageFileInputId: options.imageFileInputId || 'imageFileInput',
            imageFileInputName: options.imageFileInputName || 'imageFileInput',

            imageAltTextInputId: options.imageAltTextInputId || 'imageAltText',
            imageAltTextInputName: options.imageAltTextInputName || 'imageAltText',

            imageHiddenInputId: options.imageHiddenInputId || 'library_image_button',
            imageHiddenInputName: options.imageHiddenInputName || 'library_image_button',

            imageSubmitButtonId: options.imageSubmitButtonId || 'uploadImageButton',

            imageMessageFieldId: options.imageMessageFieldId || 'imageUploadMessage',

            imageSearchInputId: options.imageSearchInputId || 'imageSearch',
            imageSearchInputName: options.imageSearchInputName || 'imageSearch',
            
            imagesListContainerId: options.imagesListContainerId || 'imageList',

            imagesLibraryContainerId: options.imagesLibraryContainerId || 'imageLibrary',

            libraryToggleButtonId: options.libraryToggleButtonId || 'toggleImageLibrary',

            maxFiles: options.maxFiles || 20,
            maxFileSize: options.maxFileSize || 100,    // in KB
            allowedExtensions: options.allowedExtensions || ['jpg', 'jpeg', 'png', 'webp'],
            checks: options.checks || {
                maxFileSizeCheck: true,
                maxFilesCheck: true,
                allowedExtensionsCheck: true
            },
            
            onRemoveImage: options.onRemoveImage || this.defaultRemoveImage,
            onSearchImages: options.onSearchImages || this.defaultSearchImages,
            onChangeImages: options.onChangeImages || this.defaultChangeImages,
            onSubmitImages: options.onSubmitImages || this.defaultSubmitImages,
            onLoadLibraryImages: options.onLoadLibraryImages || this.defaultLoadLibraryImages,
        };

        // Initialize the library
        this.init_image_library();
        this.init_library_floating_button();
        this.eventListeners();
    }

    init_image_library = () => {
        // Create the main container div
        const container = document.createElement('div');
        container.style.cssText = `
            background-color: #fff;
            border-radius: .5rem;
            box-shadow: 0 .375rem 1.5rem 0 rgba(140, 152, 164, .125);
            position: sticky;
            top: 1rem;
            padding: 0 1.5rem;
            width: 100%;
            height: 100%;
            overflow-y: scroll
        `;

        // Create the form container div
        const formContainer = document.createElement('div');
        formContainer.style.cssText = `
            position: sticky;
            top: 0;
            z-index: 2;
            background: white;
            padding: 1rem 0;
        `;

        // Create the header div
        const header = document.createElement('div');
        header.style.cssText = `
            padding-bottom: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const heading = document.createElement('h4');
        heading.textContent = 'Images Library';
        heading.style.cssText = `
            text-align: center;
            margin-bottom: 0;
        `;
        header.appendChild(heading);

        const close_button = document.createElement('span');
        close_button.textContent = 'x';
        close_button.style.cssText = `
            background-color: red;
            color: white;
            border-radius: 50%;
            padding: 2px 10px;
            cursor: pointer; 
        `;
        close_button.addEventListener('click',  (e) => {
            document.getElementById(`${this.config.imagesLibraryContainerId}`).style.display = 'none';
            document.getElementById(`${this.config.libraryToggleButtonId}`).style.display = 'block';
        });
        header.append(close_button);
        formContainer.append(header);

        // Create the form
        const form = document.createElement('form');
        form.action = '';
        form.id = this.config.imageFormId;

        // Create the input and button container
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0rem;
            border: 1px solid rgb(221, 221, 221);
            border-radius: .35rem;
        `;

        // Create the file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = `${this.config.imageFileInputName}[]`;
        fileInput.accept = '.jpg, .jpeg, .png, .webp';
        fileInput.multiple = true;
        fileInput.required = true;
        fileInput.id = this.config.imageFileInputId;
        fileInput.style.cssText = `
            width: 100%;
            padding-left: 5px;
            cursor: pointer;
            min-width: 100px;
        `;
        inputContainer.appendChild(fileInput);

        // Create searchable text input
        const searchableText = document.createElement('input');
        searchableText.type = 'text';
        searchableText.name = this.config.imageAltTextInputName;
        searchableText.id = this.config.imageAltTextInputId;
        searchableText.required = true;
        searchableText.placeholder = "Searchable Text";
        searchableText.style.cssText = `
            border-radius: 0px; 
            border: 1px solid rgb(221, 221, 221); 
            border-width: 0 1px; 
            padding: 7.5px 5px; 
            width:100%
        `;
        inputContainer.appendChild(searchableText);

        // Create the hidden input
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.config.imageHiddenInputName;
        hiddenInput.id = this.config.imageHiddenInputId;
        inputContainer.appendChild(hiddenInput);

        // Create the submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.id = this.config.imageSubmitButtonId;
        submitButton.style.cssText = `
            font-size: 14px;
            padding: 0.5rem 1rem;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 0 .25rem .25rem 0;
            cursor: pointer;
        `;

        const buttonText = document.createElement('span');
        buttonText.textContent = 'Upload';
        submitButton.append(buttonText);

        // Create the spinner
        const spinner = document.createElement('span');
        spinner.style.cssText = `
            display: none;
            width: 1rem;
            height: 1rem;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #333;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        submitButton.appendChild(spinner);
        inputContainer.appendChild(submitButton);

        form.appendChild(inputContainer);

        const message = document.createElement('span');
        message.id = this.config.imageMessageFieldId;
        message.style.cssText = 'font-size: 14px;';
        form.appendChild(message);

        formContainer.appendChild(form);


        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.name = this.config.imageSearchInputName;
        searchInput.id = this.config.imageSearchInputId;
        searchInput.required = true;
        searchInput.placeholder = "Search Image";
        searchInput.style.cssText = `
            border-radius: 5px; 
            border: 1px solid rgb(221, 221, 221); 
            padding: 7px 10px; 
            margin-top: 10px;
            width: 100%
        `;
        formContainer.appendChild(searchInput);

        // Create the library div
        const library = document.createElement('div');
        library.id = this.config.imagesListContainerId;
        library.style.cssText = `
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #ddd;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: start;
            align-items: center;
        `;

        // Append everything to the main container
        // container.appendChild(header);
        container.appendChild(formContainer);
        container.appendChild(library);

        let libraryContainerPosition = this.libraryGetCookie('libraryContainerPosition');
        if (libraryContainerPosition != '') {
            libraryContainerPosition = JSON.parse(libraryContainerPosition);
        }
        let libraryContainerResize = this.libraryGetCookie('libraryContainerResize');
        if (libraryContainerResize != '') {
            libraryContainerResize = JSON.parse(libraryContainerResize);
        }
        // Append the container to the body
        const libraryContainer = document.createElement('div');
        libraryContainer.id = this.config.imagesLibraryContainerId;
        libraryContainer.style.cssText = `
            display: none;
            border-radius: 10px;
            z-index: 1001;
            position: fixed;
            top: ${libraryContainerPosition?.top ?? '5px'};
            right: ${libraryContainerPosition?.right ?? '5px'};
            bottom: ${libraryContainerPosition?.bottom ?? 'auto'};
            left: ${libraryContainerPosition?.left ?? 'auto'};
            width: ${libraryContainerResize?.width ?? '350px'};
            height: ${libraryContainerResize?.height ?? '90vh'};
        `;
        libraryContainer.appendChild(container);

        document.body.appendChild(libraryContainer);

        // Add spinner animation via JavaScript
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        this.dragNDrop(libraryContainer, 'libraryContainerPosition');
        this.resizeContainer(libraryContainer, 'libraryContainerResize');
    }

    librarySetCookie(cname, cvalue, expiry) {
        const d = new Date();
        d.setTime(d.getTime() + (expiry * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    libraryGetCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    dragNDrop(element, cookie_name) {
        // ############################################################ Add drag functionality
        let offsetX, offsetY;
        let isDragging = false;

        element.addEventListener('mousedown', (e) => {
            const excludedTags = ['IMG', 'INPUT'];
            const excludedClasses = ['resize-handle']; // Add any classes you want to exclude

            // Check if the target is an excluded tag or has an excluded class
            if (excludedTags.includes(e.target.tagName) || excludedClasses.some(cls => e.target.classList.contains(cls))) {
                return; // Prevent drag if the target matches an excluded tag or class
            }

            if (element.isResizing) return; // Prevent drag if resizing is active

            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && !element.isResizing) {
                // Calculate new position
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;

                // Update button position
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
                element.style.right = 'auto'; // Reset right to auto to allow free movement
                element.style.bottom = 'auto'; // Reset bottom to auto to allow free movement

                this.librarySetCookie(cookie_name, JSON.stringify({ left: `${newLeft}px`, top: `${newTop}px`, right: 'auto', bottom: 'auto' }), 365);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });
        // ############################################################ Add drag functionality
    }

    resizeContainer(element, cookie_name) {
        // const positions = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const positions = ['top', 'bottom', 'left', 'right'];
        let isResizing = false;

        // Create and append resize handles for all positions
        positions.forEach(position => {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = `resize-handle ${position}`;
            resizeHandle.style.cssText = `
                position: absolute;
                background-color: #007bff;
                z-index: 10;
            `;

            // Style each handle based on its position
            switch (position) {
                case 'top':
                    Object.assign(resizeHandle.style, {
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '3px',
                        borderRadius: '10px',
                        cursor: 'n-resize',
                    });
                    break;
                case 'bottom':
                    Object.assign(resizeHandle.style, {
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '3px',
                        borderRadius: '10px',
                        cursor: 's-resize',
                    });
                    break;
                case 'left':
                    Object.assign(resizeHandle.style, {
                        top: '0',
                        bottom: '0',
                        left: '0',
                        width: '3px',
                        borderRadius: '10px',
                        cursor: 'w-resize',
                    });
                    break;
                case 'right':
                    Object.assign(resizeHandle.style, {
                        top: '0',
                        bottom: '0',
                        right: '0',
                        width: '3px',
                        borderRadius: '10px',
                        cursor: 'e-resize',
                    });
                    break;
                case 'top-left':
                    Object.assign(resizeHandle.style, {
                        top: '0',
                        left: '0',
                        width: '10px',
                        height: '10px',
                        cursor: 'nw-resize',
                    });
                    break;
                case 'top-right':
                    Object.assign(resizeHandle.style, {
                        top: '0',
                        right: '0',
                        width: '10px',
                        height: '10px',
                        cursor: 'ne-resize',
                    });
                    break;
                case 'bottom-left':
                    Object.assign(resizeHandle.style, {
                        bottom: '0',
                        left: '0',
                        width: '10px',
                        height: '10px',
                        cursor: 'sw-resize',
                    });
                    break;
                case 'bottom-right':
                    Object.assign(resizeHandle.style, {
                        bottom: '0',
                        right: '0',
                        width: '10px',
                        height: '10px',
                        cursor: 'se-resize',
                    });
                    break;
            }

            element.appendChild(resizeHandle);

            // Add event listeners to the handle
            resizeHandle.addEventListener('mousedown', (e) => {
                if (element.isDragging) return; // Don't allow resizing when dragging

                e.preventDefault(); // Prevent text selection
                isResizing = position; // Store the active handle position
                document.body.style.cursor = resizeHandle.style.cursor;
            });

            document.addEventListener('mousemove', (e) => {
                if (isResizing && !element.isDragging) {
                    const rect = element.getBoundingClientRect();

                    // Calculate new dimensions based on the handle position
                    switch (isResizing) {
                        case 'top':
                            const newHeightTop = rect.bottom - e.clientY;
                            if (newHeightTop >= 100) {
                                element.style.height = `${newHeightTop}px`;
                                element.style.top = `${e.clientY}px`;
                            }
                            break;
                        case 'bottom':
                            const newHeightBottom = e.clientY - rect.top;
                            element.style.height = `${Math.max(newHeightBottom, 100)}px`;
                            break;
                        case 'left':
                            const newWidthLeft = rect.right - e.clientX;
                            if (newWidthLeft >= 150) {
                                element.style.width = `${newWidthLeft}px`;
                                element.style.left = `${e.clientX}px`;
                            }
                            break;
                        case 'right':
                            const newWidthRight = e.clientX - rect.left;
                            element.style.width = `${Math.max(newWidthRight, 150)}px`;
                            break;
                        case 'top-left':
                            const newHeightTopLeft = rect.bottom - e.clientY;
                            const newWidthTopLeft = rect.right - e.clientX;
                            if (newHeightTopLeft >= 100) {
                                element.style.height = `${newHeightTopLeft}px`;
                                element.style.top = `${e.clientY}px`;
                            }
                            if (newWidthTopLeft >= 150) {
                                element.style.width = `${newWidthTopLeft}px`;
                                element.style.left = `${e.clientX}px`;
                            }
                            break;
                        case 'top-right':
                            const newHeightTopRight = rect.bottom - e.clientY;
                            const newWidthTopRight = e.clientX - rect.left;
                            if (newHeightTopRight >= 100) {
                                element.style.height = `${newHeightTopRight}px`;
                                element.style.top = `${e.clientY}px`;
                            }
                            element.style.width = `${Math.max(newWidthTopRight, 150)}px`;
                            break;
                        case 'bottom-left':
                            const newHeightBottomLeft = e.clientY - rect.top;
                            const newWidthBottomLeft = rect.right - e.clientX;
                            element.style.height = `${Math.max(newHeightBottomLeft, 100)}px`;
                            if (newWidthBottomLeft >= 150) {
                                element.style.width = `${newWidthBottomLeft}px`;
                                element.style.left = `${e.clientX}px`;
                            }
                            break;
                        case 'bottom-right':
                            const newHeightBottomRight = e.clientY - rect.top;
                            const newWidthBottomRight = e.clientX - rect.left;
                            element.style.height = `${Math.max(newHeightBottomRight, 100)}px`;
                            element.style.width = `${Math.max(newWidthBottomRight, 150)}px`;
                            break;
                    }

                    const elementDimensions = {
                        width: element.style.width,
                        height: element.style.height
                    };
                    this.librarySetCookie(cookie_name, JSON.stringify(elementDimensions), 365);
                    this.librarySetCookie('libraryContainerPosition', JSON.stringify({ left: `${element.style.left}`, top: `${element.style.top}`, right: 'auto', bottom: 'auto' }), 365);
                }
            });

            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = 'default';
                }
            });
        });
    }

    init_library_floating_button = () => {

        const libraryFloatingButton = document.createElement('button');
        libraryFloatingButton.innerText = '+';
        libraryFloatingButton.id = this.config.libraryToggleButtonId;

        let libraryFloatingButtonPosition = this.libraryGetCookie('libraryFloatingButtonPosition');
        if (libraryFloatingButtonPosition != '') {
            libraryFloatingButtonPosition = JSON.parse(libraryFloatingButtonPosition) || {};
        }
        const buttonStyle = `
            position: fixed;
            top: ${libraryFloatingButtonPosition?.top ?? '100px'};
            right: ${libraryFloatingButtonPosition?.right ?? '50px'};
            bottom: ${libraryFloatingButtonPosition?.bottom ?? 'auto'};
            left: ${libraryFloatingButtonPosition?.left ?? 'auto'};
            width: 60px;
            height: 60px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            z-index: 1000;
            transition: background-color 0.3s ease;
        `;
        libraryFloatingButton.style.cssText = buttonStyle;

        this.dragNDrop(libraryFloatingButton, 'libraryFloatingButtonPosition');

        // Add hover effect using JavaScript
        libraryFloatingButton.addEventListener('mouseenter', () => {
            libraryFloatingButton.style.backgroundColor = '#0056b3';
        });

        libraryFloatingButton.addEventListener('mouseleave', () => {
            libraryFloatingButton.style.backgroundColor = '#007bff';
        });

        // Append the button to the body
        document.body.appendChild(libraryFloatingButton);

        // Add double click event listener
        libraryFloatingButton.addEventListener('dblclick', () => {
            document.getElementById(`${this.config.imagesLibraryContainerId}`).style.display = 'block';
            document.getElementById(`${this.config.libraryToggleButtonId}`).style.display = 'none';
        });
    }

    createImageElement(image) {
        const span = document.createElement('div');
        span.innerHTML = '<span class="remove_image_target">x</span>';
        span.style.cssText = `background: red; border-radius: 50%; font-size: 12px; padding: 0px 5px; color: white; position: absolute; top: -5px; right: -5px; cursor: pointer;`;
        span.setAttribute('data-id', image.id);

        const img = document.createElement('img');
        img.src = `${image.img}`;
        img.alt = `${image?.searchable_text ?? ''}`;
        img.loading = 'lazy';
        img.width = '78px';
        img.height = '78px';
        img.style.cssText = `width: 100%; height: 100%; object-fit: cover; cursor: pointer;`;
        img.classList.add('image_target');

        const input = document.createElement('input');
        input.type = 'hidden';
        input.value = `${image.img}`;
        input.style.cssText = 'display: none;';

        const div = document.createElement('div');
        div.style.cssText = `position: relative; margin: 5px; width: 80px; height: 80px; border: 1px solid;`;
        div.appendChild(img);
        div.appendChild(span);
        div.appendChild(input);

        return div;
    }

    defaultLoadLibraryImages = (res) => {
        // res = [{id:1, img:'path'}]
        try {
            const library = document.getElementById(`${this.config.imagesListContainerId}`);
            library.innerHTML = '';

            const fragment = document.createDocumentFragment();

            res.forEach(image => {
                const imageElement = this.createImageElement(image);
                fragment.appendChild(imageElement);
            });
            library.appendChild(fragment);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    loadLibraryImages(res) {
        if (typeof this.config.onLoadLibraryImages === "function") {
            this.config.onLoadLibraryImages(res, this);
        } else {
            this.defaultLoadLibraryImages(res);
        }
    }

    copy_text = (copyText) => {

        navigator.clipboard.writeText(copyText)
            .then(() => {
                this.showLibraryMessage('Text copied successfully', 'Green');
            })
            .catch((err) => {
                // console.error('Failed to copy text: ', err);
                this.showLibraryMessage('Failed to Copy text', 'Red');
            })
    }

    showLibraryMessage(msg, color){
        let message = document.getElementById(`${this.config.imageMessageFieldId}`);
        message.style.color = color;
        message.textContent = msg
        setTimeout(() => {
            message.textContent = ''
        }, 3000)
    }

    defaultSearchImages(searchText, images) {
        images.forEach(img => {
            const imageElement = img.parentElement;
            const isMatch = img.alt.toLowerCase().includes(searchText.toLowerCase());
            imageElement.style.display = isMatch ? "block" : "none";
        });
    }

    defaultRemoveImage(imageId) {
        // console.log(`Default remove image called for ID: ${imageId}`);
        // Remove the image element from the UI
        const imageElement = document.querySelector(`[data-id="${imageId}"]`);
        if (imageElement) {
            imageElement.parentElement.remove();
        }
    }

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
    }

    defaultSubmitImages = (e) => {
        e.preventDefault();
        try {
            this.showLibraryMessage(`Uploading...`, 'red');

            const library_image_submit_button = document.querySelector(`#${this.config.imageSubmitButtonId}`);
            library_image_submit_button.setAttribute('disabled', 'disabled');
            library_image_submit_button.querySelector('span:first-child').style.display = 'none';
            library_image_submit_button.querySelector('span:last-child').style.display = 'block';

            // Uploading Code
        } catch (error) {
            console.error('Error uploading images:', error);
        } finally {
            this.showLibraryMessage(`The images were uploaded successfully!`, 'green');

            library_image_submit_button.querySelector('span:last-child').style.display = 'none';
            library_image_submit_button.querySelector('span:first-child').style.display = 'block';
            library_image_submit_button.removeAttribute('disabled')
        }

    }

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
    }

}
