export interface Notification
{
    id: string;
    _id:string;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    time: string;
    link?: string;
    useRouter?: boolean;
    read: boolean;
    docId?: string;
    patientId?: string;
}
