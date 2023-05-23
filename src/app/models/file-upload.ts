export class FileUpload {
    constructor(file:File){
        this.file = file;
    }
    name!: string;
    key!: string;
    url!: string;
    file: File;
}
