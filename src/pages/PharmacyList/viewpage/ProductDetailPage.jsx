// src/pages/admin/ProductDetailPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Grid,
    Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { fetchProduct } from "../../../apis/services/pharmacyApi";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProductDetail = useCallback(async (id) => {
        try {
            setLoading(true);
            const result = await fetchProduct(id);
            if (result.data.success) {
                setProduct(result.data.data);
            } else {
                toast.error("Failed to fetch product details");
                navigate("/admin/pharmacy/products");
            }
        } catch (error) {
            toast.error("Failed to fetch product details");
            navigate("/admin/pharmacy/products");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (productId) {
            getProductDetail(productId);
        }
    }, [productId, getProductDetail]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-width">
            <div
                className="d-flex mt-2rem mb-2 pb-2"
                style={{ borderBottom: "2px solid", alignItems: "baseline" }}
            >
                <h4 className="pagename-heading ml-0">View Product</h4>
            </div>
            <Grid container spacing={2} alignItems="flex-start">
                <Grid item lg={12}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Image
                    </Typography>
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{
                                height: "200px",
                                width: "auto",
                                borderRadius: "8px",
                                objectFit: "contain",
                            }}
                        />
                    )}
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Name
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {product.name}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Brand
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {product.brand?.name || "-"}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Category
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {product.category?.name || "-"}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Description
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {product.description || "-"}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Base Price
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        ${product.base_price}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Selling Price
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        ${product.selling_price}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Prescription Required
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {product.is_prescription_required ? "Yes" : "No"}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Global Stock
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {product.stock_global}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Created At
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {new Date(product.created_at).toLocaleString()}
                    </Typography>
                </Grid>
                <Grid item lg={6}>
                    <Typography className="label" style={{ marginBottom: "11px", color: "#1E1E1E", fontSize: "16px", fontWeight: "500" }}>
                        Updated At
                    </Typography>
                    <Typography className="value" style={{ color: "#000", paddingLeft: "5px" }} variant="subtitle1">
                        {new Date(product.updated_at).toLocaleString()}
                    </Typography>
                </Grid>

            </Grid>
            <div style={{ display: "flex", justifyContent: "end", marginRight: "20px", marginBottom: "20px", borderTop: "2px solid", marginTop: "20px", paddingTop: "20px" }}>
                <Button
                    size="large"
                    variant="contained"
                    disableElevation
                    onClick={() => navigate("/pharmacy")}
                    style={{ justifyContent: "center", width: "98px", height: "44px", textTransform: "capitalize", background: "linear-gradient(180deg, #255480 0%, #173450 100%)" }}
                >
                    Back
                </Button>
            </div>
        </div>
    );
};

export default ProductDetailPage;