/**
 * Shared document preview utilities.
 * Extracted from DocumentPreviewPanel.vue and DocumentPreviewResult.vue
 * to avoid duplication of file-type detection, size formatting, and label logic.
 */

/**
 * Infer document file type from an explicit type string or a filename.
 * Returns lowercase extension (without dot), or empty string if undetectable.
 */
export function inferFileType(explicitType?: string, fileName?: string): string {
    if (explicitType) {
        return explicitType.toLowerCase();
    }
    const name = fileName || '';
    const dotIndex = name.lastIndexOf('.');
    if (dotIndex > 0 && dotIndex < name.length - 1) {
        return name.slice(dotIndex + 1).toLowerCase();
    }
    return '';
}

/**
 * CSS class suffix for file-type badges (e.g. 'type-word', 'badge-excel').
 */
export function getFileTypeClass(fileType: string): string {
    const t = fileType.toLowerCase();
    if (['docx', 'doc'].includes(t)) return 'word';
    if (['xlsx', 'xls'].includes(t)) return 'excel';
    if (['pptx', 'ppt'].includes(t)) return 'ppt';
    if (t === 'pdf') return 'pdf';
    if (['html', 'htm'].includes(t)) return 'html';
    return 'default';
}

/**
 * Short badge label (e.g. 'DOCX', 'XLSX', 'PPTX').
 */
export function getFileTypeAbbr(fileType: string): string {
    const t = fileType.toUpperCase();
    if (t.startsWith('DOC')) return 'DOCX';
    if (t.startsWith('XLS')) return 'XLSX';
    if (t.startsWith('HTM')) return 'HTML';
    return t.slice(0, 4);
}

/**
 * Human-readable file type label (e.g. 'Word', 'Excel', 'PPT').
 */
export function getFileTypeLabel(fileType: string): string {
    const t = fileType.toLowerCase();
    const map: Record<string, string> = {
        docx: 'Word',
        doc: 'Word',
        xlsx: 'Excel',
        xls: 'Excel',
        pptx: 'PPT',
        ppt: 'PPT',
        pdf: 'PDF',
        html: 'HTML',
        htm: 'HTML'
    };
    return map[t] || 'Document';
}

/**
 * Format file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
