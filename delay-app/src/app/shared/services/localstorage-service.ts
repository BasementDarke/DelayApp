import { Injectable, Service } from '@angular/core';
import { JourneyConfig } from '../models/journey.config';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
    constructor(){
    }

    setItem(key: string, value: JourneyConfig){
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch(e){
            console.error('Error saving to local storage', e)
        }
    }

    getItem(key: string){
        try {
            let item = localStorage.getItem(key);
            return item ? JSON.parse(item) as JourneyConfig: null
        } catch(e){
            console.error('Error reading from local storage', e)
            return null
        }
    }

    removeItem(key: string){
        try {
            localStorage.removeItem(key)
        } catch(e){
            console.error('Error removing from local storage', e)
        }
    }

    clear(){
        try {
            localStorage.clear()
        } catch(e){
            console.error('Error clearing local storage', e)
        }
    }
}
