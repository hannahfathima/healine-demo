import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Typography,
  TextField,
  Card,
  CardMedia,
  IconButton,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { createRecord } from '../../apis/services/CommonApiService';
import { ApiEndPoints } from '../../apis/ApiEndPoints';
import ShowInputError from '../../components/ShowInputError';
import axios from 'axios';
import { BASE_URL } from '../../config/Urls';
import imageCompression from 'browser-image-compression'; // Added import for compression

const AddEstablishmentImages = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const imageType = searchParams.get('type') || 'gallery';
  const establishmentId = searchParams.get('establishmentId');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Image type configurations
  const imageTypeConfig = {
    primary: {
      label: 'Primary Photo',
      description: 'Main establishment photo (JPG/PNG)',
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024, // 5MB (used for validation before compression)
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      hasLinkUrl: false
    },
    banners: {
      label: 'Banner Images',
      description: 'Promotional banners (JPG/PNG)',
      maxFiles: 10,
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      hasLinkUrl: true
    },
    gallery: {
      label: 'Gallery Images',
      description: 'General photos (JPG/PNG)',
      maxFiles: 20,
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      hasLinkUrl: false
    },
    main: {
      label: 'Main Images',
      description: 'Featured photos (JPG/PNG)',
      maxFiles: 10,
      maxSize: 8 * 1024 * 1024, // 8MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      hasLinkUrl: false
    }
  };

  const currentConfig = imageTypeConfig[imageType] || imageTypeConfig.gallery;

  // Validation schema
  const validationSchema = Yup.object({
    images: Yup.array()
      .min(1, 'At least one image is required')
      .max(currentConfig.maxFiles, `Maximum ${currentConfig.maxFiles} images allowed`),
    imageType: Yup.string().required('Image type is required'),
    linkUrls: currentConfig.hasLinkUrl
      ? Yup.array().of(
        Yup.string().url('Please enter a valid URL')
      )
      : Yup.array()
  });

  // Initial form values
  const initialValues = {
    images: [],
    imageType: imageType,
    linkUrls: []
  };

  // Handle file selection with compression
  const handleFileSelect = async (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    const errors = [];

    for (let file of files) {
      // Check file type
      if (!currentConfig.allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPG and PNG files are allowed.`);
        continue;
      }

      // Optional: Check original size (but we'll compress anyway)
      if (file.size > currentConfig.maxSize) {
        // No toast error for size since compression will handle it
        console.log(`Compressing oversized file: ${file.name}`);
      }

      // Compress the image
      try {
        const options = {
          maxSizeMB: currentConfig.maxSize / (1024 * 1024), // Target max size
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.85
        };
        const compressedFile = await imageCompression(file, options);

        const finalFile = new File([compressedFile], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        validFiles.push(finalFile);
      } catch (compressError) {
        console.error('Compression error:', compressError);
        errors.push(`${file.name}: Failed to compress image.`);
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles].slice(0, currentConfig.maxFiles);
      setSelectedFiles(newFiles);
      setFieldValue('images', newFiles);

      // Initialize link URLs for banner images
      if (currentConfig.hasLinkUrl) {
        const linkUrls = newFiles.map((_, index) => '');
        setFieldValue('linkUrls', linkUrls);
      }
    }
  };

  // Remove selected file
  const handleRemoveFile = (index, setFieldValue) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFieldValue('images', newFiles);

    if (currentConfig.hasLinkUrl) {
      const newLinkUrls = newFiles.map((_, i) => '');
      setFieldValue('linkUrls', newLinkUrls);
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    if (!establishmentId) {
      toast.error('Establishment ID is missing');
      setSubmitting(false);
      return;
    }
    if (values.images.length === 0) {
      toast.error('Please select at least one image');
      setSubmitting(false);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let formData = new FormData();
      let endpoint = '';
      let result;

      if (imageType === 'primary') {
        formData.append('primary_photo', values.images[0]);
        endpoint = `${BASE_URL}${ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE}/${establishmentId}`;
        result = await axios.put(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (imageType === 'banners') {
        formData.append('establishment_id', establishmentId);
        values.images.forEach((file, index) => {
          formData.append('image', file); // Match backend field name
          if (currentConfig.hasLinkUrl && values.linkUrls[index]) {
            formData.append('linkUrl', values.linkUrls[index]); // Match backend field name
          }
        });
        endpoint = ApiEndPoints.ESTABLISHMENT_BANNER_IMAGES_ROUTE;
        result = await createRecord(formData, endpoint, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
      } else {
        formData.append('establishment_id', establishmentId);
        values.images.forEach((file) => {
          formData.append('image', file); // Match backend field name
        });
        formData.append('image_type', imageType); // Match backend field name
        endpoint = ApiEndPoints.ESTABLISHMENT_IMAGES_ROUTE;
        result = await createRecord(formData, endpoint, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
      }

      if (result.status === 200) {
        toast.success(`${currentConfig.label} uploaded successfully`);
        navigate(`/establishment-images/${establishmentId}`);
      } else {
        toast.error(result.message || `Failed to upload ${currentConfig.label.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while uploading images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setSubmitting(false);
    }
  };

  // Render image preview
  const renderImagePreview = (file, index, setFieldValue, values) => (
    <Card key={index} sx={{ position: 'relative', maxWidth: 250 }}>
      <CardMedia
        component="img"
        height="150"
        image={URL.createObjectURL(file)}
        alt={`Preview ${index + 1}`}
        sx={{ objectFit: 'cover' }}
      />
      <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
        <IconButton
          size="small"
          sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
          onClick={() => handleRemoveFile(index, setFieldValue)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" display="block">
          {file.name}
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </Typography>

        {/* Link URL input for banner images */}
        {currentConfig.hasLinkUrl && (
          <TextField
            fullWidth
            size="small"
            label="Link URL (optional)"
            value={values.linkUrls[index] || ''}
            onChange={(e) => {
              const newLinkUrls = [...values.linkUrls];
              newLinkUrls[index] = e.target.value;
              setFieldValue('linkUrls', newLinkUrls);
            }}
            sx={{ mt: 1 }}
          />
        )}
      </Box>
    </Card>
  );

  return (
    <div className="min-width">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Add {currentConfig.label}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/establishments/${id}/images`)}
        >
          Back to Images
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          {currentConfig.description}
        </Typography>
        <Typography variant="body2">
          Maximum files: {currentConfig.maxFiles}
        </Typography>
      </Alert>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Select Images
                </Typography>

                {/* File Upload */}
                <Box sx={{ mb: 3 }}>
                  <input
                    id="image-upload"
                    type="file"
                    multiple={currentConfig.maxFiles > 1}
                    accept={currentConfig.allowedTypes.join(',')}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileSelect(e, setFieldValue)}
                    disabled={isUploading}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      disabled={isUploading || selectedFiles.length >= currentConfig.maxFiles}
                      sx={{ mb: 2 }}
                    >
                      Select Images ({selectedFiles.length}/{currentConfig.maxFiles})
                    </Button>
                  </label>
                </Box>

                <ErrorMessage name="images" component={ShowInputError} />

                {/* Image Type Selection (if needed) */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Image Type</InputLabel>
                  <Select
                    value={values.imageType}
                    label="Image Type"
                    onChange={(e) => setFieldValue('imageType', e.target.value)}
                    disabled={true} // Disabled since type is set from URL
                  >
                    <MenuItem value="primary">Primary Photo</MenuItem>
                    <MenuItem value="banners">Banner Images</MenuItem>
                    <MenuItem value="gallery">Gallery Images</MenuItem>
                    <MenuItem value="main">Main Images</MenuItem>
                  </Select>
                </FormControl>

                {/* Upload Progress */}
                {isUploading && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Uploading images...
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}

                {/* Selected Images Preview */}
                {selectedFiles.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Selected Images ({selectedFiles.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedFiles.map((file, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          {renderImagePreview(file, index, setFieldValue, values)}
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Guidelines */}
                <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Upload Guidelines
                  </Typography>
                  <Typography variant="body2" component="div">
                    <ul>
                      <li>Supported formats: JPG, PNG</li>
                      <li>Maximum files: {currentConfig.maxFiles} images</li>
                      <li>Recommended resolution: 1920x1080 or higher</li>
                      {currentConfig.hasLinkUrl && (
                        <li>Banner images can include optional link URLs</li>
                      )}
                    </ul>
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Form Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/establishment-images/${establishmentId}`)}
                disabled={isUploading}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || isUploading || selectedFiles.length === 0}
                sx={{
                  background: 'linear-gradient(180deg, #255480 0%, #173450 100%)',
                  textTransform: 'capitalize',
                  width: 120
                }}
              >
                {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Upload Images'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // Add any required state mappings here
});

const mapDispatchToProps = (dispatch) => ({
  // Add any required dispatch mappings here
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEstablishmentImages);