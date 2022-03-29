import {BehaviorSubject} from 'rxjs';
const isLoadingSubject = new BehaviorSubject();
export const getIsLoading = {
    
    setIsLoading,
    isLoading: isLoadingSubject.asObservable(),
    get isLoadingValue() {
        return isLoadingSubject.value
        
    }
}

function setIsLoading(value) {
    isLoadingSubject.next(value);
}