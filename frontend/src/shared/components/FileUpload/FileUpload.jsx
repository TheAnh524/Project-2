import { FC, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onChange?: (file: File) => void
  value?: File
  type?: string
}

const FileUpload: FC<FileUploadProps> = ({
  onChange,
  value,
  type = 'image/*',
}) => {
  const [file, setFile] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const previewFile = URL.createObjectURL(file)
      setFile(previewFile)
      if (onChange) {
        onChange(file)
      }
    }
  }, [])

  useEffect(() => {
    if (value) {
      const imageUrl = URL.createObjectURL(value)
      setFile(imageUrl)
    }
  }, [value])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [type]: [],
    },
    multiple: false,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: 10,
          padding: 20,
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Thả file vào đây...</p>
        ) : (
          <p>Kéo và thả file vào đây, hoặc bấm để chọn</p>
        )}
      </div>

      {file && (
        <div style={{ marginTop: 20 }}>
          {type.includes('image') && (
            <img
              src={file}
              alt="preview"
              className="max-w-80 max-h-80 rounded-md"
            />
          )}
          {type.includes('video') && (
            <video controls className="max-w-80 max-h-80 rounded-md">
              <source src={file} />
            </video>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUpload
