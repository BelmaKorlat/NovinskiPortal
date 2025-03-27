import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor() { }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    getCurrentUser(): any | null {
        const token = this.getToken();

        if (!token) {
            return null;
        }
        return jwtDecode(token);
    }

    isLoggedIn(): boolean {
        const user = this.getCurrentUser();
        return !!user && (!user.exp || Date.now() < user.exp * 1000);
    }

    logout(): void {
        localStorage.removeItem('authToken');
    }
}