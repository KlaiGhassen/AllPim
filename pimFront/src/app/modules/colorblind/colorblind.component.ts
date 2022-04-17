import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colorblind',
  templateUrl: './colorblind.component.html',
  styleUrls: ['./colorblind.component.scss']
})
export class ColorblindComponent implements OnInit {

  constructor() { }
  files

  
  
  pickimage(){

    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    var normalImg = window.document.getElementById('normalImg');
  var normalImgSrc = normalImg.getAttribute('src');
  var imgPicker = window.document.getElementById('img-picker');
  var filteredImgs = document.querySelectorAll('[class^="img--"]');
  var filename = 'colorblind-gallery-' + normalImgSrc.split('/').pop();
  
  /**
   * Image picker
   */
  imgPicker.addEventListener('change', function () {
    
    // Only reads first file when multiple are selected
    const file = (<HTMLInputElement>document.getElementById('img-picker')).files[0]; //this.files[0];
    if (file) {
      console.log("ééééézzzzebi")
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        filename = 'colorblind-gallery-' + file.name;
        const csv: string | ArrayBuffer = reader.result;
        console.log(csv)
        const csvv = reader.result;
        normalImg.setAttribute("src", csv.toString());
        //replaceImg(this.result);
        filteredImgs.forEach((filteredImg: HTMLImageElement) => {
          //filteredImg.src = csv.toString();
          filteredImg.setAttribute("src", csv.toString());
        });
      });
      // Converts to url used for src
      reader.readAsDataURL(file);
    }
  });
  }
  ngOnInit(): void {
  }

}
