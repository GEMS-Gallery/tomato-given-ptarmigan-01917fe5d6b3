import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { backend } from 'declarations/backend';

const FileInput = styled('input')(({ theme }) => ({
  display: 'none',
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
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
      <UploadButton
        variant="contained"
        component="label"
      >
        Upload File
        <FileInput
          type="file"
          multiple
          onChange={handleFileUpload}
        />
      </UploadButton>
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
