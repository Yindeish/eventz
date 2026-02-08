
export type tNextStep = 'EMAIL_CODE_VERIFICATION' | 'PHONE_VERIFICATION' | 'PHONE_CODE_VERIFICATION' | 'COMPLETE_REGISTRATION';
export type tRole = 'attendee' | 'organizer';

export enum eIntersts {
    MUSIC = 'Music',
    ART = 'Art',
    // TECHNOLOGY = 'Technology',
    // SPORTS = 'Sports',
    // EDUCATION = 'Education',
    HEALTH = 'Health',
    BUSINESS = 'Business',
    // FOOD = 'Food',
    // TRAVEL = 'Travel',
    // FASHION = 'Fashion',
    // FILM = 'Film',
    // GAMING = 'Gaming',
    // LITERATURE = 'Literature',
    // SCIENCE = 'Science',
    // NATURE = 'Nature',
    // POLITICS = 'Politics',
    // RELIGION = 'Religion',
    // ENVIRONMENT = 'Environment',
    // PHOTOGRAPHY = 'Photography',
    // THEATER = 'Theater',
    BANKING = 'Banking',
    READING = 'Reading',
}

export interface iBusiness {
    about: string,
    companyName: string,
    companyType: string,
    phone: string,
    website: string,
    image: string,
}

export interface iUser {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    userName: string,
    gender: string,
    hashedPwd: string,
    phone: string,
    picture: string,
    role: tRole,
    uId: string,
    dob: string,
    deviceToken?: string,
    business?: iBusiness,
    interests: string[],
    profileSetup: boolean,
    businessSetup: boolean,
    eventsIds: string[],
    followersIds: string[],
    followingsIds: string[],
}