import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Divider,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchList, deleteRecord } from '../../apis/services/CommonApiService';
import { ApiEndPoints } from '../../apis/ApiEndPoints';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import CustomIconButton from '../../shared/components/CustomIconButton';
import moment from 'moment';
import axios from 'axios';
import { BASE_URL } from '../../config/Urls';

const EstablishmentImages = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [images, setImages] = useState({
    primary: null,
    banners: [],
    gallery: [],
    main: []
  });

  // Dialog states
  const [previewDialog, setPreviewDialog] = useState({ open: false, image: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, type: null });

  // Image type configurations
  const imageTypes = [
    {
      key: 'banners',
      label: 'Banner Images',
      description: 'Promotional banners with optional links',
      maxCount: 10
    },
    {
      key: 'gallery',
      label: 'Gallery Images',
      description: 'General photos showcasing the establishment',
      maxCount: 50
    },
    {
      key: 'main',
      label: 'Main Images',
      description: 'Featured images for detailed views',
      maxCount: 20
    }
  ];

  // Fetch establishment images
  // Update fetchEstablishmentImages to filter images by establishment_id in frontend
  // Update fetchEstablishmentImages to exclude primary photo
// Update fetchEstablishmentImages to filter images by establishment_id in frontend
// Fetch establishment images
const fetchEstablishmentImages = useCallback(async () => {
  setLoading(true);
  console.log('Starting fetchEstablishmentImages for establishment ID:', id);

  try {
    if (!id) {
      console.log('No id provided, skipping API call');
      return;
    }

    // Fetch establishment data (for reference, though primary is handled elsewhere)
    const establishmentResult = await fetchList(`${ApiEndPoints.ESTABLISHMENT_RESOURCE_ROUTE}/${id}`);
    console.log('ESTABLISHMENT_RESOURCE_ROUTE Response:', establishmentResult);

    // Fetch gallery and main images
    const imagesResult = await fetchList(
      `${ApiEndPoints.ESTABLISHMENT_IMAGES_ROUTE}?page_no=1&items_per_page=50&establishment_id=${id}`
    );
    console.log('ESTABLISHMENT_IMAGES_ROUTE Response:', imagesResult);

    // Fetch banner images
    const bannerResult = await fetchList(
      `${ApiEndPoints.ESTABLISHMENT_BANNER_IMAGES_ROUTE}?page_no=1&items_per_page=10&establishment_id=${id}`
    );
    console.log('ESTABLISHMENT_BANNER_IMAGES_ROUTE Response:', bannerResult);

    if (establishmentResult.status === 200 && imagesResult.status === 200 && bannerResult.status === 200) {
      const establishment = establishmentResult.data;
      const imageData = imagesResult.data.rows || [];
      const bannerData = bannerResult.data.rows || [];
      // Filter images by current establishment_id
      const filteredImageData = imageData.filter(img => img.establishment_id === parseInt(id));
      setImages({
        primary: establishment.primary_photo ? {
          id: establishment.id,
          image: establishment.primary_photo,
          type: 'primary'
        } : null,
        banners: bannerData.map(banner => ({
          id: banner.id,
          image: banner.image,
          linkUrl: banner.linkUrl || '',
          type: 'banners',
          establishment_id: banner.establishment_id,
          created_at: banner.created_at
        })) || [],
        gallery: filteredImageData.filter(img => img.image_type === 'gallery') || [],
        main: filteredImageData.filter(img => img.image_type === 'main') || []
      });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    toast.error('Failed to fetch establishment images');
  } finally {
    setLoading(false);
  }
}, [id]);
  useEffect(() => {
    console.log('useEffect triggered with id:', id);
    if (id) {
      fetchEstablishmentImages();
    }
  }, [id, fetchEstablishmentImages]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle image preview
  const handlePreviewImage = (image) => {
    setPreviewDialog({ open: true, image });
  };

  // Handle image deletion
 // Handle image deletion
const handleDeleteImage = async () => {
  const { id: imageId, type } = deleteDialog;
  try {
    let endpoint = '';
    if (type === 'banners') {
      endpoint = `${BASE_URL}${ApiEndPoints.ESTABLISHMENT_BANNER_IMAGES_ROUTE}/${imageId}`;
    } else {
      endpoint = `${BASE_URL}${ApiEndPoints.ESTABLISHMENT_IMAGES_ROUTE}/${imageId}`;
      
    }

    console.log('Constructed DELETE endpoint:', endpoint); // Debug log

    const result = await axios.delete(endpoint);

    if (result.status === 200) {
      toast.success('Image deleted successfully');
      fetchEstablishmentImages();
    } else {
      toast.error(result.message || 'Failed to delete image');
    }
  } catch (error) {
    toast.error('Error deleting image');
    console.error('Delete error:', error.response?.data || error.message);
  } finally {
    setDeleteDialog({ open: false, id: null, type: null });
  }
};

  // Render image card
  const renderImageCard = (image, type) => (
    <Card key={image.id} sx={{ maxWidth: 300, margin: 1 }}>
      <CardMedia
        component="img"
        height="200"
        image={image.image}
        alt="Establishment Image"
        sx={{ objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => handlePreviewImage(image)}
      />
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Box>
            {type === 'banners' && image.linkUrl && (
              <Chip label="Has Link" size="small" color="primary" />
            )}
            {image.created_at && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                {moment(image.created_at).format('MMM DD, YYYY')}
              </Typography>
            )}
          </Box>
          <Box>
            <IconButton size="small" onClick={() => handlePreviewImage(image)}>
              <VisibilityIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteDialog({ open: true, id: image.id, type })}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
  const renderImageGrid = (imageType) => {
    const currentImages = images[imageType.key];
    const imageArray = Array.isArray(currentImages) ? currentImages : [];

    return (
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6">{imageType.label}</Typography>
            <Typography variant="body2" color="textSecondary">
              {imageType.description}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {imageArray.length} / {imageType.maxCount} images
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={() => navigate(`/add-establishment-images?establishmentId=${id}&type=${imageType.key}`)}
            disabled={imageArray.length >= imageType.maxCount}
          >
            Add {imageType.label}
          </Button>
        </Box>

        {imageArray.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
              border: '2px dashed #ccc',
              borderRadius: 2,
              backgroundColor: '#f9f9f9'
            }}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No {imageType.label.toLowerCase()} uploaded
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Click the button above to add your first image
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {imageArray.map((image) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                {renderImageCard(image, imageType.key)}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="min-width">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Establishment Images</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/establishments')}
        >
          Back to Establishments
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Tabs for different image types */}
      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        {imageTypes.map((type, index) => (
          <Tab
            key={type.key}
            label={`${type.label} (${Array.isArray(images[type.key])
              ? images[type.key].length
              : (images[type.key] ? 1 : 0)
              })`}
          />
        ))}
      </Tabs>

      {/* Tab panels */}
      {imageTypes.map((type, index) => (
        <Box key={type.key} hidden={tabValue !== index}>
          {tabValue === index && renderImageGrid(type)}
        </Box>
      ))}

      {/* Image Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, image: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {previewDialog.image && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={previewDialog.image.image}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              {previewDialog.image.linkUrl && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Link URL:</strong> {previewDialog.image.linkUrl}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, image: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        title="Confirm Delete"
        message="Are you sure you want to delete this image? This action cannot be undone."
        openDialog={deleteDialog.open}
        handleDialogClose={() => setDeleteDialog({ open: false, id: null, type: null })}
        handleDialogAction={handleDeleteImage}
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  // Add any required state mappings here
});

const mapDispatchToProps = (dispatch) => ({
  // Add any required dispatch mappings here
});

export default connect(mapStateToProps, mapDispatchToProps)(EstablishmentImages);