/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    
    {
        id   : 'divider',
        title: 'dashboard',
        type : 'divider',
    },
    {
        id   : 'dashboard',
        title: 'dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        Role:"ophto"   
    },
    {
        id   : 'Calendar',
        title: 'Calendar',
        type : 'basic',
        icon : 'heroicons_outline:calendar',
        link : '/calendar',
        Role:"ophto"



    },
    {
        id   : 'Notes',
        title: 'Notes',
        type : 'basic',
        icon : 'heroicons_outline:calendar',
        link : '/notes',
        Role:"ophto"



    },
    {
        id   : 'Settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/settings',
        Role:"ophto"


    },
    {
        id   : 'dashboard',
        title: 'dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        Role:"simple"   
    },
    {
        id   : 'Calendar',
        title: 'Calendar',
        type : 'basic',
        icon : 'heroicons_outline:calendar',
        link : '/calendar',
        Role:"simple"



    },
    {
        id   : 'ColorBlind',
        title: 'ColorBlind',
        type : 'basic',
        icon : 'heroicons_outline:calendar',
        link : '/colorblind',
        Role:"simple"



    },
    {
        id   : 'Settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/settings',
        Role:"simple"


    },
    {
        id   : 'Pricing',
        title: 'Pricing',
        type : 'basic',
        icon : 'heroicons_outline:currency-dollar',
        link : '/pricing',
        Role:"ophto"
    },
    {
        id   : 'medicalfollowup',
        title: 'Patients',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/get',
        Role:"ophto"
    },{
        id   : 'chat',
        title: 'Chat',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/chat',
        Role:"ophto"   
    },
    {
        id   : 'chat',
        title: 'Chat',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/chat',
        Role:"simple"   
    },
    
 
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    }
];
