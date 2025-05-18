import { Component } from '@angular/core';

@Component({ 
    templateUrl: 'layout.component.html',
    styles: [`
        .admin-layout {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .admin-nav {
            background-color: #f8f9fa;
            padding: 1rem;
            border-bottom: 1px solid #dee2e6;
        }
    `]
})
export class LayoutComponent { }