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
  Chip,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiEndPoints } from "../../apis/ApiEndPoints";
import { getRecord } from "../../apis/services/CommonApiService";
import axios from "axios";

// ===== Styled Components =====
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  marginTop: theme.spacing(1.5),
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

// Helper function to safely render values
const renderValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") {
    // If it's an object, try to extract meaningful data
    if (value.name) return value.name;
    if (value.id) return value.id;
    return JSON.stringify(value);
  }
  return String(value);
};

function ViewPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [biomarkers, setBiomarkers] = useState([]);
  const [addons, setAddons] = useState({ biomarkers: [], packages: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      toast.error("Invalid package ID");
      navigate(-1);
      return;
    }
    setLoading(true);
    try {
      // Fetch package details
      const pkgRes = await getRecord(id, ApiEndPoints.PACKAGES);
      console.log("Package Response:", pkgRes); // Debug log
      if (pkgRes.status !== 200) throw new Error(pkgRes.message);
      setPkg(pkgRes.data);

      // Fetch biomarkers
      try {
        const bioRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}packages/${id}/edit-data`
        );
        console.log("Biomarkers Response:", bioRes.data); // Debug log
        if (bioRes.status === 200 && bioRes.data.success) {
          setBiomarkers(bioRes.data.data.allGroups || []);
        }
      } catch (bioError) {
        console.error("Failed to fetch biomarkers:", bioError);
        // Don't fail the whole page if biomarkers fail
      }

      // Fetch add-ons
      try {
        const addRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}packages/${id}/get_addons`
        );
        console.log("Add-ons Response:", addRes.data); // Debug log
        if (addRes.status === 200 && addRes.data.success) {
          setAddons({
            biomarkers: addRes.data.data.addonBiomarkers || [],
            packages: addRes.data.data.addonPackages || [],
          });
        }
      } catch (addError) {
        console.error("Failed to fetch add-ons:", addError);
        // Don't fail the whole page if add-ons fail
      }
      // In the fetchData function, inside the try block for biomarkers fetch:
      try {
        const bioRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}packages/${id}/edit-data`
        );
        console.log("Biomarkers Response:", bioRes.data); // Debug log
        if (bioRes.status === 200 && bioRes.data.success) {
          const { selectedGroups, allGroups } = bioRes.data.data;
          // Filter to only selected biomarker groups
          const selectedBiomarkerGroups = allGroups.filter(group => selectedGroups?.includes(group.id)) || [];
          setBiomarkers(selectedBiomarkerGroups);
        }
      } catch (bioError) {
        console.error("Failed to fetch biomarkers:", bioError);
        // Don't fail the whole page if biomarkers fail
      }
    } catch (err) {
      console.error("Error fetching package:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to load data";
      toast.error(msg);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!pkg) return null;

  // Safely extract demographics
  const demographics = Array.isArray(pkg.demographics)
    ? pkg.demographics
    : (pkg.demographics ? [pkg.demographics] : []);

  // Safely extract instructions
  const instructions = Array.isArray(pkg.instruction_before_test)
    ? pkg.instruction_before_test.join(", ")
    : (pkg.instruction_before_test || "-");

  return (
    <Box className="min-width" sx={{ p: 2 }}>
      {/* Header */}
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
          View Package
        </Typography>
      </Box>

      {/* Image */}
      {/* Image with fallback */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 500, mb: 1 }}>Image</Typography>

        {pkg.image && !pkg.image.endsWith("/null") ? (
          <img
            src={pkg.image}
            alt="Package"
            style={{
              maxWidth: "250px",
              maxHeight: "250px",
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <Box
            sx={{
              width: 150,
              height: 150,
              border: "1px solid #ddd",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f5f5f5",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No image found
            </Typography>
          </Box>
        )}
      </Box>


      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Name</Typography>
          <Typography>{renderValue(pkg.name)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Sub-title</Typography>
          <Typography>{renderValue(pkg.sub_title)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: 500 }}>Description</Typography>
          <Typography>{renderValue(pkg.description)}</Typography>
        </Grid>

        {/* Pricing */}
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Base Price (AED)</Typography>
          <Typography>
            {pkg.base_price !== null && pkg.base_price !== undefined
              ? pkg.base_price.toFixed(2)
              : "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Selling Price (AED)</Typography>
          <Typography>
            {pkg.selling_price !== null && pkg.selling_price !== undefined
              ? pkg.selling_price.toFixed(2)
              : "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Strike Price (AED)</Typography>
          <Typography>
            {pkg.strike_price !== null && pkg.strike_price !== undefined
              ? pkg.strike_price.toFixed(2)
              : "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Discount Text</Typography>
          <Typography>{renderValue(pkg.discount_text)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Add-on Price (AED)</Typography>
          <Typography>
            {pkg.addon_price !== null && pkg.addon_price !== undefined
              ? pkg.addon_price.toFixed(2)
              : "-"}
          </Typography>
        </Grid>

        {/* Service Details */}
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Instructions Before Test</Typography>
          <Typography>{instructions}</Typography>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Type</Typography>
          <Typography>{renderValue(pkg.type)}</Typography>
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Tag</Typography>
          <Typography>{renderValue(pkg.tag)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Service Duration (min)</Typography>
          <Typography>{renderValue(pkg.service_duration_minutes)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>SLA</Typography>
          <Typography>
            {pkg.sla ? `${pkg.sla} ${pkg.sla_unit || "hours"}` : "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Category</Typography>
          <Typography>
            {pkg.category?.name || pkg.category_id || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Result Time</Typography>
          <Typography>{renderValue(pkg.result_time)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Establishment</Typography>
          <Typography>
            {pkg.establishment?.name || pkg.establishment_id || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ fontWeight: 500 }}>Recommended</Typography>
          <Typography>{pkg.recommended ? "Yes" : "No"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: 500 }}>Demographics</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {demographics.length > 0 ? (
              demographics.map((d, idx) => (
                <Chip
                  key={idx}
                  label={typeof d === "string" ? d : renderValue(d)}
                  size="small"
                  sx={{ backgroundColor: "#f0f6fb", color: "#255480" }}
                />
              ))
            ) : (
              <Typography>-</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: 500 }}>Visible</Typography>
          <Typography>{pkg.visible ? "Yes" : "No"}</Typography>
        </Grid>

        {/* === Biomarker Groups === */}
        {pkg.groups && pkg.groups.length > 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: 600, fontSize: "18px", color: "#173450", mb: 1 }}
            >
              Biomarker Groups ({pkg.groups.length})
            </Typography>
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Group ID</TableCell>
                    <TableCell>Group Name</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {pkg.groups.map((group) => (
                    <StyledTableRow key={group.id}>
                      <StyledTableCell>{group.id}</StyledTableCell>
                      <StyledTableCell>{group.name || "-"}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        )}

        {/* === Biomarkers (from edit-data endpoint) === */}
        {biomarkers.length > 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: 600, fontSize: "18px", color: "#173450", mb: 1 }}
            >
              Biomarkers Details (
              {biomarkers.reduce((acc, g) => acc + (g.biomarkers?.length || 0), 0)})
            </Typography>
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Group</TableCell>
                    <TableCell>Biomarker</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Specimen</TableCell>
                    <TableCell>Unit</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {biomarkers.map((group) =>
                    group.biomarkers && group.biomarkers.length > 0 ? (
                      group.biomarkers.map((b, i) => (
                        <StyledTableRow key={`${group.id}-${b.id}`}>
                          {i === 0 && (
                            <StyledTableCell rowSpan={group.biomarkers.length}>
                              {group.name}
                            </StyledTableCell>
                          )}
                          <StyledTableCell>{b.name}</StyledTableCell>
                          <StyledTableCell>{b.type || "-"}</StyledTableCell>
                          <StyledTableCell>{b.specimen || "-"}</StyledTableCell>
                          <StyledTableCell>{b.unit || "-"}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow key={group.id}>
                        <StyledTableCell>{group.name}</StyledTableCell>
                        <StyledTableCell colSpan={4}>No biomarkers</StyledTableCell>
                      </StyledTableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        )}

        {/* === Add-on Biomarkers === */}
        {addons.biomarkers.length > 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: 600, fontSize: "18px", color: "#173450", mb: 1 }}
            >
              Add-on Biomarkers ({addons.biomarkers.length})
            </Typography>
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price (AED)</TableCell>
                    <TableCell>Recommended</TableCell>
                    <TableCell>Why Recommended</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {addons.biomarkers.map((b) => (
                    <StyledTableRow key={b.id}>
                      <StyledTableCell>{b.name || "-"}</StyledTableCell>
                      <StyledTableCell>
                        {b.price !== null && b.price !== undefined
                          ? b.price.toFixed(2)
                          : "-"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {b.recommended ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {b.why_recommended || "-"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        )}

        {/* === Add-on Packages === */}
        {addons.packages.length > 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: 600, fontSize: "18px", color: "#173450", mb: 1 }}
            >
              Add-on Packages ({addons.packages.length})
            </Typography>
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price (AED)</TableCell>
                    <TableCell>Recommended</TableCell>
                    <TableCell>Why Recommended</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {addons.packages.map((p) => (
                    <StyledTableRow key={p.id}>
                      <StyledTableCell>{p.name || "-"}</StyledTableCell>
                      <StyledTableCell>
                        {p.price !== null && p.price !== undefined
                          ? p.price.toFixed(2)
                          : "-"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {p.recommended ? "Yes" : "No"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {p.why_recommended || "-"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        )}

        {/* === Biomarker Groups === */}
        {biomarkers.length > 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{ fontWeight: 600, fontSize: "18px", color: "#173450", mb: 1 }}
            >
              Biomarker Groups ({biomarkers.length})
            </Typography>
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Group ID</TableCell>
                    <TableCell>Group Name</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {biomarkers.map((group) => (
                    <StyledTableRow key={group.id}>
                      <StyledTableCell>{group.id}</StyledTableCell>
                      <StyledTableCell>{group.name || "-"}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        )}
      </Grid>

      {/* Back Button */}
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

export default ViewPackage;