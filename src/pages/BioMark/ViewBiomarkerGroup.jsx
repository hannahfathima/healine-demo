import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { getRecord } from "../../apis/services/CommonApiService";

// ──────────────────────────────────────────────────────────────
// Styled Components (unchanged except for ImageCell)
// ──────────────────────────────────────────────────────────────
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#f0f6fb",
  "& th": {
    fontWeight: 600,
    color: "#255480",
    fontSize: "15px",
    padding: "14px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#fafafa",
  },
  "&:hover": {
    backgroundColor: "#f1f7fd",
    transition: "0.2s ease-in-out",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "14px",
  color: "#333",
  padding: "14px 16px",
  borderBottom: "1px solid #f0f0f0",
}));

// New styled cell for the image column
const ImageCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px",
  "& img": {
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
}));

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────
function ViewBiomarkerGroup() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGroup = useCallback(async () => {
    if (!id) {
      toast.error("Invalid group ID");
      navigate(-1);
      return;
    }

    setLoading(true);
    try {
      const res = await getRecord(id, ApiEndPoints.BIOMARKER_GROUPS);
      if (res.status === 200) {
        setGroup(res.data);
      } else {
        toast.error(res.message || "Failed to load group");
        navigate(-1);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Network error";
      toast.error(msg);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!group) return null;

  // Helper to render an image (fallback to placeholder)
  const renderImage = (src) => {
    if (!src) {
      return (
        <Avatar
          sx={{ width: 48, height: 48, bgcolor: "#e0e0e0" }}
          variant="rounded"
        >
          ?
        </Avatar>
      );
    }
    return <img src={src} alt="biomarker" loading="lazy" />;
  };

  return (
    <Box className="min-width" sx={{ padding: 2 }}>
      {/* ───── Header ───── */}
      <Box
        sx={{
          borderBottom: "2px solid #e0e0e0",
          display: "flex",
          alignItems: "baseline",
          pb: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "#173450", fontSize: "22px" }}
        >
          View Biomarker Group
        </Typography>
      </Box>

      {/* ───── Group Image (optional) ───── */}
      {/* ───── Group Image (with null check) ───── */}
      {group.image && !group.image.endsWith("/null") ? (
        <Box sx={{ mb: 3 }}>
          <img
            src={group.image}
            alt={group.name}
            style={{
              maxHeight: 180,
              width: "auto",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            mb: 3,
            width: 130,
            height: 130,
            borderRadius: 1,
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            No image found
          </Typography>
        </Box>
      )}


      {/* ───── Group Details ───── */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Name</Typography>
          <Typography sx={{ color: "#333" }}>{group.name || "-"}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500, mb: 0.5 }}>Description</Typography>
          <Typography sx={{ color: "#333" }}>
            {group.description || "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
            Base Price (AED)
          </Typography>
          <Typography sx={{ color: "#333" }}>
            {group.base_price ? group.base_price.toFixed(2) : "-"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
            Selling Price (AED)
          </Typography>
          <Typography sx={{ color: "#333" }}>
            {group.selling_price ? group.selling_price.toFixed(2) : "-"}
          </Typography>
        </Grid>

        {/* ───── Biomarkers Table ───── */}
        {group.biomarkers && group.biomarkers.length > 0 ? (
          <Grid item xs={12}>
            <Typography
              sx={{
                fontWeight: 600,
                mb: 1,
                mt: 2,
                fontSize: "18px",
                color: "#173450",
              }}
            >
              Selected Biomarkers
            </Typography>

            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    {/* <TableCell>Image</TableCell> */}
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Specimen</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell align="right">Price (AED)</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {group.biomarkers.map((b, index) => (
                    <StyledTableRow key={b.id} index={index}>
                      {/* ---- Image column ---- */}
                      {/* <ImageCell>{renderImage(b.image)}</ImageCell> */}

                      <StyledTableCell>{b.id}</StyledTableCell>
                      <StyledTableCell>{b.name}</StyledTableCell>
                      <StyledTableCell>{b.type}</StyledTableCell>
                      <StyledTableCell>{b.specimen}</StyledTableCell>
                      <StyledTableCell>{b.unit}</StyledTableCell>
                      <StyledTableCell align="right">
                        {b.selling_price ? b.selling_price.toFixed(2) : "-"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: 500 }}>Selected Biomarkers</Typography>
            <Typography sx={{ color: "#555" }}>
              No biomarkers selected
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* ───── Back Button ───── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          borderTop: "2px solid #e0e0e0",
          mt: 4,
          pt: 3,
        }}
      >
        <Button
          variant="contained"
          disableElevation
          onClick={() => navigate(-1)}
          sx={{
            width: 120,
            height: 44,
            textTransform: "capitalize",
            background:
              "linear-gradient(180deg, #255480 0%, #173450 100%)",
            "&:hover": {
              background:
                "linear-gradient(180deg, #1e4060 0%, #122b40 100%)",
            },
          }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
}

export default ViewBiomarkerGroup;