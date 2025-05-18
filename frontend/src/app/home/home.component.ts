import { Component } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    account: any;

    constructor(private accountService: AccountService) {
        this.account = this.accountService.accountValue;
    }
}