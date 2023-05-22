export interface Course {
    id: number;
    title: string;
    description: string;
    createdByUserID: number;
    averageRating?: number;
    imageURL?: string;
}