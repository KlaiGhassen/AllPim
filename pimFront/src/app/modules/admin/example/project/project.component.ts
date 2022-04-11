import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { ProjectService } from './project.service';
import { GlobalService } from 'app/global.service';
import { DomSanitizer } from '@angular/platform-browser';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogAppointementComponent } from '../../dialog-appointement/dialog-appointement.component';
import { CalendarService } from 'app/modules/calendar/calendar.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { CalendarEvent } from 'app/modules/calendar/calendar.types';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    encapsulation: ViewEncapsulation.None,

    changeDetection: ChangeDetectionStrategy.Default,
})
export class ProjectComponent implements OnInit, OnDestroy {
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any = [];
    picture;
    user;
    selectedProject: string = 'ACME Corp. Backend App';
    filesPredection: File[] = [];
    newEvent;
    profilePicture;

    notification: Notification = {
        id: null,
        _id: null,
        icon: null,
        image: null,
        title: null,
        description: null,
        time: '',
        link: null,
        useRouter: null,
        read: false,
        docId: null,
        patientId: null,
    };
    brag;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _Us: UserService,
        private sanitizer: DomSanitizer,
        private gs: GlobalService,
        private _projectService: ProjectService,
        private _router: Router,
        public dialog: MatDialog,
        private _calendarService: CalendarService,
        private _notifservice: NotificationsService
    ) {}
    openDialog(docId, place, dd): void {
        const dialogRef = this.dialog.open(DialogAppointementComponent, {
            width: '250px',

            data: { docId: docId, place: place },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    /**
     * Add event
     */
    addEvent(docId: string, place: string) {
        var now = new Date().getTime();
        // Get the clone of the event form value
        let newEvent = new CalendarEvent(
            '123',
            '1a470c8e-40ed-4c2d-b590-a4f1f6ead6cc',
            this.gs.getUser()._id,
            this.gs.getUser().full_name + now,
            docId,
            true,
            false,
            'Pending',
            this.brag,
            place
        );

        // Add the event
        this._calendarService.addEvent(newEvent).subscribe(() => {
            this.notification.description = `${
                this.gs.getUser().full_name
            } have submitted an appointement`;
            this.notification.icon = 'heroicons_solid:star';
            this.notification.title = 'new Appointement';
            this.notification.time = Date();
            this.notification.read = false;
            //this.notification.docId = this.gs.getUser()._id;
            this.notification.docId = docId;
            this.notification.patientId = this.gs.getUser()._id;
            this.notification.useRouter = true;
            this.notification.link = '/calendar';

            this._notifservice.create(this.notification).subscribe((res) => {
                console.log(res);
                //this.notification_component.ngOnInit();
            });
            //this.ngOnInit();
        });
    }
    // ------------------------------

    onSelectPredection(event: any) {
        console.log(event);
        this.filesPredection.push(...event.addedFiles);
    }
    onRemovePredection(event: any) {
        console.log(event);
        this.filesPredection.splice(this.filesPredection.indexOf(event), 1);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     donMedia() {
        this._Us.downloadMedia(this.user.profilePicture).subscribe((blob) => {
            // var myFile = this.blobToFile(blob, 'my-image1.png');
            const objectURL = URL.createObjectURL(blob);
            this.profilePicture =
                this.sanitizer.bypassSecurityTrustUrl(objectURL);

            // this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        });
    }
    ngOnInit(): void {

        this.user = this.gs.getUser();
        this.donMedia();

        // Get the data
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                console.log(data);
                data.forEach((elm) => {
                    console.log(elm.profilePicture);
                    this._projectService
                        .downloadMedia(elm.profilePicture)
                        .subscribe((blob) => {
                            // var myFile = this.blobToFile(blob, 'my-image1.png');
                            const objectURL = URL.createObjectURL(blob);
                            this.picture =
                                this.sanitizer.bypassSecurityTrustUrl(
                                    objectURL
                                );
                            // this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
                            elm.profilePicture = this.picture;
                            console.log(elm.profilePicture);
                            this.data.push(elm);
                        });
                });
                // Store the data
                // Prepare the chart data
                // this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        // window['Apex'] = {
        //     chart: {
        //         events: {
        //             mounted: (chart: any, options?: any): void => {
        //                 this._fixSvgFill(chart.el);
        //             },
        //             updated: (chart: any, options?: any): void => {
        //                 this._fixSvgFill(chart.el);
        //             },
        //         },
        //     },
        // };
    }
    disease;
    loading = false;
    uploadPredection = false;
    upload() {
        this.loading = true;

        console.log('hello');
        this.gs.postFileToPy(this.filesPredection[0]).subscribe((data: any) => {
            console.log(data);
            this.loading = false;
            this.disease = data.disease;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    // private _prepareChartData(): void
    // {
    //     // Github issues
    //     this.chartGithubIssues = {
    //         chart      : {
    //             fontFamily: 'inherit',
    //             foreColor : 'inherit',
    //             height    : '100%',
    //             type      : 'line',
    //             toolbar   : {
    //                 show: false
    //             },
    //             zoom      : {
    //                 enabled: false
    //             }
    //         },
    //         colors     : ['#64748B', '#94A3B8'],
    //         dataLabels : {
    //             enabled        : true,
    //             enabledOnSeries: [0],
    //             background     : {
    //                 borderWidth: 0
    //             }
    //         },
    //         grid       : {
    //             borderColor: 'var(--fuse-border)'
    //         },
    //         labels     : this.data.githubIssues.labels,
    //         legend     : {
    //             show: false
    //         },
    //         plotOptions: {
    //             bar: {
    //                 columnWidth: '50%'
    //             }
    //         },
    //         series     : this.data.githubIssues.series,
    //         states     : {
    //             hover: {
    //                 filter: {
    //                     type : 'darken',
    //                     value: 0.75
    //                 }
    //             }
    //         },
    //         stroke     : {
    //             width: [3, 0]
    //         },
    //         tooltip    : {
    //             followCursor: true,
    //             theme       : 'dark'
    //         },
    //         xaxis      : {
    //             axisBorder: {
    //                 show: false
    //             },
    //             axisTicks : {
    //                 color: 'var(--fuse-border)'
    //             },
    //             labels    : {
    //                 style: {
    //                     colors: 'var(--fuse-text-secondary)'
    //                 }
    //             },
    //             tooltip   : {
    //                 enabled: false
    //             }
    //         },
    //         yaxis      : {
    //             labels: {
    //                 offsetX: -16,
    //                 style  : {
    //                     colors: 'var(--fuse-text-secondary)'
    //                 }
    //             }
    //         }
    //     };

    //     // Task distribution
    //     this.chartTaskDistribution = {
    //         chart      : {
    //             fontFamily: 'inherit',
    //             foreColor : 'inherit',
    //             height    : '100%',
    //             type      : 'polarArea',
    //             toolbar   : {
    //                 show: false
    //             },
    //             zoom      : {
    //                 enabled: false
    //             }
    //         },
    //         labels     : this.data.taskDistribution.labels,
    //         legend     : {
    //             position: 'bottom'
    //         },
    //         plotOptions: {
    //             polarArea: {
    //                 spokes: {
    //                     connectorColors: 'var(--fuse-border)'
    //                 },
    //                 rings : {
    //                     strokeColor: 'var(--fuse-border)'
    //                 }
    //             }
    //         },
    //         series     : this.data.taskDistribution.series,
    //         states     : {
    //             hover: {
    //                 filter: {
    //                     type : 'darken',
    //                     value: 0.75
    //                 }
    //             }
    //         },
    //         stroke     : {
    //             width: 2
    //         },
    //         theme      : {
    //             monochrome: {
    //                 enabled       : true,
    //                 color         : '#93C5FD',
    //                 shadeIntensity: 0.75,
    //                 shadeTo       : 'dark'
    //             }
    //         },
    //         tooltip    : {
    //             followCursor: true,
    //             theme       : 'dark'
    //         },
    //         yaxis      : {
    //             labels: {
    //                 style: {
    //                     colors: 'var(--fuse-text-secondary)'
    //                 }
    //             }
    //         }
    //     };

    //     // Budget distribution
    //     this.chartBudgetDistribution = {
    //         chart      : {
    //             fontFamily: 'inherit',
    //             foreColor : 'inherit',
    //             height    : '100%',
    //             type      : 'radar',
    //             sparkline : {
    //                 enabled: true
    //             }
    //         },
    //         colors     : ['#818CF8'],
    //         dataLabels : {
    //             enabled   : true,
    //             formatter : (val: number): string | number => `${val}%`,
    //             textAnchor: 'start',
    //             style     : {
    //                 fontSize  : '13px',
    //                 fontWeight: 500
    //             },
    //             background: {
    //                 borderWidth: 0,
    //                 padding    : 4
    //             },
    //             offsetY   : -15
    //         },
    //         markers    : {
    //             strokeColors: '#818CF8',
    //             strokeWidth : 4
    //         },
    //         plotOptions: {
    //             radar: {
    //                 polygons: {
    //                     strokeColors   : 'var(--fuse-border)',
    //                     connectorColors: 'var(--fuse-border)'
    //                 }
    //             }
    //         },
    //         series     : this.data.budgetDistribution.series,
    //         stroke     : {
    //             width: 2
    //         },
    //         tooltip    : {
    //             theme: 'dark',
    //             y    : {
    //                 formatter: (val: number): string => `${val}%`
    //             }
    //         },
    //         xaxis      : {
    //             labels    : {
    //                 show : true,
    //                 style: {
    //                     fontSize  : '12px',
    //                     fontWeight: '500'
    //                 }
    //             },
    //             categories: this.data.budgetDistribution.categories
    //         },
    //         yaxis      : {
    //             max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
    //             tickAmount: 7
    //         }
    //     };

    //     // Weekly expenses
    //     this.chartWeeklyExpenses = {
    //         chart  : {
    //             animations: {
    //                 enabled: false
    //             },
    //             fontFamily: 'inherit',
    //             foreColor : 'inherit',
    //             height    : '100%',
    //             type      : 'line',
    //             sparkline : {
    //                 enabled: true
    //             }
    //         },
    //         colors : ['#22D3EE'],
    //         series : this.data.weeklyExpenses.series,
    //         stroke : {
    //             curve: 'smooth'
    //         },
    //         tooltip: {
    //             theme: 'dark'
    //         },
    //         xaxis  : {
    //             type      : 'category',
    //             categories: this.data.weeklyExpenses.labels
    //         },
    //         yaxis  : {
    //             labels: {
    //                 formatter: (val): string => `$${val}`
    //             }
    //         }
    //     };

    //     // Monthly expenses
    //     this.chartMonthlyExpenses = {
    //         chart  : {
    //             animations: {
    //                 enabled: false
    //             },
    //             fontFamily: 'inherit',
    //             foreColor : 'inherit',
    //             height    : '100%',
    //             type      : 'line',
    //             sparkline : {
    //                 enabled: true
    //             }
    //         },
    //         colors : ['#4ADE80'],
    //         series : this.data.monthlyExpenses.series,
    //         stroke : {
    //             curve: 'smooth'
    //         },
    //         tooltip: {
    //             theme: 'dark'
    //         },
    //         xaxis  : {
    //             type      : 'category',
    //             categories: this.data.monthlyExpenses.labels
    //         },
    //         yaxis  : {
    //             labels: {
    //                 formatter: (val): string => `$${val}`
    //             }
    //         }
    //     };

    //     // Yearly expenses
    //     this.chartYearlyExpenses = {
    //         chart  : {
    //             animations: {
    //                 enabled: false
    //             },
    //             fontFamily: 'inherit',
    //             foreColor : 'inherit',
    //             height    : '100%',
    //             type      : 'line',
    //             sparkline : {
    //                 enabled: true
    //             }
    //         },
    //         colors : ['#FB7185'],
    //         series : this.data.yearlyExpenses.series,
    //         stroke : {
    //             curve: 'smooth'
    //         },
    //         tooltip: {
    //             theme: 'dark'
    //         },
    //         xaxis  : {
    //             type      : 'category',
    //             categories: this.data.yearlyExpenses.labels
    //         },
    //         yaxis  : {
    //             labels: {
    //                 formatter: (val): string => `$${val}`
    //             }
    //         }
    //     };
    // }
}
