import {BehaviorSubject} from 'rxjs';
const currentImageSubject = new BehaviorSubject();

export const getImageService = {
    setImage,
    currentImage: currentImageSubject.asObservable(),
    get currentImageValue() {
        var image = localStorage.getItem("dataUrl");
        if(image) return JSON.parse(image);
        else return currentImageSubject.value;
    }
}

function setImage(image) {
    currentImageSubject.next(image);
    localStorage.setItem("dataUrl", JSON.stringify(image));
}
