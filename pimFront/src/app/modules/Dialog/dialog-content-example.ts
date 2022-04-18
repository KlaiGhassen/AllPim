import { Component, Input } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'dialog-content-example',
  templateUrl: './dialog-content-example.html',
})

export class DialogContentExample {
  public mdf = JSON.parse(localStorage.getItem("mdf"));
  constructor(public dialog: MatDialog) { }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
    console.log(this.mdf);
    localStorage.removeItem("mdf");
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-content-example.html',
})
export class DialogContentExampleDialog {
  public mdf = JSON.parse(localStorage.getItem("mdf"));
}


/**  Copyright 2022 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
