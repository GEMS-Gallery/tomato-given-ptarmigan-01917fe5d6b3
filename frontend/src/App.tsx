import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { backend } from 'declarations/backend';

const DropZone = styled('div')(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
}));

interface File {
  id: bigint;
  name: string;
  size: bigint;
  createdAt: bigint;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedFiles = await backend.getFiles();
      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFiles = async (files: FileList | null) => {
    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async () => {
          const binaryStr = reader.result;
          if (binaryStr instanceof ArrayBuffer) {
            try {
              await backend.uploadFile(file.name, [...new Uint8Array(binaryStr)]);
            } catch (error) {
              console.error('Error uploading file:', error);
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
      await fetchFiles();
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const formatFileSize = (bytes: bigint): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === BigInt(0)) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(Number(bytes)) / Math.log(1024)).toString());
    return Math.round(Number(bytes) / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Modern Dropbox Clone
      </Typography>
      <DropZone
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Typography>Drag 'n' drop some files here, or click to select files</Typography>
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button variant="contained" component="span">
            Upload Files
          </Button>
        </label>
      </DropZone>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {files.map((file) => (
            <ListItem key={file.id.toString()}>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`Size: ${formatFileSize(file.size)} | Uploaded: ${new Date(Number(file.createdAt) / 1000000).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default App;
