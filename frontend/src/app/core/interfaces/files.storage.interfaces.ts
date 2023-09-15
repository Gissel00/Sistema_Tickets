export interface FileMetadata {
    _id: string;
    ticket: string;
    gDriveFileId: string;
    fileNameAndExtension: string;
    fileContentType: string;
    creado_a:       string;
    actualizado_a:  string;
  }

export interface FileMetadataResponse {
    _id: string;
    ticket: string;
    gDriveFileId: string;
    fileNameAndExtension: string;
    fileContentType: string;
    creado_a:       string;
    actualizado_a:  string;
    [key: string]: any;
  }

export interface MessageResponse {
  message: string;
}