import { Component } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
    account: any;

    constructor(private accountService: AccountService) {
        this.account = this.accountService.accountValue;
    }
}