import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileIcon } from 'react-file-icon';
interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  accept?: string;
  className?: string;
  multiple?: boolean; // New prop to toggle between single/multiple uploads
  maxFiles?: number; // Maximum number of files allowed in multiple mode
  key?: string | number;
}

export const FileUpload = ({
  onFileUpload,
  accept = 'image/*',
  className = '',
  multiple = false,
  maxFiles = 5, // Default max files limit for multiple mode
}: FileUploadProps) => {
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const t = useTranslations('components.fileUpload');
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = multiple ? acceptedFiles : [acceptedFiles[0]];

      // Validate file count
      if (multiple && uploadedFiles.length + newFiles.length > maxFiles) {
        alert(t('maxFilesAllowed', { count: maxFiles }));
        return;
      }

      // Update uploaded files
      setUploadedFiles(previous =>
        multiple ? [...previous, ...newFiles] : newFiles
      );
      onFileUpload(newFiles);

      // Generate previews for images
      const newPreviews = new Map(previews);
      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            newPreviews.set(file.name, reader.result as string);
            setPreviews(new Map(newPreviews));
          });
          reader.readAsDataURL(file);
        }
      });
    },
    [onFileUpload, multiple, maxFiles, previews, uploadedFiles.length, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
    maxFiles: multiple ? maxFiles : 1,
  });

  const removeFile = (event: React.MouseEvent, fileName: string) => {
    event.stopPropagation();
    const newFiles = uploadedFiles.filter(file => file.name !== fileName);
    setUploadedFiles(newFiles);

    const newPreviews = new Map(previews);
    newPreviews.delete(fileName);
    setPreviews(newPreviews);

    onFileUpload(newFiles); // Update parent with remaining files
  };

  const clearAllFiles = (event: React.MouseEvent) => {
    event.stopPropagation();
    setUploadedFiles([]);
    setPreviews(new Map());
    onFileUpload([]);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />

        {uploadedFiles.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedFiles.map(file => (
                <div key={file.name} className="relative group">
                  {previews.get(file.name) ? (
                    <div className="relative">
                      <img
                        src={previews.get(file.name)}
                        alt={file.name}
                        className="max-h-28 w-full rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={event => removeFile(event, file.name)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label={t('removeFile')}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-20 mx-auto">
                        <FileIcon
                          extension={file.name.split('.').pop()}
                          {...defaultStyles}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={event => removeFile(event, file.name)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label={t('removeFile')}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-600 truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
            {multiple && uploadedFiles.length > 1 && (
              <button
                type="button"
                onClick={clearAllFiles}
                className="text-sm text-red-500 hover:text-red-700"
              >
                {t('clearAll')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600">
              {isDragActive ? (
                t('dropFilesHere', { count: multiple ? 2 : 1 })
              ) : (
                <>
                  {t('dragAndDrop', { count: multiple ? 2 : 1 })}
                  <br />
                  {accept && t('supportedFormat', { format: accept })}
                  {multiple && t('maxFiles', { count: maxFiles })}
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const defaultStyles = {
  labelColor: '#667EEA',
  labelUppercase: true,
};
