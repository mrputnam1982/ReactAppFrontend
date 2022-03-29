import {BehaviorSubject} from 'rxjs';
const currentImageSubject = new BehaviorSubject();

export const getImageService = {
    setImage,
    currentImage: currentImageSubject.asObservable(),
    get currentImageValue() {
        var image = localStorage.getItem("dataUrl");
        if(image) return JSON.parse(image);
        else {
            console.log(currentImageSubject.value);
            return currentImageSubject.value;
        }
    }
}

function setImage(image) {
    console.log("setImage", image);
    console.log("dataUrl in localStorage", localStorage.getItem("dataUrl"));
    currentImageSubject.next(image);
    localStorage.setItem("dataUrl", JSON.stringify(image));
}
