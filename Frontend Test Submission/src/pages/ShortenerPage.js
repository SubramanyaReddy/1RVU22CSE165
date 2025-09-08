import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from "@mui/material";
import { logEvent } from "../utils/logger";

function ShortenerPage() {
  const [urls, setUrls] = useState([{ longUrl: "", validity: 30, shortcode: "" }]);
  const [shortened, setShortened] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: "", validity: 30, shortcode: "" }]);
    }
  };

  const shortenUrls = () => {
    const newLinks = urls.map((u) => {
      if (!u.longUrl) return null;

      const uniqueId =
        u.shortcode ||
        Math.random().toString(36).substring(2, 7) + Date.now().toString(36);

      const expiry = new Date(Date.now() + (u.validity || 30) * 60000).toLocaleString();
      const shortUrl = `https://short.ly/${uniqueId}`;
      logEvent("URL_SHORTENED", { original: u.longUrl, shortUrl, expiry });

      return { ...u, shortUrl, expiry, clicks: 0, clickData: [], createdAt: new Date().toLocaleString() };
    });

    const validLinks = newLinks.filter((x) => x !== null);
    setShortened([...shortened, ...validLinks]);
    localStorage.setItem("shortened", JSON.stringify([...shortened, ...validLinks]));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        Shorten your URLs
      </Typography>

      {urls.map((u, index) => (
        <Card sx={{ mt: 2, boxShadow: 4, borderRadius: 3 }} key={index}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={u.longUrl}
                  onChange={(e) => handleChange(index, "longUrl", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Validity (min)"
                  type="number"
                  value={u.validity}
                  onChange={(e) => handleChange(index, "validity", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  value={u.shortcode}
                  onChange={(e) => handleChange(index, "shortcode", e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={addUrlField} disabled={urls.length >= 5}>
          + Add Another
        </Button>
        <Button variant="contained" onClick={shortenUrls}>
          Shorten URLs
        </Button>
      </Box>

      {shortened.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Shortened Links</Typography>
          {shortened.map((s, idx) => (
            <Card sx={{ mt: 2, p: 2, borderLeft: "6px solid #1976d2", boxShadow: 3 }} key={idx}>
              <CardContent>
                <Typography>Original: <a href={s.longUrl}>{s.longUrl}</a></Typography>
                <Typography>Short: <a href={s.shortUrl}>{s.shortUrl}</a></Typography>
                <Typography>Expiry: {s.expiry}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default ShortenerPage;
