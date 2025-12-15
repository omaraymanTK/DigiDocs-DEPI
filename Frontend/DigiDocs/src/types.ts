export interface RouterContext {
    user: {
        id?: number
        name?: string
        role: string
        token?: string
    } | null
    session: {
        id: string
        token: string
    } | null
    isLoggedIn: boolean
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
    occupation: string;
    complaint: string;
    chronicDiseases: string;
    serviceType: string;
    priority: string;
    amountDue: number;
    status: 'waiting' | 'in-examination' | 'done';
    addedAt: Date;
}

export interface PatientProfile {
    patientId: number;
    pname: string;
    page: number;
    pjob: string;
    pgender: string;
    paddress: string;
    pcomplain: string;
    pchronicDisease: string;
    pserviceType: number;
    ppriority: number;
    pamountToPay: number;
    pphoneNumber: string;
}

export interface PatientQueueItem {
    patientQueueId: number;
    patientId: number;
    patient: PatientProfile;
    status: number;
}
