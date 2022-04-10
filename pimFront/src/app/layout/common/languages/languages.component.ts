import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'languages',
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    exportAs: 'languages',
})
export class LanguagesComponent implements OnInit, OnDestroy {
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;
    localLang;
    /**
     * Constructor
     */
    constructor(
        private _translocoService: TranslocoService,
        private translateService:TranslateService,
    ) {
        translateService.addLangs(['us', 'fr','ar']);
        translateService.setDefaultLang('us');
    
        const browserLang = translateService.getBrowserLang();
        translateService.use(browserLang.match(/ar|fr|us/) ? browserLang : 'us');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.flagCodes = {
            fr: 'fr',
            en: 'us',
            ar: 'ar',
        };
         this.localLang = localStorage.getItem('lang') || 'en';
         this.activeLang =  localStorage.getItem('lang') || 'en'; 

        // Get the available languages from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();
        // Subscribe to language changes
        this.translateService.setDefaultLang(this.localLang)
        this.translateService.use(localStorage.getItem('lang'))
        
      
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
        localStorage.setItem('lang', lang);
        if(lang != this.activeLang)
        window.location.reload();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

 
}
