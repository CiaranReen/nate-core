import { PrivacySettings, ExportRecord } from "../smart-memory";
export declare class PrivacyManager {
    private encryptionKey;
    constructor(encryptionKey: string);
    updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings>;
    exportUserData(userId: string, format: "nate_readable" | "json" | "csv" | "pdf"): Promise<ExportRecord>;
    deleteUserData(userId: string): Promise<void>;
    anonymizeData(userId: string): Promise<void>;
    encryptSensitiveData(data: any): Promise<string>;
    decryptSensitiveData(encryptedData: string): Promise<any>;
    private getPrivacySettings;
    private mergeSettings;
    private validateSettings;
    private persistSettings;
    private gatherUserData;
    private formatData;
    private createExportRecord;
    private generateExportId;
    private calculateDataSize;
    private summarizeContents;
    private logExport;
    private validateDeletionRequest;
    private performDeletion;
    private logDeletion;
    private performAnonymization;
    private persistAnonymizedData;
}
